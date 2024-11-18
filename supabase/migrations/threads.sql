create table threads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  content jsonb, -- stores the generated thread segments
  resources jsonb[], -- stores original resource metadata
  status text check (status in ('draft', 'scheduled', 'posted')),
  created_at timestamp with time zone default now(),
  scheduled_for timestamp with time zone,
  posted_at timestamp with time zone
);