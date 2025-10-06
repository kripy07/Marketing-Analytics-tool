-- Add explicit SELECT denial policies for ad_account_secrets
CREATE POLICY "ad_secrets_deny_select_anon" 
ON public.ad_account_secrets 
AS RESTRICTIVE
FOR SELECT
TO anon 
USING (false);

CREATE POLICY "ad_secrets_deny_select_public" 
ON public.ad_account_secrets 
AS RESTRICTIVE
FOR SELECT
TO public 
USING (false);

CREATE POLICY "ad_secrets_deny_select_authenticated" 
ON public.ad_account_secrets 
AS RESTRICTIVE
FOR SELECT
TO authenticated 
USING (false);

-- Add explicit SELECT denial policies for profiles
CREATE POLICY "profiles_deny_select_anon" 
ON public.profiles 
AS RESTRICTIVE
FOR SELECT
TO anon 
USING (false);

CREATE POLICY "profiles_deny_select_public" 
ON public.profiles 
AS RESTRICTIVE
FOR SELECT
TO public 
USING (false);

-- Add explicit SELECT denial policies for invitations
CREATE POLICY "invitations_deny_select_anon" 
ON public.invitations 
AS RESTRICTIVE
FOR SELECT
TO anon 
USING (false);

CREATE POLICY "invitations_deny_select_public" 
ON public.invitations 
AS RESTRICTIVE
FOR SELECT
TO public 
USING (false);