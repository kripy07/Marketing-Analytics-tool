-- Fix profiles table: Remove the permissive policy that allows all authenticated users to SELECT
-- and replace with more restrictive ones
DROP POLICY IF EXISTS "profiles_auth_select" ON public.profiles;

-- Create a restrictive policy that only allows users to see their own profile
CREATE POLICY "profiles_user_select_own" 
ON public.profiles 
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Add restrictive policy to prevent enumeration of user_roles
CREATE POLICY "user_roles_block_anon" 
ON public.user_roles 
AS RESTRICTIVE
FOR ALL
TO anon 
USING (false)
WITH CHECK (false);

CREATE POLICY "user_roles_block_public" 
ON public.user_roles 
AS RESTRICTIVE
FOR ALL
TO public 
USING (false)
WITH CHECK (false);

-- Add restrictive SELECT policy for user_roles to prevent enumeration
-- Users can only see roles within their own organizations
DROP POLICY IF EXISTS "users_view_own_role" ON public.user_roles;

CREATE POLICY "users_view_org_roles" 
ON public.user_roles 
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
);