-- Fix ad_account_secrets table to explicitly block all unauthenticated access
-- Drop the existing policy
DROP POLICY IF EXISTS "No direct access to ad account secrets" ON public.ad_account_secrets;

-- Create new policy that explicitly requires authentication and denies all direct access
CREATE POLICY "Block all direct access to ad account secrets"
ON public.ad_account_secrets
AS RESTRICTIVE
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Also fix the profiles table to block unauthenticated access
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policies that block anonymous access and only allow authenticated users their own data
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Authenticated users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add comment explaining the security model
COMMENT ON TABLE public.ad_account_secrets IS 'Encrypted token storage. Direct access blocked - use store_ad_account_tokens() and get_ad_account_tokens() functions only. Anonymous access explicitly forbidden.';
COMMENT ON TABLE public.profiles IS 'User profiles. Anonymous access blocked. Users can only access their own profile data.';