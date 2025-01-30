-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.handle_new_auth_user();
DROP FUNCTION IF EXISTS public.handle_auth_user_update();
DROP FUNCTION IF EXISTS public.handle_auth_user_delete();

-- Create function to handle new users
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Create function to handle user updates
create or replace function public.handle_auth_user_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.users
  set email = new.email,
      updated_at = now()
  where id = new.id;
  return new;
end;
$$;

-- Create function to handle user deletions
create or replace function public.handle_auth_user_delete()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.users
  where id = old.id;
  return old;
end;
$$;

-- Create trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

-- Create trigger for user updates
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_auth_user_update();

-- Create trigger for user deletions
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_auth_user_delete();

-- Add comment explaining the purpose
comment on function public.handle_new_auth_user() is 'Automatically creates a public.user record when a new auth.users record is created';
comment on function public.handle_auth_user_update() is 'Keeps public.user email in sync with auth.users';

-- Create down migration
-- We'll need this if we ever need to roll back
create or replace function down_20250120132050()
returns void as $$
begin
  -- Drop triggers first
  drop trigger if exists on_auth_user_created on auth.users;
  drop trigger if exists on_auth_user_updated on auth.users;
  drop trigger if exists on_auth_user_deleted on auth.users;

  -- Then drop functions
  drop function if exists public.handle_new_auth_user();
  drop function if exists public.handle_auth_user_update();
  drop function if exists public.handle_auth_user_delete();
end;
$$ language plpgsql;
