-- ========================================
-- COMPREHENSIVE SECURITY FIX - RLS POLICIES
-- ========================================

-- Part 1: Fix profiles table RLS policies with explicit role targeting
-- ========================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Block anon role access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Block public role access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON public.profiles;

-- Create blocking policies for anon and public roles (RESTRICTIVE)
CREATE POLICY "profiles_block_anon"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "profiles_block_public"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Create permissive policies for authenticated users
CREATE POLICY "profiles_auth_select"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "profiles_auth_insert"
ON public.profiles
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_auth_update"
ON public.profiles
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_auth_delete"
ON public.profiles
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Part 2: Fix ad_account_secrets table RLS policies
-- ========================================

-- Drop all existing policies on ad_account_secrets
DROP POLICY IF EXISTS "Block anon role access to ad account secrets" ON public.ad_account_secrets;
DROP POLICY IF EXISTS "Block public role access to ad account secrets" ON public.ad_account_secrets;
DROP POLICY IF EXISTS "Block authenticated role access to ad account secrets" ON public.ad_account_secrets;

-- Block all roles from direct access (data only via security definer functions)
CREATE POLICY "ad_secrets_block_anon"
ON public.ad_account_secrets
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "ad_secrets_block_public"
ON public.ad_account_secrets
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "ad_secrets_block_authenticated"
ON public.ad_account_secrets
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- Add table comments for documentation
COMMENT ON TABLE public.profiles IS 
'User profile data (email, name, company). RLS enforced: anon/public blocked, authenticated can only access own profile.';

COMMENT ON TABLE public.ad_account_secrets IS 
'Encrypted OAuth tokens. All direct access blocked. Access only via store_ad_account_tokens() and get_ad_account_tokens() security definer functions.';