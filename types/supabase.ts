export type User = {
  id: string
  email: string
  payment_id: string
  subscription_status: 'active' | 'cancelled' | 'expired'
  created_at: string
  subscription_end_date: string
}

// Add this type for Supabase
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