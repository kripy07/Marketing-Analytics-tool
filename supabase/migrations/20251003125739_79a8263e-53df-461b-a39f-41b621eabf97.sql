-- Fix profiles table RLS policies by explicitly targeting roles
-- Drop existing blocking policies
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Block public role access to profiles" ON public.profiles;

-- Add explicit role-targeted restrictive policies
CREATE POLICY "Block anon role access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Block public role access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Ensure authenticated users can only access their own profile
-- The existing policies already handle this, but let's make sure they target authenticated role
DROP POLICY IF EXISTS "Authenticated users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON public.profiles;

CREATE POLICY "Authenticated users can view own profile"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can insert own profile"
ON public.profiles
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can update own profile"
ON public.profiles
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Fix ad_account_secrets table policies similarly
DROP POLICY IF EXISTS "Block all direct access to ad account secrets" ON public.ad_account_secrets;
DROP POLICY IF EXISTS "Block public role access to ad account secrets" ON public.ad_account_secrets;

CREATE POLICY "Block anon role access to ad account secrets"
ON public.ad_account_secrets
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Block public role access to ad account secrets"
ON public.ad_account_secrets
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "Block authenticated role access to ad account secrets"
ON public.ad_account_secrets
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

COMMENT ON TABLE public.profiles IS 'User profiles with email, name, and company data. Protected by RLS - only authenticated users can access their own profile.';
COMMENT ON TABLE public.ad_account_secrets IS 'Encrypted advertising platform tokens. All direct access blocked. Use store_ad_account_tokens() and get_ad_account_tokens() functions only.';