-- Enable RLS on public.user table
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own data" ON public.user;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON public.user;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.user;

-- Create comprehensive RLS policies for public.user
CREATE POLICY "Enable read for users own data"
ON public.user FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

CREATE POLICY "Enable update for users own data"
ON public.user FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Allow service role full access
CREATE POLICY "Enable full access for service role"
ON public.user
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

GRANT ALL ON public.user TO authenticated;
GRANT ALL ON public.user TO service_role;

-- Add comment explaining the policies
COMMENT ON TABLE public.user IS 'Custom user data table linked to auth.users via auth_user_id';