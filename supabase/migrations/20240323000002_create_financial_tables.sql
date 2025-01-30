-- Create financial advisers table
CREATE TABLE IF NOT EXISTS financial_advisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "LICENCE_NUMBER" TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AFSL licensees table
CREATE TABLE IF NOT EXISTS afsl_licensees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "AFS_LIC_NUM" TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create financial adviser AFS representatives table
CREATE TABLE IF NOT EXISTS financial_adviser_afs_reps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "AFS_LIC_NUM" TEXT NOT NULL,
  adviser_id UUID REFERENCES financial_advisers(id) ON DELETE CASCADE,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create triggers for updated_at
CREATE TRIGGER set_timestamp_financial_advisers
  BEFORE UPDATE ON financial_advisers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_afsl_licensees
  BEFORE UPDATE ON afsl_licensees
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_financial_adviser_afs_reps
  BEFORE UPDATE ON financial_adviser_afs_reps
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();