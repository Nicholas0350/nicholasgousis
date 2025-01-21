

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE SCHEMA IF NOT EXISTS "drizzle";


ALTER SCHEMA "drizzle" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'basejump'
    AS $$
declare
    lookup_account_id       uuid;
    declare new_member_role basejump.account_role;
    lookup_account_slug     text;
begin
    select i.account_id, i.account_role, a.slug
    into lookup_account_id, new_member_role, lookup_account_slug
    from basejump.invitations i
             join basejump.accounts a on a.id = i.account_id
    where i.token = lookup_invitation_token
      and i.created_at > now() - interval '24 hours';

    if lookup_account_id IS NULL then
        raise exception 'Invitation not found';
    end if;

    if lookup_account_id is not null then
        -- we've validated the token is real, so grant the user access
        insert into basejump.account_user (account_id, user_id, account_role)
        values (lookup_account_id, auth.uid(), new_member_role);
        -- email types of invitations are only good for one usage
        delete from basejump.invitations where token = lookup_invitation_token and invitation_type = 'one_time';
    end if;
    return json_build_object('account_id', lookup_account_id, 'account_role', new_member_role, 'slug',
                             lookup_account_slug);
EXCEPTION
    WHEN unique_violation THEN
        raise exception 'You are already a member of this account';
end;
$$;


ALTER FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_account"("slug" "text" DEFAULT NULL::"text", "name" "text" DEFAULT NULL::"text") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_account_id uuid;
BEGIN
    insert into basejump.accounts (slug, name)
    values (create_account.slug, create_account.name)
    returning id into new_account_id;

    return public.get_account(new_account_id);
EXCEPTION
    WHEN unique_violation THEN
        raise exception 'An account with that unique ID already exists';
END;
$$;


