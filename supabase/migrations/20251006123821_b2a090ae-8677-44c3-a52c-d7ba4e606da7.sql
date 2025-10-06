-- Add blocking policy for anonymous access to scheduled_reports
CREATE POLICY "scheduled_reports_block_anon" 
ON public.scheduled_reports 
FOR ALL 
TO anon 
USING (false)
WITH CHECK (false);

-- Add blocking policy for public role to scheduled_reports
CREATE POLICY "scheduled_reports_block_public" 
ON public.scheduled_reports 
FOR ALL 
TO public 
USING (false)
WITH CHECK (false);

-- Ensure profiles table blocks all public access (if policy doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'profiles_block_public'
  ) THEN
    CREATE POLICY "profiles_block_public" 
    ON public.profiles 
    FOR ALL 
    TO public 
    USING (false)
    WITH CHECK (false);
  END IF;
END $$;

-- Ensure invitations table blocks all public access (if policy doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'invitations' 
    AND policyname = 'invitations_block_public'
  ) THEN
    CREATE POLICY "invitations_block_public" 
    ON public.invitations 
    FOR ALL 
    TO public 
    USING (false)
    WITH CHECK (false);
  END IF;
END $$;