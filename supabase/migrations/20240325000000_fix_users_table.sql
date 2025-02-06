-- Update RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create updated policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Grant necessary permissions
GRANT ALL ON public.profiles TO postgres;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;