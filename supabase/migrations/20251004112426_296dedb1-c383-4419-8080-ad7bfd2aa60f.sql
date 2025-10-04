-- ========================================
-- FIX: Ensure invitations table is completely inaccessible to anonymous users
-- ========================================
-- Security issue: The invitations table contains email addresses and tokens
-- and must be completely inaccessible to unauthenticated users.

-- The existing policies are correct but we need to ensure RLS is enabled
-- and add an additional layer of protection

-- Verify RLS is enabled (it should be already)
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're properly configured
DROP POLICY IF EXISTS "invitations_block_anon" ON public.invitations;
DROP POLICY IF EXISTS "invitations_block_public" ON public.invitations;
DROP POLICY IF EXISTS "invitations_admins_manage" ON public.invitations;

-- Create RESTRICTIVE policies to completely block anonymous access
-- This blocks the anon role specifically
CREATE POLICY "invitations_block_anon"
ON public.invitations
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- This blocks the public role (which in PostgreSQL means all roles by default)
-- but we'll make it check for authentication
CREATE POLICY "invitations_block_public"
ON public.invitations
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Now create the PERMISSIVE policy for admins (this only works if the restrictive policies pass)
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

-- Update table comment
COMMENT ON TABLE public.invitations IS 
'Organization invitations with email addresses and tokens. RLS enforced: anonymous/public completely blocked, only organization admins (authenticated) can view and manage invitations.';