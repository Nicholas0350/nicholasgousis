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

CREATE SCHEMA IF NOT EXISTS "public";
ALTER SCHEMA "public" OWNER TO "pg_database_owner";
COMMENT ON SCHEMA "public" IS 'standard public schema';

-- Create tables
CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "id" bigint NOT NULL,
    "primary_owner_user_id" "text"
);

CREATE TABLE IF NOT EXISTS "public"."financial_services_representatives" (
    "ID" integer NOT NULL,
    "REGISTER_NAME" "text",
    "AFS_REP_NUM" "text" NOT NULL,
    "AFS_LIC_NUM" "text",
    "AFS_REP_NAME" "text"
);

CREATE TABLE IF NOT EXISTS "public"."afsl_licensees" (
    "AFS_LIC_NUM" character varying(9) NOT NULL,
    "AFS_LIC_NAME" character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."banned_and_disqualified_persons" (
    "ID" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "BD_PER_NAME" "text" NOT NULL,
    "BD_PER_TYPE" "text" NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."credit_licensees" (
    "CRED_LIC_NUM" character varying(50) NOT NULL,
    "CRED_LIC_NAME" "text" NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."credit_representatives" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "CRED_REP_NUM" numeric(9,0) NOT NULL,
    "CRED_LIC_NUM" character varying(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."financial_advisers" (
    "ADV_NUMBER" character varying(100) NOT NULL,
    "ADV_NAME" character varying(250) NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."representative_relationships" (
    "ID" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "REP_ID" integer NOT NULL,
    "AFS_REP_NUM" character varying(9) NOT NULL,
    "AFS_LIC_NUM" character varying(9) NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" bigint NOT NULL,
    "email" "text",
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);

-- Add primary keys
ALTER TABLE ONLY "public"."accounts" ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."financial_services_representatives" ADD CONSTRAINT "afs_representatives_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY "public"."afsl_licensees" ADD CONSTRAINT "afsl_licensees_pkey" PRIMARY KEY ("AFS_LIC_NUM");
ALTER TABLE ONLY "public"."banned_and_disqualified_persons" ADD CONSTRAINT "banned_and_disqualified_persons_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY "public"."credit_licensees" ADD CONSTRAINT "credit_licensees_pkey" PRIMARY KEY ("CRED_LIC_NUM");
ALTER TABLE ONLY "public"."credit_representatives" ADD CONSTRAINT "credit_representatives_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."financial_advisers" ADD CONSTRAINT "FINANCIAL_ADVISERS_pkey" PRIMARY KEY ("ADV_NUMBER");
ALTER TABLE ONLY "public"."representative_relationships" ADD CONSTRAINT "representative_relationships_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY "public"."user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- Grant permissions
GRANT ALL ON TABLE "public"."accounts" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."financial_services_representatives" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."afsl_licensees" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."banned_and_disqualified_persons" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."credit_licensees" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."credit_representatives" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."financial_advisers" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."representative_relationships" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."user" TO "anon", "authenticated", "service_role";
