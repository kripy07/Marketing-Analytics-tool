-- Fix organizations RLS policies to allow authenticated users to create organizations
-- The issue is that restrictive block policies were blocking ALL users including authenticated

-- Drop existing problematic policies
DROP POLICY IF EXISTS "organizations_block_anon" ON public.organizations;
DROP POLICY IF EXISTS "users_can_create_organizations" ON public.organizations;

-- Recreate block policy scoped to anon role only
CREATE POLICY "organizations_block_anon"
ON public.organizations
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Recreate insert policy for authenticated users as PERMISSIVE
CREATE POLICY "users_can_create_organizations"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (true);