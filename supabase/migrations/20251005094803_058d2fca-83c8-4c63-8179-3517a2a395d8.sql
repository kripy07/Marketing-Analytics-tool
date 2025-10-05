-- Fix organizations and user_roles RLS policies to allow onboarding and data creation

-- 1. Fix organizations table - allow authenticated users to create organizations
CREATE POLICY "users_can_create_organizations" 
ON public.organizations 
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Any authenticated user can create an organization

CREATE POLICY "users_can_update_their_organizations" 
ON public.organizations 
FOR UPDATE
TO authenticated
USING (id IN (
  SELECT organization_id FROM user_roles WHERE user_id = auth.uid()
))
WITH CHECK (id IN (
  SELECT organization_id FROM user_roles WHERE user_id = auth.uid()
));

CREATE POLICY "admins_can_delete_organizations" 
ON public.organizations 
FOR DELETE
TO authenticated
USING (
  public.user_has_role(auth.uid(), 'admin'::user_role)
  AND id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid())
);

-- 2. Fix user_roles table - allow users to be added to organizations
CREATE POLICY "users_can_create_own_role" 
ON public.user_roles 
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_can_manage_org_roles" 
ON public.user_roles 
FOR ALL
TO authenticated
USING (
  public.user_has_role(auth.uid(), 'admin'::user_role)
  AND organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid())
)
WITH CHECK (
  public.user_has_role(auth.uid(), 'admin'::user_role)
  AND organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid())
);

-- 3. Ensure onboarding can complete properly
-- When a user creates an org during onboarding, they automatically become admin
-- This should be handled by the application logic or trigger