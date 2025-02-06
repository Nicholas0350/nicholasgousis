## SpecStory

## Fixing Socket.IO 404 Error in Next.js (19/12/2024, 12:11:42)

_**User**_

when dashboard page is rendering im gettting GET /socket.io?EIO=4&transport=polling&t=5vh4ti8k 404 in 139ms in terminal 

---

_**Assistant**_

This error occurs because something is trying to establish a Socket.IO connection, but there's no Socket.IO server configured. In Next.js 13+, you'll need to properly set up the WebSocket connection for Supabase's realtime features.

Here's how to fix it:

```typescript:app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/supabase'
// ... other imports

export default function DashboardPage() {
  // ... existing state declarations

  useEffect(() => {
    // Create a clean-up function for the Supabase client
    const cleanupSupabase = () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {})
      return () => {
        subscription.unsubscribe()
      }
    }

    // ... your existing bot detection code

    async function fetchUser() {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .single()

        if (error) throw error
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    const cleanup = cleanupSupabase()
    
    return () => {
      cleanup()
    }
  }, [])

  // ... rest of your component
}
```

Also, update your Supabase client configuration:

```typescript:lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)
```

This should resolve the Socket.IO error by:
1. Properly cleaning up Supabase subscriptions
2. Configuring the realtime client options
3. Preventing unnecessary WebSocket connections

---



---