ALTER FUNCTION "public"."create_account"("slug" "text", "name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_account_role"("account_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    response jsonb;
BEGIN

    select jsonb_build_object(
                   'account_role', wu.account_role,
                   'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                   'is_personal_account', a.personal_account
               )
    into response
    from basejump.account_user wu
             join basejump.accounts a on a.id = wu.account_id
    where wu.user_id = auth.uid()
      and wu.account_id = current_user_account_role.account_id;

    -- if the user is not a member of the account, throw an error
    if response ->> 'account_role' IS NULL then
        raise exception 'Not found';
    end if;

    return response;
END
$$;


ALTER FUNCTION "public"."current_user_account_role"("account_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_invitation"("invitation_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- verify account owner for the invitation
    if basejump.has_role_on_account(
               (select account_id from basejump.invitations where id = delete_invitation.invitation_id), 'owner') <>
       true then
        raise exception 'Only account owners can delete invitations';
    end if;

    delete from basejump.invitations where id = delete_invitation.invitation_id;
end
$$;


ALTER FUNCTION "public"."delete_invitation"("invitation_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account"("account_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- check if the user is a member of the account or a service_role user
    if current_user IN ('anon', 'authenticated') and
       (select current_user_account_role(get_account.account_id) ->> 'account_role' IS NULL) then
        raise exception 'You must be a member of an account to access it';
    end if;


    return (select json_build_object(
                           'account_id', a.id,
                           'account_role', wu.account_role,
                           'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                           'name', a.name,
                           'slug', a.slug,
                           'personal_account', a.personal_account,
                           'billing_enabled', case
                                                  when a.personal_account = true then
                                                      config.enable_personal_account_billing
                                                  else
                                                      config.enable_team_account_billing
                               end,
                           'billing_status', bs.status,
                           'created_at', a.created_at,
                           'updated_at', a.updated_at,
                           'metadata', a.public_metadata
                       )
            from basejump.accounts a
                     left join basejump.account_user wu on a.id = wu.account_id and wu.user_id = auth.uid()
                     join basejump.config config on true
                     left join (select bs.account_id, status
                                from basejump.billing_subscriptions bs
                                where bs.account_id = get_account.account_id
                                order by created desc
                                limit 1) bs on bs.account_id = a.id
            where a.id = get_account.account_id);
END;
$$;


ALTER FUNCTION "public"."get_account"("account_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_billing_status"("account_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'basejump'
    AS $$
DECLARE
    result      jsonb;
    role_result jsonb;
BEGIN
    select public.current_user_account_role(get_account_billing_status.account_id) into role_result;

    select jsonb_build_object(
                   'account_id', get_account_billing_status.account_id,
                   'billing_subscription_id', s.id,
                   'billing_enabled', case
                                          when a.personal_account = true then config.enable_personal_account_billing
                                          else config.enable_team_account_billing end,
                   'billing_status', s.status,
                   'billing_customer_id', c.id,
                   'billing_provider', config.billing_provider,
                   'billing_email',
                   coalesce(c.email, u.email) -- if we don't have a customer email, use the user's email as a fallback
               )
    into result
    from basejump.accounts a
             join auth.users u on u.id = a.primary_owner_user_id
             left join basejump.billing_subscriptions s on s.account_id = a.id
             left join basejump.billing_customers c on c.account_id = coalesce(s.account_id, a.id)
             join basejump.config config on true
    where a.id = get_account_billing_status.account_id
    order by s.created desc
    limit 1;

    return result || role_result;
END;
$$;


ALTER FUNCTION "public"."get_account_billing_status"("account_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_by_slug"("slug" "text") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    internal_account_id uuid;
BEGIN
    select a.id
    into internal_account_id
    from basejump.accounts a
    where a.slug IS NOT NULL
      and a.slug = get_account_by_slug.slug;

    return public.get_account(internal_account_id);
END;
$$;


ALTER FUNCTION "public"."get_account_by_slug"("slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_id"("slug" "text") RETURNS "uuid"
    LANGUAGE "sql"
    AS $$
select id
from basejump.accounts
where slug = get_account_id.slug;
$$;


ALTER FUNCTION "public"."get_account_id"("slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer DEFAULT 25, "results_offset" integer DEFAULT 0) RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- only account owners can access this function
    if (select public.current_user_account_role(get_account_invitations.account_id) ->> 'account_role' <> 'owner') then
        raise exception 'Only account owners can access this function';
    end if;

    return (select json_agg(
                           json_build_object(
                                   'account_role', i.account_role,
                                   'created_at', i.created_at,
                                   'invitation_type', i.invitation_type,
                                   'invitation_id', i.id
                               )
                       )
            from basejump.invitations i
            where i.account_id = get_account_invitations.account_id
              and i.created_at > now() - interval '24 hours'
            limit coalesce(get_account_invitations.results_limit, 25) offset coalesce(get_account_invitations.results_offset, 0));
END;
$$;


ALTER FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer, "results_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer DEFAULT 50, "results_offset" integer DEFAULT 0) RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'basejump'
    AS $$
BEGIN

    -- only account owners can access this function
    if (select public.current_user_account_role(get_account_members.account_id) ->> 'account_role' <> 'owner') then
        raise exception 'Only account owners can access this function';
    end if;

    return (select json_agg(
                           json_build_object(
                                   'user_id', wu.user_id,
                                   'account_role', wu.account_role,
                                   'name', p.name,
                                   'email', u.email,
                                   'is_primary_owner', a.primary_owner_user_id = wu.user_id
                               )
                       )
            from basejump.account_user wu
                     join basejump.accounts a on a.id = wu.account_id
                     join basejump.accounts p on p.primary_owner_user_id = wu.user_id and p.personal_account = true
                     join auth.users u on u.id = wu.user_id
            where wu.account_id = get_account_members.account_id
            limit coalesce(get_account_members.results_limit, 50) offset coalesce(get_account_members.results_offset, 0));
END;
$$;


ALTER FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer, "results_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_accounts"() RETURNS "json"
    LANGUAGE "sql"
    AS $$
select coalesce(json_agg(
                        json_build_object(
                                'account_id', wu.account_id,
                                'account_role', wu.account_role,
                                'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                                'name', a.name,
                                'slug', a.slug,
                                'personal_account', a.personal_account,
                                'created_at', a.created_at,
                                'updated_at', a.updated_at
                            )
                    ), '[]'::json)
from basejump.account_user wu
         join basejump.accounts a on a.id = wu.account_id
where wu.user_id = auth.uid();
$$;


ALTER FUNCTION "public"."get_accounts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_personal_account"() RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    return public.get_account(auth.uid());
END;
$$;


ALTER FUNCTION "public"."get_personal_account"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_auth_user_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.user
  SET 
    email = new.email,
    updated_at = new.updated_at
  WHERE auth_user_id = new.id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_auth_user_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_auth_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.user (
    auth_user_id,
    email,
    created_at,
    updated_at,
    subscription_status
  ) VALUES (
    new.id,
    new.email,
    new.created_at,
    new.created_at,
    'pending'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_auth_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new."UPDATED_AT" = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'basejump'
    AS $$
declare
    name              text;
    invitation_active boolean;
begin
    select account_name,
           case when id IS NOT NULL then true else false end as active
    into name, invitation_active
    from basejump.invitations
    where token = lookup_invitation_token
      and created_at > now() - interval '24 hours'
    limit 1;
    return json_build_object('active', coalesce(invitation_active, false), 'account_name', name);
end;
$$;


ALTER FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."moddatetime"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.UPDATED_AT = now();
    RETURN NEW;
END; $$;


ALTER FUNCTION "public"."moddatetime"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."populate_financial_adviser_afs_representative"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    BEGIN
        INSERT INTO financial_adviser_afs_representative (ADV_NUMBER, AFS_LIC_NUM)
        SELECT DISTINCT fa.ADV_NUMBER, ar.AFS_LIC_NUM
        FROM financial_advisers fa
        JOIN afs_representatives ar ON fa.LICENCE_NUMBER = ar.AFS_LIC_NUM
        ON CONFLICT (ADV_NUMBER, AFS_LIC_NUM) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error in populate_financial_adviser_afs_representative: %', SQLERRM;
    END;
END;
$$;


ALTER FUNCTION "public"."populate_financial_adviser_afs_representative"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- only account owners can access this function
    if basejump.has_role_on_account(remove_account_member.account_id, 'owner') <> true then
        raise exception 'Only account owners can access this function';
    end if;

    delete
    from basejump.account_user wu
    where wu.account_id = remove_account_member.account_id
      and wu.user_id = remove_account_member.user_id;
END;
$$;


ALTER FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."service_role_upsert_customer_subscription"("account_id" "uuid", "customer" "jsonb" DEFAULT NULL::"jsonb", "subscription" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- if the customer is not null, upsert the data into billing_customers, only upsert fields that are present in the jsonb object
    if customer is not null then
        insert into basejump.billing_customers (id, account_id, email, provider)
        values (customer ->> 'id', service_role_upsert_customer_subscription.account_id, customer ->> 'billing_email',
                (customer ->> 'provider'))
        on conflict (id) do update
            set email = customer ->> 'billing_email';
    end if;

    -- if the subscription is not null, upsert the data into billing_subscriptions, only upsert fields that are present in the jsonb object
    if subscription is not null then
        insert into basejump.billing_subscriptions (id, account_id, billing_customer_id, status, metadata, price_id,
                                                    quantity, cancel_at_period_end, created, current_period_start,
                                                    current_period_end, ended_at, cancel_at, canceled_at, trial_start,
                                                    trial_end, plan_name, provider)
        values (subscription ->> 'id', service_role_upsert_customer_subscription.account_id,
                subscription ->> 'billing_customer_id', (subscription ->> 'status')::basejump.subscription_status,
                subscription -> 'metadata',
                subscription ->> 'price_id', (subscription ->> 'quantity')::int,
                (subscription ->> 'cancel_at_period_end')::boolean,
                (subscription ->> 'created')::timestamptz, (subscription ->> 'current_period_start')::timestamptz,
                (subscription ->> 'current_period_end')::timestamptz, (subscription ->> 'ended_at')::timestamptz,
                (subscription ->> 'cancel_at')::timestamptz,
                (subscription ->> 'canceled_at')::timestamptz, (subscription ->> 'trial_start')::timestamptz,
                (subscription ->> 'trial_end')::timestamptz,
                subscription ->> 'plan_name', (subscription ->> 'provider'))
        on conflict (id) do update
            set billing_customer_id  = subscription ->> 'billing_customer_id',
                status               = (subscription ->> 'status')::basejump.subscription_status,
                metadata             = subscription -> 'metadata',
                price_id             = subscription ->> 'price_id',
                quantity             = (subscription ->> 'quantity')::int,
                cancel_at_period_end = (subscription ->> 'cancel_at_period_end')::boolean,
                current_period_start = (subscription ->> 'current_period_start')::timestamptz,
                current_period_end   = (subscription ->> 'current_period_end')::timestamptz,
                ended_at             = (subscription ->> 'ended_at')::timestamptz,
                cancel_at            = (subscription ->> 'cancel_at')::timestamptz,
                canceled_at          = (subscription ->> 'canceled_at')::timestamptz,
                trial_start          = (subscription ->> 'trial_start')::timestamptz,
                trial_end            = (subscription ->> 'trial_end')::timestamptz,
                plan_name            = subscription ->> 'plan_name';
    end if;
end;
$$;


ALTER FUNCTION "public"."service_role_upsert_customer_subscription"("account_id" "uuid", "customer" "jsonb", "subscription" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW."UPDATED_AT" = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_set_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text" DEFAULT NULL::"text", "name" "text" DEFAULT NULL::"text", "public_metadata" "jsonb" DEFAULT NULL::"jsonb", "replace_metadata" boolean DEFAULT false) RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
BEGIN

    -- check if postgres role is service_role
    if current_user IN ('anon', 'authenticated') and
       not (select current_user_account_role(update_account.account_id) ->> 'account_role' = 'owner') then
        raise exception 'Only account owners can update an account';
    end if;

    update basejump.accounts accounts
    set slug            = coalesce(update_account.slug, accounts.slug),
        name            = coalesce(update_account.name, accounts.name),
        public_metadata = case
                              when update_account.public_metadata is null then accounts.public_metadata -- do nothing
                              when accounts.public_metadata IS NULL then update_account.public_metadata -- set metadata
                              when update_account.replace_metadata
                                  then update_account.public_metadata -- replace metadata
                              else accounts.public_metadata || update_account.public_metadata end -- merge metadata
    where accounts.id = update_account.account_id;

    return public.get_account(account_id);
END;
$$;


ALTER FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text", "name" "text", "public_metadata" "jsonb", "replace_metadata" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW."UPDATED_AT" = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."accounts_backup" (
    "id" bigint,
    "primary_owner_user_id" "text"
);


ALTER TABLE "public"."accounts_backup" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."financial_services_representatives" (
    "ID" integer NOT NULL,
    "REGISTER_NAME" "text",
    "AFS_REP_NUM" "text" NOT NULL,
    "AFS_LIC_NUM" "text",
    "AFS_REP_NAME" "text",
    "AFS_REP_ABN" "text",
    "AFS_REP_ACN" "text",
    "AFS_REP_OTHER_ROLE" "text",
    "AFS_REP_START_DT" "date",
    "AFS_REP_STATUS" "text",
    "AFS_REP_END_DT" "date",
    "AFS_REP_ADD_LOCAL" "text",
    "AFS_REP_ADD_STATE" "text",
    "AFS_REP_ADD_PCODE" "text",
    "AFS_REP_ADD_COUNTRY" "text",
    "AFS_REP_CROSS_ENDORSE" "text",
    "AFS_REP_MAY_APPOINT" "text",
    "AFS_REP_APPOINTED_BY" "text",
    "FIN" "text",
    "DEAL" "text",
    "APPLY" "text",
    "GENFIN" "text",
    "ISSUE" "text",
    "ARRANGE_APPLY" "text",
    "ARRANGE_ISSUE" "text",
    "ARRANGE_UNDERWR" "text",
    "CLASSES" "text",
    "DEAL_APPLY" "text",
    "DEAL_ISSUE" "text",
    "DEAL_UNDERWR" "text",
    "IDPS" "text",
    "MARKET" "text",
    "NONIDPS" "text",
    "SCHEME" "text",
    "TRUSTEE" "text",
    "WSALE" "text",
    "ARRANGE" "text",
    "UNDERWR" "text",
    "AFS_REP_SAME_AUTH" "text",
    "AFS_REP_RELATED_BN" "text"
);


ALTER TABLE "public"."financial_services_representatives" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."afs_representatives_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."afs_representatives_ID_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."afs_representatives_ID_seq" OWNED BY "public"."financial_services_representatives"."ID";



CREATE TABLE IF NOT EXISTS "public"."afsl_licensees" (
    "REGISTER_NAME" character varying(255) NOT NULL,
    "AFS_LIC_NUM" character varying(9) NOT NULL,
    "AFS_LIC_NAME" character varying(255) NOT NULL,
    "AFS_LIC_ABN_ACN" character varying(11),
    "AFS_LIC_START_DT" character varying(10) NOT NULL,
    "AFS_LIC_PRE_FSR" character varying(255),
    "AFS_LIC_ADD_LOCAL" character varying(255),
    "AFS_LIC_ADD_STATE" character varying(3),
    "AFS_LIC_ADD_PCODE" character varying(4),
    "AFS_LIC_ADD_COUNTRY" character varying(255),
    "AFS_LIC_LAT" character varying(20),
    "AFS_LIC_LNG" character varying(20),
    "AFS_LIC_CONDITION" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."afsl_licensees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."banned_and_disqualified_persons" (
    "ID" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "REGISTER_NAME" "text" NOT NULL,
    "BD_PER_NAME" "text" NOT NULL,
    "BD_PER_TYPE" "text" NOT NULL,
    "BD_PER_DOC_NUM" "text",
    "BD_PER_START_DT" timestamp with time zone NOT NULL,
    "BD_PER_END_DT" timestamp with time zone NOT NULL,
    "BD_PER_ADD_LOCAL" "text" DEFAULT 'ADDRESS UNKNOWN'::"text",
    "BD_PER_ADD_STATE" "text" DEFAULT 'ADDRESS UNKNOWN'::"text",
    "BD_PER_ADD_PCODE" "text" DEFAULT 'ADDRESS UNKNOWN'::"text",
    "BD_PER_ADD_COUNTRY" "text" DEFAULT 'AUSTRALIA'::"text",
    "BD_PER_COMMENTS" "text",
    "CREATED_AT" timestamp with time zone DEFAULT "now"(),
    "UPDATED_AT" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "banned_and_disqualified_persons_BD_PER_TYPE_check" CHECK (("BD_PER_TYPE" = ANY (ARRAY['AFS Banned & Disqualified'::"text", 'Banned Futures'::"text", 'Banned Securities'::"text", 'Credit Banned & Disqualified'::"text", 'Disq. Director'::"text", 'Disqualified SMSF'::"text"])))
);


ALTER TABLE "public"."banned_and_disqualified_persons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credit_licensees" (
    "REGISTER_NAME" "text" NOT NULL,
    "CRED_LIC_NUM" character varying(50) NOT NULL,
    "CRED_LIC_NAME" "text" NOT NULL,
    "CRED_LIC_START_DT" "text",
    "CRED_LIC_END_DT" "text",
    "CRED_LIC_STATUS" "text",
    "CRED_LIC_ABN_ACN" character varying(20),
    "CRED_LIC_AFSL_NUM" character varying(20),
    "CRED_LIC_STATUS_HISTORY" "text",
    "CRED_LIC_LOCALITY" "text",
    "CRED_LIC_STATE" character varying(10),
    "CRED_LIC_PCODE" character varying(10),
    "CRED_LIC_LAT" "text",
    "CRED_LIC_LNG" "text",
    "CRED_LIC_EDRS" "text",
    "CRED_LIC_BN" "text",
    "CRED_LIC_AUTHORISATIONS" "text",
    "CREATED_AT" timestamp with time zone DEFAULT "now"(),
    "UPDATED_AT" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."credit_licensees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credit_representatives" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "REGISTER_NAME" character varying(255) NOT NULL,
    "CRED_REP_NUM" numeric(9,0) NOT NULL,
    "CRED_LIC_NUM" character varying(50) NOT NULL,
    "CRED_REP_NAME" character varying(255) NOT NULL,
    "CRED_REP_ABN_ACN" numeric(11,0),
    "CRED_REP_START_DT" "date" NOT NULL,
    "CRED_REP_END_DT" "date",
    "CRED_REP_LOCALITY" character varying(255),
    "CRED_REP_STATE" character varying(3),
    "CRED_REP_PCODE" numeric(4,0),
    "CRED_REP_EDRS" character varying(10),
    "CRED_REP_AUTHORISATIONS" character varying(255),
    "CRED_REP_CROSS_ENDORSE" character varying(255),
    "CREATED_AT" timestamp with time zone DEFAULT "now"(),
    "UPDATED_AT" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "credit_representatives_CRED_REP_AUTHORISATIONS_check" CHECK ((("CRED_REP_AUTHORISATIONS")::"text" = ANY (ARRAY[('Different to Appointing Rep'::character varying)::"text", ('Different to Registrant'::character varying)::"text", ('Same as Appointing Rep'::character varying)::"text", ('Same as Registrant'::character varying)::"text"]))),
    CONSTRAINT "credit_representatives_CRED_REP_EDRS_check" CHECK ((("CRED_REP_EDRS")::"text" = ANY (ARRAY[('FOS'::character varying)::"text", ('COSL'::character varying)::"text", ('FOS:COSL'::character varying)::"text", ('CIO'::character varying)::"text", ('AFCA'::character varying)::"text"])))
);


ALTER TABLE "public"."credit_representatives" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."financial_adviser_afs_reps" (
    "id" integer NOT NULL,
    "ADV_NUMBER" "text" NOT NULL,
    "AFS_LIC_NUM" "text" NOT NULL,
    "AFS_REP_NUM" "text" NOT NULL
);


ALTER TABLE "public"."financial_adviser_afs_reps" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."financial_adviser_afs_reps_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."financial_adviser_afs_reps_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."financial_adviser_afs_reps_id_seq" OWNED BY "public"."financial_adviser_afs_reps"."id";



CREATE TABLE IF NOT EXISTS "public"."financial_advisers" (
    "REGISTER_NAME" character varying(250) NOT NULL,
    "ADV_NAME" character varying(250) NOT NULL,
    "ADV_NUMBER" character varying(100) NOT NULL,
    "ADV_ROLE" character varying(100) NOT NULL,
    "ADV_SUB_TYPE" character varying(100),
    "ADV_ROLE_STATUS" character varying(100) NOT NULL,
    "ADV_ABN" character varying(30),
    "ADV_FIRST_PROVIDED_ADVICE" character varying(4),
    "LICENCE_NAME" character varying(250) NOT NULL,
    "LICENCE_NUMBER" character varying(100) NOT NULL,
    "LICENCE_ABN" character varying(30),
    "LICENCE_CONTROLLED_BY" character varying(4000),
    "REP_APPOINTED_BY" character varying(250),
    "REP_APPOINTED_NUM" character varying(100),
    "REP_APPOINTED_ABN" character varying(30),
    "ADV_START_DT" character varying(10) NOT NULL,
    "ADV_END_DT" character varying(10),
    "ADV_DA_START_DT" character varying(10),
    "ADV_DA_END_DT" character varying(10),
    "ADV_DA_TYPE" character varying(100),
    "ADV_DA_DESCRIPTION" character varying(4000),
    "OVERALL_REGISTRATION_STATUS" character varying(100),
    "REGISTRATION_STATUS_UNDER_AFSL" character varying(100),
    "REGISTRATION_START_DATE_UNDER_AFSL" character varying(10),
    "REGISTRATION_END_DATE_UNDER_AFSL" character varying(10),
    "FIN" character varying(1),
    "FIN_CARBUNIT" character varying(1),
    "FIN_DEPPAY_DPNONBAS" character varying(1),
    "FIN_DEPPAY_DPNONCSH" character varying(1),
    "FIN_DERIV" character varying(1),
    "FIN_DERIV_DERWOOL" character varying(1),
    "FIN_DERIV_DERELEC" character varying(1),
    "FIN_DERIV_DERGRAIN" character varying(1),
    "FIN_FOREXCH" character varying(1),
    "FIN_GOVDEB" character varying(1),
    "FIN_LIFEPROD_LIFEINV" character varying(1),
    "FIN_LIFEPROD_LIFERISK" character varying(1),
    "FIN_LIFEPROD_LIFERISK_LIFECONS" character varying(1),
    "FIN_MINV_MIEXCLUDEIDPS" character varying(1),
    "FIN_MINV_MIINCLUDEIDPS" character varying(1),
    "FIN_MINV_MIIDPSONLY" character varying(1),
    "FIN_MINV_MIOWN" character varying(1),
    "FIN_MINV_MIHORSE" character varying(1),
    "FIN_MINV_MITIME" character varying(1),
    "FIN_MINV_IMIS" character varying(1),
    "FIN_RSA" character varying(1),
    "FIN_SECUR" character varying(1),
    "FIN_SUPER" character varying(1),
    "FIN_SUPER_SMSUPER" character varying(1),
    "FIN_SUPER_SUPERHOLD" character varying(1),
    "FIN_STDMARGLEND" character varying(1),
    "FIN_NONSTDMARGLEND" character varying(1),
    "FIN_AUSCARBCRDUNIT" character varying(1),
    "FIN_ELIGINTREMSUNIT" character varying(1),
    "FIN_MISFIN_MISMDA" character varying(1),
    "FIN_MISFIN_MISFINRP" character varying(1),
    "FIN_MISFIN_MISFINIP" character varying(1),
    "FIN_FHSANONADIDUMMY" character varying(1),
    "CLASSES_SECUR" character varying(1),
    "CLASSES_SMIS" character varying(1),
    "CLASSES_LIFEPROD_LIFERISK" character varying(1),
    "CLASSES_SUPER" character varying(1),
    "ADV_CPD_FAILURE_YEAR" character varying(255),
    "QUALIFICATIONS_AND_TRAINING" character varying(4000),
    "MEMBERSHIPS" character varying(4000),
    "FURTHER_RESTRICTIONS" character varying(2000),
    "ABLE_TO_PROVIDE_TFAS" character varying(1),
    "ADV_ADD_LOCAL" character varying(255),
    "ADV_ADD_STATE" character varying(255),
    "ADV_ADD_PCODE" character varying(4),
    "ADV_ADD_COUNTRY" character varying(255),
    "CREATED_AT" timestamp with time zone DEFAULT "now"(),
    "UPDATED_AT" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."financial_advisers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."function_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "function_name" "text" NOT NULL,
    "status" "text" NOT NULL,
    "records_processed" integer,
    "error_message" "text",
    "duration_ms" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."function_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."representative_relationships" (
    "ID" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "REP_ID" integer NOT NULL,
    "AFS_REP_NUM" character varying(9) NOT NULL,
    "AFS_LIC_NUM" character varying(9) NOT NULL,
    "ADVISER_NUMBER" character varying(9),
    "CREATED_AT" timestamp with time zone DEFAULT "now"(),
    "UPDATED_AT" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."representative_relationships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stripe_webhooks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "processed_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."stripe_webhooks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "email" "text",
    "password" "text",
    "subscription_status" "text",
    "subscription_end_date" timestamp with time zone,
    "stripe_customer_id" "text",
    "stripe_session_id" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "auth_user_id" "uuid"
);


ALTER TABLE "public"."user" OWNER TO "postgres";


ALTER TABLE "public"."user" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."financial_adviser_afs_reps" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."financial_adviser_afs_reps_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."financial_services_representatives" ALTER COLUMN "ID" SET DEFAULT "nextval"('"public"."afs_representatives_ID_seq"'::"regclass");



ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."financial_advisers"
    ADD CONSTRAINT "FINANCIAL_ADVISERS_pkey" PRIMARY KEY ("ADV_NUMBER");



ALTER TABLE ONLY "public"."financial_services_representatives"
    ADD CONSTRAINT "afs_representatives_AFS_LIC_NUM_AFS_REP_NUM_key" UNIQUE ("AFS_LIC_NUM", "AFS_REP_NUM");



ALTER TABLE ONLY "public"."financial_services_representatives"
    ADD CONSTRAINT "afs_representatives_pkey" PRIMARY KEY ("ID");



ALTER TABLE ONLY "public"."afsl_licensees"
    ADD CONSTRAINT "afsl_licensees_pkey" PRIMARY KEY ("AFS_LIC_NUM");



ALTER TABLE ONLY "public"."banned_and_disqualified_persons"
    ADD CONSTRAINT "banned_and_disqualified_persons_BD_PER_DOC_NUM_key" UNIQUE ("BD_PER_DOC_NUM");



ALTER TABLE ONLY "public"."banned_and_disqualified_persons"
    ADD CONSTRAINT "banned_and_disqualified_persons_pkey" PRIMARY KEY ("ID");



ALTER TABLE ONLY "public"."credit_licensees"
    ADD CONSTRAINT "credit_licensees_pkey" PRIMARY KEY ("CRED_LIC_NUM");



ALTER TABLE ONLY "public"."credit_representatives"
    ADD CONSTRAINT "credit_representatives_cred_rep_num_key" UNIQUE ("CRED_REP_NUM");



ALTER TABLE ONLY "public"."credit_representatives"
    ADD CONSTRAINT "credit_representatives_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."financial_adviser_afs_reps"
    ADD CONSTRAINT "financial_adviser_afs_reps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."function_logs"
    ADD CONSTRAINT "function_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."representative_relationships"
    ADD CONSTRAINT "representative_relationships_pkey" PRIMARY KEY ("ID");



ALTER TABLE ONLY "public"."stripe_webhooks"
    ADD CONSTRAINT "stripe_webhooks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stripe_webhooks"
    ADD CONSTRAINT "stripe_webhooks_session_id_key" UNIQUE ("session_id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_email_unique" UNIQUE ("email");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



CREATE INDEX "IDX_FINANCIAL_ADVISERS_LICENCE" ON "public"."financial_advisers" USING "btree" ("LICENCE_NUMBER");



CREATE INDEX "IDX_FINANCIAL_ADVISERS_NUMBER" ON "public"."financial_advisers" USING "btree" ("ADV_NUMBER");



CREATE INDEX "idx_afs_representatives_afs_lic_num" ON "public"."financial_services_representatives" USING "btree" ("AFS_LIC_NUM");



CREATE UNIQUE INDEX "idx_afs_representatives_afs_rep_num" ON "public"."financial_services_representatives" USING "btree" ("AFS_REP_NUM");



CREATE INDEX "idx_afsl_licensees_abn_acn" ON "public"."afsl_licensees" USING "btree" ("AFS_LIC_ABN_ACN");



CREATE INDEX "idx_afsl_licensees_name" ON "public"."afsl_licensees" USING "btree" ("AFS_LIC_NAME");



CREATE INDEX "idx_bd_per_dates" ON "public"."banned_and_disqualified_persons" USING "btree" ("BD_PER_START_DT", "BD_PER_END_DT");



CREATE INDEX "idx_bd_per_name" ON "public"."banned_and_disqualified_persons" USING "btree" ("BD_PER_NAME");



CREATE INDEX "idx_bd_per_type" ON "public"."banned_and_disqualified_persons" USING "btree" ("BD_PER_TYPE");



CREATE INDEX "idx_cred_lic_num" ON "public"."credit_representatives" USING "btree" ("CRED_LIC_NUM");



CREATE INDEX "idx_cred_rep_name" ON "public"."credit_representatives" USING "btree" ("CRED_REP_NAME");



CREATE INDEX "idx_cred_rep_num" ON "public"."credit_representatives" USING "btree" ("CRED_REP_NUM");



CREATE INDEX "idx_rep_relationships_adviser_number" ON "public"."representative_relationships" USING "btree" ("ADVISER_NUMBER");



CREATE INDEX "idx_rep_relationships_afs_lic_num" ON "public"."representative_relationships" USING "btree" ("AFS_LIC_NUM");



CREATE INDEX "idx_rep_relationships_afs_rep_num" ON "public"."representative_relationships" USING "btree" ("AFS_REP_NUM");



CREATE INDEX "idx_rep_relationships_rep_id" ON "public"."representative_relationships" USING "btree" ("REP_ID");



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."banned_and_disqualified_persons" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."credit_licensees" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."credit_representatives" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."representative_relationships" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."afsl_licensees" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."financial_adviser_afs_reps"
    ADD CONSTRAINT "financial_adviser_afs_reps_AFS_LIC_NUM_AFS_REP_NUM_fkey" FOREIGN KEY ("AFS_LIC_NUM", "AFS_REP_NUM") REFERENCES "public"."financial_services_representatives"("AFS_LIC_NUM", "AFS_REP_NUM") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."representative_relationships"
    ADD CONSTRAINT "representative_relationships_ADVISER_NUMBER_fkey" FOREIGN KEY ("ADVISER_NUMBER") REFERENCES "public"."financial_advisers"("ADV_NUMBER");



ALTER TABLE ONLY "public"."representative_relationships"
    ADD CONSTRAINT "representative_relationships_REP_ID_fkey" FOREIGN KEY ("REP_ID") REFERENCES "public"."financial_services_representatives"("ID");



CREATE POLICY "Authenticated users can view financial_adviser_afs_reps" ON "public"."financial_adviser_afs_reps" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view user" ON "public"."user" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid"))::"text" = ("id")::"text"));



CREATE POLICY "Enable all access for service role" ON "public"."stripe_webhooks" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."financial_services_representatives" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."function_logs" FOR SELECT USING (true);



ALTER TABLE "public"."credit_representatives" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."financial_adviser_afs_reps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."financial_services_representatives" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."function_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stripe_webhooks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";















































































































































































































REVOKE ALL ON FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."create_account"("slug" "text", "name" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."create_account"("slug" "text", "name" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."create_account"("slug" "text", "name" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."current_user_account_role"("account_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_account_role"("account_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."current_user_account_role"("account_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."delete_invitation"("invitation_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."delete_invitation"("invitation_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."delete_invitation"("invitation_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account"("account_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account"("account_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account"("account_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_billing_status"("account_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_billing_status"("account_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_billing_status"("account_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_by_slug"("slug" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_by_slug"("slug" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_by_slug"("slug" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_id"("slug" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_id"("slug" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_id"("slug" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer, "results_offset" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer, "results_offset" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer, "results_offset" integer) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer, "results_offset" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer, "results_offset" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer, "results_offset" integer) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_accounts"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_accounts"() TO "service_role";
GRANT ALL ON FUNCTION "public"."get_accounts"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_personal_account"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_personal_account"() TO "service_role";
GRANT ALL ON FUNCTION "public"."get_personal_account"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."handle_auth_user_update"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_auth_user_update"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_new_auth_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_updated_at"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."moddatetime"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."populate_financial_adviser_afs_representative"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."populate_financial_adviser_afs_representative"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."service_role_upsert_customer_subscription"("account_id" "uuid", "customer" "jsonb", "subscription" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."service_role_upsert_customer_subscription"("account_id" "uuid", "customer" "jsonb", "subscription" "jsonb") TO "service_role";



REVOKE ALL ON FUNCTION "public"."trigger_set_timestamp"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text", "name" "text", "public_metadata" "jsonb", "replace_metadata" boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text", "name" "text", "public_metadata" "jsonb", "replace_metadata" boolean) TO "service_role";
GRANT ALL ON FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text", "name" "text", "public_metadata" "jsonb", "replace_metadata" boolean) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."update_updated_at"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_updated_at_column"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";
























GRANT ALL ON TABLE "public"."accounts_backup" TO "anon";
GRANT ALL ON TABLE "public"."accounts_backup" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts_backup" TO "service_role";



GRANT ALL ON TABLE "public"."financial_services_representatives" TO "anon";
GRANT ALL ON TABLE "public"."financial_services_representatives" TO "authenticated";
GRANT ALL ON TABLE "public"."financial_services_representatives" TO "service_role";



GRANT ALL ON SEQUENCE "public"."afs_representatives_ID_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."afs_representatives_ID_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."afs_representatives_ID_seq" TO "service_role";



GRANT ALL ON TABLE "public"."afsl_licensees" TO "anon";
GRANT ALL ON TABLE "public"."afsl_licensees" TO "authenticated";
GRANT ALL ON TABLE "public"."afsl_licensees" TO "service_role";



GRANT ALL ON TABLE "public"."banned_and_disqualified_persons" TO "anon";
GRANT ALL ON TABLE "public"."banned_and_disqualified_persons" TO "authenticated";
GRANT ALL ON TABLE "public"."banned_and_disqualified_persons" TO "service_role";



GRANT ALL ON TABLE "public"."credit_licensees" TO "anon";
GRANT ALL ON TABLE "public"."credit_licensees" TO "authenticated";
GRANT ALL ON TABLE "public"."credit_licensees" TO "service_role";



GRANT ALL ON TABLE "public"."credit_representatives" TO "anon";
GRANT ALL ON TABLE "public"."credit_representatives" TO "authenticated";
GRANT ALL ON TABLE "public"."credit_representatives" TO "service_role";



GRANT ALL ON TABLE "public"."financial_adviser_afs_reps" TO "anon";
GRANT ALL ON TABLE "public"."financial_adviser_afs_reps" TO "authenticated";
GRANT ALL ON TABLE "public"."financial_adviser_afs_reps" TO "service_role";



GRANT ALL ON SEQUENCE "public"."financial_adviser_afs_reps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."financial_adviser_afs_reps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."financial_adviser_afs_reps_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."financial_advisers" TO "anon";
GRANT ALL ON TABLE "public"."financial_advisers" TO "authenticated";
GRANT ALL ON TABLE "public"."financial_advisers" TO "service_role";



GRANT ALL ON TABLE "public"."function_logs" TO "anon";
GRANT ALL ON TABLE "public"."function_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."function_logs" TO "service_role";



GRANT ALL ON TABLE "public"."representative_relationships" TO "anon";
GRANT ALL ON TABLE "public"."representative_relationships" TO "authenticated";
GRANT ALL ON TABLE "public"."representative_relationships" TO "service_role";



GRANT ALL ON TABLE "public"."stripe_webhooks" TO "anon";
GRANT ALL ON TABLE "public"."stripe_webhooks" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_webhooks" TO "service_role";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" REVOKE ALL ON FUNCTIONS  FROM PUBLIC;



























RESET ALL;
