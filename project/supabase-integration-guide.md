# Supabase Integration Guide

## Installation Steps

1. Install Supabase Client:
```bash
npm install @supabase/supabase-js
```

## Environment Setup

1. Create `.env.local` and `.env.production` with these variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

2. Get these values from:
- Supabase Dashboard > Project Settings > API
- Use the "service_role" key, not the "anon" key
- Project URL is under "Project Settings"

## Database Setup

1. Create Users Table in Supabase SQL Editor:
```sql
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  payment_id text unique not null,
  subscription_status text check (subscription_status in ('active', 'cancelled', 'expired')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  subscription_end_date timestamp with time zone not null
);
```

2. Enable Row Level Security (RLS):
```sql
-- Enable RLS
alter table public.users enable row level security;

-- Create policy for service role
create policy "Enable insert for service role"
on public.users
for insert
to service_role
with check (true);

-- Grant privileges
grant usage on schema public to service_role;
grant all privileges on public.users to service_role;
```

## TypeScript Setup

1. Create types file (`types/supabase.ts`):
```typescript
export type User = {
  id: string
  email: string
  payment_id: string
  subscription_status: 'active' | 'cancelled' | 'expired'
  created_at: string
  subscription_end_date: string
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id'>
        Update: Partial<User>
      }
    }
  }
}
```

## Supabase Client Setup

1. Create Supabase client (`lib/supabase.ts`):
```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    }
  }
)
```

## API Route Setup

1. Create user API route (`app/api/create-user/route.ts`):
```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, payment_id, subscription_status } = await req.json();

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          payment_id,
          subscription_status,
          created_at: new Date().toISOString(),
          subscription_end_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ user: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

## Common Issues & Solutions

1. Database Error (42501):
- Make sure you're using the service_role key, not the anon key
- Check RLS policies are properly set
- Verify table permissions

2. Type Errors:
- Ensure Database type matches your table schema
- Check that all required fields are included in inserts
- Verify enum values match the check constraint

3. Authentication Issues:
- Double-check environment variables are set
- Verify service role key has proper permissions
- Make sure RLS policies are correctly configured

## Testing the Integration

1. Test User Creation:
```typescript
// Make a test request to create-user endpoint
const response = await fetch('/api/create-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    payment_id: 'pi_123',
    subscription_status: 'active'
  })
});
```

2. Verify in Supabase Dashboard:
- Check Table Editor for new entries
- Review SQL query logs for errors
- Monitor realtime updates

## Next Steps
1. Add user authentication
2. Implement subscription management
3. Add user profile updates
4. Set up webhook handlers
5. Add email notifications

*Note: Always use environment variables and never commit sensitive keys to version control.*