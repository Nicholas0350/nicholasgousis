create schema if not exists "basejump";

create type "basejump"."account_role" as enum ('owner', 'member');

create type "basejump"."invitation_type" as enum ('one_time', '24_hour');

create type "basejump"."subscription_status" as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');

create table "basejump"."account_user" (
    "user_id" uuid not null,
    "account_id" uuid not null,
    "account_role" basejump.account_role not null
);


alter table "basejump"."account_user" enable row level security;

create table "basejump"."accounts" (
    "id" uuid not null default uuid_generate_v4(),
    "primary_owner_user_id" uuid not null default auth.uid(),
    "name" text,
    "slug" text,
    "personal_account" boolean not null default false,
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "created_by" uuid,
    "updated_by" uuid,
    "private_metadata" jsonb default '{}'::jsonb,
    "public_metadata" jsonb default '{}'::jsonb
);


alter table "basejump"."accounts" enable row level security;

create table "basejump"."billing_customers" (
    "account_id" uuid not null,
    "id" text not null,
    "email" text,
    "active" boolean,
    "provider" text
);


alter table "basejump"."billing_customers" enable row level security;

create table "basejump"."billing_subscriptions" (
    "id" text not null,
    "account_id" uuid not null,
    "billing_customer_id" text not null,
    "status" basejump.subscription_status,
    "metadata" jsonb,
    "price_id" text,
    "plan_name" text,
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_start" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_end" timestamp with time zone not null default timezone('utc'::text, now()),
    "ended_at" timestamp with time zone default timezone('utc'::text, now()),
    "cancel_at" timestamp with time zone default timezone('utc'::text, now()),
    "canceled_at" timestamp with time zone default timezone('utc'::text, now()),
    "trial_start" timestamp with time zone default timezone('utc'::text, now()),
    "trial_end" timestamp with time zone default timezone('utc'::text, now()),
    "provider" text
);


alter table "basejump"."billing_subscriptions" enable row level security;

create table "basejump"."config" (
    "enable_team_accounts" boolean default true,
    "enable_personal_account_billing" boolean default true,
    "enable_team_account_billing" boolean default true,
    "billing_provider" text default 'stripe'::text
);


alter table "basejump"."config" enable row level security;

create table "basejump"."invitations" (
    "id" uuid not null default uuid_generate_v4(),
    "account_role" basejump.account_role not null,
    "account_id" uuid not null,
    "token" text not null default basejump.generate_token(30),
    "invited_by_user_id" uuid not null,
    "account_name" text,
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "invitation_type" basejump.invitation_type not null
);


alter table "basejump"."invitations" enable row level security;

CREATE UNIQUE INDEX account_user_pkey ON basejump.account_user USING btree (user_id, account_id);

CREATE UNIQUE INDEX accounts_pkey ON basejump.accounts USING btree (id);

CREATE UNIQUE INDEX accounts_slug_key ON basejump.accounts USING btree (slug);

CREATE UNIQUE INDEX billing_customers_pkey ON basejump.billing_customers USING btree (id);

CREATE UNIQUE INDEX billing_subscriptions_pkey ON basejump.billing_subscriptions USING btree (id);

CREATE UNIQUE INDEX invitations_pkey ON basejump.invitations USING btree (id);

CREATE UNIQUE INDEX invitations_token_key ON basejump.invitations USING btree (token);

alter table "basejump"."account_user" add constraint "account_user_pkey" PRIMARY KEY using index "account_user_pkey";

alter table "basejump"."accounts" add constraint "accounts_pkey" PRIMARY KEY using index "accounts_pkey";

alter table "basejump"."billing_customers" add constraint "billing_customers_pkey" PRIMARY KEY using index "billing_customers_pkey";

alter table "basejump"."billing_subscriptions" add constraint "billing_subscriptions_pkey" PRIMARY KEY using index "billing_subscriptions_pkey";

alter table "basejump"."invitations" add constraint "invitations_pkey" PRIMARY KEY using index "invitations_pkey";

alter table "basejump"."account_user" add constraint "account_user_account_id_fkey" FOREIGN KEY (account_id) REFERENCES basejump.accounts(id) ON DELETE CASCADE not valid;

alter table "basejump"."account_user" validate constraint "account_user_account_id_fkey";

alter table "basejump"."account_user" add constraint "account_user_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "basejump"."account_user" validate constraint "account_user_user_id_fkey";

alter table "basejump"."accounts" add constraint "accounts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "basejump"."accounts" validate constraint "accounts_created_by_fkey";

alter table "basejump"."accounts" add constraint "accounts_primary_owner_user_id_fkey" FOREIGN KEY (primary_owner_user_id) REFERENCES auth.users(id) not valid;

alter table "basejump"."accounts" validate constraint "accounts_primary_owner_user_id_fkey";

alter table "basejump"."accounts" add constraint "accounts_slug_key" UNIQUE using index "accounts_slug_key";

alter table "basejump"."accounts" add constraint "accounts_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "basejump"."accounts" validate constraint "accounts_updated_by_fkey";

alter table "basejump"."accounts" add constraint "basejump_accounts_slug_null_if_personal_account_true" CHECK ((((personal_account = true) AND (slug IS NULL)) OR ((personal_account = false) AND (slug IS NOT NULL)))) not valid;

alter table "basejump"."accounts" validate constraint "basejump_accounts_slug_null_if_personal_account_true";

alter table "basejump"."billing_customers" add constraint "billing_customers_account_id_fkey" FOREIGN KEY (account_id) REFERENCES basejump.accounts(id) ON DELETE CASCADE not valid;

alter table "basejump"."billing_customers" validate constraint "billing_customers_account_id_fkey";

alter table "basejump"."billing_subscriptions" add constraint "billing_subscriptions_account_id_fkey" FOREIGN KEY (account_id) REFERENCES basejump.accounts(id) ON DELETE CASCADE not valid;

