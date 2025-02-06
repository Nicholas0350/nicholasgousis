-- Create dataset_metadata table
CREATE TABLE IF NOT EXISTS dataset_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dataset_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE policyname = 'Dataset metadata is viewable by all users'
  ) THEN
    CREATE POLICY "Dataset metadata is viewable by all users"
      ON dataset_metadata
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE policyname = 'Dataset metadata is insertable by service role only'
  ) THEN
    CREATE POLICY "Dataset metadata is insertable by service role only"
      ON dataset_metadata
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE policyname = 'Dataset metadata is updatable by service role only'
  ) THEN
    CREATE POLICY "Dataset metadata is updatable by service role only"
      ON dataset_metadata
      FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE policyname = 'Dataset metadata is deletable by service role only'
  ) THEN
    CREATE POLICY "Dataset metadata is deletable by service role only"
      ON dataset_metadata
      FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- Create webhooks table for Tier 2 subscribers
CREATE TABLE IF NOT EXISTS public.webhooks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret text NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create RLS policies
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Webhook policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE policyname = 'Users can view their own webhooks'
  ) THEN
    CREATE POLICY "Users can view their own webhooks"
      ON public.webhooks FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE policyname = 'Users can create their own webhooks'
  ) THEN
    CREATE POLICY "Users can create their own webhooks"
      ON public.webhooks FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE policyname = 'Users can update their own webhooks'
  ) THEN
    CREATE POLICY "Users can update their own webhooks"
      ON public.webhooks FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE policyname = 'Users can delete their own webhooks'
  ) THEN
    CREATE POLICY "Users can delete their own webhooks"
      ON public.webhooks FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.dataset_metadata;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.dataset_metadata
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.webhooks;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();