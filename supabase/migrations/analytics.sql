create table account_metrics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  followers_count integer,
  engagement_rate float,
  post_frequency integer, -- posts per week
  best_posting_times jsonb,
  measured_at timestamp with time zone default now()
);

create table post_performance (
  id uuid default uuid_generate_v4() primary key,
  thread_id uuid references threads(id),
  impressions integer,
  likes integer,
  replies integer,
  reposts integer,
  engagement_rate float,
  posted_at timestamp with time zone,
  measured_at timestamp with time zone default now()
);

create table growth_targets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  target_metric text, -- followers, engagement, etc
  target_value integer,
  target_date timestamp with time zone,
  created_at timestamp with time zone default now()
);