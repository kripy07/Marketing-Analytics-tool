-- Fix scheduled_reports policies
-- First, drop the incorrectly created permissive blocking policies
DROP POLICY IF EXISTS "scheduled_reports_block_anon" ON public.scheduled_reports;
DROP POLICY IF EXISTS "scheduled_reports_block_public" ON public.scheduled_reports;

-- Drop the policy that allows public role access
DROP POLICY IF EXISTS "Users can access org reports" ON public.scheduled_reports;

-- Create proper RESTRICTIVE blocking policies for scheduled_reports
CREATE POLICY "scheduled_reports_block_anon" 
ON public.scheduled_reports 
AS RESTRICTIVE
FOR ALL 
TO anon 
USING (false)
WITH CHECK (false);

CREATE POLICY "scheduled_reports_block_public" 
ON public.scheduled_reports 
AS RESTRICTIVE
FOR ALL 
TO public 
USING (false)
WITH CHECK (false);

-- Recreate the access policy for authenticated users only
CREATE POLICY "Users can access org reports" 
ON public.scheduled_reports 
FOR ALL 
TO authenticated
USING (organization_id IN ( 
  SELECT user_roles.organization_id
  FROM user_roles
  WHERE user_roles.user_id = auth.uid()
));

-- Ensure invitations policies are RESTRICTIVE
DROP POLICY IF EXISTS "invitations_block_anon" ON public.invitations;
DROP POLICY IF EXISTS "invitations_block_public" ON public.invitations;

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

-- Ensure profiles policies are RESTRICTIVE  
DROP POLICY IF EXISTS "profiles_block_anon" ON public.profiles;
DROP POLICY IF EXISTS "profiles_block_public" ON public.profiles;

CREATE POLICY "profiles_block_anon" 
ON public.profiles 
AS RESTRICTIVE
FOR ALL 
TO anon 
USING (false)
WITH CHECK (false);

CREATE POLICY "profiles_block_public" 
ON public.profiles 
AS RESTRICTIVE
FOR ALL 
TO public 
USING (false)
WITH CHECK (false);