alter table "basejump"."billing_subscriptions" validate constraint "billing_subscriptions_account_id_fkey";

alter table "basejump"."billing_subscriptions" add constraint "billing_subscriptions_billing_customer_id_fkey" FOREIGN KEY (billing_customer_id) REFERENCES basejump.billing_customers(id) ON DELETE CASCADE not valid;

alter table "basejump"."billing_subscriptions" validate constraint "billing_subscriptions_billing_customer_id_fkey";

alter table "basejump"."invitations" add constraint "invitations_account_id_fkey" FOREIGN KEY (account_id) REFERENCES basejump.accounts(id) ON DELETE CASCADE not valid;

alter table "basejump"."invitations" validate constraint "invitations_account_id_fkey";

alter table "basejump"."invitations" add constraint "invitations_invited_by_user_id_fkey" FOREIGN KEY (invited_by_user_id) REFERENCES auth.users(id) not valid;

alter table "basejump"."invitations" validate constraint "invitations_invited_by_user_id_fkey";

alter table "basejump"."invitations" add constraint "invitations_token_key" UNIQUE using index "invitations_token_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION basejump.add_current_user_to_new_account()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
    if new.primary_owner_user_id = auth.uid() then
        insert into basejump.account_user (account_id, user_id, account_role)
        values (NEW.id, auth.uid(), 'owner');
    end if;
    return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION basejump.generate_token(length integer)
 RETURNS text
 LANGUAGE sql
