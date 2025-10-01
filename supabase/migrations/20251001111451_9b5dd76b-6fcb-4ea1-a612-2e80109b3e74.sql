-- Fix search_path for trigger function to address security linter warning
CREATE OR REPLACE FUNCTION public.update_ad_account_secrets_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;