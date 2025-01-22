-- Create banned person relationships table
CREATE TABLE IF NOT EXISTS banned_person_relationships (
  "ID" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "BANNED_PERSON_ID" uuid NOT NULL,
  "ENTITY_TYPE" text NOT NULL,
  "ENTITY_ID" text NOT NULL,
  "RELATIONSHIP_START_DATE" timestamptz NOT NULL,
  "RELATIONSHIP_END_DATE" timestamptz,
  "CREATED_AT" timestamptz DEFAULT now(),
  "UPDATED_AT" timestamptz DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE banned_person_relationships
  ADD CONSTRAINT fk_banned_person
  FOREIGN KEY ("BANNED_PERSON_ID")
  REFERENCES banned_and_disqualified_persons("ID");

-- Add indexes
CREATE INDEX idx_banned_person_relationships_entity
  ON banned_person_relationships("ENTITY_TYPE", "ENTITY_ID");

CREATE INDEX idx_banned_person_relationships_dates
  ON banned_person_relationships("RELATIONSHIP_START_DATE", "RELATIONSHIP_END_DATE");

-- Add comment
COMMENT ON TABLE banned_person_relationships IS 'Tracks relationships between banned persons and various entities';