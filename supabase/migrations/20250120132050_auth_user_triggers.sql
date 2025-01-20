-- Create function to handle new auth users
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.user (
    id,
    email,
    created_at,
    updated_at,
    subscription_status,
    stripe_customer_id,
    stripe_session_id
  ) values (
    new.id::bigint,
    new.email,
    new.created_at,
    new.created_at,
    'pending',
    null,
    null
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create function to handle auth user updates
create or replace function public.handle_auth_user_update()
returns trigger as $$
begin
  update public.user
  set
    email = new.email,
    updated_at = new.updated_at
  where id = new.id::bigint;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

-- Create trigger for user updates
create trigger on_auth_user_updated
  after update of email on auth.users
  for each row execute procedure public.handle_auth_user_update();

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

  -- Then drop functions
  drop function if exists public.handle_new_auth_user();
  drop function if exists public.handle_auth_user_update();
end;
$$ language plpgsql;
