-- Fix profiles table RLS to prevent public access to user emails
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "profiles_block_public" ON public.profiles;

-- Recreate restrictive policy scoped to authenticated role only
-- This ensures authenticated users must still pass the permissive policies
CREATE POLICY "profiles_restrict_authenticated" 
ON public.profiles 
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- The existing permissive policies already ensure users can only access their own profile:
-- profiles_auth_select: SELECT where auth.uid() = id
-- profiles_auth_insert: INSERT where auth.uid() = id  
-- profiles_auth_update: UPDATE where auth.uid() = id
-- profiles_auth_delete: DELETE where auth.uid() = id

-- Now authenticated users can only access profiles where auth.uid() = id