-- Drop unused Basejump functions
DROP FUNCTION IF EXISTS basejump.run_new_user_setup() CASCADE;
DROP FUNCTION IF EXISTS basejump.add_current_user_to_new_account() CASCADE;
DROP FUNCTION IF EXISTS basejump.trigger_set_invitation_details() CASCADE;
DROP FUNCTION IF EXISTS basejump.trigger_set_timestamps() CASCADE;
DROP FUNCTION IF EXISTS basejump.trigger_set_user_tracking() CASCADE;
DROP FUNCTION IF EXISTS basejump.protect_account_fields() CASCADE;
DROP FUNCTION IF EXISTS basejump.slugify_account_slug() CASCADE;

-- Log that functions were removed
DO $$
BEGIN
    RAISE NOTICE 'Removed unused Basejump functions';
END $$;