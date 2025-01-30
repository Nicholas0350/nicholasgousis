-- First, create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_advisers_licence_number
  ON financial_advisers("LICENCE_NUMBER");

CREATE INDEX IF NOT EXISTS idx_financial_adviser_afs_reps_lic_num
  ON financial_adviser_afs_reps("AFS_LIC_NUM");

CREATE INDEX IF NOT EXISTS idx_afsl_licensees_lic_num
  ON afsl_licensees("AFS_LIC_NUM");

-- Drop existing constraints if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_financial_adviser_licensee'
        AND table_name = 'financial_advisers'
    ) THEN
        ALTER TABLE financial_advisers
        DROP CONSTRAINT fk_financial_adviser_licensee;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_financial_adviser_afs_rep_licensee'
        AND table_name = 'financial_adviser_afs_reps'
    ) THEN
        ALTER TABLE financial_adviser_afs_reps
        DROP CONSTRAINT fk_financial_adviser_afs_rep_licensee;
    END IF;
END $$;

-- Clean up any orphaned records before adding constraints
DELETE FROM financial_advisers
WHERE "LICENCE_NUMBER" NOT IN (
  SELECT "AFS_LIC_NUM" FROM afsl_licensees
);

DELETE FROM financial_adviser_afs_reps
WHERE "AFS_LIC_NUM" NOT IN (
  SELECT "AFS_LIC_NUM" FROM afsl_licensees
);

-- Now add the foreign key constraints
ALTER TABLE financial_advisers
  ADD CONSTRAINT fk_financial_adviser_licensee
  FOREIGN KEY ("LICENCE_NUMBER")
  REFERENCES afsl_licensees("AFS_LIC_NUM")
  ON DELETE CASCADE;

ALTER TABLE financial_adviser_afs_reps
  ADD CONSTRAINT fk_financial_adviser_afs_rep_licensee
  FOREIGN KEY ("AFS_LIC_NUM")
  REFERENCES afsl_licensees("AFS_LIC_NUM")
  ON DELETE CASCADE;