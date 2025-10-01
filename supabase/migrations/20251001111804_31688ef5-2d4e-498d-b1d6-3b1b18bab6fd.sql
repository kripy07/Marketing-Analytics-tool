-- Add restrictive policy to block public role access to profiles
CREATE POLICY "Block public role access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Add restrictive policy to block public role access to ad_account_secrets
CREATE POLICY "Block public role access to ad account secrets"
ON public.ad_account_secrets
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Update table comments
COMMENT ON TABLE public.profiles IS 'User profiles. All anonymous and public access blocked. Only authenticated users can access their own profile data.';
COMMENT ON TABLE public.ad_account_secrets IS 'Encrypted token storage. All anonymous and public access blocked. Access only via store_ad_account_tokens() and get_ad_account_tokens() security definer functions.';