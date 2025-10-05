-- Fix infinite recursion in user_roles RLS policies
-- The current policy queries the same table it protects, causing recursion

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view roles in their orgs" ON public.user_roles;

-- Simplify the policy - users can only view their own role
CREATE POLICY "users_view_own_role" 
ON public.user_roles 
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow users to see other roles in their organization through a security definer function
-- First, create the function that bypasses RLS
CREATE OR REPLACE FUNCTION public.get_user_organization_roles(p_organization_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role user_role,
  organization_id uuid,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- First verify the requesting user is in this organization
  SELECT ur.id, ur.user_id, ur.role, ur.organization_id, ur.created_at
  FROM user_roles ur
  WHERE ur.organization_id = p_organization_id
    AND EXISTS (
      SELECT 1 FROM user_roles ur2 
      WHERE ur2.user_id = auth.uid() 
      AND ur2.organization_id = p_organization_id
    );
$$;

-- Create a function to check if user has a specific role (for other RLS policies to use)
CREATE OR REPLACE FUNCTION public.user_has_role(p_user_id uuid, p_role user_role)
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
    AND role = p_role
  );
$$;

-- No recursive queries, no infinite loops