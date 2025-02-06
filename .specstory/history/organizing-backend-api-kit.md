## SpecStory

## Organizing Backend API Kit (26/01/2025, 15:17:39)

_**User**_

@backend-api-kit.md is quite large for an llm so slice it into managable files and place them in a folder named backend-api-kit and place this folder in the @Schema-builder-Greece 

---

_**Assistant**_

I'll help you split the backend-api-kit.md into smaller, logical files and organize them in the appropriate folder structure. First, let me create the necessary files.

---

_****_



---

_****_



I'll split the content into logical files and create them in the appropriate directory structure. Let me create the files:

1. First, I'll create the main README.md and project structure files
2. Then create the documentation files
3. Finally, create the source code files

---

_****_

```diff
- 
+ # Backend API Kit
+ 
+ A scalable, monetizable backend API starter kit built with Hono + Cloudflare workers.
+ 
+ ## Features
+ 
+ - API Keys
+ - Rate Limiting
+ - Authentication with [better-auth](https://www.better-auth.com/)
+ - Database with [Drizzle](https://drizzle.team) + [D1](https://developers.cloudflare.com/d1)
+ - Subscriptions with [Lemonsqueezy](https://lemonsqueezy.com)
+ - Integration tests with [Vitest](https://vitest.dev)
+ 
+ ## Project Structure
+ ```
+ ├── LICENSE
+ ├── README.md
+ ├── biome.json
+ ├── bun.lock
+ ├── docs/
+ │   ├── drizzle.md
+ │   ├── lemonsqueezy.md
+ │   ├── ratelimits.md
+ │   └── tests.md
+ ├── drizzle/
+ │   ├── 0000_crazy_zuras.sql
+ ├── drizzle.config.ts
+ ├── package.json
+ ├── scripts/
+ │   └── setup.ts
+ ├── src/
+ │   ├── api.ts
+ │   ├── auth.ts
+ │   ├── index.tsx
+ ├── test/
+ │   └── index.spec.ts
+ ├── tsconfig.json
+ ├── vitest.config.mts
+ ├── worker-configuration.d.ts
+ └── wrangler.jsonc
+ ```
```

---

_****_



Now let's create the documentation files:

---

_****_

```diff
- 
+ # Database Management with Drizzle
+ 
+ ## How to make changes to database schema
+ 
+ 1. Make changes to the schema in `src/db/schema.ts`
+ 2. Run `npx drizzle-kit generate` to generate the migration
+ 3. Run `npx drizzle-kit migrate` to apply the migration
+ 4. Run `npx drizzle-kit push` to push the migration to the database
+ 
+ For making changes to the prod database, you will need to change the NODE_ENV in `.env` to `production` and run `npx drizzle-kit migrate` or push the migration.
+ 
+ To learn more about Drizzle, see the [Drizzle docs](https://orm.drizzle.team/docs/introduction)
```

---

_****_

```diff
- 
+ # Setting up Lemonsqueezy Store and Webhooks
+ 
+ 1. [Create a store](https://docs.lemonsqueezy.com/guides/getting-started) on lemonsqueezy
+ 2. Make sure you set up **Subscriptions** in the store
+ 3. Go to Settings -> Webhooks and set up a webhook, select *all events*
+ 4. Make sure that the secret is the same as the one in your `.dev.vars` file
+ 5. Copy the store URL and paste it in the `.env` file as `LEMONSQUEEZY_STORE_LINK`
+ 
+ ... and you're done!
```

---

_****_

```diff
- 
+ # Rate Limiting Configuration
+ 
+ ## Changing ratelimits
+ 
+ Ratelimits are set in [`src/middleware/rateLimit.ts`](/src/middleware/rateLimit.ts)
+ 
+ To edit them, simply change the `getTierLimit` function in the ratelimit middleware.
+ 
+ ```ts
+ export const getTierLimit = async (user: User) => {
+     if (!user?.subscriptionId) {
+         return { limit: 100, window: 60 * 60 }; // Free tier
+     }
+     return { limit: 1000, window: 60 * 60 }; // Paid tier
+ };
+ ```
+ 
+ All the `window` values are in seconds.
+ 
+ We are using D1 with custom logic to ratelimit the requests. The schema can be found in [`src/db/schema.ts`](/src/db/schema.ts)
```

