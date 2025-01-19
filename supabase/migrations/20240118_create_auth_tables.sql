-- Create stripe_webhooks table to prevent duplicate processing
CREATE TABLE IF NOT EXISTS stripe_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL
);

-- Enable RLS
ALTER TABLE stripe_webhooks ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Enable all access for service role" ON stripe_webhooks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);