-- Enable SMTP in auth.config
UPDATE auth.config
SET
  smtp_admin_email = 'newsletter@nicholasgousis.com',
  smtp_host = 'smtp.resend.com',
  smtp_port = 465,
  smtp_user = 'resend',
  smtp_pass = 're_HvPAiaJX_Mb9UcoVWUnbF7N5PKPJjeohi',
  smtp_max_frequency = 0,
  rate_limit_email_sent = 0,
  smtp_sender_name = 'Nicholas Gousis',
  mailer_autoconfirm = true,
  enable_signup = true,
  enable_confirmations = true,
  smtp_auth_method = 'LOGIN';

-- Enable email confirmations in auth.config
UPDATE auth.config
SET
  mailer_secure_email_change_enabled = true,
  mailer_secure_password_reset_enabled = true;