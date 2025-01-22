CREATE TABLE "afs_licensees" (
	"id" integer PRIMARY KEY NOT NULL,
	"REGISTER_NAME" text,
	"AFS_LIC_NUM" text,
	"AFS_LIC_NAME" text,
	"AFS_LIC_ABN" text,
	"AFS_LIC_ACN" text,
	"AFS_LIC_START_DT" date,
	"AFS_LIC_END_DT" date,
	"AFS_LIC_STATUS" text,
	"AFS_LIC_ADD_LOC" text,
	"AFS_LIC_ADD_STATE" text,
	"AFS_LIC_ADD_PCO" text,
	"AFS_LIC_ADD_COU" text,
	"AFS_LIC_PRIN_BUS" text,
	"AFS_LIC_SERV_NAME" text,
	"AFS_LIC_REMUN_TYP" text,
	"AFS_LIC_EXT_DIS_RES" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "banned_person_relationships" (
	"ID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"BANNED_PERSON_ID" uuid NOT NULL,
	"ENTITY_TYPE" text NOT NULL,
	"ENTITY_ID" text NOT NULL,
	"RELATIONSHIP_START_DATE" timestamp with time zone NOT NULL,
	"RELATIONSHIP_END_DATE" timestamp with time zone,
	"CREATED_AT" timestamp with time zone DEFAULT now(),
	"UPDATED_AT" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "banned_and_disqualified_persons" (
	"ID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"REGISTER_NAME" text NOT NULL,
	"BD_PER_NAME" text NOT NULL,
	"BD_PER_TYPE" text NOT NULL,
	"BD_PER_DOC_NUM" text,
	"BD_PER_START_DT" timestamp with time zone NOT NULL,
	"BD_PER_END_DT" timestamp with time zone NOT NULL,
	"BD_PER_ADD_LOCAL" text DEFAULT 'ADDRESS UNKNOWN',
	"BD_PER_ADD_STATE" text DEFAULT 'ADDRESS UNKNOWN',
	"BD_PER_ADD_PCODE" text DEFAULT 'ADDRESS UNKNOWN',
	"BD_PER_ADD_COUNTRY" text DEFAULT 'AUSTRALIA',
	"BD_PER_COMMENTS" text,
	"CREATED_AT" timestamp with time zone DEFAULT now(),
	"UPDATED_AT" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit_licensees" (
	"REGISTER_NAME" text NOT NULL,
	"CRED_LIC_NUM" varchar(50) NOT NULL,
	"CRED_LIC_NAME" text NOT NULL,
	"CRED_LIC_START_DT" text,
	"CRED_LIC_END_DT" text,
	"CRED_LIC_STATUS" text,
	"CRED_LIC_ABN_ACN" varchar(20),
	"CRED_LIC_AFSL_NUM" varchar(20),
	"CRED_LIC_STATUS_HISTORY" text,
	"CRED_LIC_LOCALITY" text,
	"CRED_LIC_STATE" varchar(10),
	"CRED_LIC_PCODE" varchar(10),
	"CRED_LIC_LAT" text,
	"CRED_LIC_LNG" text,
	"CRED_LIC_EDRS" text,
	"CRED_LIC_BN" text,
	"CRED_LIC_AUTHORISATIONS" text,
	"CREATED_AT" timestamp with time zone DEFAULT now(),
	"UPDATED_AT" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit_representatives" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"REGISTER_NAME" varchar(255) NOT NULL,
	"CRED_REP_NUM" numeric(9, 0) NOT NULL,
	"CRED_LIC_NUM" varchar(50) NOT NULL,
	"CRED_REP_NAME" varchar(255) NOT NULL,
	"CRED_REP_ABN_ACN" numeric(11, 0),
	"CRED_REP_START_DT" date NOT NULL,
	"CRED_REP_END_DT" date,
	"CRED_REP_LOCALITY" varchar(255),
	"CRED_REP_STATE" varchar(3),
	"CRED_REP_PCODE" numeric(4, 0),
	"CRED_REP_EDRS" varchar(10),
	"CRED_REP_AUTHORISATIONS" varchar(255),
	"CRED_REP_CROSS_ENDORSE" varchar(255),
	"CREATED_AT" timestamp with time zone DEFAULT now(),
	"UPDATED_AT" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "financial_adviser_afs_reps" (
	"id" integer NOT NULL,
	"ADV_NUMBER" text NOT NULL,
	"AFS_LIC_NUM" text NOT NULL,
	"AFS_REP_NUM" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_advisers" (
	"REGISTER_NAME" varchar(250) NOT NULL,
	"ADV_NAME" varchar(250) NOT NULL,
	"ADV_NUMBER" varchar(100) NOT NULL,
	"ADV_ROLE" varchar(100) NOT NULL,
	"ADV_SUB_TYPE" varchar(100),
	"ADV_ROLE_STATUS" varchar(100) NOT NULL,
	"ADV_ABN" varchar(30),
	"ADV_FIRST_PROVIDED_ADVICE" varchar(4),
	"LICENCE_NAME" varchar(250) NOT NULL,
	"LICENCE_NUMBER" varchar(100) NOT NULL,
	"LICENCE_ABN" varchar(30),
	"LICENCE_CONTROLLED_BY" varchar(4000),
	"REP_APPOINTED_BY" varchar(250),
	"REP_APPOINTED_NUM" varchar(100),
	"REP_APPOINTED_ABN" varchar(30),
	"ADV_START_DT" varchar(10) NOT NULL,
	"ADV_END_DT" varchar(10),
	"ADV_DA_START_DT" varchar(10),
	"ADV_DA_END_DT" varchar(10),
	"ADV_DA_TYPE" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "financial_services_representatives" (
	"ID" integer NOT NULL,
	"REGISTER_NAME" text,
	"AFS_REP_NUM" text NOT NULL,
	"AFS_LIC_NUM" text,
	"AFS_REP_NAME" text,
	"AFS_REP_ABN" text,
	"AFS_REP_ACN" text,
	"AFS_REP_OTHER_ROLE" text,
	"AFS_REP_START_DT" date,
	"AFS_REP_STATUS" text,
	"AFS_REP_END_DT" date,
	"AFS_REP_ADD_LOCAL" text,
	"AFS_REP_ADD_STATE" text,
	"AFS_REP_ADD_PCO" text,
	"AFS_REP_ADD_COUNTRY" text,
	"AFS_REP_CROSS_ENDORSE" text,
	"AFS_REP_MAY_APPOINT" text,
	"AFS_REP_APPOINTED_BY" text,
	"FIN" text,
	"DEAL" text,
	"APPLY" text,
	"GENFIN" text,
	"ISSUE" text,
	"ARRANGE_APPLY" text,
	"ARRANGE_ISSUE" text,
	"ARRANGE_UNDERWR" text,
	"CLASSES" text,
	"DEAL_APPLY" text,
	"DEAL_ISSUE" text,
	"DEAL_UNDERWR" text,
	"IDPS" text,
	"MARKET" text,
	"NONIDPS" text,
	"SCHEME" text,
	"TRUSTEE" text,
	"WSALE" text,
	"ARRANGE" text,
	"UNDERWR" text,
	"AFS_REP_SAME_AU" text,
	"AFS_REP_RELATED" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "function_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"function_name" text NOT NULL,
	"status" text NOT NULL,
	"records_processed" integer,
	"error_message" text,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "representative_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"REP_ID" integer NOT NULL,
	"AFS_REP_NUM" varchar(9) NOT NULL,
	"AFS_LIC_NUM" varchar(9) NOT NULL,
	"ADVISER_NUMBER" varchar(9),
	"CREATED_AT" timestamp with time zone DEFAULT now(),
	"UPDATED_AT" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" bigint NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"email" text,
	"password" text,
	"subscription_status" text,
	"subscription_end_date" timestamp with time zone,
	"stripe_customer_id" text,
	"stripe_session_id" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"auth_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "stripe_webhooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"processed_at" timestamp with time zone NOT NULL
);
