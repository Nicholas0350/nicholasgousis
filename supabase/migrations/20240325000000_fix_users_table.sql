-- Rename user table to users and update references
ALTER TABLE IF EXISTS public.user RENAME TO users;

-- Create trigger function for auth user management
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (
    new.id,
    new.email,
    new.created_at
  );
  RETURN new;
END;
$$;

-- Update RLS policies for the renamed table
DROP POLICY IF EXISTS "Authenticated users can view user" ON public.users;
CREATE POLICY "Authenticated users can view users"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid()::text = id::text);

-- Grant necessary permissions
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO service_role;