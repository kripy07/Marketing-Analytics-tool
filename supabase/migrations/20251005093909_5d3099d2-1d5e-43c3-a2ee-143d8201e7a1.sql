-- Fix all public/anonymous access security issues
-- Drop existing policies first to avoid conflicts

-- 1. Fix profiles table - block all anonymous and public access
DROP POLICY IF EXISTS "profiles_block_anon" ON public.profiles;
DROP POLICY IF EXISTS "profiles_block_public" ON public.profiles;

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

-- 2. Fix invitations table - replace weak public policy
DROP POLICY IF EXISTS "invitations_block_public" ON public.invitations;

CREATE POLICY "invitations_block_public" 
ON public.invitations 
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- 3. Fix ad_account_secrets table - add public blocking policy
DROP POLICY IF EXISTS "ad_secrets_block_public" ON public.ad_account_secrets;

CREATE POLICY "ad_secrets_block_public" 
ON public.ad_account_secrets 
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- 4. Fix organizations table - block anonymous access
DROP POLICY IF EXISTS "organizations_block_anon" ON public.organizations;

CREATE POLICY "organizations_block_anon" 
ON public.organizations 
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- All tables now have proper protection against unauthenticated access
-- Authenticated users can still access their own data through existing permissive policies