export interface Webhook {
  id: string
  user_id: string
  url: string
  secret: string
  description?: string
  is_active: boolean
  last_triggered_at?: string
  failure_count: number
  created_at: string
  updated_at: string
}
