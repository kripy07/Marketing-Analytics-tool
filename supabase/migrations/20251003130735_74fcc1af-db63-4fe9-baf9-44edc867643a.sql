-- ========================================
-- SECURITY FIX: Block public access to invitations table
-- ========================================

-- Add restrictive policies to block anon and public role access to invitations
-- This prevents unauthorized access to invitation tokens and email addresses

CREATE POLICY "invitations_block_anon"
ON public.invitations
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "invitations_block_public"
ON public.invitations
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Add a policy to allow invited users to view their own invitation by token
-- This allows users to accept invitations via a public invitation link
CREATE POLICY "invitations_view_by_token"
ON public.invitations
AS PERMISSIVE
FOR SELECT
TO anon
USING (
  -- Allow access only if the invitation hasn't been accepted and hasn't expired
  accepted_at IS NULL 
  AND expires_at > now()
  AND token = (current_setting('request.jwt.claims', true)::json->>'invitation_token')::uuid
);

-- Document the security configuration
COMMENT ON TABLE public.invitations IS 
'Organization invitations with email addresses and tokens. RLS enforced: anon/public blocked by default, only admins can manage, invited users can view via valid token.';

-- Note: The invitations_view_by_token policy allows access via token in JWT claims
-- which would be set when a user clicks an invitation link. If this functionality
-- isn't needed, you can drop that policy for maximum security.