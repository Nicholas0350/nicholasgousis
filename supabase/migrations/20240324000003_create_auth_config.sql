-- Drop existing table if it exists
DROP TABLE IF EXISTS auth.config;

-- Create auth.config table
CREATE TABLE auth.config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id uuid,
  provider_id uuid,
  provider_type text,
  smtp_admin_email text,
  smtp_host text,
  smtp_port integer,
  smtp_user text,
  smtp_pass text,
  smtp_max_frequency integer DEFAULT 0,
  rate_limit_email_sent integer DEFAULT 0,
  smtp_sender_name text,
  mailer_autoconfirm boolean DEFAULT false,
  enable_signup boolean DEFAULT true,
  enable_confirmations boolean DEFAULT false,
  smtp_auth_method text DEFAULT 'LOGIN',
  mailer_secure_email_change_enabled boolean DEFAULT false,
  mailer_secure_password_reset_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default row
INSERT INTO auth.config (
  smtp_admin_email,
  smtp_host,
  smtp_port,
  smtp_user,
  smtp_pass,
  smtp_sender_name,
  mailer_autoconfirm,
  enable_signup,
  enable_confirmations,
  smtp_auth_method,
  mailer_secure_email_change_enabled,
  mailer_secure_password_reset_enabled
) VALUES (
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  false,
  true,
  false,
  'LOGIN',
  false,
  false
);