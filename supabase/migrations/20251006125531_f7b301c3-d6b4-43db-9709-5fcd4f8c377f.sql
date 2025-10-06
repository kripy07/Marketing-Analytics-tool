-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "users_view_org_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_manage_org_roles" ON public.user_roles;

-- Create security definer function to check if user belongs to an organization
CREATE OR REPLACE FUNCTION public.user_in_organization(p_user_id uuid, p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = p_user_id
    AND organization_id = p_organization_id
  );
$$;

-- Create security definer function to get user's organizations
CREATE OR REPLACE FUNCTION public.get_user_organizations(p_user_id uuid)
RETURNS TABLE(organization_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT organization_id
  FROM user_roles
  WHERE user_id = p_user_id;
$$;

-- Create new SELECT policy using security definer function
CREATE POLICY "users_view_org_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT get_user_organizations.organization_id 
    FROM get_user_organizations(auth.uid())
  )
);

-- Create new policy for admins to manage roles using security definer function
CREATE POLICY "admins_can_manage_org_roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  user_has_role(auth.uid(), 'admin'::user_role) 
  AND organization_id IN (
    SELECT get_user_organizations.organization_id 
    FROM get_user_organizations(auth.uid())
  )
)
WITH CHECK (
  user_has_role(auth.uid(), 'admin'::user_role)
  AND organization_id IN (
    SELECT get_user_organizations.organization_id 
    FROM get_user_organizations(auth.uid())
  )
);