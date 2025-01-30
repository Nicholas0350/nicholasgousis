-- Create webhooks table for dataset change notifications
CREATE TABLE IF NOT EXISTS public.webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  last_triggered_at timestamptz,
  failure_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_webhooks_user_id ON public.webhooks(user_id);
CREATE INDEX idx_webhooks_is_active ON public.webhooks(is_active);

-- Add RLS policies
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Users can view their own webhooks
CREATE POLICY "Users can view their own webhooks"
ON public.webhooks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own webhooks
CREATE POLICY "Users can create their own webhooks"
ON public.webhooks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own webhooks
CREATE POLICY "Users can update their own webhooks"
ON public.webhooks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own webhooks
CREATE POLICY "Users can delete their own webhooks"
ON public.webhooks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Add comments
COMMENT ON TABLE public.webhooks IS 'Webhooks for notifying users of dataset changes';
COMMENT ON COLUMN public.webhooks.secret IS 'Secret used to sign webhook payloads';
COMMENT ON COLUMN public.webhooks.failure_count IS 'Number of consecutive delivery failures';