AS $function$
select regexp_replace(replace(
                              replace(replace(replace(encode(gen_random_bytes(length)::bytea, 'base64'), '/', ''), '+',
                                              ''), '\', ''),
                              '=',
                              ''), E'[\\n\\r]+', '', 'g');
$function$
;

CREATE OR REPLACE FUNCTION basejump.get_accounts_with_role(passed_in_role basejump.account_role DEFAULT NULL::basejump.account_role)
 RETURNS SETOF uuid
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
select account_id
from basejump.account_user wu
where wu.user_id = auth.uid()
  and (
            wu.account_role = passed_in_role
        or passed_in_role is null
    );
$function$
;

CREATE OR REPLACE FUNCTION basejump.get_config()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    result RECORD;
BEGIN
    SELECT * from basejump.config limit 1 into result;
    return row_to_json(result);
END;
$function$
;

CREATE OR REPLACE FUNCTION basejump.has_role_on_account(account_id uuid, account_role basejump.account_role DEFAULT NULL::basejump.account_role)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
select exists(
               select 1
               from basejump.account_user wu
               where wu.user_id = auth.uid()
                 and wu.account_id = has_role_on_account.account_id
                 and (
                           wu.account_role = has_role_on_account.account_role
                       or has_role_on_account.account_role is null
                   )
           );
$function$
;

CREATE OR REPLACE FUNCTION basejump.is_set(field_name text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    result BOOLEAN;
BEGIN
    execute format('select %I from basejump.config limit 1', field_name) into result;
    return result;
END;
$function$
;

CREATE OR REPLACE FUNCTION basejump.protect_account_fields()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF current_user IN ('authenticated', 'anon') THEN
        -- these are protected fields that users are not allowed to update themselves
        -- platform admins should be VERY careful about updating them as well.
        if NEW.id <> OLD.id
            OR NEW.personal_account <> OLD.personal_account
            OR NEW.primary_owner_user_id <> OLD.primary_owner_user_id
        THEN
            RAISE EXCEPTION 'You do not have permission to update this field';
        end if;
    end if;

    RETURN NEW;
END
$function$
;

CREATE OR REPLACE FUNCTION basejump.run_new_user_setup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
    first_account_id    uuid;
    generated_user_name text;
begin

    -- first we setup the user profile
    -- TODO: see if we can get the user's name from the auth.users table once we learn how oauth works
    if new.email IS NOT NULL then
        generated_user_name := split_part(new.email, '@', 1);
    end if;
    -- create the new users's personal account
    insert into basejump.accounts (name, primary_owner_user_id, personal_account, id)
    values (generated_user_name, NEW.id, true, NEW.id)
    returning id into first_account_id;

    -- add them to the account_user table so they can act on it
    insert into basejump.account_user (account_id, user_id, account_role)
    values (first_account_id, NEW.id, 'owner');

    return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION basejump.slugify_account_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    if NEW.slug is not null then
        NEW.slug = lower(regexp_replace(NEW.slug, '[^a-zA-Z0-9-]+', '-', 'g'));
    end if;

    RETURN NEW;
END
$function$
;

CREATE OR REPLACE FUNCTION basejump.trigger_set_invitation_details()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.invited_by_user_id = auth.uid();
    NEW.account_name = (select name from basejump.accounts where id = NEW.account_id);
    RETURN NEW;
END
$function$
;

CREATE OR REPLACE FUNCTION basejump.trigger_set_timestamps()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    if TG_OP = 'INSERT' then
        NEW.created_at = now();
        NEW.updated_at = now();
    else
        NEW.updated_at = now();
        NEW.created_at = OLD.created_at;
    end if;
    RETURN NEW;
END
$function$
;

CREATE OR REPLACE FUNCTION basejump.trigger_set_user_tracking()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    if TG_OP = 'INSERT' then
        NEW.created_by = auth.uid();
        NEW.updated_by = auth.uid();
    else
        NEW.updated_by = auth.uid();
        NEW.created_by = OLD.created_by;
    end if;
    RETURN NEW;
END
$function$
;

grant delete on table "basejump"."account_user" to "authenticated";

grant insert on table "basejump"."account_user" to "authenticated";

grant select on table "basejump"."account_user" to "authenticated";

grant update on table "basejump"."account_user" to "authenticated";

grant delete on table "basejump"."account_user" to "service_role";

grant insert on table "basejump"."account_user" to "service_role";

grant select on table "basejump"."account_user" to "service_role";

grant update on table "basejump"."account_user" to "service_role";

grant delete on table "basejump"."accounts" to "authenticated";

grant insert on table "basejump"."accounts" to "authenticated";

grant select on table "basejump"."accounts" to "authenticated";

grant update on table "basejump"."accounts" to "authenticated";

grant delete on table "basejump"."accounts" to "service_role";

grant insert on table "basejump"."accounts" to "service_role";

grant select on table "basejump"."accounts" to "service_role";

grant update on table "basejump"."accounts" to "service_role";

grant select on table "basejump"."billing_customers" to "authenticated";

grant delete on table "basejump"."billing_customers" to "service_role";

grant insert on table "basejump"."billing_customers" to "service_role";

grant select on table "basejump"."billing_customers" to "service_role";

grant update on table "basejump"."billing_customers" to "service_role";

grant select on table "basejump"."billing_subscriptions" to "authenticated";

grant delete on table "basejump"."billing_subscriptions" to "service_role";

grant insert on table "basejump"."billing_subscriptions" to "service_role";

grant select on table "basejump"."billing_subscriptions" to "service_role";

grant update on table "basejump"."billing_subscriptions" to "service_role";

grant select on table "basejump"."config" to "authenticated";

grant select on table "basejump"."config" to "service_role";

grant delete on table "basejump"."invitations" to "authenticated";

grant insert on table "basejump"."invitations" to "authenticated";

grant select on table "basejump"."invitations" to "authenticated";

grant update on table "basejump"."invitations" to "authenticated";

grant delete on table "basejump"."invitations" to "service_role";

grant insert on table "basejump"."invitations" to "service_role";

grant select on table "basejump"."invitations" to "service_role";

grant update on table "basejump"."invitations" to "service_role";

create policy "Account users can be deleted by owners except primary account o"
on "basejump"."account_user"
as permissive
for delete
to authenticated
using (((basejump.has_role_on_account(account_id, 'owner'::basejump.account_role) = true) AND (user_id <> ( SELECT accounts.primary_owner_user_id
   FROM basejump.accounts
  WHERE (account_user.account_id = accounts.id)))));


create policy "users can view their own account_users"
on "basejump"."account_user"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "users can view their teammates"
on "basejump"."account_user"
as permissive
for select
to authenticated
using ((basejump.has_role_on_account(account_id) = true));


create policy "Accounts are viewable by members"
on "basejump"."accounts"
as permissive
for select
to authenticated
using ((basejump.has_role_on_account(id) = true));


create policy "Accounts are viewable by primary owner"
on "basejump"."accounts"
as permissive
for select
to authenticated
using ((primary_owner_user_id = auth.uid()));


create policy "Accounts can be edited by owners"
on "basejump"."accounts"
as permissive
for update
to authenticated
using ((basejump.has_role_on_account(id, 'owner'::basejump.account_role) = true));


create policy "Team accounts can be created by any user"
on "basejump"."accounts"
as permissive
for insert
to authenticated
with check (((basejump.is_set('enable_team_accounts'::text) = true) AND (personal_account = false)));


create policy "Can only view own billing customer data."
on "basejump"."billing_customers"
as permissive
for select
to public
using ((basejump.has_role_on_account(account_id) = true));


create policy "Can only view own billing subscription data."
on "basejump"."billing_subscriptions"
as permissive
for select
to public
using ((basejump.has_role_on_account(account_id) = true));


create policy "Basejump settings can be read by authenticated users"
on "basejump"."config"
as permissive
for select
to authenticated
using (true);


create policy "Invitations can be created by account owners"
on "basejump"."invitations"
as permissive
for insert
to authenticated
with check (((basejump.is_set('enable_team_accounts'::text) = true) AND (( SELECT accounts.personal_account
   FROM basejump.accounts
  WHERE (accounts.id = invitations.account_id)) = false) AND (basejump.has_role_on_account(account_id, 'owner'::basejump.account_role) = true)));


create policy "Invitations can be deleted by account owners"
on "basejump"."invitations"
as permissive
for delete
to authenticated
using ((basejump.has_role_on_account(account_id, 'owner'::basejump.account_role) = true));


create policy "Invitations viewable by account owners"
on "basejump"."invitations"
as permissive
for select
to authenticated
using (((created_at > (now() - '24:00:00'::interval)) AND (basejump.has_role_on_account(account_id, 'owner'::basejump.account_role) = true)));


CREATE TRIGGER basejump_add_current_user_to_new_account AFTER INSERT ON basejump.accounts FOR EACH ROW EXECUTE FUNCTION basejump.add_current_user_to_new_account();

CREATE TRIGGER basejump_protect_account_fields BEFORE UPDATE ON basejump.accounts FOR EACH ROW EXECUTE FUNCTION basejump.protect_account_fields();

CREATE TRIGGER basejump_set_accounts_timestamp BEFORE INSERT OR UPDATE ON basejump.accounts FOR EACH ROW EXECUTE FUNCTION basejump.trigger_set_timestamps();

CREATE TRIGGER basejump_set_accounts_user_tracking BEFORE INSERT OR UPDATE ON basejump.accounts FOR EACH ROW EXECUTE FUNCTION basejump.trigger_set_user_tracking();

CREATE TRIGGER basejump_slugify_account_slug BEFORE INSERT OR UPDATE ON basejump.accounts FOR EACH ROW EXECUTE FUNCTION basejump.slugify_account_slug();

CREATE TRIGGER basejump_set_invitations_timestamp BEFORE INSERT OR UPDATE ON basejump.invitations FOR EACH ROW EXECUTE FUNCTION basejump.trigger_set_timestamps();

CREATE TRIGGER basejump_trigger_set_invitation_details BEFORE INSERT ON basejump.invitations FOR EACH ROW EXECUTE FUNCTION basejump.trigger_set_invitation_details();


create schema if not exists "drizzle";

create sequence "drizzle"."__drizzle_migrations_id_seq";

create table "drizzle"."__drizzle_migrations" (
    "id" integer not null default nextval('drizzle.__drizzle_migrations_id_seq'::regclass),
    "hash" text not null,
    "created_at" bigint
);


alter sequence "drizzle"."__drizzle_migrations_id_seq" owned by "drizzle"."__drizzle_migrations"."id";

CREATE UNIQUE INDEX __drizzle_migrations_pkey ON drizzle.__drizzle_migrations USING btree (id);

alter table "drizzle"."__drizzle_migrations" add constraint "__drizzle_migrations_pkey" PRIMARY KEY using index "__drizzle_migrations_pkey";


create sequence "public"."afs_representatives_ID_seq";

create sequence "public"."financial_adviser_afs_reps_id_seq";

create table "public"."financial_adviser_afs_reps" (
    "id" integer not null default nextval('financial_adviser_afs_reps_id_seq'::regclass),
    "ADV_NUMBER" text not null,
    "AFS_LIC_NUM" text not null,
    "AFS_REP_NUM" text not null
);


alter table "public"."financial_adviser_afs_reps" enable row level security;

alter table "public"."accounts" alter column "id" add generated always as identity;

alter table "public"."accounts" enable row level security;

alter table "public"."afsl_licensees" add column "AFS_LIC_ABN_ACN" character varying(11);

alter table "public"."afsl_licensees" add column "AFS_LIC_ADD_COUNTRY" character varying(255);

alter table "public"."afsl_licensees" add column "AFS_LIC_ADD_LOCAL" character varying(255);

alter table "public"."afsl_licensees" add column "AFS_LIC_ADD_PCODE" character varying(4);

alter table "public"."afsl_licensees" add column "AFS_LIC_ADD_STATE" character varying(3);

alter table "public"."afsl_licensees" add column "AFS_LIC_CONDITION" character varying(255);

alter table "public"."afsl_licensees" add column "AFS_LIC_LAT" character varying(20);

alter table "public"."afsl_licensees" add column "AFS_LIC_LNG" character varying(20);

alter table "public"."afsl_licensees" add column "AFS_LIC_PRE_FSR" character varying(255);

alter table "public"."afsl_licensees" add column "AFS_LIC_START_DT" character varying(10) not null;

alter table "public"."afsl_licensees" add column "REGISTER_NAME" character varying(255) not null;

alter table "public"."afsl_licensees" add column "created_at" timestamp with time zone default now();

alter table "public"."afsl_licensees" add column "updated_at" timestamp with time zone default now();

alter table "public"."banned_and_disqualified_persons" add column "BD_PER_ADD_COUNTRY" text default 'AUSTRALIA'::text;

alter table "public"."banned_and_disqualified_persons" add column "BD_PER_ADD_LOCAL" text default 'ADDRESS UNKNOWN'::text;

alter table "public"."banned_and_disqualified_persons" add column "BD_PER_ADD_PCODE" text default 'ADDRESS UNKNOWN'::text;

alter table "public"."banned_and_disqualified_persons" add column "BD_PER_ADD_STATE" text default 'ADDRESS UNKNOWN'::text;

alter table "public"."banned_and_disqualified_persons" add column "BD_PER_COMMENTS" text;

alter table "public"."banned_and_disqualified_persons" add column "BD_PER_DOC_NUM" text;

alter table "public"."banned_and_disqualified_persons" add column "BD_PER_END_DT" timestamp with time zone not null;

alter table "public"."banned_and_disqualified_persons" add column "BD_PER_START_DT" timestamp with time zone not null;

alter table "public"."banned_and_disqualified_persons" add column "CREATED_AT" timestamp with time zone default now();

alter table "public"."banned_and_disqualified_persons" add column "REGISTER_NAME" text not null;

alter table "public"."banned_and_disqualified_persons" add column "UPDATED_AT" timestamp with time zone default now();

alter table "public"."credit_licensees" add column "CREATED_AT" timestamp with time zone default now();

alter table "public"."credit_licensees" add column "CRED_LIC_ABN_ACN" character varying(20);

alter table "public"."credit_licensees" add column "CRED_LIC_AFSL_NUM" character varying(20);

alter table "public"."credit_licensees" add column "CRED_LIC_AUTHORISATIONS" text;

alter table "public"."credit_licensees" add column "CRED_LIC_BN" text;

alter table "public"."credit_licensees" add column "CRED_LIC_EDRS" text;

alter table "public"."credit_licensees" add column "CRED_LIC_END_DT" text;

alter table "public"."credit_licensees" add column "CRED_LIC_LAT" text;

alter table "public"."credit_licensees" add column "CRED_LIC_LNG" text;

alter table "public"."credit_licensees" add column "CRED_LIC_LOCALITY" text;

alter table "public"."credit_licensees" add column "CRED_LIC_PCODE" character varying(10);

alter table "public"."credit_licensees" add column "CRED_LIC_START_DT" text;

alter table "public"."credit_licensees" add column "CRED_LIC_STATE" character varying(10);

alter table "public"."credit_licensees" add column "CRED_LIC_STATUS" text;

alter table "public"."credit_licensees" add column "CRED_LIC_STATUS_HISTORY" text;

alter table "public"."credit_licensees" add column "REGISTER_NAME" text not null;

alter table "public"."credit_licensees" add column "UPDATED_AT" timestamp with time zone default now();

alter table "public"."credit_representatives" add column "CREATED_AT" timestamp with time zone default now();

alter table "public"."credit_representatives" add column "CRED_REP_ABN_ACN" numeric(11,0);

alter table "public"."credit_representatives" add column "CRED_REP_AUTHORISATIONS" character varying(255);

alter table "public"."credit_representatives" add column "CRED_REP_CROSS_ENDORSE" character varying(255);

alter table "public"."credit_representatives" add column "CRED_REP_EDRS" character varying(10);

alter table "public"."credit_representatives" add column "CRED_REP_END_DT" date;

alter table "public"."credit_representatives" add column "CRED_REP_LOCALITY" character varying(255);

alter table "public"."credit_representatives" add column "CRED_REP_NAME" character varying(255) not null;

alter table "public"."credit_representatives" add column "CRED_REP_PCODE" numeric(4,0);

alter table "public"."credit_representatives" add column "CRED_REP_START_DT" date not null;

alter table "public"."credit_representatives" add column "CRED_REP_STATE" character varying(3);

alter table "public"."credit_representatives" add column "REGISTER_NAME" character varying(255) not null;

alter table "public"."credit_representatives" add column "UPDATED_AT" timestamp with time zone default now();

alter table "public"."credit_representatives" enable row level security;

alter table "public"."financial_advisers" add column "ABLE_TO_PROVIDE_TFAS" character varying(1);

alter table "public"."financial_advisers" add column "ADV_ABN" character varying(30);

alter table "public"."financial_advisers" add column "ADV_ADD_COUNTRY" character varying(255);

alter table "public"."financial_advisers" add column "ADV_ADD_LOCAL" character varying(255);

alter table "public"."financial_advisers" add column "ADV_ADD_PCODE" character varying(4);

alter table "public"."financial_advisers" add column "ADV_ADD_STATE" character varying(255);

alter table "public"."financial_advisers" add column "ADV_CPD_FAILURE_YEAR" character varying(255);

alter table "public"."financial_advisers" add column "ADV_DA_DESCRIPTION" character varying(4000);

alter table "public"."financial_advisers" add column "ADV_DA_END_DT" character varying(10);

alter table "public"."financial_advisers" add column "ADV_DA_START_DT" character varying(10);

alter table "public"."financial_advisers" add column "ADV_DA_TYPE" character varying(100);

alter table "public"."financial_advisers" add column "ADV_END_DT" character varying(10);

alter table "public"."financial_advisers" add column "ADV_FIRST_PROVIDED_ADVICE" character varying(4);

alter table "public"."financial_advisers" add column "ADV_ROLE" character varying(100) not null;

alter table "public"."financial_advisers" add column "ADV_ROLE_STATUS" character varying(100) not null;

alter table "public"."financial_advisers" add column "ADV_START_DT" character varying(10) not null;

alter table "public"."financial_advisers" add column "ADV_SUB_TYPE" character varying(100);

alter table "public"."financial_advisers" add column "CLASSES_LIFEPROD_LIFERISK" character varying(1);

alter table "public"."financial_advisers" add column "CLASSES_SECUR" character varying(1);

alter table "public"."financial_advisers" add column "CLASSES_SMIS" character varying(1);

alter table "public"."financial_advisers" add column "CLASSES_SUPER" character varying(1);

alter table "public"."financial_advisers" add column "CREATED_AT" timestamp with time zone default now();

alter table "public"."financial_advisers" add column "FIN" character varying(1);

alter table "public"."financial_advisers" add column "FIN_AUSCARBCRDUNIT" character varying(1);

alter table "public"."financial_advisers" add column "FIN_CARBUNIT" character varying(1);

alter table "public"."financial_advisers" add column "FIN_DEPPAY_DPNONBAS" character varying(1);

alter table "public"."financial_advisers" add column "FIN_DEPPAY_DPNONCSH" character varying(1);

alter table "public"."financial_advisers" add column "FIN_DERIV" character varying(1);

alter table "public"."financial_advisers" add column "FIN_DERIV_DERELEC" character varying(1);

alter table "public"."financial_advisers" add column "FIN_DERIV_DERGRAIN" character varying(1);

alter table "public"."financial_advisers" add column "FIN_DERIV_DERWOOL" character varying(1);

alter table "public"."financial_advisers" add column "FIN_ELIGINTREMSUNIT" character varying(1);

alter table "public"."financial_advisers" add column "FIN_FHSANONADIDUMMY" character varying(1);

alter table "public"."financial_advisers" add column "FIN_FOREXCH" character varying(1);

alter table "public"."financial_advisers" add column "FIN_GOVDEB" character varying(1);

alter table "public"."financial_advisers" add column "FIN_LIFEPROD_LIFEINV" character varying(1);

alter table "public"."financial_advisers" add column "FIN_LIFEPROD_LIFERISK" character varying(1);

alter table "public"."financial_advisers" add column "FIN_LIFEPROD_LIFERISK_LIFECONS" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MINV_IMIS" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MINV_MIEXCLUDEIDPS" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MINV_MIHORSE" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MINV_MIIDPSONLY" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MINV_MIINCLUDEIDPS" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MINV_MIOWN" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MINV_MITIME" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MISFIN_MISFINIP" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MISFIN_MISFINRP" character varying(1);

alter table "public"."financial_advisers" add column "FIN_MISFIN_MISMDA" character varying(1);

alter table "public"."financial_advisers" add column "FIN_NONSTDMARGLEND" character varying(1);

alter table "public"."financial_advisers" add column "FIN_RSA" character varying(1);

alter table "public"."financial_advisers" add column "FIN_SECUR" character varying(1);

alter table "public"."financial_advisers" add column "FIN_STDMARGLEND" character varying(1);

alter table "public"."financial_advisers" add column "FIN_SUPER" character varying(1);

alter table "public"."financial_advisers" add column "FIN_SUPER_SMSUPER" character varying(1);

alter table "public"."financial_advisers" add column "FIN_SUPER_SUPERHOLD" character varying(1);

alter table "public"."financial_advisers" add column "FURTHER_RESTRICTIONS" character varying(2000);

alter table "public"."financial_advisers" add column "LICENCE_ABN" character varying(30);

alter table "public"."financial_advisers" add column "LICENCE_CONTROLLED_BY" character varying(4000);

alter table "public"."financial_advisers" add column "LICENCE_NAME" character varying(250) not null;

alter table "public"."financial_advisers" add column "LICENCE_NUMBER" character varying(100) not null;

alter table "public"."financial_advisers" add column "MEMBERSHIPS" character varying(4000);

alter table "public"."financial_advisers" add column "OVERALL_REGISTRATION_STATUS" character varying(100);

alter table "public"."financial_advisers" add column "QUALIFICATIONS_AND_TRAINING" character varying(4000);

alter table "public"."financial_advisers" add column "REGISTER_NAME" character varying(250) not null;

alter table "public"."financial_advisers" add column "REGISTRATION_END_DATE_UNDER_AFSL" character varying(10);

alter table "public"."financial_advisers" add column "REGISTRATION_START_DATE_UNDER_AFSL" character varying(10);

alter table "public"."financial_advisers" add column "REGISTRATION_STATUS_UNDER_AFSL" character varying(100);

alter table "public"."financial_advisers" add column "REP_APPOINTED_ABN" character varying(30);

alter table "public"."financial_advisers" add column "REP_APPOINTED_BY" character varying(250);

alter table "public"."financial_advisers" add column "REP_APPOINTED_NUM" character varying(100);

alter table "public"."financial_advisers" add column "UPDATED_AT" timestamp with time zone default now();

alter table "public"."financial_services_representatives" add column "AFS_REP_ABN" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_ACN" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_ADD_COUNTRY" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_ADD_LOCAL" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_ADD_PCODE" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_ADD_STATE" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_APPOINTED_BY" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_CROSS_ENDORSE" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_END_DT" date;

alter table "public"."financial_services_representatives" add column "AFS_REP_MAY_APPOINT" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_OTHER_ROLE" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_RELATED_BN" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_SAME_AUTH" text;

alter table "public"."financial_services_representatives" add column "AFS_REP_START_DT" date;

alter table "public"."financial_services_representatives" add column "AFS_REP_STATUS" text;

alter table "public"."financial_services_representatives" add column "APPLY" text;

alter table "public"."financial_services_representatives" add column "ARRANGE" text;

alter table "public"."financial_services_representatives" add column "ARRANGE_APPLY" text;

alter table "public"."financial_services_representatives" add column "ARRANGE_ISSUE" text;

alter table "public"."financial_services_representatives" add column "ARRANGE_UNDERWR" text;

alter table "public"."financial_services_representatives" add column "CLASSES" text;

alter table "public"."financial_services_representatives" add column "DEAL" text;

alter table "public"."financial_services_representatives" add column "DEAL_APPLY" text;

alter table "public"."financial_services_representatives" add column "DEAL_ISSUE" text;

alter table "public"."financial_services_representatives" add column "DEAL_UNDERWR" text;

alter table "public"."financial_services_representatives" add column "FIN" text;

alter table "public"."financial_services_representatives" add column "GENFIN" text;

alter table "public"."financial_services_representatives" add column "IDPS" text;

alter table "public"."financial_services_representatives" add column "ISSUE" text;

alter table "public"."financial_services_representatives" add column "MARKET" text;

alter table "public"."financial_services_representatives" add column "NONIDPS" text;

alter table "public"."financial_services_representatives" add column "SCHEME" text;

alter table "public"."financial_services_representatives" add column "TRUSTEE" text;

alter table "public"."financial_services_representatives" add column "UNDERWR" text;

alter table "public"."financial_services_representatives" add column "WSALE" text;

alter table "public"."financial_services_representatives" alter column "ID" set default nextval('"afs_representatives_ID_seq"'::regclass);

alter table "public"."financial_services_representatives" enable row level security;

alter table "public"."representative_relationships" add column "ADVISER_NUMBER" character varying(9);

alter table "public"."representative_relationships" add column "CREATED_AT" timestamp with time zone default now();

alter table "public"."representative_relationships" add column "UPDATED_AT" timestamp with time zone default now();

alter table "public"."user" add column "password" text;

alter table "public"."user" add column "stripe_customer_id" text;

alter table "public"."user" add column "stripe_session_id" text;

alter table "public"."user" add column "subscription_end_date" timestamp with time zone;

alter table "public"."user" add column "subscription_status" text;

alter table "public"."user" alter column "id" add generated by default as identity;

alter table "public"."user" enable row level security;

alter sequence "public"."afs_representatives_ID_seq" owned by "public"."financial_services_representatives"."ID";

alter sequence "public"."financial_adviser_afs_reps_id_seq" owned by "public"."financial_adviser_afs_reps"."id";

CREATE INDEX "IDX_FINANCIAL_ADVISERS_LICENCE" ON public.financial_advisers USING btree ("LICENCE_NUMBER");

CREATE INDEX "IDX_FINANCIAL_ADVISERS_NUMBER" ON public.financial_advisers USING btree ("ADV_NUMBER");

CREATE UNIQUE INDEX "afs_representatives_AFS_LIC_NUM_AFS_REP_NUM_key" ON public.financial_services_representatives USING btree ("AFS_LIC_NUM", "AFS_REP_NUM");

CREATE UNIQUE INDEX "banned_and_disqualified_persons_BD_PER_DOC_NUM_key" ON public.banned_and_disqualified_persons USING btree ("BD_PER_DOC_NUM");

CREATE UNIQUE INDEX credit_representatives_cred_rep_num_key ON public.credit_representatives USING btree ("CRED_REP_NUM");

CREATE UNIQUE INDEX financial_adviser_afs_reps_pkey ON public.financial_adviser_afs_reps USING btree (id);

CREATE INDEX idx_afs_representatives_afs_lic_num ON public.financial_services_representatives USING btree ("AFS_LIC_NUM");

CREATE UNIQUE INDEX idx_afs_representatives_afs_rep_num ON public.financial_services_representatives USING btree ("AFS_REP_NUM");

CREATE INDEX idx_afsl_licensees_abn_acn ON public.afsl_licensees USING btree ("AFS_LIC_ABN_ACN");

CREATE INDEX idx_afsl_licensees_name ON public.afsl_licensees USING btree ("AFS_LIC_NAME");

CREATE INDEX idx_bd_per_dates ON public.banned_and_disqualified_persons USING btree ("BD_PER_START_DT", "BD_PER_END_DT");

CREATE INDEX idx_bd_per_name ON public.banned_and_disqualified_persons USING btree ("BD_PER_NAME");

CREATE INDEX idx_bd_per_type ON public.banned_and_disqualified_persons USING btree ("BD_PER_TYPE");

CREATE INDEX idx_cred_lic_num ON public.credit_representatives USING btree ("CRED_LIC_NUM");

CREATE INDEX idx_cred_rep_name ON public.credit_representatives USING btree ("CRED_REP_NAME");

CREATE INDEX idx_cred_rep_num ON public.credit_representatives USING btree ("CRED_REP_NUM");

CREATE INDEX idx_rep_relationships_adviser_number ON public.representative_relationships USING btree ("ADVISER_NUMBER");

CREATE INDEX idx_rep_relationships_afs_lic_num ON public.representative_relationships USING btree ("AFS_LIC_NUM");

CREATE INDEX idx_rep_relationships_afs_rep_num ON public.representative_relationships USING btree ("AFS_REP_NUM");

CREATE INDEX idx_rep_relationships_rep_id ON public.representative_relationships USING btree ("REP_ID");

CREATE UNIQUE INDEX user_email_unique ON public."user" USING btree (email);

alter table "public"."financial_adviser_afs_reps" add constraint "financial_adviser_afs_reps_pkey" PRIMARY KEY using index "financial_adviser_afs_reps_pkey";

alter table "public"."banned_and_disqualified_persons" add constraint "banned_and_disqualified_persons_BD_PER_DOC_NUM_key" UNIQUE using index "banned_and_disqualified_persons_BD_PER_DOC_NUM_key";

alter table "public"."banned_and_disqualified_persons" add constraint "banned_and_disqualified_persons_BD_PER_TYPE_check" CHECK (("BD_PER_TYPE" = ANY (ARRAY['AFS Banned & Disqualified'::text, 'Banned Futures'::text, 'Banned Securities'::text, 'Credit Banned & Disqualified'::text, 'Disq. Director'::text, 'Disqualified SMSF'::text]))) not valid;

alter table "public"."banned_and_disqualified_persons" validate constraint "banned_and_disqualified_persons_BD_PER_TYPE_check";

alter table "public"."credit_representatives" add constraint "credit_representatives_CRED_REP_AUTHORISATIONS_check" CHECK ((("CRED_REP_AUTHORISATIONS")::text = ANY (ARRAY[('Different to Appointing Rep'::character varying)::text, ('Different to Registrant'::character varying)::text, ('Same as Appointing Rep'::character varying)::text, ('Same as Registrant'::character varying)::text]))) not valid;

alter table "public"."credit_representatives" validate constraint "credit_representatives_CRED_REP_AUTHORISATIONS_check";

alter table "public"."credit_representatives" add constraint "credit_representatives_CRED_REP_EDRS_check" CHECK ((("CRED_REP_EDRS")::text = ANY (ARRAY[('FOS'::character varying)::text, ('COSL'::character varying)::text, ('FOS:COSL'::character varying)::text, ('CIO'::character varying)::text, ('AFCA'::character varying)::text]))) not valid;

alter table "public"."credit_representatives" validate constraint "credit_representatives_CRED_REP_EDRS_check";

alter table "public"."credit_representatives" add constraint "credit_representatives_cred_rep_num_key" UNIQUE using index "credit_representatives_cred_rep_num_key";

alter table "public"."financial_adviser_afs_reps" add constraint "financial_adviser_afs_reps_AFS_LIC_NUM_AFS_REP_NUM_fkey" FOREIGN KEY ("AFS_LIC_NUM", "AFS_REP_NUM") REFERENCES financial_services_representatives("AFS_LIC_NUM", "AFS_REP_NUM") ON DELETE CASCADE not valid;

alter table "public"."financial_adviser_afs_reps" validate constraint "financial_adviser_afs_reps_AFS_LIC_NUM_AFS_REP_NUM_fkey";

alter table "public"."financial_services_representatives" add constraint "afs_representatives_AFS_LIC_NUM_AFS_REP_NUM_key" UNIQUE using index "afs_representatives_AFS_LIC_NUM_AFS_REP_NUM_key";

alter table "public"."representative_relationships" add constraint "representative_relationships_ADVISER_NUMBER_fkey" FOREIGN KEY ("ADVISER_NUMBER") REFERENCES financial_advisers("ADV_NUMBER") not valid;

alter table "public"."representative_relationships" validate constraint "representative_relationships_ADVISER_NUMBER_fkey";

alter table "public"."representative_relationships" add constraint "representative_relationships_REP_ID_fkey" FOREIGN KEY ("REP_ID") REFERENCES financial_services_representatives("ID") not valid;

alter table "public"."representative_relationships" validate constraint "representative_relationships_REP_ID_fkey";

alter table "public"."user" add constraint "user_email_unique" UNIQUE using index "user_email_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.accept_invitation(lookup_invitation_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'basejump'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.create_account(slug text DEFAULT NULL::text, name text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.create_invitation(account_id uuid, account_role basejump.account_role, invitation_type basejump.invitation_type)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    new_invitation basejump.invitations;
begin
    insert into basejump.invitations (account_id, account_role, invitation_type, invited_by_user_id)
    values (account_id, account_role, invitation_type, auth.uid())
    returning * into new_invitation;

    return json_build_object('token', new_invitation.token);
end
$function$
;

CREATE OR REPLACE FUNCTION public.current_user_account_role(account_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.delete_invitation(invitation_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    -- verify account owner for the invitation
    if basejump.has_role_on_account(
               (select account_id from basejump.invitations where id = delete_invitation.invitation_id), 'owner') <>
       true then
        raise exception 'Only account owners can delete invitations';
    end if;

    delete from basejump.invitations where id = delete_invitation.invitation_id;
end
$function$
;

CREATE OR REPLACE FUNCTION public.get_account(account_id uuid)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_account_billing_status(account_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'basejump'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_account_by_slug(slug text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_account_id(slug text)
 RETURNS uuid
 LANGUAGE sql
AS $function$
select id
from basejump.accounts
where slug = get_account_id.slug;
$function$
;

CREATE OR REPLACE FUNCTION public.get_account_invitations(account_id uuid, results_limit integer DEFAULT 25, results_offset integer DEFAULT 0)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_account_members(account_id uuid, results_limit integer DEFAULT 50, results_offset integer DEFAULT 0)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'basejump'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_accounts()
 RETURNS json
 LANGUAGE sql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_personal_account()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN
    return public.get_account(auth.uid());
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    new."UPDATED_AT" = now();
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.lookup_invitation(lookup_invitation_token text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'basejump'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.moddatetime()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.UPDATED_AT = now();
    RETURN NEW;
END; $function$
;

CREATE OR REPLACE FUNCTION public.populate_financial_adviser_afs_representative()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.remove_account_member(account_id uuid, user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.service_role_upsert_customer_subscription(account_id uuid, customer jsonb DEFAULT NULL::jsonb, subscription jsonb DEFAULT NULL::jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW."UPDATED_AT" = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_account(account_id uuid, slug text DEFAULT NULL::text, name text DEFAULT NULL::text, public_metadata jsonb DEFAULT NULL::jsonb, replace_metadata boolean DEFAULT false)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_account_user_role(account_id uuid, user_id uuid, new_account_role basejump.account_role, make_primary_owner boolean DEFAULT false)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
    is_account_owner         boolean;
    is_account_primary_owner boolean;
    changing_primary_owner   boolean;
begin
    -- check if the user is an owner, and if they are, allow them to update the role
    select basejump.has_role_on_account(update_account_user_role.account_id, 'owner') into is_account_owner;

    if not is_account_owner then
        raise exception 'You must be an owner of the account to update a users role';
    end if;

    -- check if the user being changed is the primary owner, if so its not allowed
    select primary_owner_user_id = auth.uid(), primary_owner_user_id = update_account_user_role.user_id
    into is_account_primary_owner, changing_primary_owner
    from basejump.accounts
    where id = update_account_user_role.account_id;

    if changing_primary_owner = true and is_account_primary_owner = false then
        raise exception 'You must be the primary owner of the account to change the primary owner';
    end if;

    update basejump.account_user au
    set account_role = new_account_role
    where au.account_id = update_account_user_role.account_id
      and au.user_id = update_account_user_role.user_id;

    if make_primary_owner = true then
        -- first we see if the current user is the owner, only they can do this
        if is_account_primary_owner = false then
            raise exception 'You must be the primary owner of the account to change the primary owner';
        end if;

        update basejump.accounts
        set primary_owner_user_id = update_account_user_role.user_id
        where id = update_account_user_role.account_id;
    end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW."UPDATED_AT" = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."financial_adviser_afs_reps" to "anon";

grant insert on table "public"."financial_adviser_afs_reps" to "anon";

grant references on table "public"."financial_adviser_afs_reps" to "anon";

grant select on table "public"."financial_adviser_afs_reps" to "anon";

grant trigger on table "public"."financial_adviser_afs_reps" to "anon";

grant truncate on table "public"."financial_adviser_afs_reps" to "anon";

grant update on table "public"."financial_adviser_afs_reps" to "anon";

grant delete on table "public"."financial_adviser_afs_reps" to "authenticated";

grant insert on table "public"."financial_adviser_afs_reps" to "authenticated";

grant references on table "public"."financial_adviser_afs_reps" to "authenticated";

grant select on table "public"."financial_adviser_afs_reps" to "authenticated";

grant trigger on table "public"."financial_adviser_afs_reps" to "authenticated";

grant truncate on table "public"."financial_adviser_afs_reps" to "authenticated";

grant update on table "public"."financial_adviser_afs_reps" to "authenticated";

grant delete on table "public"."financial_adviser_afs_reps" to "service_role";

grant insert on table "public"."financial_adviser_afs_reps" to "service_role";

grant references on table "public"."financial_adviser_afs_reps" to "service_role";

grant select on table "public"."financial_adviser_afs_reps" to "service_role";

grant trigger on table "public"."financial_adviser_afs_reps" to "service_role";

grant truncate on table "public"."financial_adviser_afs_reps" to "service_role";

grant update on table "public"."financial_adviser_afs_reps" to "service_role";

create policy "Authenticated users can view accounts"
on "public"."accounts"
as permissive
for select
to authenticated
using (true);


create policy "Authenticated users can view financial_adviser_afs_reps"
on "public"."financial_adviser_afs_reps"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."financial_services_representatives"
as permissive
for select
to public
using (true);


create policy "Authenticated users can view user"
on "public"."user"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid))::text = (id)::text));


CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.afsl_licensees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.banned_and_disqualified_persons FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.credit_licensees FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.credit_representatives FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.representative_relationships FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


