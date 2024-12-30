-- Initial setup
CREATE SCHEMA IF NOT EXISTS "public";

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- Schema ownership
ALTER SCHEMA "public" OWNER TO "postgres";

-- Grant usage
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

-- Grant privileges
GRANT ALL ON ALL TABLES IN SCHEMA "public" TO "postgres";
GRANT ALL ON ALL FUNCTIONS IN SCHEMA "public" TO "postgres";
GRANT ALL ON ALL SEQUENCES IN SCHEMA "public" TO "postgres";