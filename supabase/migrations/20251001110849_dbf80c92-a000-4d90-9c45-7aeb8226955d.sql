-- Enable pgsodium extension for encryption
CREATE EXTENSION IF NOT EXISTS pgsodium;

-- Create a secure secrets table in public schema with encrypted storage
CREATE TABLE IF NOT EXISTS public.ad_account_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_account_id UUID NOT NULL UNIQUE REFERENCES public.ad_accounts(id) ON DELETE CASCADE,
  -- Store tokens encrypted using pgsodium
  encrypted_access_token BYTEA,
  encrypted_refresh_token BYTEA,
  -- Encryption key for this account (stored securely)
  encryption_key BYTEA DEFAULT pgsodium.crypto_secretbox_keygen(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the secrets table
ALTER TABLE public.ad_account_secrets ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - only accessible through security definer functions
CREATE POLICY "No direct access to ad account secrets"
ON public.ad_account_secrets
FOR ALL
USING (false);

-- Create security definer function to securely store tokens
CREATE OR REPLACE FUNCTION public.store_ad_account_tokens(
  p_ad_account_id UUID,
  p_access_token TEXT,
  p_refresh_token TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_secret_id UUID;
  v_key BYTEA;
BEGIN
  -- Verify user has access to this ad account through their organization
  IF NOT EXISTS (
    SELECT 1 FROM public.ad_accounts aa
    JOIN public.user_roles ur ON aa.organization_id = ur.organization_id
    WHERE aa.id = p_ad_account_id 
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'editor')
  ) THEN
    RAISE EXCEPTION 'Access denied to ad account';
  END IF;

  -- Get existing key or generate new one
  SELECT encryption_key INTO v_key
  FROM public.ad_account_secrets
  WHERE ad_account_id = p_ad_account_id;

  IF v_key IS NULL THEN
    v_key := pgsodium.crypto_secretbox_keygen();
  END IF;

  -- Insert or update the encrypted tokens
  INSERT INTO public.ad_account_secrets (
    ad_account_id, 
    encrypted_access_token, 
    encrypted_refresh_token,
    encryption_key
  )
  VALUES (
    p_ad_account_id,
    CASE WHEN p_access_token IS NOT NULL 
      THEN pgsodium.crypto_secretbox(p_access_token::bytea, v_key)
      ELSE NULL 
    END,
    CASE WHEN p_refresh_token IS NOT NULL
      THEN pgsodium.crypto_secretbox(p_refresh_token::bytea, v_key)
      ELSE NULL
    END,
    v_key
  )
  ON CONFLICT (ad_account_id) 
  DO UPDATE SET 
    encrypted_access_token = CASE WHEN p_access_token IS NOT NULL 
      THEN pgsodium.crypto_secretbox(p_access_token::bytea, EXCLUDED.encryption_key)
      ELSE public.ad_account_secrets.encrypted_access_token 
    END,
    encrypted_refresh_token = CASE WHEN p_refresh_token IS NOT NULL
      THEN pgsodium.crypto_secretbox(p_refresh_token::bytea, EXCLUDED.encryption_key)
      ELSE public.ad_account_secrets.encrypted_refresh_token
    END,
    updated_at = now()
  RETURNING id INTO v_secret_id;

  RETURN v_secret_id;
END;
$$;

-- Create security definer function to securely retrieve tokens
CREATE OR REPLACE FUNCTION public.get_ad_account_tokens(p_ad_account_id UUID)
RETURNS TABLE (
  access_token TEXT,
  refresh_token TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user has access to this ad account through their organization
  IF NOT EXISTS (
    SELECT 1 FROM public.ad_accounts aa
    JOIN public.user_roles ur ON aa.organization_id = ur.organization_id
    WHERE aa.id = p_ad_account_id 
    AND ur.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied to ad account';
  END IF;

  -- Return the decrypted tokens
  RETURN QUERY
  SELECT 
    CASE WHEN s.encrypted_access_token IS NOT NULL
      THEN convert_from(pgsodium.crypto_secretbox_open(s.encrypted_access_token, s.encryption_key), 'UTF8')
      ELSE NULL
    END,
    CASE WHEN s.encrypted_refresh_token IS NOT NULL
      THEN convert_from(pgsodium.crypto_secretbox_open(s.encrypted_refresh_token, s.encryption_key), 'UTF8')
      ELSE NULL
    END
  FROM public.ad_account_secrets s
  WHERE s.ad_account_id = p_ad_account_id;
END;
$$;

-- Migrate existing tokens to encrypted storage (if any exist)
DO $$
DECLARE
  r RECORD;
  v_key BYTEA;
BEGIN
  FOR r IN 
    SELECT id, access_token, refresh_token 
    FROM public.ad_accounts 
    WHERE access_token IS NOT NULL OR refresh_token IS NOT NULL
  LOOP
    -- Generate encryption key for this account
    v_key := pgsodium.crypto_secretbox_keygen();
    
    INSERT INTO public.ad_account_secrets (
      ad_account_id, 
      encrypted_access_token, 
      encrypted_refresh_token,
      encryption_key
    )
    VALUES (
      r.id,
      CASE WHEN r.access_token IS NOT NULL 
        THEN pgsodium.crypto_secretbox(r.access_token::bytea, v_key)
        ELSE NULL 
      END,
      CASE WHEN r.refresh_token IS NOT NULL
        THEN pgsodium.crypto_secretbox(r.refresh_token::bytea, v_key)
        ELSE NULL
      END,
      v_key
    )
    ON CONFLICT (ad_account_id) DO NOTHING;
  END LOOP;
END $$;

-- Clear the tokens from the public table
UPDATE public.ad_accounts 
SET access_token = NULL, refresh_token = NULL
WHERE access_token IS NOT NULL OR refresh_token IS NOT NULL;

-- Add comments to document the security change
COMMENT ON COLUMN public.ad_accounts.access_token IS 'DEPRECATED: Tokens now stored encrypted in ad_account_secrets. Use store_ad_account_tokens() to save and get_ad_account_tokens() to retrieve.';
COMMENT ON COLUMN public.ad_accounts.refresh_token IS 'DEPRECATED: Tokens now stored encrypted in ad_account_secrets. Use store_ad_account_tokens() to save and get_ad_account_tokens() to retrieve.';
COMMENT ON TABLE public.ad_account_secrets IS 'Securely stores encrypted access and refresh tokens for ad accounts using pgsodium encryption.';

-- Create trigger to automatically update secrets table updated_at
CREATE OR REPLACE FUNCTION public.update_ad_account_secrets_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_ad_account_secrets_updated_at
BEFORE UPDATE ON public.ad_account_secrets
FOR EACH ROW
EXECUTE FUNCTION public.update_ad_account_secrets_updated_at();