-- Completely rebuild organizations RLS policies to allow proper access
-- Drop ALL existing policies on organizations
DROP POLICY IF EXISTS "Users can view their organizations" ON public.organizations;
DROP POLICY IF EXISTS "organizations_block_anon" ON public.organizations;
DROP POLICY IF EXISTS "users_can_create_organizations" ON public.organizations;
DROP POLICY IF EXISTS "users_can_update_their_organizations" ON public.organizations;
DROP POLICY IF EXISTS "admins_can_delete_organizations" ON public.organizations;

-- Create simple, straightforward policies for authenticated users
-- Allow authenticated users to insert organizations
CREATE POLICY "authenticated_users_can_create_orgs"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to view organizations they belong to
CREATE POLICY "authenticated_users_can_view_their_orgs"
ON public.organizations
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT organization_id
    FROM public.user_roles
    WHERE user_id = auth.uid()
  )
);

-- Allow authenticated users to update organizations they belong to
CREATE POLICY "authenticated_users_can_update_their_orgs"
ON public.organizations
FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT organization_id
    FROM public.user_roles
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  id IN (
    SELECT organization_id
    FROM public.user_roles
    WHERE user_id = auth.uid()
  )
);

-- Allow admins to delete organizations
CREATE POLICY "admins_can_delete_orgs"
ON public.organizations
FOR DELETE
TO authenticated
USING (
  id IN (
    SELECT organization_id
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Block all anon access
CREATE POLICY "block_anon_access"
ON public.organizations
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);