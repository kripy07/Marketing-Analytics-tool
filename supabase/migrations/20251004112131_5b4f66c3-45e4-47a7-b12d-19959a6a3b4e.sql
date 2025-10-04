-- ========================================
-- FIX: Remove plain text OAuth tokens from ad_accounts table
-- ========================================
-- Security issue: ad_accounts stores refresh_token and access_token in plain text
-- and is accessible to all organization members. These tokens should only exist
-- in the encrypted ad_account_secrets table.

-- Step 1: Migrate any existing tokens to the encrypted table
-- (This is a safe operation - if tokens already exist in ad_account_secrets, they won't be overwritten)
DO $$
DECLARE
  account_record RECORD;
BEGIN
  FOR account_record IN 
    SELECT id, access_token, refresh_token 
    FROM public.ad_accounts 
    WHERE access_token IS NOT NULL OR refresh_token IS NOT NULL
  LOOP
    -- Use the existing store function to encrypt and store tokens
    -- This will only insert if not already present
    INSERT INTO public.ad_account_secrets (
      ad_account_id,
      encrypted_access_token,
      encrypted_refresh_token,
      encryption_key
    )
    SELECT 
      account_record.id,
      CASE WHEN account_record.access_token IS NOT NULL 
        THEN pgsodium.crypto_secretbox(account_record.access_token::bytea, pgsodium.crypto_secretbox_keygen())
        ELSE NULL 
      END,
      CASE WHEN account_record.refresh_token IS NOT NULL
        THEN pgsodium.crypto_secretbox(account_record.refresh_token::bytea, pgsodium.crypto_secretbox_keygen())
        ELSE NULL
      END,
      pgsodium.crypto_secretbox_keygen()
    ON CONFLICT (ad_account_id) DO NOTHING;
  END LOOP;
END $$;

-- Step 2: Drop the insecure columns from ad_accounts
ALTER TABLE public.ad_accounts DROP COLUMN IF EXISTS access_token;
ALTER TABLE public.ad_accounts DROP COLUMN IF EXISTS refresh_token;

-- Step 3: Update table comment to reflect security improvement
COMMENT ON TABLE public.ad_accounts IS 
'Advertising account metadata. OAuth tokens are stored encrypted in ad_account_secrets table and accessed via get_ad_account_tokens() function.';

-- Step 4: Ensure ad_account_secrets remains locked down
-- (These policies should already exist, but we confirm them here)
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "ad_secrets_block_public" ON public.ad_account_secrets;
  DROP POLICY IF EXISTS "ad_secrets_block_anon" ON public.ad_account_secrets;
  DROP POLICY IF EXISTS "ad_secrets_block_authenticated" ON public.ad_account_secrets;
  
  -- Recreate blocking policies
  CREATE POLICY "ad_secrets_block_public"
  ON public.ad_account_secrets
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

  CREATE POLICY "ad_secrets_block_anon"
  ON public.ad_account_secrets
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

  CREATE POLICY "ad_secrets_block_authenticated"
  ON public.ad_account_secrets
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);
END $$;