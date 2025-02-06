-- Create banned and disqualified persons table
CREATE TABLE IF NOT EXISTS banned_and_disqualified_persons (
  "ID" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "NAME" text NOT NULL,
  "DATE_OF_BIRTH" date,
  "BAN_START_DATE" timestamptz NOT NULL,
  "BAN_END_DATE" timestamptz,
  "BAN_TYPE" text NOT NULL,
  "BAN_REASON" text,
  "REGULATORY_ACTION" text,
  "CREATED_AT" timestamptz DEFAULT now(),
  "UPDATED_AT" timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_banned_persons_name
  ON banned_and_disqualified_persons("NAME");

CREATE INDEX IF NOT EXISTS idx_banned_persons_dates
  ON banned_and_disqualified_persons("BAN_START_DATE", "BAN_END_DATE");

-- Add trigger for updated_at
CREATE TRIGGER set_timestamp_banned_persons
  BEFORE UPDATE ON banned_and_disqualified_persons
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Add comment
COMMENT ON TABLE banned_and_disqualified_persons IS 'Stores information about banned and disqualified persons in the financial services industry';