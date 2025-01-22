# AFSL Data Pipeline


Details:

Data is fetched from data.gov.au
Parsed and transformed so it can be upserted into Supabase
Data is fetched on the 1st and 15th of each month






## Cron for data pipeline
```sql
-- Schedule AFSL data fetch to run on 1st and 15th of each month at 00:00 UTC
select cron.schedule(
  'fetch-afsl-data',
  '0 0 1,15 * *',
  $$
  select net.http_post(
    url := 'https://chybymkpkirlyskmmxaf.supabase.co/functions/v1/fetch-afsl-data',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoeWJ5bWtwa2lybHlza21teGFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTQxOTM3NywiZXhwIjoyMDMwOTk1Mzc3fQ._X1ldeh1SHu_besmPY6tbVPckVanZA9-ox-UBAJxpCk"}'::jsonb
  ) as request_id;
  $$
);
```

## Supabase

-- Create index for faster searches
  -- create index
  -- create index

<!-- -- Prospects Table (for sales pipeline)
create table public.prospects (
  id bigint primary key,
  afsl_licensee_id bigint references public.afsl_licensees(id),
  status varchar default 'new',
  priority int default 0,
  last_contacted timestamptz,
  next_follow_up timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for pipeline management
create index idx_prospects_status on public.prospects(status);
create index idx_prospects_next_follow_up on public.prospects(next_follow_up); -->


## Implementation Steps

1. Data Import Script
   - Create TypeScript interfaces for AFSL data
   - Implement API fetching with rate limiting
   - Transform data to match Supabase schema
   - Implement upsert logic for updates

2. Data Enrichment
   - Company size from ABN lookup
   - LinkedIn company profiles
   - Website details
   - Industry categorization

3. Prospect Scoring
   - Score based on:
     * License scope
     * Company size
     * Location
     * Recent compliance issues
     * Digital presence

4. Integration Points
