<!-- [text](https://github.com/dhravya/backend-api-kit) -->


Project Structure:
├── LICENSE
├── README.md
├── biome.json
├── bun.lock
├── docs
│   ├── drizzle.md
│   ├── lemonsqueezy.md
│   ├── ratelimits.md
│   └── tests.md
├── drizzle
│   ├── 0000_crazy_zuras.sql
├── drizzle.config.ts
├── package-lock.json
├── package.json
├── scripts
│   └── setup.ts
├── src
│   ├── api.ts
│   ├── auth.ts
│   ├── index.tsx
├── test
│   └── index.spec.ts
├── tsconfig.json
├── vitest.config.mts
├── worker-configuration.d.ts
└── wrangler.jsonc


.dev.vars.example
```
1 | AUTH_GITHUB_ID=
2 | AUTH_GITHUB_SECRET=
3 | BETTER_AUTH_URL=http://localhost:8787
4 | SECRET=
5 | LEMONSQUEEZY_CHECKOUT_LINK=
```

biome.json
```
1 | {
2 | 	"$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
3 | 	"vcs": {
4 | 		"enabled": false,
5 | 		"clientKind": "git",
6 | 		"useIgnoreFile": false
7 | 	},
8 | 	"files": {
9 | 		"ignoreUnknown": false,
10 | 		"ignore": ["drizzle/", "node_modules/", ".wrangler/"]
11 | 	},
12 | 	"formatter": {
13 | 		"enabled": true,
14 | 		"indentStyle": "tab"
15 | 	},
16 | 	"organizeImports": {
17 | 		"enabled": true
18 | 	},
19 | 	"linter": {
20 | 		"enabled": true,
21 | 		"rules": {
22 | 			"recommended": true
23 | 		}
24 | 	},
25 | 	"javascript": {
26 | 		"formatter": {
27 | 			"quoteStyle": "double"
28 | 		}
29 | 	}
30 | }
```

drizzle.config.ts
```
1 | import 'dotenv/config';
2 | import { defineConfig } from 'drizzle-kit';
3 | import { execSync } from 'child_process';
4 |
5 | declare global {
6 | 	interface Process {
7 | 	  env: {
8 | 		DATABASE_ID: string;
9 | 		ACCOUNT_ID: string;
10 |         TOKEN: string;
11 |         NODE_ENV: string;
12 | 	  }
13 | 	}
14 |
15 |   var process: Process;
16 | }
17 |
18 | const getSqlitePath = () => {
19 |   try {
20 |     return execSync('find .wrangler/state/v3/d1/miniflare-D1DatabaseObject -type f -name "*.sqlite" -print -quit', { encoding: 'utf-8' }).trim();
21 |   } catch (e) {
22 |     console.error('Failed to find SQLite database file');
23 |     return '';
24 |   }
25 | };
26 |
27 | const cloudflareConfig = defineConfig({
28 |   out: './drizzle',
29 |   schema: './src/db/schema.ts',
30 |   dialect: 'sqlite',
31 |   driver: "d1-http",
32 |   dbCredentials: {
33 |     accountId: process.env.ACCOUNT_ID,
34 |     databaseId: process.env.DATABASE_ID,
35 |     token: process.env.TOKEN,
36 |   },
37 | });
38 |
39 | const localConfig = defineConfig({
40 |   out: './drizzle',
41 |   schema: './src/db/schema.ts',
42 |   dialect: 'sqlite',
43 |   dbCredentials: {
44 |     url: `file:${getSqlitePath()}`,
45 |   },
46 | });
47 |
48 | const config = process.env.NODE_ENV === "production" ? cloudflareConfig : localConfig;
49 | console.log(`Using ${process.env.NODE_ENV === "production" ? "cloudflare" : "local"} config`);
50 | export default config;
```

package.json
```
1 | {
2 |   "name": "backend-api-kit",
3 |   "scripts": {
4 |     "dev": "wrangler dev",
5 |     "deploy": "wrangler deploy --minify",
6 |     "cf-typegen": "wrangler types --env-interface CloudflareBindings",
7 |     "setup": "bun scripts/setup.ts",
8 |     "lint": "biome lint --write ."
9 |   },
10 |   "dependencies": {
11 |     "better-auth": "^1.1.14",
12 |     "drizzle-orm": "^0.38.4",
13 |     "hono": "^4.6.18"
14 |   },
15 |   "devDependencies": {
16 |     "@biomejs/biome": "1.9.4",
17 |     "@clack/prompts": "^0.9.1",
18 |     "@cloudflare/vitest-pool-workers": "0.6.4",
19 |     "@cloudflare/workers-types": "^4.20250121.0",
20 |     "@types/bun": "^1.2.0",
21 |     "better-sqlite3": "^11.8.1",
22 |     "child_process": "^1.0.2",
23 |     "drizzle-kit": "^0.30.2",
24 |     "vitest": "2.1.8",
25 |     "wrangler": "^3.105.0",
26 |     "bun": "^1.2.0",
27 |     "dotenv": "^16.4.7"
28 |   }
29 | }
```

tsconfig.json
```
1 | {
2 |   "compilerOptions": {
3 |     "target": "ESNext",
4 |     "module": "ESNext",
5 |     "moduleResolution": "Bundler",
6 |     "strict": true,
7 |     "skipLibCheck": true,
8 |     "lib": [
9 |       "ESNext"
10 |     ],
11 |     "types": [
12 |         "@cloudflare/workers-types/2023-07-01","node", "@cloudflare/vitest-pool-workers"
13 |     ],
14 |     "jsx": "react-jsx",
15 |     "jsxImportSource": "hono/jsx"
16 |   },
17 | }
```

vitest.config.mts
```
1 | import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
2 |
3 | export default defineWorkersConfig({
4 | 	test: {
5 | 		poolOptions: {
6 | 			workers: {
7 | 				wrangler: { configPath: './wrangler.jsonc' },
8 | 			},
9 | 		},
10 | 	},
11 | });
```

worker-configuration.d.ts
```
1 | interface Env {
2 | 	USERS_DATABASE: D1Database;
3 | 	BETTER_AUTH_URL: string;
4 | 	SECRET: string;
5 | 	AUTH_GITHUB_ID: string;
6 | 	AUTH_GITHUB_SECRET: string;
7 | 	LEMONSQUEEZY_CHECKOUT_LINK: string
8 | }
```

wrangler.jsonc
```
1 | {
2 |   "$schema": "node_modules/wrangler/config-schema.json",
3 |   "name": "backend-api-kit",
4 |   "main": "src/index.tsx",
5 |   "compatibility_date": "2025-01-21",
6 |   "compatibility_flags": ["nodejs_compat"],
7 |   "observability": {
8 |     "enabled": true
9 |   },
10 |   "placement": {
11 |     "mode": "smart"
12 |   },
13 |   "d1_databases": [
14 |     {
15 |       "binding": "USERS_DATABASE",
16 |       "database_name": "backend-api-kit",
17 |       "database_id": "05a34dd0-b2df-40e1-9e3f-daec23f471d9",
18 |       "preview_database_id": "05a34dd0-b2df-40e1-9e3f-daec23f471d9"
19 |     }
20 |   ]
21 | }
```

docs/drizzle.md
```
1 | ## How to make changes to database schema
2 |
3 | 1. Make changes to the schema in `src/db/schema.ts`
4 | 2. Run `npx drizzle-kit generate` to generate the migration
5 | 3. Run `npx drizzle-kit migrate` to apply the migration
6 | 4. Run `npx drizzle-kit push` to push the migration to the database
7 |
8 | For making changes to the prod database, you will need to change the NODE_ENV in `.env` to `production` and run `npx drizzle-kit migrate` or push the migration.
9 |
10 | To learn more about Drizzle, see the [Drizzle docs](https://orm.drizzle.team/docs/introduction)
```

docs/lemonsqueezy.md
```
1 | ## Setting up lemonsqueezy store and webhooks
2 |
3 | 1. [Create a store](https://docs.lemonsqueezy.com/guides/getting-started) on lemonsqueezy
4 | 2. Make sure you up **Subscriptions** in the store
5 |
6 | ![Setting up subscriptions](https://imagedelivery.net/_Zs8NCbSWCQ8-iurXrWjBg/d997516e-bd3e-46e9-f962-15c331d85100/public)
7 |
8 | 3. Go to Settings -> Webhooks and set up a webhook, select *all events*
9 |
10 | ![Setting up webhook](https://imagedelivery.net/_Zs8NCbSWCQ8-iurXrWjBg/cd1eabd0-9981-4dfe-8ce9-2748cca76c00/public)
11 |
12 | 4. Make sure that the secret is the same as the one in your `.dev.vars` file
13 |
14 | 5. Copy the store URL and paste it in the `.env` file as `LEMONSQUEEZY_STORE_LINK`
15 |
16 | ... and you're done!
```

docs/ratelimits.md
```
1 | ## Changing ratelimits
2 |
3 | Ratelimits are set in [`src/middleware/rateLimit.ts`](/src/middleware/rateLimit.ts)
4 |
5 | To edit them, simply change the `getTierLimit` function in the ratelimit middleware.
6 |
7 | ```ts
8 | export const getTierLimit = async (user: User) => {
9 | 	if (!user?.subscriptionId) {
10 | 		return { limit: 100, window: 60 * 60 }; // Free tier
11 | 	}
12 | 	return { limit: 1000, window: 60 * 60 }; // Paid tier
13 | };
14 | ```
15 |
16 | All the `window` values are in seconds.
17 |
18 | We are using D1 with custom logic to ratelimit the requests. The schema can be found here - [`src/db/schema.ts`](/src/db/schema.ts)
19 |
20 | ```ts
21 | export const rateLimit = sqliteTable("rateLimit", {
22 |   id: text("id").primaryKey(),
23 |   userId: text("userId").notNull().references(() => user.id),
24 |   endpoint: text("endpoint").notNull(),
25 |   count: integer("count").notNull().default(0),
26 |   resetAt: integer("resetAt", { mode: "timestamp" }).notNull(),
27 |   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
28 |   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
29 | });
30 | ```
```

docs/tests.md
```
1 | ## Writing and running tests
2 |
3 | To run tests, use `npm run test`
4 |
5 | Tests are made using the hono RPC functions, for better type safety and error handling.
6 |
7 | [Hono testing guide](https://hono.dev/docs/guides/testing)
8 | [Hono testing client](https://hono.dev/docs/helpers/testing)
9 | [Vitest docs](https://vitest.dev/guide/)
10 | [Using Vitest-pool-workers](https://www.npmjs.com/package/@cloudflare/vitest-pool-workers)
```

drizzle/0000_crazy_zuras.sql
```
1 | CREATE TABLE `account` (
2 | 	`id` text PRIMARY KEY NOT NULL,
3 | 	`userId` text NOT NULL,
4 | 	`accountId` text NOT NULL,
5 | 	`providerId` text NOT NULL,
6 | 	`accessToken` text,
7 | 	`refreshToken` text,
8 | 	`accessTokenExpiresAt` integer,
9 | 	`refreshTokenExpiresAt` integer,
10 | 	`scope` text,
11 | 	`idToken` text,
12 | 	`password` text,
13 | 	`createdAt` integer NOT NULL,
14 | 	`updatedAt` integer NOT NULL,
15 | 	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
16 | );
17 | --> statement-breakpoint
18 | CREATE TABLE `rateLimit` (
19 | 	`id` text PRIMARY KEY NOT NULL,
20 | 	`userId` text NOT NULL,
21 | 	`endpoint` text NOT NULL,
22 | 	`count` integer DEFAULT 0 NOT NULL,
23 | 	`resetAt` integer NOT NULL,
24 | 	`createdAt` integer NOT NULL,
25 | 	`updatedAt` integer NOT NULL,
26 | 	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
27 | );
28 | --> statement-breakpoint
29 | CREATE TABLE `session` (
30 | 	`id` text PRIMARY KEY NOT NULL,
31 | 	`userId` text NOT NULL,
32 | 	`token` text NOT NULL,
33 | 	`expiresAt` integer NOT NULL,
34 | 	`ipAddress` text,
35 | 	`userAgent` text,
36 | 	`createdAt` integer NOT NULL,
37 | 	`updatedAt` integer NOT NULL,
38 | 	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
39 | );
40 | --> statement-breakpoint
41 | CREATE TABLE `user` (
42 | 	`id` text PRIMARY KEY NOT NULL,
43 | 	`name` text NOT NULL,
44 | 	`email` text NOT NULL,
45 | 	`emailVerified` integer DEFAULT false NOT NULL,
46 | 	`image` text,
47 | 	`createdAt` integer NOT NULL,
48 | 	`updatedAt` integer NOT NULL,
49 | 	`subscriptionId` text,
50 | 	`lastKeyGeneratedAt` integer
51 | );
52 | --> statement-breakpoint
53 | CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
54 | CREATE TABLE `verification` (
55 | 	`id` text PRIMARY KEY NOT NULL,
56 | 	`identifier` text NOT NULL,
57 | 	`value` text NOT NULL,
58 | 	`expiresAt` integer NOT NULL,
59 | 	`createdAt` integer NOT NULL,
60 | 	`updatedAt` integer NOT NULL
61 | );
```

scripts/setup.ts
```
1 | import { execSync, spawnSync } from "node:child_process";
2 | import crypto from "node:crypto";
3 | import { default as fs } from "node:fs";
4 | import os from "node:os";
5 | import { default as path } from "node:path";
6 | import { cancel, intro, outro, select, spinner, text } from "@clack/prompts";
7 |
8 |
9 | interface CommandError {
10 |     stdout?: string;
11 |     stderr?: string;
12 | }
13 |
14 | // Function to get current working directory
15 | function getCurrentDirectory(): string {
16 |     return execSync('pwd', { encoding: 'utf-8' }).trim();
17 | }
18 |
19 | // Function to execute shell commands
20 | function executeCommand(command: string): string | { error: true; message: string } {
21 |     console.log(`\x1b[33m${command}\x1b[0m`);
22 |     try {
23 |         return execSync(command, { encoding: "utf-8" });
24 |     } catch (error) {
25 |         const err = error as CommandError;
26 |         return { error: true, message: err.stdout || err.stderr || "Unknown error" };
27 |     }
28 | }
29 |
30 | // Function to prompt user for input without readline-sync
31 | async function prompt(message: string, defaultValue: string): Promise<string> {
32 |     return (await text({
33 |         message: `${message} (${defaultValue}):`,
34 |         placeholder: defaultValue,
35 |         defaultValue,
36 |     })) as string;
37 | }
38 |
39 | // Function to extract account IDs from `wrangler whoami` output
40 | function extractAccountDetails(output: string): { name: string; id: string }[] {
41 |     const lines = output.split("\n");
42 |     const accountDetails: { name: string; id: string }[] = [];
43 |
44 |     for (const line of lines) {
45 |         const isValidLine =
46 |             line.trim().startsWith("│ ") && line.trim().endsWith(" │");
47 |
48 |         if (isValidLine) {
49 |             const regex = /\b[a-f0-9]{32}\b/g;
50 |             const matches = line.match(regex);
51 |
52 |             if (matches && matches.length === 1) {
53 |                 const accountName = line.split("│ ")[1]?.trim();
54 |                 const accountId = matches[0].replace("│ ", "").replace(" │", "");
55 |                 if (accountName === undefined || accountId === undefined) {
56 |                     console.error(
57 |                         "\x1b[31mError extracting account details from wrangler whoami output.\x1b[0m",
58 |                     );
59 |                     cancel("Operation cancelled.");
60 |                     throw new Error("Failed to extract account details");
61 |                 }
62 |                 accountDetails.push({ name: accountName, id: accountId });
63 |             }
64 |         }
65 |     }
66 |
67 |     return accountDetails;
68 | }
69 |
70 | // Function to prompt for account ID if there are multiple accounts
71 | async function promptForAccountId(
72 |     accounts: { name: string; id: string }[],
73 | ): Promise<string> {
74 |     if (accounts.length === 1) {
75 |         if (!accounts[0]) {
76 |             console.error(
77 |                 "\x1b[31mNo accounts found. Please run `wrangler login`.\x1b[0m",
78 |             );
79 |             cancel("Operation cancelled.");
80 |             throw new Error("No accounts found");
81 |         }
82 |         if (!accounts[0].id) {
83 |             console.error(
84 |                 "\x1b[31mNo accounts found. Please run `wrangler login`.\x1b[0m",
85 |             );
86 |             cancel("Operation cancelled.");
87 |             throw new Error("No account ID found");
88 |         }
89 |         return accounts[0].id;
90 |     }
91 |
92 |     if (accounts.length > 1) {
93 |         const options = accounts.map((account) => ({
94 |             value: account.id,
95 |             label: account.name,
96 |         }));
97 |         const selectedAccountId = await select({
98 |             message: "Select an account to use:",
99 |             options,
100 |         });
101 |
102 |         if (!selectedAccountId) {
103 |             throw new Error("No account selected");
104 |         }
105 |
106 |         return selectedAccountId as string;
107 |     }
108 |
109 |     console.error(
110 |         "\x1b[31mNo accounts found. Please run `wrangler login`.\x1b[0m",
111 |     );
112 |     cancel("Operation cancelled.");
113 |     throw new Error("No accounts found");
114 | }
115 |
116 | let dbName: string;
117 |
118 | interface WranglerConfig {
119 |     name?: string;
120 |     main?: string;
121 |     compatibility_date?: string;
122 |     compatibility_flags?: string[];
123 |     d1_databases?: Array<{
124 |         binding: string;
125 |         database_name: string;
126 |         database_id: string;
127 |         migrations_dir: string;
128 |     }>;
129 | }
130 |
131 | // Function to create database and update wrangler.jsonc
132 | async function createDatabaseAndConfigure() {
133 |     intro(`Let's set up your database...`);
134 |     const defaultDBName = `${path.basename(getCurrentDirectory())}-db`;
135 |     dbName = await prompt("Enter the name of your database", defaultDBName);
136 |
137 |     let databaseID: string | undefined;
138 |
139 |     const wranglerJsoncPath = path.join(__dirname, "..", "wrangler.jsonc");
140 |     let wranglerConfig: WranglerConfig;
141 |
142 |     try {
143 |         const wranglerJsoncContent = fs.readFileSync(wranglerJsoncPath, "utf-8");
144 |         wranglerConfig = JSON.parse(wranglerJsoncContent);
145 |     } catch (error) {
146 |         console.error("\x1b[31mError reading wrangler.jsonc:", error, "\x1b[0m");
147 |         cancel("Operation cancelled.");
148 |         throw error;
149 |     }
150 |
151 |     // Run command to create a new database
152 |     const creationOutput = executeCommand(`bunx wrangler d1 create ${dbName}`);
153 |
154 |     if (creationOutput === undefined || typeof creationOutput !== "string") {
155 |         console.log(
156 |             "\x1b[33mDatabase creation failed, maybe you have already created a database with that name. I'll try to find the database ID for you.\x1b[0m",
157 |         );
158 |         const dbInfoOutput = executeCommand(`bunx wrangler d1 info ${dbName}`);
159 |         if (typeof dbInfoOutput === "string") {
160 |             const getInfo = dbInfoOutput.match(
161 |                 /│ [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12} │/i,
162 |             );
163 |             if (getInfo && getInfo.length === 1) {
164 |                 console.log(
165 |                     "\x1b[33mFound it! The database ID is: ",
166 |                     getInfo[0],
167 |                     "\x1b[0m",
168 |                 );
169 |                 databaseID = getInfo[0].replace("│ ", "").replace(" │", "");
170 |             }
171 |         }
172 |
173 |         if (!databaseID) {
174 |             console.error(
175 |                 "\x1b[31mSomething went wrong when initialising the database. Please try again.\x1b[0m",
176 |             );
177 |             cancel("Operation cancelled.");
178 |             throw new Error("Failed to get database ID");
179 |         }
180 |     } else {
181 |         // Extract database ID from the output
182 |         const matchResult = creationOutput.match(
183 |             /database_id = "(.*)"/,
184 |         );
185 |         if (matchResult?.[1]) {
186 |             databaseID = matchResult[1];
187 |         } else {
188 |             console.error("Failed to extract database ID from the output.");
189 |             cancel("Operation cancelled.");
190 |             throw new Error("Failed to extract database ID");
191 |         }
192 |     }
193 |
194 |     // Update wrangler.jsonc with database configuration
195 |     wranglerConfig.d1_databases = [
196 |         {
197 |             binding: "DATABASE",
198 |             database_name: dbName,
199 |             database_id: databaseID,
200 |             migrations_dir: "./drizzle",
201 |         },
202 |     ];
203 |
204 |     try {
205 |         const updatedJsonc = JSON.stringify(wranglerConfig, null, 2);
206 |         fs.writeFileSync(wranglerJsoncPath, updatedJsonc);
207 |         console.log(
208 |             "\x1b[33mDatabase configuration updated in wrangler.jsonc\x1b[0m",
209 |         );
210 |     } catch (error) {
211 |         console.error("\x1b[31mError updating wrangler.jsonc:", error, "\x1b[0m");
212 |         cancel("Operation cancelled.");
213 |         throw error;
214 |     }
215 |
216 |     outro("Database configuration completed.");
217 | }
218 |
219 | // Function to prompt for environment variables
220 | async function promptForEnvVars() {
221 |     intro("Setting up environment variables...");
222 |
223 |     const devVarsPath = path.join(__dirname, "..", ".dev.vars");
224 |     const devVarsExamplePath = path.join(__dirname, "..", ".dev.vars.example");
225 |
226 |     if (!fs.existsSync(devVarsPath)) {
227 |         console.log("\x1b[33mNow, let's set up your environment variables.\x1b[0m");
228 |
229 |         const vars = {
230 |             AUTH_GITHUB_ID: await prompt("Enter your GitHub Client ID (enter to skip)", ""),
231 |             AUTH_GITHUB_SECRET: await prompt("Enter your GitHub Client Secret (enter to skip)", ""),
232 |             BETTER_AUTH_URL: await prompt("Enter your Better Auth URL", "http://localhost:8787"),
233 |             SECRET: generateSecureRandomString(32),
234 |             LEMONSQUEEZY_CHECKOUT_LINK: await prompt("Enter your Lemonsqueezy Checkout Link (enter to skip)", ""),
235 |         };
236 |
237 |         try {
238 |             const envContent = Object.entries(vars)
239 |                 .map(([key, value]) => `${key}=${value}`)
240 |                 .join("\n");
241 |             fs.writeFileSync(devVarsPath, `${envContent}\n`);
242 |             console.log("\x1b[33m.dev.vars file created with environment variables.\x1b[0m");
243 |         } catch (error) {
244 |             console.error("\x1b[31mError creating .dev.vars file:", error, "\x1b[0m");
245 |             cancel("Operation cancelled.");
246 |             throw error;
247 |         }
248 |     } else {
249 |         console.log("\x1b[31m.dev.vars file already exists. Skipping creation.\x1b[0m");
250 |     }
251 |
252 |     outro("Environment variables setup completed.");
253 | }
254 |
255 | // Function to generate secure random string
256 | function generateSecureRandomString(length: number): string {
257 |     return crypto
258 |         .randomBytes(Math.ceil(length / 2))
259 |         .toString("hex")
260 |         .slice(0, length);
261 | }
262 |
263 | // Function to run database migrations
264 | async function runDatabaseMigrations(dbName: string) {
265 |     const setupMigrationSpinner = spinner();
266 |     setupMigrationSpinner.start("Generating setup migration...");
267 |     executeCommand("bunx drizzle-kit generate --name setup");
268 |     setupMigrationSpinner.stop("Setup migration generated.");
269 |
270 |     const localMigrationSpinner = spinner();
271 |     localMigrationSpinner.start("Running local database migrations...");
272 |     executeCommand(`bunx wrangler d1 migrations apply ${dbName}`);
273 |     localMigrationSpinner.stop("Local database migrations completed.");
274 |
275 |     const remoteMigrationSpinner = spinner();
276 |     remoteMigrationSpinner.start("Running remote database migrations...");
277 |     executeCommand(`bunx wrangler d1 migrations apply ${dbName} --remote`);
278 |     remoteMigrationSpinner.stop("Remote database migrations completed.");
279 | }
280 |
281 | // Function to deploy worker
282 | async function deployWorker() {
283 |     const shouldDeploy = await select({
284 |         message: "Would you like to deploy the worker now?",
285 |         options: [
286 |             { value: "yes", label: "Yes" },
287 |             { value: "no", label: "No" },
288 |         ],
289 |     });
290 |
291 |     if (shouldDeploy === "yes") {
292 |         console.log("\x1b[33mDeploying worker...\x1b[0m");
293 |         executeCommand("bunx wrangler deploy");
294 |         console.log("\x1b[32mWorker deployed successfully!\x1b[0m");
295 |     }
296 | }
297 |
298 | function setEnvironmentVariable(name: string, value: string): never {
299 |     const platform = os.platform();
300 |     const command = platform === "win32"
301 |         ? `set ${name}=${value}` // Windows Command Prompt
302 |         : `export ${name}=${value}`; // Unix-like shells
303 |
304 |     console.log(
305 |         `\x1b[33mPlease run this command: ${command} and then rerun the setup script.\x1b[0m`,
306 |     );
307 |     throw new Error("Environment variable needs to be set");
308 | }
309 |
310 | async function main() {
311 |     try {
312 |         const whoamiOutput = executeCommand("wrangler whoami");
313 |         if (whoamiOutput === undefined || typeof whoamiOutput !== "string") {
314 |             console.error(
315 |                 "\x1b[31mError running wrangler whoami. Please run `wrangler login`.\x1b[0m",
316 |             );
317 |             cancel("Operation cancelled.");
318 |             throw new Error("Failed to run wrangler whoami");
319 |         }
320 |
321 |         try {
322 |             await createDatabaseAndConfigure();
323 |         } catch (error) {
324 |             console.error("\x1b[31mError:", error, "\x1b[0m");
325 |             const accountIds = extractAccountDetails(whoamiOutput);
326 |             const accountId = await promptForAccountId(accountIds);
327 |             setEnvironmentVariable("CLOUDFLARE_ACCOUNT_ID", accountId);
328 |         }
329 |
330 |         await promptForEnvVars();
331 |         await runDatabaseMigrations(dbName);
332 |         await deployWorker();
333 |
334 |         console.log("\x1b[32mSetup completed successfully!\x1b[0m");
335 |         console.log("\x1b[33mYou can now run 'bun run dev' to start the development server.\x1b[0m");
336 |     } catch (error) {
337 |         console.error("\x1b[31mError:", error, "\x1b[0m");
338 |         cancel("Operation cancelled.");
339 |         throw error;
340 |     }
341 | }
342 |
343 | main().catch(() => {
344 |     // Exit with error code
345 |     // @ts-expect-error
346 |     process.exit(1)
347 | });
```

src/api.ts
```
1 | import { Hono } from "hono";
2 | import { ratelimiter } from "./middleware/rateLimit";
3 | import type { User, Session } from "./db/schema";
4 |
5 | export const apiRouter = new Hono<{
6 | 	Bindings: Env;
7 | 	Variables: {
8 | 		user: User;
9 | 		session: Session;
10 | 	};
11 | }>()
12 | .use(ratelimiter)
13 | .get("/", (c) => {
14 |     const user = c.get("user")
15 |     if (!user?.subscriptionId) {
16 |         return c.json({
17 |             error: "Unauthorized, please buy a subscription"
18 |         }, 401)
19 |     }
20 |     return c.json({
21 |         message: "Hello World"
22 |     })
23 | })
```

src/auth.ts
```
1 | import { betterAuth } from "better-auth";
2 | import type { User, Session } from "./db/schema";
3 | import { drizzle } from "drizzle-orm/d1";
4 | import { drizzleAdapter } from "better-auth/adapters/drizzle";
5 | import * as schema from "./db/schema";
6 | import { createMiddleware } from "hono/factory";
7 | import { Hono } from "hono";
8 | import { generateKey, decryptKey } from "./utils/key";
9 | import { and, eq } from "drizzle-orm";
10 |
11 | const app = new Hono<{
12 | 	Bindings: Env;
13 | 	Variables: {
14 | 		user: User;
15 | 		session: Session;
16 | 	};
17 | }>();
18 |
19 | export const db = (env: Env) => drizzle(env.USERS_DATABASE);
20 |
21 | export const auth = (env: Env) =>
22 | 	betterAuth({
23 | 		database: drizzleAdapter(drizzle(env.USERS_DATABASE), {
24 | 			provider: "sqlite",
25 | 			schema: {
26 | 				account: schema.account,
27 | 				session: schema.session,
28 | 				user: schema.user,
29 | 				verification: schema.verification,
30 | 			},
31 | 		}),
32 | 		secret: env.SECRET,
33 | 		socialProviders: {
34 | 			github: {
35 | 				clientId: env.AUTH_GITHUB_ID,
36 | 				clientSecret: env.AUTH_GITHUB_SECRET,
37 | 				redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/github`,
38 | 			},
39 | 		},
40 | 	});
41 |
42 | export const authMiddleware = createMiddleware(async (c, next) => {
43 | 	// Check for bearer token
44 | 	const authHeader = c.req.header("Authorization");
45 | 	if (authHeader?.startsWith("Bearer ")) {
46 | 		const token = authHeader.substring(7);
47 | 		try {
48 | 			const [userId, lastKeyGeneratedAtTimestamp] = await decryptKey(token, c.env.SECRET);
49 | 			const user = await db(c.env)
50 | 				.select()
51 | 				.from(schema.user)
52 | 				.where(eq(schema.user.id, userId))
53 | 				.get();
54 |
55 | 			if (user) {
56 | 				if (!user.lastKeyGeneratedAt || user.lastKeyGeneratedAt === null) {
57 | 					// Update user with current timestamp if no lastKeyGeneratedAt
58 | 					const now = new Date();
59 | 					await db(c.env)
60 | 						.update(schema.user)
61 | 						.set({ lastKeyGeneratedAt: now })
62 | 						.where(eq(schema.user.id, userId))
63 | 						.run();
64 | 					user.lastKeyGeneratedAt = now;
65 | 				}
66 |
67 | 				// Convert both timestamps to numbers for comparison
68 | 				const storedTimestamp = user.lastKeyGeneratedAt.getTime();
69 | 				const providedTimestamp = Number(lastKeyGeneratedAtTimestamp);
70 |
71 | 				if (storedTimestamp === providedTimestamp) {
72 | 					c.set("user", user);
73 | 					c.set("session", null);
74 | 					await next();
75 | 					return;
76 | 				}
77 | 			}
78 | 		} catch (e) {
79 | 			console.error("API Key validation failed:", e);
80 | 			return c.json({ error: "Invalid API key" }, 401);
81 | 		}
82 |
83 | 		// If we reach here, the API key was invalid
84 | 		return c.json({ error: "Invalid API key" }, 401);
85 | 	}
86 |
87 | 	// Fall back to session-based auth
88 | 	const session = await auth(c.env).api.getSession({
89 | 		headers: c.req.raw.headers,
90 | 	});
91 |
92 | 	if (session?.user) {
93 | 		const user = await db(c.env)
94 | 			.select()
95 | 			.from(schema.user)
96 | 			.where(eq(schema.user.id, session.user.id))
97 | 			.get();
98 |
99 | 		if (user && (!user.lastKeyGeneratedAt || user.lastKeyGeneratedAt === null)) {
100 | 			// Update user with current timestamp if no lastKeyGeneratedAt
101 | 			const now = new Date();
102 | 			await db(c.env)
103 | 				.update(schema.user)
104 | 				.set({ lastKeyGeneratedAt: now })
105 | 				.where(eq(schema.user.id, user.id))
106 | 				.run();
107 | 			user.lastKeyGeneratedAt = now;
108 | 		}
109 |
110 | 		c.set("session", session.session || null);
111 | 		c.set("user", user || null);
112 | 	}
113 | 	await next();
114 | });
115 |
116 | export const authRouter = app
117 | 	.all("/api/auth/*", (c) => {
118 | 		const authHandler = auth(c.env).handler;
119 | 		return authHandler(c.req.raw);
120 | 	})
121 | 	.get("/signout", async (c) => {
122 | 		await auth(c.env).api.signOut({
123 | 			headers: c.req.raw.headers,
124 | 		});
125 | 		return c.redirect("/");
126 | 	})
127 | 	.get("/signin", async (c) => {
128 | 		const signinUrl = await auth(c.env).api.signInSocial({
129 | 			body: {
130 | 				provider: "github",
131 | 				callbackURL: "/",
132 | 			},
133 | 		});
134 |
135 | 		if (!signinUrl || !signinUrl.url) {
136 | 			return c.text("Failed to sign in", 500);
137 | 		}
138 |
139 | 		return c.redirect(signinUrl.url);
140 | 	})
141 | 	.post("/api/auth/token", async (c) => {
142 | 		const user = c.get("user");
143 | 		if (!user) {
144 | 			return c.json({ error: "Unauthorized" }, 401);
145 | 		}
146 |
147 | 		const lastKeyGeneratedAt = new Date().getTime();
148 | 		const token = await generateKey(user.id, String(lastKeyGeneratedAt), c.env.SECRET);
149 |
150 | 		return c.json({ token });
151 | 	});
```

src/index.tsx
```
1 | import { Hono } from "hono";
2 | import { authMiddleware, authRouter } from "./auth";
3 | import type { User, Session } from "./db/schema";
4 | import { paymentRouter } from "./payment/lemonsqueezy";
5 | import { apiRouter } from "./api";
6 | import { generateKey } from "./utils/key";
7 | import { Landing } from "./ui/landing";
8 |
9 | const app = new Hono<{
10 | 	Bindings: Env;
11 | 	Variables: {
12 | 		user: User;
13 | 		session: Session;
14 | 	};
15 | }>()
16 | 	.use(authMiddleware)
17 | 	// main (signup) route
18 | 	.route("/", authRouter)
19 | 	// webhook handler
20 | 	.route("/", paymentRouter)
21 | 	// api routes
22 | 	.route("/api", apiRouter)
23 | 	.get("/", async (c) => {
24 | 		const user = c.get("user");
25 |
26 | 		const apiKey = await generateKey(
27 | 			user?.id,
28 | 			String(user?.lastKeyGeneratedAt?.getTime()),
29 | 			c.env.SECRET
30 | 		);
31 |
32 | 		const subscriptionLink = `${c.env.LEMONSQUEEZY_CHECKOUT_LINK}?checkout[email]=${user?.email}`;
33 | 		const subscriptionStatus = user?.subscriptionId
34 | 			? "Premium"
35 | 			: `Free • <a href="${subscriptionLink}">Upgrade</a>`;
36 |
37 | 		return c.html(<Landing user={user} apiKey={apiKey} subscriptionLink={subscriptionLink} />);
38 | 	});
39 |
40 | export default app;
```

test/index.spec.ts
```
1 | import { env } from 'cloudflare:test';
2 | import { describe, it, expect } from 'vitest';
3 | import app from "../src"
4 | import { testClient } from 'hono/testing'
5 |
6 | describe('Authentication on /api routes', () => {
7 | 	it('should return 401 on protected routes', async () => {
8 | 		const client = testClient(app, env)
9 | 		const res = await client.api.$get()
10 |
11 |     expect(res.status).toBe(401)
12 | 	});
13 | });
```

drizzle/meta/0000_snapshot.json
```
1 | {
2 |   "version": "6",
3 |   "dialect": "sqlite",
4 |   "id": "15bcb89c-5ea5-4756-a34f-39d3ab222176",
5 |   "prevId": "00000000-0000-0000-0000-000000000000",
6 |   "tables": {
7 |     "account": {
8 |       "name": "account",
9 |       "columns": {
10 |         "id": {
11 |           "name": "id",
12 |           "type": "text",
13 |           "primaryKey": true,
14 |           "notNull": true,
15 |           "autoincrement": false
16 |         },
17 |         "userId": {
18 |           "name": "userId",
19 |           "type": "text",
20 |           "primaryKey": false,
21 |           "notNull": true,
22 |           "autoincrement": false
23 |         },
24 |         "accountId": {
25 |           "name": "accountId",
26 |           "type": "text",
27 |           "primaryKey": false,
28 |           "notNull": true,
29 |           "autoincrement": false
30 |         },
31 |         "providerId": {
32 |           "name": "providerId",
33 |           "type": "text",
34 |           "primaryKey": false,
35 |           "notNull": true,
36 |           "autoincrement": false
37 |         },
38 |         "accessToken": {
39 |           "name": "accessToken",
40 |           "type": "text",
41 |           "primaryKey": false,
42 |           "notNull": false,
43 |           "autoincrement": false
44 |         },
45 |         "refreshToken": {
46 |           "name": "refreshToken",
47 |           "type": "text",
48 |           "primaryKey": false,
49 |           "notNull": false,
50 |           "autoincrement": false
51 |         },
52 |         "accessTokenExpiresAt": {
53 |           "name": "accessTokenExpiresAt",
54 |           "type": "integer",
55 |           "primaryKey": false,
56 |           "notNull": false,
57 |           "autoincrement": false
58 |         },
59 |         "refreshTokenExpiresAt": {
60 |           "name": "refreshTokenExpiresAt",
61 |           "type": "integer",
62 |           "primaryKey": false,
63 |           "notNull": false,
64 |           "autoincrement": false
65 |         },
66 |         "scope": {
67 |           "name": "scope",
68 |           "type": "text",
69 |           "primaryKey": false,
70 |           "notNull": false,
71 |           "autoincrement": false
72 |         },
73 |         "idToken": {
74 |           "name": "idToken",
75 |           "type": "text",
76 |           "primaryKey": false,
77 |           "notNull": false,
78 |           "autoincrement": false
79 |         },
80 |         "password": {
81 |           "name": "password",
82 |           "type": "text",
83 |           "primaryKey": false,
84 |           "notNull": false,
85 |           "autoincrement": false
86 |         },
87 |         "createdAt": {
88 |           "name": "createdAt",
89 |           "type": "integer",
90 |           "primaryKey": false,
91 |           "notNull": true,
92 |           "autoincrement": false
93 |         },
94 |         "updatedAt": {
95 |           "name": "updatedAt",
96 |           "type": "integer",
97 |           "primaryKey": false,
98 |           "notNull": true,
99 |           "autoincrement": false
100 |         }
101 |       },
102 |       "indexes": {},
103 |       "foreignKeys": {
104 |         "account_userId_user_id_fk": {
105 |           "name": "account_userId_user_id_fk",
106 |           "tableFrom": "account",
107 |           "tableTo": "user",
108 |           "columnsFrom": [
109 |             "userId"
110 |           ],
111 |           "columnsTo": [
112 |             "id"
113 |           ],
114 |           "onDelete": "no action",
115 |           "onUpdate": "no action"
116 |         }
117 |       },
118 |       "compositePrimaryKeys": {},
119 |       "uniqueConstraints": {},
120 |       "checkConstraints": {}
121 |     },
122 |     "rateLimit": {
123 |       "name": "rateLimit",
124 |       "columns": {
125 |         "id": {
126 |           "name": "id",
127 |           "type": "text",
128 |           "primaryKey": true,
129 |           "notNull": true,
130 |           "autoincrement": false
131 |         },
132 |         "userId": {
133 |           "name": "userId",
134 |           "type": "text",
135 |           "primaryKey": false,
136 |           "notNull": true,
137 |           "autoincrement": false
138 |         },
139 |         "endpoint": {
140 |           "name": "endpoint",
141 |           "type": "text",
142 |           "primaryKey": false,
143 |           "notNull": true,
144 |           "autoincrement": false
145 |         },
146 |         "count": {
147 |           "name": "count",
148 |           "type": "integer",
149 |           "primaryKey": false,
150 |           "notNull": true,
151 |           "autoincrement": false,
152 |           "default": 0
153 |         },
154 |         "resetAt": {
155 |           "name": "resetAt",
156 |           "type": "integer",
157 |           "primaryKey": false,
158 |           "notNull": true,
159 |           "autoincrement": false
160 |         },
161 |         "createdAt": {
162 |           "name": "createdAt",
163 |           "type": "integer",
164 |           "primaryKey": false,
165 |           "notNull": true,
166 |           "autoincrement": false
167 |         },
168 |         "updatedAt": {
169 |           "name": "updatedAt",
170 |           "type": "integer",
171 |           "primaryKey": false,
172 |           "notNull": true,
173 |           "autoincrement": false
174 |         }
175 |       },
176 |       "indexes": {},
177 |       "foreignKeys": {
178 |         "rateLimit_userId_user_id_fk": {
179 |           "name": "rateLimit_userId_user_id_fk",
180 |           "tableFrom": "rateLimit",
181 |           "tableTo": "user",
182 |           "columnsFrom": [
183 |             "userId"
184 |           ],
185 |           "columnsTo": [
186 |             "id"
187 |           ],
188 |           "onDelete": "no action",
189 |           "onUpdate": "no action"
190 |         }
191 |       },
192 |       "compositePrimaryKeys": {},
193 |       "uniqueConstraints": {},
194 |       "checkConstraints": {}
195 |     },
196 |     "session": {
197 |       "name": "session",
198 |       "columns": {
199 |         "id": {
200 |           "name": "id",
201 |           "type": "text",
202 |           "primaryKey": true,
203 |           "notNull": true,
204 |           "autoincrement": false
205 |         },
206 |         "userId": {
207 |           "name": "userId",
208 |           "type": "text",
209 |           "primaryKey": false,
210 |           "notNull": true,
211 |           "autoincrement": false
212 |         },
213 |         "token": {
214 |           "name": "token",
215 |           "type": "text",
216 |           "primaryKey": false,
217 |           "notNull": true,
218 |           "autoincrement": false
219 |         },
220 |         "expiresAt": {
221 |           "name": "expiresAt",
222 |           "type": "integer",
223 |           "primaryKey": false,
224 |           "notNull": true,
225 |           "autoincrement": false
226 |         },
227 |         "ipAddress": {
228 |           "name": "ipAddress",
229 |           "type": "text",
230 |           "primaryKey": false,
231 |           "notNull": false,
232 |           "autoincrement": false
233 |         },
234 |         "userAgent": {
235 |           "name": "userAgent",
236 |           "type": "text",
237 |           "primaryKey": false,
238 |           "notNull": false,
239 |           "autoincrement": false
240 |         },
241 |         "createdAt": {
242 |           "name": "createdAt",
243 |           "type": "integer",
244 |           "primaryKey": false,
245 |           "notNull": true,
246 |           "autoincrement": false
247 |         },
248 |         "updatedAt": {
249 |           "name": "updatedAt",
250 |           "type": "integer",
251 |           "primaryKey": false,
252 |           "notNull": true,
253 |           "autoincrement": false
254 |         }
255 |       },
256 |       "indexes": {},
257 |       "foreignKeys": {
258 |         "session_userId_user_id_fk": {
259 |           "name": "session_userId_user_id_fk",
260 |           "tableFrom": "session",
261 |           "tableTo": "user",
262 |           "columnsFrom": [
263 |             "userId"
264 |           ],
265 |           "columnsTo": [
266 |             "id"
267 |           ],
268 |           "onDelete": "no action",
269 |           "onUpdate": "no action"
270 |         }
271 |       },
272 |       "compositePrimaryKeys": {},
273 |       "uniqueConstraints": {},
274 |       "checkConstraints": {}
275 |     },
276 |     "user": {
277 |       "name": "user",
278 |       "columns": {
279 |         "id": {
280 |           "name": "id",
281 |           "type": "text",
282 |           "primaryKey": true,
283 |           "notNull": true,
284 |           "autoincrement": false
285 |         },
286 |         "name": {
287 |           "name": "name",
288 |           "type": "text",
289 |           "primaryKey": false,
290 |           "notNull": true,
291 |           "autoincrement": false
292 |         },
293 |         "email": {
294 |           "name": "email",
295 |           "type": "text",
296 |           "primaryKey": false,
297 |           "notNull": true,
298 |           "autoincrement": false
299 |         },
300 |         "emailVerified": {
301 |           "name": "emailVerified",
302 |           "type": "integer",
303 |           "primaryKey": false,
304 |           "notNull": true,
305 |           "autoincrement": false,
306 |           "default": false
307 |         },
308 |         "image": {
309 |           "name": "image",
310 |           "type": "text",
311 |           "primaryKey": false,
312 |           "notNull": false,
313 |           "autoincrement": false
314 |         },
315 |         "createdAt": {
316 |           "name": "createdAt",
317 |           "type": "integer",
318 |           "primaryKey": false,
319 |           "notNull": true,
320 |           "autoincrement": false
321 |         },
322 |         "updatedAt": {
323 |           "name": "updatedAt",
324 |           "type": "integer",
325 |           "primaryKey": false,
326 |           "notNull": true,
327 |           "autoincrement": false
328 |         },
329 |         "subscriptionId": {
330 |           "name": "subscriptionId",
331 |           "type": "text",
332 |           "primaryKey": false,
333 |           "notNull": false,
334 |           "autoincrement": false
335 |         },
336 |         "lastKeyGeneratedAt": {
337 |           "name": "lastKeyGeneratedAt",
338 |           "type": "integer",
339 |           "primaryKey": false,
340 |           "notNull": false,
341 |           "autoincrement": false
342 |         }
343 |       },
344 |       "indexes": {
345 |         "user_email_unique": {
346 |           "name": "user_email_unique",
347 |           "columns": [
348 |             "email"
349 |           ],
350 |           "isUnique": true
351 |         }
352 |       },
353 |       "foreignKeys": {},
354 |       "compositePrimaryKeys": {},
355 |       "uniqueConstraints": {},
356 |       "checkConstraints": {}
357 |     },
358 |     "verification": {
359 |       "name": "verification",
360 |       "columns": {
361 |         "id": {
362 |           "name": "id",
363 |           "type": "text",
364 |           "primaryKey": true,
365 |           "notNull": true,
366 |           "autoincrement": false
367 |         },
368 |         "identifier": {
369 |           "name": "identifier",
370 |           "type": "text",
371 |           "primaryKey": false,
372 |           "notNull": true,
373 |           "autoincrement": false
374 |         },
375 |         "value": {
376 |           "name": "value",
377 |           "type": "text",
378 |           "primaryKey": false,
379 |           "notNull": true,
380 |           "autoincrement": false
381 |         },
382 |         "expiresAt": {
383 |           "name": "expiresAt",
384 |           "type": "integer",
385 |           "primaryKey": false,
386 |           "notNull": true,
387 |           "autoincrement": false
388 |         },
389 |         "createdAt": {
390 |           "name": "createdAt",
391 |           "type": "integer",
392 |           "primaryKey": false,
393 |           "notNull": true,
394 |           "autoincrement": false
395 |         },
396 |         "updatedAt": {
397 |           "name": "updatedAt",
398 |           "type": "integer",
399 |           "primaryKey": false,
400 |           "notNull": true,
401 |           "autoincrement": false
402 |         }
403 |       },
404 |       "indexes": {},
405 |       "foreignKeys": {},
406 |       "compositePrimaryKeys": {},
407 |       "uniqueConstraints": {},
408 |       "checkConstraints": {}
409 |     }
410 |   },
411 |   "views": {},
412 |   "enums": {},
413 |   "_meta": {
414 |     "schemas": {},
415 |     "tables": {},
416 |     "columns": {}
417 |   },
418 |   "internal": {
419 |     "indexes": {}
420 |   }
421 | }
```

drizzle/meta/_journal.json
```
1 | {
2 |   "version": "7",
3 |   "dialect": "sqlite",
4 |   "entries": [
5 |     {
6 |       "idx": 0,
7 |       "version": "6",
8 |       "when": 1737744579019,
9 |       "tag": "0000_crazy_zuras",
10 |       "breakpoints": true
11 |     }
12 |   ]
13 | }
```

src/db/schema.ts
```
1 | import { sql } from "drizzle-orm";
2 | import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
3 |
4 | export const user = sqliteTable("user", {
5 |   id: text("id").primaryKey(),
6 |   name: text("name").notNull(),
7 |   email: text("email").notNull().unique(),
8 |   emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
9 |   image: text("image"),
10 |   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
11 |   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
12 |   subscriptionId: text("subscriptionId"),
13 |   lastKeyGeneratedAt: integer("lastKeyGeneratedAt", { mode: "timestamp" }),
14 |   });
15 |
16 | export const session = sqliteTable("session", {
17 |   id: text("id").primaryKey(),
18 |   userId: text("userId").notNull().references(() => user.id),
19 |   token: text("token").notNull(),
20 |   expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
21 |   ipAddress: text("ipAddress"),
22 |   userAgent: text("userAgent"),
23 |   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
24 |   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
25 | });
26 |
27 | export const account = sqliteTable("account", {
28 |   id: text("id").primaryKey(),
29 |   userId: text("userId").notNull().references(() => user.id),
30 |   accountId: text("accountId").notNull(),
31 |   providerId: text("providerId").notNull(),
32 |   accessToken: text("accessToken"),
33 |   refreshToken: text("refreshToken"),
34 |   accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
35 |   refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
36 |   scope: text("scope"),
37 |   idToken: text("idToken"),
38 |   password: text("password"),
39 |   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
40 |   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
41 | });
42 |
43 | export const verification = sqliteTable("verification", {
44 |   id: text("id").primaryKey(),
45 |   identifier: text("identifier").notNull(),
46 |   value: text("value").notNull(),
47 |   expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
48 |   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
49 |   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
50 | });
51 |
52 | export const rateLimit = sqliteTable("rateLimit", {
53 |   id: text("id").primaryKey(),
54 |   userId: text("userId").notNull().references(() => user.id),
55 |   endpoint: text("endpoint").notNull(),
56 |   count: integer("count").notNull().default(0),
57 |   resetAt: integer("resetAt", { mode: "timestamp" }).notNull(),
58 |   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
59 |   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
60 | });
61 |
62 | export type User = typeof user.$inferSelect;
63 | export type Session = typeof session.$inferSelect;
64 | export type Account = typeof account.$inferSelect;
65 | export type Verification = typeof verification.$inferSelect;
66 | export type RateLimit = typeof rateLimit.$inferSelect;
```

src/middleware/rateLimit.ts
```
1 | import type { Context, MiddlewareHandler, Next } from "hono";
2 | import { HTTPException } from "hono/http-exception";
3 | import { db } from "../auth";
4 | import { rateLimit, user } from "../db/schema";
5 | import { and, eq, gt } from "drizzle-orm";
6 | import type { User, Session } from "../db/schema";
7 |
8 | export interface RateLimitConfig {
9 |   // Requests per window
10 |   limit: number;
11 |   // Window size in seconds
12 |   window: number;
13 | }
14 |
15 | export const ratelimiter = async (c: Context<{
16 |     Bindings: Env,
17 |     Variables: {
18 |         user: User,
19 |         session: Session
20 |     }
21 | }>, next: Next) => {
22 | 	const rateLimiter = createRateLimiter(
23 | 		async (user) => await getTierLimit(user)
24 | 	);
25 | 	return rateLimiter(c, next);
26 | }
27 |
28 | export const getTierLimit = async (user: User) => {
29 | 	if (!user?.subscriptionId) {
30 | 		return { limit: 100, window: 60 * 60 }; // Free tier
31 | 	}
32 | 	return { limit: 1000, window: 60 * 60 }; // Paid tier
33 | };
34 |
35 | // Default tier limits: You can disable this if you want.
36 | const DEFAULT_LIMIT: RateLimitConfig = { limit: 10, window: 60 * 60 }
37 |
38 | export const createRateLimiter = <T extends { id: string }>(
39 |   getTierLimit: (user: User) => Promise<RateLimitConfig | undefined>
40 | ): MiddlewareHandler<{
41 |   Bindings: Env;
42 |   Variables: {
43 |     user: User,
44 |     session: Session
45 |   };
46 | }> => {
47 |   return async (c, next) => {
48 |     const user = c.get("user");
49 |     if (!user || c.req.path === "/") {
50 |       await next();
51 |       return;
52 |     }
53 |
54 |     const endpoint = new URL(c.req.url).pathname;
55 |     const now = new Date();
56 |
57 |     // Get user's tier limit
58 |     const tierLimit = (await getTierLimit(user)) ?? DEFAULT_LIMIT;
59 |
60 |     // Check existing rate limit
61 |     const existing = await db(c.env)
62 |       .select()
63 |       .from(rateLimit)
64 |       .where(
65 |         and(
66 |           eq(rateLimit.userId, user.id),
67 |           eq(rateLimit.endpoint, endpoint),
68 |           gt(rateLimit.resetAt, now)
69 |         )
70 |       )
71 |       .get();
72 |
73 |     if (!existing) {
74 |       // Create new rate limit entry
75 |       const resetAt = new Date(now.getTime() + tierLimit.window * 1000);
76 |       await db(c.env)
77 |         .insert(rateLimit)
78 |         .values({
79 |           id: crypto.randomUUID(),
80 |           userId: user.id,
81 |           endpoint,
82 |           count: 1,
83 |           resetAt,
84 |           createdAt: now,
85 |           updatedAt: now,
86 |         });
87 |     } else if (existing.count >= tierLimit.limit) {
88 |       // Rate limit exceeded
89 |       throw new HTTPException(429, {
90 |         message: `Rate limit exceeded ${JSON.stringify(tierLimit)}, existing: ${JSON.stringify(existing)}`,
91 |       });
92 |     } else {
93 |       // Update count
94 |       await db(c.env)
95 |         .update(rateLimit)
96 |         .set({
97 |           count: existing.count + 1,
98 |           updatedAt: now,
99 |         })
100 |         .where(eq(rateLimit.id, existing.id));
101 |     }
102 |
103 |     // Set rate limit headers
104 |     if (existing) {
105 |       c.header("X-RateLimit-Limit", tierLimit.limit.toString());
106 |       c.header("X-RateLimit-Remaining", (tierLimit.limit - existing.count - 1).toString());
107 |       c.header(
108 |         "X-RateLimit-Reset",
109 |         Math.floor(existing.resetAt.getTime() / 1000).toString()
110 |       );
111 |     }
112 |
113 |     await next();
114 |   };
115 | };
```

src/payment/lemonsqueezy.ts
```
1 | import { Hono } from "hono"
2 | import { user } from "../db/schema"
3 | import { db } from "../auth"
4 | import { eq } from "drizzle-orm"
5 |
6 | import type{ Subscription, WebhookPayload, DiscriminatedWebhookPayload } from "./types"
7 | import type { User, Session } from "../db/schema";
8 |
9 | export const paymentRouter = new Hono<{ Bindings: Env, Variables: {
10 |     user: User,
11 |     session: Session
12 | } }>()
13 |
14 | const SUPPORTED_EVENTS = [
15 |     'subscription_created',
16 |     'subscription_updated',
17 |     'subscription_cancelled',
18 |     'subscription_expired'
19 | ]
20 |
21 | const verifySignature = async (secret: string, signature: string, body: string) => {
22 |     const encoder = new TextEncoder();
23 |
24 |     const key = await crypto.subtle.importKey(
25 |       'raw',
26 |       encoder.encode(secret),
27 |       { name: 'HMAC', hash: 'SHA-256' },
28 |       false,
29 |       ['sign', 'verify']
30 |     );
31 |
32 |     const hmac = await crypto.subtle.sign(
33 |       'HMAC',
34 |       key,
35 |       encoder.encode(body)
36 |     );
37 |
38 |     const expectedSignature = Array.from(new Uint8Array(hmac))
39 |       .map(b => b.toString(16).padStart(2, '0'))
40 |       .join('');
41 |
42 |       if (signature !== expectedSignature) {
43 |         return false
44 |       }
45 |
46 |       return true
47 | }
48 |
49 | const updateUserSubscription = async (env: Env, userId: string, subscriptionId: string | null) => {
50 |     await db(env).update(user)
51 |         .set({ subscriptionId })
52 |         .where(eq(user.id, userId))
53 | }
54 |
55 | paymentRouter.post("/webhook", async (c) => {
56 |     if (c.req.method !== "POST") {
57 |         return c.json({ error: "Method not allowed" }, 405)
58 |     }
59 |
60 |     const secret = c.env.SECRET
61 |     const signature = c.req.header("x-signature")
62 |
63 |
64 |     if (!signature || !secret) {
65 |         return c.json({ error: "Unauthorized" }, 401)
66 |     }
67 |
68 |     const body = await c.req.text()
69 |
70 |     const isValid = await verifySignature(secret, signature, body)
71 |
72 |     if (!isValid) {
73 |         return c.json({ error: "Unauthorized" }, 401)
74 |     }
75 |
76 |     const payload = JSON.parse(body) as DiscriminatedWebhookPayload<{email: string}>
77 |     const { event_name: eventName } = payload.meta
78 |
79 |
80 |     if (!SUPPORTED_EVENTS.includes(eventName)) {
81 |         return c.json({ error: "Event not supported" }, 400)
82 |     }
83 |
84 |     if (!payload.data.attributes.user_email) {
85 |         return c.json({ error: "Email not found" }, 400)
86 |     }
87 |
88 |     const users = await db(c.env)
89 |         .select()
90 |         .from(user)
91 |         .where(eq(user.email, payload.data.attributes.user_email))
92 |
93 |     if (!users.length) {
94 |         return c.json({ error: "User not found" }, 404)
95 |     }
96 |
97 |     const isSubscriptionActive = ['subscription_created', 'subscription_updated'].includes(eventName)
98 |     await updateUserSubscription(
99 |         c.env,
100 |         users[0].id,
101 |         isSubscriptionActive ? payload.data.id : null
102 |     )
103 |
104 |     console.log('Webhook processed successfully')
105 |     return c.json({ message: "Webhook received" }, 200)
106 | })
```

src/payment/types.ts
```
1 | // Source: https://github.com/remorses/lemonsqueezy-webhooks
2 |
3 | type SubscriptionEventNames =
4 |     | 'subscription_created'
5 |     | 'subscription_cancelled'
6 |     | 'subscription_resumed'
7 |     | 'subscription_updated'
8 |     | 'subscription_expired'
9 |     | 'subscription_paused'
10 |     | 'subscription_unpaused'
11 |
12 | type SubscriptionInvoiceEventNames =
13 |     | 'subscription_payment_success'
14 |     | 'subscription_payment_failed'
15 |     | 'subscription_payment_recovered'
16 |
17 | type OrderEventNames = 'order_created' | 'order_refunded'
18 |
19 | type LicenseKeyEventNames = 'license_key_created'
20 |
21 | export type WebhookPayload<CustomData = unknown> = {
22 |     meta: {
23 |         event_name:
24 |             | SubscriptionEventNames
25 |             | SubscriptionInvoiceEventNames
26 |             | OrderEventNames
27 |             | LicenseKeyEventNames
28 |         custom_data?: CustomData
29 |     }
30 |     data: Subscription | SubscriptionInvoice | Order | LicenseKey
31 | }
32 |
33 | // augmented type to make TypeScript discriminated unions work: https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions
34 | export type DiscriminatedWebhookPayload<CustomData = unknown> =
35 |     | {
36 |           event_name: SubscriptionEventNames
37 |           meta: {
38 |               event_name: SubscriptionEventNames
39 |
40 |               custom_data: CustomData
41 |           }
42 |           data: Subscription
43 |       }
44 |     // | {
45 |     //       event_name: SubscriptionInvoiceEventNames
46 |     //       meta: {
47 |     //           event_name: SubscriptionInvoiceEventNames
48 |     //           custom_data: CustomData
49 |     //       }
50 |     //       data: SubscriptionInvoice
51 |     //   }
52 |     // | {
53 |     //       event_name: OrderEventNames
54 |     //       meta: { event_name: OrderEventNames; custom_data: CustomData }
55 |     //       data: Order
56 |     //   }
57 |     // | {
58 |     //       event_name: LicenseKeyEventNames
59 |     //       meta: { event_name: LicenseKeyEventNames; custom_data: CustomData }
60 |     //       data: LicenseKey
61 |     //   }
62 |
63 | export type EventName = WebhookPayload['meta']['event_name']
64 |
65 | export type SubscriptionInvoice = {
66 |     type: 'subscription-invoices'
67 |     id: string
68 |     attributes: {
69 |         store_id: number
70 |         subscription_id: number
71 |         billing_reason: string
72 |         card_brand: string
73 |         card_last_four: string
74 |         currency: string
75 |         currency_rate: string
76 |         subtotal: number
77 |         discount_total: number
78 |         tax: number
79 |         total: number
80 |         subtotal_usd: number
81 |         discount_total_usd: number
82 |         tax_usd: number
83 |         total_usd: number
84 |         status: string
85 |         status_formatted: string
86 |         refunded: number
87 |         refunded_at: string | null
88 |         subtotal_formatted: string
89 |         discount_total_formatted: string
90 |         tax_formatted: string
91 |         total_formatted: string
92 |         urls: {
93 |             invoice_url: string
94 |         }
95 |         created_at: string
96 |         updated_at: string
97 |         test_mode: boolean
98 |     }
99 |     relationships: {
100 |         store: {
101 |             links: {
102 |                 related: string
103 |                 self: string
104 |             }
105 |         }
106 |         subscription: {
107 |             links: {
108 |                 related: string
109 |                 self: string
110 |             }
111 |         }
112 |     }
113 |     links: {
114 |         self: string
115 |     }
116 | }
117 |
118 | export type Subscription = {
119 |     type: 'subscriptions'
120 |     id: string
121 |     attributes: {
122 |         store_id: number
123 |         order_id: number
124 |         customer_id: number
125 |         order_item_id: number
126 |         product_id: number
127 |         variant_id: number
128 |         product_name: string
129 |         variant_name: string
130 |         user_name: string
131 |         user_email: string
132 |         status: SubscriptionStatus
133 |         status_formatted: string
134 |         pause: null
135 |         cancelled: boolean
136 |         trial_ends_at: string | null
137 |         billing_anchor: number
138 |         urls: {
139 |             update_payment_method: string
140 |         }
141 |         renews_at: string
142 |         /**
143 |          * If the subscription has as status of cancelled or expired, this will be an ISO-8601 formatted date-time string indicating when the subscription expires (or expired). For all other status values, this will be null.
144 |          */
145 |         ends_at: string | null
146 |         created_at: string
147 |         updated_at: string
148 |         test_mode: boolean
149 |     }
150 | }
151 |
152 | export type Order = {
153 |     type: 'orders'
154 |     id: string
155 |     attributes: {
156 |         store_id: number
157 |         identifier: string
158 |         customer_id: number
159 |         order_number: number
160 |         user_name: string
161 |         user_email: string
162 |         currency: string
163 |         currency_rate: string
164 |         subtotal: number
165 |         discount_total: number
166 |         tax: number
167 |         total: number
168 |         subtotal_usd: number
169 |         discount_total_usd: number
170 |         tax_usd: number
171 |         total_usd: number
172 |         tax_name: string
173 |         tax_rate: string
174 |         status: string
175 |         status_formatted: string
176 |         refunded: number
177 |         refunded_at: string | null
178 |         subtotal_formatted: string
179 |         discount_total_formatted: string
180 |         tax_formatted: string
181 |         total_formatted: string
182 |         first_order_item: {
183 |             id: number
184 |             order_id: number
185 |             product_id: number
186 |             variant_id: number
187 |             product_name: string
188 |             variant_name: string
189 |             price: number
190 |             created_at: string
191 |             updated_at: string
192 |             test_mode: boolean
193 |         }
194 |         created_at: string
195 |         updated_at: string
196 |     }
197 | }
198 |
199 | export type LicenseKey = {
200 |     type: 'license-keys'
201 |     id: string
202 |     attributes: {
203 |         store_id: number
204 |         order_id: number
205 |         order_item_id: number
206 |         product_id: number
207 |         user_name: string
208 |         user_email: string
209 |         key: string
210 |         key_short: string
211 |         activation_limit: number
212 |         instances_count: number
213 |         disabled: number
214 |         status: string
215 |         status_formatted: string
216 |         expires_at: string | null
217 |         created_at: string
218 |         updated_at: string
219 |     }
220 | }
221 |
222 | type SubscriptionStatus =
223 |     | 'on_trial'
224 |     | 'active'
225 |     | 'paused'
226 |     | 'past_due'
227 |     | 'unpaid'
228 |     | 'cancelled'
229 |     | 'expired'
```

src/ui/landing.tsx
```
1 | import type { FC } from "hono/jsx";
2 | import type { User } from "../db/schema";
3 |
4 | const styles = {
5 |   container: {
6 |     padding: "40px",
7 |     fontFamily: "system-ui, sans-serif",
8 |     maxWidth: "800px",
9 |     margin: "0 auto"
10 |   },
11 |   title: {
12 |     color: "#f97316",
13 |     fontSize: "2.5rem",
14 |     fontWeight: "bold",
15 |     marginBottom: "20px"
16 |   },
17 |   subtitle: {
18 |     fontSize: "1.2rem",
19 |     marginBottom: "20px"
20 |   },
21 |   featureList: {
22 |     listStyle: "none",
23 |     padding: 0
24 |   },
25 |   featureItem: {
26 |     marginBottom: "10px",
27 |     display: "flex",
28 |     alignItems: "center"
29 |   },
30 |   checkmark: {
31 |     color: "#f97316",
32 |     marginRight: "10px"
33 |   },
34 |   link: {
35 |     textDecoration: "none",
36 |     fontWeight: "semibold"
37 |   },
38 |   button: {
39 |     color: "#f97316",
40 |     textDecoration: "none",
41 |     fontWeight: "bold",
42 |     fontSize: "1.1rem",
43 |     padding: "10px 20px",
44 |     border: "2px solid #f97316",
45 |     borderRadius: "6px",
46 |     display: "inline-block"
47 |   },
48 |   apiKeyBox: {
49 |     fontFamily: "monospace",
50 |     padding: "16px",
51 |     background: "#fff7ed",
52 |     borderRadius: "8px",
53 |     marginBottom: "20px",
54 |     border: "2px solid #f97316"
55 |   },
56 |   githubIcon: {
57 |     width: "20px",
58 |     height: "20px",
59 |     marginRight: "8px",
60 |     verticalAlign: "middle"
61 |   }
62 | };
63 |
64 | const features = [
65 |   { text: "API Keys" },
66 |   { text: "Rate Limiting" },
67 |   { text: "Authentication with", link: { text: "better-auth", url: "https://www.better-auth.com/" } },
68 |   { text: "Database with", link: { text: "Drizzle", url: "https://drizzle.team" }, extra: { text: "D1", url: "https://developers.cloudflare.com/d1" } },
69 |   { text: "Subscriptions with", link: { text: "Lemonsqueezy", url: "https://lemonsqueezy.com" } },
70 |   { text: "", link: { text: "Integration tests", url: "https://vitest.dev" } }
71 | ];
72 |
73 | export const Landing: FC<{
74 |   user?: User;
75 |   apiKey?: string;
76 |   subscriptionLink?: string;
77 | }> = ({ user, apiKey, subscriptionLink }) => {
78 |   if (!user) {
79 |     return (
80 |       <div style={styles.container}>
81 |         <h1 style={styles.title}>⚡️ Backend API Kit</h1>
82 |         <p style={styles.subtitle}>
83 |           Easily create scalable, monetisable backend APIs with Hono + Cloudflare workers
84 |         </p>
85 |         <div style={{ marginBottom: "30px" }}>
86 |           <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Features:</h2>
87 |           <ul style={styles.featureList}>
88 |             {features.map((feature, i) => (
89 |               <li key={`${i}-${feature.text}`} style={styles.featureItem}>
90 |                 <span style={styles.checkmark}>✓</span>
91 |                 {feature.text}
92 |                 {feature.link && (
93 |                   <>&nbsp;<a href={feature.link.url} style={styles.link}>{feature.link.text}</a></>
94 |                 )}
95 |                 {feature.extra && (
96 |                   <>&nbsp;+&nbsp;<a href={feature.extra.url} style={styles.link}>{feature.extra.text}</a></>
97 |                 )}
98 |               </li>
99 |             ))}
100 |           </ul>
101 |         </div>
102 |         <div style={{ display: "flex", gap: "12px" }}>
103 |           <a href="/signin" style={styles.button}>(demo) Sign in</a>
104 |           <a href="https://github.com/dhravya/backend-api-kit" style={{
105 |             ...styles.button,
106 |             display: "flex",
107 |             alignItems: "center",
108 |             gap: "8px",
109 |             // black text & borders
110 |             borderColor: "#000",
111 |             color: "#000"
112 |           }}>
113 |             {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
114 |             <svg aria-label="Github icon" alt="Github icon" style={styles.githubIcon} viewBox="0 0 256 250"  xmlns="http://www.w3.org/2000/svg">
115 |               <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z"/>
116 |             </svg>
117 |             GitHub
118 |           </a>
119 |         </div>
120 |       </div>
121 |     );
122 |   }
123 |
124 |   return (
125 |     <div style={styles.container}>
126 |       <h1 style={styles.title}>Backend API Kit</h1>
127 |       <div style={styles.subtitle}>
128 |         Welcome <span style={{ fontWeight: "bold", color: "#f97316" }}>{user.name}</span>!
129 |       </div>
130 |       <div style={{ marginBottom: "20px" }}>
131 |         {user.email} • {user.subscriptionId ? (
132 |           <span style={{ color: "#f97316", fontWeight: "bold" }}>Premium</span>
133 |         ) : (
134 |           <>
135 |             <span style={{ color: "#6b7280" }}>Free</span> • <a href={subscriptionLink} style={{ color: "#f97316", textDecoration: "none", fontWeight: "bold" }}>&nbsp;Upgrade&nbsp;</a>
136 |           </>
137 |         )}
138 |       </div>
139 |       {apiKey && (
140 |         <div style={styles.apiKeyBox}>
141 |           <div style={{ color: "#666", marginBottom: "8px" }}>Your API Key:</div>
142 |           <div style={{ color: "#f97316", fontWeight: "bold", wordBreak: "break-all" }}>{apiKey}</div>
143 |         </div>
144 |       )}
145 |       <div style={{ marginTop: "40px" }}>
146 |         <a href="/signout" style={styles.button}>Sign out</a>
147 |       </div>
148 |     </div>
149 |   );
150 | };
```

src/utils/cipher.ts
```
1 | async function encrypt(data: string, key: string): Promise<string> {
2 | 	try {
3 | 		const encoder = new TextEncoder();
4 | 		const encodedData = encoder.encode(data);
5 |
6 | 		// Hash the key to ensure it's exactly 16 bytes (128 bits)
7 | 		const keyHash = await crypto.subtle.digest("SHA-256", encoder.encode(key));
8 | 		const keyBytes = new Uint8Array(keyHash).slice(0, 16);
9 |
10 | 		const baseForIv = encoder.encode(data + key);
11 | 		const ivHash = await crypto.subtle.digest("SHA-256", baseForIv);
12 | 		const iv = new Uint8Array(ivHash).slice(0, 12);
13 |
14 | 		const cryptoKey = await crypto.subtle.importKey(
15 | 			"raw",
16 | 			keyBytes,
17 | 			{ name: "AES-GCM", length: 128 }, // Changed to 128 bit key
18 | 			false,
19 | 			["encrypt", "decrypt"],
20 | 		);
21 |
22 | 		const encrypted = await crypto.subtle.encrypt(
23 | 			{ name: "AES-GCM", iv: new Uint8Array(iv).buffer as ArrayBuffer },
24 | 			cryptoKey,
25 | 			encodedData,
26 | 		);
27 |
28 | 		const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
29 |
30 | 		// Convert to base64 safely
31 | 		const base64 = Buffer.from(combined).toString("base64");
32 |
33 | 		// Make URL-safe
34 | 		return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
35 | 	} catch (err) {
36 | 		console.error("Encryption error:", err);
37 | 		throw err;
38 | 	}
39 | }
40 |
41 | async function decrypt(encryptedData: string, key: string): Promise<string> {
42 | 	try {
43 | 		// Restore base64 padding and convert URL-safe chars
44 | 		const base64 = encryptedData
45 | 			.replace(/-/g, "+")
46 | 			.replace(/_/g, "/")
47 | 			.padEnd(
48 | 				encryptedData.length + ((4 - (encryptedData.length % 4)) % 4),
49 | 				"=",
50 | 			);
51 |
52 | 		// Use Buffer for safer base64 decoding
53 | 		const combined = Buffer.from(base64, "base64");
54 | 		const combinedArray = new Uint8Array(combined);
55 |
56 | 		// Extract the IV that was used for encryption
57 | 		const iv = combinedArray.slice(0, 12);
58 | 		const encrypted = combinedArray.slice(12);
59 |
60 | 		// Hash the key to ensure it's exactly 16 bytes (128 bits)
61 | 		const keyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
62 | 		const keyBytes = new Uint8Array(keyHash).slice(0, 16);
63 |
64 | 		// Import the same key used for encryption
65 | 		const cryptoKey = await crypto.subtle.importKey(
66 | 			"raw",
67 | 			keyBytes,
68 | 			{ name: "AES-GCM", length: 128 }, // Changed to 128 bit key
69 | 			false,
70 | 			["encrypt", "decrypt"],
71 | 		);
72 |
73 | 		// Use the extracted IV and key to decrypt
74 | 		const decrypted = await crypto.subtle.decrypt(
75 | 			{ name: "AES-GCM", iv: new Uint8Array(iv).buffer as ArrayBuffer },
76 | 			cryptoKey,
77 | 			encrypted.buffer as ArrayBuffer,
78 | 		);
79 |
80 | 		return new TextDecoder().decode(decrypted);
81 | 	} catch (err) {
82 | 		console.error("Decryption error:", err);
83 | 		throw err;
84 | 	}
85 | }
86 |
87 | export { encrypt, decrypt };
```

src/utils/key.ts
```
1 | import { decrypt, encrypt } from "./cipher"
2 |
3 | export const generateKey =  async (userId: string, lastKeyGeneratedAt: string, secret: string) => {
4 |     return await encrypt(`${userId}--${lastKeyGeneratedAt}`, secret)
5 | }
6 |
7 | export const decryptKey = async (key: string, secret: string) => {
8 |     const decrypted = await decrypt(key, secret)
9 |
10 |     return decrypted.split("--")
11 | }
```
