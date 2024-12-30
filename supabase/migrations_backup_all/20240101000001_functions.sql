-- Create functions
CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW."UPDATED_AT" = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."trigger_set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE OR REPLACE TRIGGER "handle_updated_at"
    BEFORE UPDATE ON "public"."banned_and_disqualified_persons"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at"();

CREATE OR REPLACE TRIGGER "handle_updated_at"
    BEFORE UPDATE ON "public"."credit_licensees"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at"();

CREATE OR REPLACE TRIGGER "handle_updated_at"
    BEFORE UPDATE ON "public"."credit_representatives"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."handle_updated_at"();

CREATE OR REPLACE TRIGGER "set_timestamp"
    BEFORE UPDATE ON "public"."representative_relationships"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."trigger_set_timestamp"();

CREATE OR REPLACE TRIGGER "set_updated_at"
    BEFORE UPDATE ON "public"."afsl_licensees"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at_column"();