---

_****_

```diff
- 
+ # Testing Guide
+ 
+ ## Writing and running tests
+ 
+ To run tests, use `npm run test`
+ 
+ Tests are made using the hono RPC functions, for better type safety and error handling.
+ 
+ ## Resources
+ - [Hono testing guide](https://hono.dev/docs/guides/testing)
+ - [Hono testing client](https://hono.dev/docs/helpers/testing)
+ - [Vitest docs](https://vitest.dev/guide/)
+ - [Using Vitest-pool-workers](https://www.npmjs.com/package/@cloudflare/vitest-pool-workers)
```

---

_****_



Now let's create the configuration files:

---

_****_

```diff
- 
+ {
+     "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
+     "vcs": {
+         "enabled": false,
+         "clientKind": "git",
+         "useIgnoreFile": false
+     },
+     "files": {
+         "ignoreUnknown": false,
+         "ignore": ["drizzle/", "node_modules/", ".wrangler/"]
+     },
+     "formatter": {
+         "enabled": true,
+         "indentStyle": "tab"
+     },
+     "organizeImports": {
+         "enabled": true
+     },
+     "linter": {
+         "enabled": true,
+         "rules": {
+             "recommended": true
+         }
+     },
+     "javascript": {
+         "formatter": {
+             "quoteStyle": "double"
+         }
+     }
+ }
```

---

_****_

```diff
- 
+ {
+   "name": "backend-api-kit",
+   "scripts": {
+     "dev": "wrangler dev",
+     "deploy": "wrangler deploy --minify",
+     "cf-typegen": "wrangler types --env-interface CloudflareBindings",
+     "setup": "bun scripts/setup.ts",
+     "lint": "biome lint --write ."
+   },
+   "dependencies": {
+     "better-auth": "^1.1.14",
+     "drizzle-orm": "^0.38.4",
+     "hono": "^4.6.18"
+   },
+   "devDependencies": {
+     "@biomejs/biome": "1.9.4",
+     "@clack/prompts": "^0.9.1",
+     "@cloudflare/vitest-pool-workers": "0.6.4",
+     "@cloudflare/workers-types": "^4.20250121.0",
+     "@types/bun": "^1.2.0",
+     "better-sqlite3": "^11.8.1",
+     "child_process": "^1.0.2",
+     "drizzle-kit": "^0.30.2",
+     "vitest": "2.1.8",
+     "wrangler": "^3.105.0",
+     "bun": "^1.2.0",
+     "dotenv": "^16.4.7"
+   }
+ }
```

---

_****_

```diff
- 
+ {
+   "compilerOptions": {
+     "target": "ESNext",
+     "module": "ESNext",
+     "moduleResolution": "Bundler",
+     "strict": true,
+     "skipLibCheck": true,
+     "lib": [
+       "ESNext"
+     ],
+     "types": [
+         "@cloudflare/workers-types/2023-07-01","node", "@cloudflare/vitest-pool-workers"
+     ],
+     "jsx": "react-jsx",
+     "jsxImportSource": "hono/jsx"
+   }
+ }
```

---

_****_

```diff
- 
+ {
+   "$schema": "node_modules/wrangler/config-schema.json",
+   "name": "backend-api-kit",
+   "main": "src/index.tsx",
+   "compatibility_date": "2025-01-21",
+   "compatibility_flags": ["nodejs_compat"],
+   "observability": {
+     "enabled": true
+   },
+   "placement": {
+     "mode": "smart"
+   },
+   "d1_databases": [
+     {
+       "binding": "USERS_DATABASE",
+       "database_name": "backend-api-kit",
+       "database_id": "05a34dd0-b2df-40e1-9e3f-daec23f471d9",
+       "preview_database_id": "05a34dd0-b2df-40e1-9e3f-daec23f471d9"
+     }
+   ]
+ }
```

---

_****_



Now let's create the source code files:

---

_****_



---

_****_



---

_****_



