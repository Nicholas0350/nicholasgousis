-- Functions for account management
CREATE OR REPLACE FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text")
    RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'basejump'
    AS $$
declare
    lookup_account_id       uuid;
    declare new_member_role basejump.account_role;
    lookup_account_slug     text;
begin
    -- ... rest of function ...
end;
$$;

ALTER FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") OWNER TO "postgres";

-- ... continue with other functions ...