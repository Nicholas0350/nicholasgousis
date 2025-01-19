-- First truncate tables to remove any data
TRUNCATE TABLE basejump.invitations CASCADE;
TRUNCATE TABLE basejump.billing_subscriptions CASCADE;
TRUNCATE TABLE basejump.billing_customers CASCADE;
TRUNCATE TABLE basejump.account_user CASCADE;
TRUNCATE TABLE basejump.config CASCADE;

-- Now drop the tables
DROP TABLE IF EXISTS basejump.invitations CASCADE;
DROP TABLE IF EXISTS basejump.billing_subscriptions CASCADE;
DROP TABLE IF EXISTS basejump.billing_customers CASCADE;
DROP TABLE IF EXISTS basejump.account_user CASCADE;
DROP TABLE IF EXISTS basejump.config CASCADE;

-- Remove types
DROP TYPE IF EXISTS basejump.account_role CASCADE;
DROP TYPE IF EXISTS basejump.invitation_type CASCADE;
DROP TYPE IF EXISTS basejump.subscription_status CASCADE;

-- Finally remove the schema itself
DROP SCHEMA IF EXISTS basejump CASCADE;

-- Log removal
DO $$
BEGIN
    RAISE NOTICE 'Removed Basejump schema and all its components';
END $$;