-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.handle_new_auth_user();
DROP FUNCTION IF EXISTS public.handle_auth_user_update();
DROP FUNCTION IF EXISTS public.handle_auth_user_delete();

-- Create function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user (
    auth_user_id,
    email,
    created_at,
    updated_at,
    subscription_status
  ) VALUES (
    new.id,
    new.email,
    new.created_at,
    new.created_at,
    'pending'
  );
  RETURN new;
END;
$$;

-- Create function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_auth_user_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.user
  SET
    email = new.email,
    updated_at = now()
  WHERE auth_user_id = new.id;
  RETURN new;
END;
$$;

-- Create function to handle user deletions
CREATE OR REPLACE FUNCTION public.handle_auth_user_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user
  WHERE auth_user_id = old.id;
  RETURN old;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_auth_user_update();

-- Create trigger for user deletions
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_auth_user_delete();

-- Add RLS policy for the user table
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
ON public.user
FOR ALL
TO authenticated
USING (auth_user_id = auth.uid());

-- Grant necessary permissions
GRANT ALL ON public.user TO postgres;
GRANT ALL ON public.user TO service_role;