---

_**User**_

for starters lets just sliice backend api kit file for the llm 

---

_**Assistant**_

I'll help you slice the backend-api-kit.md file into smaller, more manageable sections. Let's organize it into logical sections based on the project structure we already created:

---

_****_

```diff
- 
+ # Project Setup and Configuration
+ 
+ ## Project Structure
+ ```
+ ├── LICENSE
+ ├── README.md
+ ├── biome.json
+ ├── bun.lock
+ ├── docs/
+ │   ├── drizzle.md
+ │   ├── lemonsqueezy.md
+ │   ├── ratelimits.md
+ │   └── tests.md
+ ├── drizzle/
+ │   ├── 0000_crazy_zuras.sql
+ ├── drizzle.config.ts
+ ├── package.json
+ ├── scripts/
+ │   └── setup.ts
+ ├── src/
+ │   ├── api.ts
+ │   ├── auth.ts
+ │   ├── index.tsx
+ ├── test/
+ │   └── index.spec.ts
+ ├── tsconfig.json
+ ├── vitest.config.mts
+ ├── worker-configuration.d.ts
+ └── wrangler.jsonc
+ ```
+ 
+ ## Configuration Files
+ 
+ ### biome.json
+ ```json
+ {
+     "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
+     "vcs": {
+         "enabled": false,
+         "clientKind": "git",
+         "useIgnoreFile": false
+     },
+     "files": {
+         "ignoreUnknown": false,
+         "ignore": ["drizzle/", "node_modules/", ".wrangler/"]
+     },
+     "formatter": {
+         "enabled": true,
+         "indentStyle": "tab"
+     },
+     "organizeImports": {
+         "enabled": true
+     },
+     "linter": {
+         "enabled": true,
+         "rules": {
+             "recommended": true
+         }
+     },
+     "javascript": {
+         "formatter": {
+             "quoteStyle": "double"
+         }
+     }
+ }
+ ```
+ 
+ ### package.json
+ ```json
+ {
+   "name": "backend-api-kit",
+   "scripts": {
+     "dev": "wrangler dev",
+     "deploy": "wrangler deploy --minify",
+     "cf-typegen": "wrangler types --env-interface CloudflareBindings",
+     "setup": "bun scripts/setup.ts",
+     "lint": "biome lint --write ."
+   },
+   "dependencies": {
+     "better-auth": "^1.1.14",
+     "drizzle-orm": "^0.38.4",
+     "hono": "^4.6.18"
+   },
+   "devDependencies": {
+     "@biomejs/biome": "1.9.4",
+     "@clack/prompts": "^0.9.1",
+     "@cloudflare/vitest-pool-workers": "0.6.4",
+     "@cloudflare/workers-types": "^4.20250121.0",
+     "@types/bun": "^1.2.0",
+     "better-sqlite3": "^11.8.1",
+     "child_process": "^1.0.2",
+     "drizzle-kit": "^0.30.2",
+     "vitest": "2.1.8",
+     "wrangler": "^3.105.0",
+     "bun": "^1.2.0",
+     "dotenv": "^16.4.7"
+   }
+ }
+ ```
+ 
+ ### tsconfig.json
+ ```json
+ {
+   "compilerOptions": {
+     "target": "ESNext",
+     "module": "ESNext",
+     "moduleResolution": "Bundler",
+     "strict": true,
+     "skipLibCheck": true,
+     "lib": ["ESNext"],
+     "types": [
+       "@cloudflare/workers-types/2023-07-01",
+       "node",
+       "@cloudflare/vitest-pool-workers"
+     ],
+     "jsx": "react-jsx",
+     "jsxImportSource": "hono/jsx"
+   }
+ }
+ ```
```

---

_****_

