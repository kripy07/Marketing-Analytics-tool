-- ========================================
-- FIX: Block public/anonymous access to profiles table
-- ========================================
-- Security issue: The profiles table contains PII (emails, names, company names) 
-- and must be completely inaccessible to unauthenticated users.

-- Drop existing blocking policies to recreate them properly
DROP POLICY IF EXISTS "profiles_block_anon" ON public.profiles;
DROP POLICY IF EXISTS "profiles_block_public" ON public.profiles;

-- Create RESTRICTIVE policies to completely block anonymous access
CREATE POLICY "profiles_block_anon"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Create RESTRICTIVE policy to block public (all roles) except authenticated
CREATE POLICY "profiles_block_public"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Update table comment
COMMENT ON TABLE public.profiles IS 
'User profiles containing PII. RLS enforced: anonymous/public completely blocked, authenticated users can only access their own profile.';