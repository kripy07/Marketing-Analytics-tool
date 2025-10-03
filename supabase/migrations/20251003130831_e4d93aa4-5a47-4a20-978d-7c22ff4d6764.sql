-- ========================================
-- FIX: Update invitations policy to target authenticated role only
-- ========================================

-- The existing "Admins can manage invitations" policy targets the 'public' role
-- which in PostgreSQL means ALL roles, creating a conflict with blocking policies.
-- We need to drop and recreate it to target only 'authenticated' role.

DROP POLICY IF EXISTS "Admins can manage invitations" ON public.invitations;

-- Recreate the admin policy targeting only authenticated users
CREATE POLICY "invitations_admins_manage"
ON public.invitations
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT user_roles.organization_id
    FROM user_roles
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'::user_role
  )
)
WITH CHECK (
  organization_id IN (
    SELECT user_roles.organization_id
    FROM user_roles
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'::user_role
  )
);

-- Also drop the invitations_view_by_token policy as it conflicts with blocking
-- If invitation acceptance is needed, it should be handled via a server-side function
DROP POLICY IF EXISTS "invitations_view_by_token" ON public.invitations;

-- Update table comment
COMMENT ON TABLE public.invitations IS 
'Organization invitations with email addresses and tokens. RLS enforced: anon/public completely blocked, only organization admins can view and manage invitations.';