```diff
- 
+ # Database and Authentication
+ 
+ ## Database Schema
+ 
+ The project uses Drizzle ORM with SQLite (D1) for the database. Here's the schema definition:
+ 
+ ```typescript
+ // src/db/schema.ts
+ import { sql } from "drizzle-orm";
+ import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
+ 
+ export const user = sqliteTable("user", {
+   id: text("id").primaryKey(),
+   name: text("name").notNull(),
+   email: text("email").notNull().unique(),
+   emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
+   image: text("image"),
+   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
+   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
+   subscriptionId: text("subscriptionId"),
+   lastKeyGeneratedAt: integer("lastKeyGeneratedAt", { mode: "timestamp" }),
+ });
+ 
+ export const session = sqliteTable("session", {
+   id: text("id").primaryKey(),
+   userId: text("userId").notNull().references(() => user.id),
+   token: text("token").notNull(),
+   expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
+   ipAddress: text("ipAddress"),
+   userAgent: text("userAgent"),
+   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
+   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
+ });
+ 
+ export const account = sqliteTable("account", {
+   id: text("id").primaryKey(),
+   userId: text("userId").notNull().references(() => user.id),
+   accountId: text("accountId").notNull(),
+   providerId: text("providerId").notNull(),
+   accessToken: text("accessToken"),
+   refreshToken: text("refreshToken"),
+   accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
+   refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
+   scope: text("scope"),
+   idToken: text("idToken"),
+   password: text("password"),
+   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
+   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
+ });
+ 
+ export const verification = sqliteTable("verification", {
+   id: text("id").primaryKey(),
+   identifier: text("identifier").notNull(),
+   value: text("value").notNull(),
+   expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
+   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
+   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
+ });
+ 
+ export const rateLimit = sqliteTable("rateLimit", {
+   id: text("id").primaryKey(),
+   userId: text("userId").notNull().references(() => user.id),
+   endpoint: text("endpoint").notNull(),
+   count: integer("count").notNull().default(0),
+   resetAt: integer("resetAt", { mode: "timestamp" }).notNull(),
+   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
+   updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
+ });
+ 
+ export type User = typeof user.$inferSelect;
+ export type Session = typeof session.$inferSelect;
+ export type Account = typeof account.$inferSelect;
+ export type Verification = typeof verification.$inferSelect;
+ export type RateLimit = typeof rateLimit.$inferSelect;
+ ```
+ 
+ ## Authentication
+ 
+ Authentication is handled using better-auth with GitHub OAuth. Here's the setup:
+ 
+ ```typescript
+ // src/auth.ts
+ import { betterAuth } from "better-auth";
+ import { drizzle } from "drizzle-orm/d1";
+ import { drizzleAdapter } from "better-auth/adapters/drizzle";
+ import * as schema from "./db/schema";
+ 
+ export const auth = (env: Env) =>
+   betterAuth({
+     database: drizzleAdapter(drizzle(env.USERS_DATABASE), {
+       provider: "sqlite",
+       schema: {
+         account: schema.account,
+         session: schema.session,
+         user: schema.user,
+         verification: schema.verification,
+       },
+     }),
+     secret: env.SECRET,
+     socialProviders: {
+       github: {
+         clientId: env.AUTH_GITHUB_ID,
+         clientSecret: env.AUTH_GITHUB_SECRET,
+         redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/github`,
+       },
+     },
+   });
```

---

_****_

```diff
- 
+ # API Routes and Middleware
+ 
+ ## Rate Limiting Middleware
+ 
+ The API uses rate limiting based on subscription tiers:
+ 
+ ```typescript
+ // src/middleware/rateLimit.ts
+ import type { Context, MiddlewareHandler, Next } from "hono";
+ import { HTTPException } from "hono/http-exception";
+ import { db } from "../auth";
+ import { rateLimit, user } from "../db/schema";
+ import { and, eq, gt } from "drizzle-orm";
+ import type { User, Session } from "../db/schema";
+ 
+ export interface RateLimitConfig {
+   limit: number;
+   window: number;
+ }
+ 
+ export const getTierLimit = async (user: User) => {
+   if (!user?.subscriptionId) {
+     return { limit: 100, window: 60 * 60 }; // Free tier
+   }
+   return { limit: 1000, window: 60 * 60 }; // Paid tier
+ };
+ 
+ export const ratelimiter = async (c: Context<{
+   Bindings: Env,
+   Variables: {
+     user: User,
+     session: Session
+   }
+ }>, next: Next) => {
+   const rateLimiter = createRateLimiter(
+     async (user) => await getTierLimit(user)
+   );
+   return rateLimiter(c, next);
+ }
+ ```
+ 
+ ## API Routes
+ 
+ Main API routes with authentication and rate limiting:
+ 
+ ```typescript
+ // src/api.ts
+ import { Hono } from "hono";
+ import { ratelimiter } from "./middleware/rateLimit";
+ import type { User, Session } from "./db/schema";
+ 
+ export const apiRouter = new Hono<{
+   Bindings: Env;
+   Variables: {
+     user: User;
+     session: Session;
+   };
+ }>()
+ .use(ratelimiter)
+ .get("/", (c) => {
+     const user = c.get("user")
+     if (!user?.subscriptionId) {
+         return c.json({
+             error: "Unauthorized, please buy a subscription"
+         }, 401)
+     }
+     return c.json({
+         message: "Hello World"
+     })
+ })
+ ```
+ 
+ ## Payment Webhook Handler
+ 
+ Handles Lemonsqueezy subscription webhooks:
+ 
+ ```typescript
+ // src/payment/lemonsqueezy.ts
+ export const paymentRouter = new Hono<{
+   Bindings: Env,
+   Variables: {
+     user: User,
+     session: Session
+   }
+ }>()
+ 
+ const SUPPORTED_EVENTS = [
+     'subscription_created',
+     'subscription_updated',
+     'subscription_cancelled',
+     'subscription_expired'
+ ]
+ 
+ paymentRouter.post("/webhook", async (c) => {
+     if (c.req.method !== "POST") {
+         return c.json({ error: "Method not allowed" }, 405)
+     }
+ 
+     const secret = c.env.SECRET
+     const signature = c.req.header("x-signature")
+ 
+     if (!signature || !secret) {
+         return c.json({ error: "Unauthorized" }, 401)
+     }
+ 
+     const body = await c.req.text()
+     const isValid = await verifySignature(secret, signature, body)
+ 
+     if (!isValid) {
+         return c.json({ error: "Unauthorized" }, 401)
+     }
+ 
+     const payload = JSON.parse(body) as DiscriminatedWebhookPayload<{email: string}>
+     const { event_name: eventName } = payload.meta
+ 
+     if (!SUPPORTED_EVENTS.includes(eventName)) {
+         return c.json({ error: "Event not supported" }, 400)
+     }
+ 
+     // Update user subscription status
+     const isSubscriptionActive = ['subscription_created', 'subscription_updated'].includes(eventName)
+     await updateUserSubscription(
+         c.env,
+         users[0].id,
+         isSubscriptionActive ? payload.data.id : null
+     )
+ 
+     return c.json({ message: "Webhook received" }, 200)
+ })
+ ```
```

---

_****_

```diff
- 
+ # Utilities and Type Definitions
+ 
+ ## Encryption Utilities
+ 
+ Utilities for encrypting and decrypting API keys:
+ 
+ ```typescript
+ // src/utils/cipher.ts
+ async function encrypt(data: string, key: string): Promise<string> {
+   const encoder = new TextEncoder();
+   const encodedData = encoder.encode(data);
+ 
+   // Hash the key to ensure it's exactly 16 bytes (128 bits)
+   const keyHash = await crypto.subtle.digest("SHA-256", encoder.encode(key));
+   const keyBytes = new Uint8Array(keyHash).slice(0, 16);
+ 
+   const baseForIv = encoder.encode(data + key);
+   const ivHash = await crypto.subtle.digest("SHA-256", baseForIv);
+   const iv = new Uint8Array(ivHash).slice(0, 12);
+ 
+   const cryptoKey = await crypto.subtle.importKey(
+     "raw",
+     keyBytes,
+     { name: "AES-GCM", length: 128 },
+     false,
+     ["encrypt", "decrypt"],
+   );
+ 
+   const encrypted = await crypto.subtle.encrypt(
+     { name: "AES-GCM", iv: new Uint8Array(iv).buffer as ArrayBuffer },
+     cryptoKey,
+     encodedData,
+   );
+ 
+   const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
+   const base64 = Buffer.from(combined).toString("base64");
+   return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
+ }
+ 
+ async function decrypt(encryptedData: string, key: string): Promise<string> {
+   const base64 = encryptedData
+     .replace(/-/g, "+")
+     .replace(/_/g, "/")
+     .padEnd(
+       encryptedData.length + ((4 - (encryptedData.length % 4)) % 4),
+       "=",
+     );
+ 
+   const combined = Buffer.from(base64, "base64");
+   const combinedArray = new Uint8Array(combined);
+ 
+   const iv = combinedArray.slice(0, 12);
+   const encrypted = combinedArray.slice(12);
+ 
+   const keyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
+   const keyBytes = new Uint8Array(keyHash).slice(0, 16);
+ 
+   const cryptoKey = await crypto.subtle.importKey(
+     "raw",
+     keyBytes,
+     { name: "AES-GCM", length: 128 },
+     false,
+     ["encrypt", "decrypt"],
+   );
+ 
+   const decrypted = await crypto.subtle.decrypt(
+     { name: "AES-GCM", iv: new Uint8Array(iv).buffer as ArrayBuffer },
+     cryptoKey,
+     encrypted.buffer as ArrayBuffer,
+   );
+ 
+   return new TextDecoder().decode(decrypted);
+ }
+ 
+ export { encrypt, decrypt };
+ ```
+ 
+ ## API Key Generation
+ 
+ Functions for generating and decrypting API keys:
+ 
+ ```typescript
+ // src/utils/key.ts
+ import { decrypt, encrypt } from "./cipher"
+ 
+ export const generateKey = async (userId: string, lastKeyGeneratedAt: string, secret: string) => {
+     return await encrypt(`${userId}--${lastKeyGeneratedAt}`, secret)
+ }
+ 
+ export const decryptKey = async (key: string, secret: string) => {
+     const decrypted = await decrypt(key, secret)
+     return decrypted.split("--")
+ }
+ ```
+ 
+ ## Lemonsqueezy Types
+ 
+ Type definitions for Lemonsqueezy webhooks:
+ 
+ ```typescript
+ // src/payment/types.ts
+ type SubscriptionEventNames =
+     | 'subscription_created'
+     | 'subscription_cancelled'
+     | 'subscription_resumed'
+     | 'subscription_updated'
+     | 'subscription_expired'
+     | 'subscription_paused'
+     | 'subscription_unpaused'
+ 
+ export type WebhookPayload<CustomData = unknown> = {
+     meta: {
+         event_name: SubscriptionEventNames
+         custom_data?: CustomData
+     }
+     data: Subscription
+ }
+ 
+ export type DiscriminatedWebhookPayload<CustomData = unknown> = {
+     event_name: SubscriptionEventNames
+     meta: {
+         event_name: SubscriptionEventNames
+         custom_data: CustomData
+     }
+     data: Subscription
+ }
+ 
+ export type Subscription = {
+     type: 'subscriptions'
+     id: string
+     attributes: {
+         store_id: number
+         order_id: number
+         customer_id: number
+         user_name: string
+         user_email: string
+         status: SubscriptionStatus
+         status_formatted: string
+         renews_at: string
+         ends_at: string | null
+         created_at: string
+         updated_at: string
+         test_mode: boolean
+     }
+ }
+ 
+ type SubscriptionStatus =
+     | 'on_trial'
+     | 'active'
+     | 'paused'
+     | 'past_due'
+     | 'unpaid'
+     | 'cancelled'
+     | 'expired'
+ ```
```

---

_****_



I've split the backend-api-kit documentation into 4 logical sections:

1. `1-project-setup.md`: Project structure and configuration files
2. `2-database-and-auth.md`: Database schema and authentication setup
3. `3-api-and-middleware.md`: API routes and middleware implementation
4. `4-utils-and-types.md`: Utility functions and type definitions

Each file contains the relevant code snippets and documentation for its section, making it easier to understand and maintain. The files are organized in a way that follows a natural progression from setup to implementation details.

Would you like me to create any additional sections or make any modifications to the existing ones?

---



---

