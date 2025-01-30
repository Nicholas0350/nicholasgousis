-- Add is_admin column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Set nicholas0350@gmail.com as admin
UPDATE auth.users
SET is_admin = TRUE
WHERE email = 'nicholas0350@gmail.com';

-- Create policy to allow admin users to access admin features
CREATE POLICY "Allow admin access"
ON auth.users
FOR ALL
TO authenticated
USING (
  CASE
    WHEN is_admin = TRUE THEN TRUE
    ELSE id = auth.uid()
  END
);