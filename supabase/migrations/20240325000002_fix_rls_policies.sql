-- Enable RLS on public.profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own data" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.profiles;

-- Create comprehensive RLS policies for public.profiles
CREATE POLICY "Enable read for users own data"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Enable update for users own data"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow service role full access
CREATE POLICY "Enable full access for service role"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policies for auth.users
-- These are more restrictive since it's the core auth table
CREATE POLICY "Users can view their own auth data"
ON auth.users FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own auth data"
ON auth.users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Add comment explaining the policies
COMMENT ON TABLE public.profiles IS 'User profiles table linked to auth.users via id';