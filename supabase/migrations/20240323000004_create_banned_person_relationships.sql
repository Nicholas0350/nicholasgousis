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

-- First drop existing constraints if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_banned_person'
        AND table_name = 'banned_person_relationships'
    ) THEN
        ALTER TABLE banned_person_relationships
        DROP CONSTRAINT fk_banned_person;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_entity'
        AND table_name = 'banned_person_relationships'
    ) THEN
        ALTER TABLE banned_person_relationships
        DROP CONSTRAINT fk_entity;
    END IF;
END $$;

-- Add foreign key constraints
ALTER TABLE banned_person_relationships
  ADD CONSTRAINT fk_banned_person
  FOREIGN KEY ("BANNED_PERSON_ID")
  REFERENCES banned_and_disqualified_persons("ID")
  ON DELETE CASCADE;

ALTER TABLE banned_person_relationships
  ADD CONSTRAINT fk_entity
  FOREIGN KEY ("ENTITY_ID")
  REFERENCES afsl_licensees("AFS_LIC_NUM")
  ON DELETE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_banned_person_relationships_banned_person_id
  ON banned_person_relationships("BANNED_PERSON_ID");

CREATE INDEX IF NOT EXISTS idx_banned_person_relationships_entity_id
  ON banned_person_relationships("ENTITY_ID");

-- Add indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_banned_person_relationships_entity
  ON banned_person_relationships("ENTITY_TYPE", "ENTITY_ID");

CREATE INDEX IF NOT EXISTS idx_banned_person_relationships_dates
  ON banned_person_relationships("RELATIONSHIP_START_DATE", "RELATIONSHIP_END_DATE");

-- Add comment
COMMENT ON TABLE banned_person_relationships IS 'Tracks relationships between banned persons and various entities';