-- Add foreign key constraints for financial advisers to AFS licensees
ALTER TABLE financial_advisers
  ADD CONSTRAINT fk_financial_adviser_licensee
  FOREIGN KEY ("LICENCE_NUMBER")
  REFERENCES afs_licensees("AFS_LIC_NUM");

-- Add foreign key constraints for financial adviser AFS reps
ALTER TABLE financial_adviser_afs_reps
  ADD CONSTRAINT fk_financial_adviser_afs_rep_licensee
  FOREIGN KEY ("AFS_LIC_NUM")
  REFERENCES afs_licensees("AFS_LIC_NUM");

-- Add indexes for better query performance
CREATE INDEX idx_financial_advisers_licence_number
  ON financial_advisers("LICENCE_NUMBER");

CREATE INDEX idx_financial_adviser_afs_reps_lic_num
  ON financial_adviser_afs_reps("AFS_LIC_NUM");