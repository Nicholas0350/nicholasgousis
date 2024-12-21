import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Add debug logging
console.log('Supabase URL Available:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key Available:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-my-custom-header': 'newsletter-subscriber'
      }
    }
  }
)