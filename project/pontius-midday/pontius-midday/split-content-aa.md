Project Structure:
├── LICENSE
├── README.md
├── SECURITY.md
├── apps
├── biome.json
├── bun.lockb
├── codefetch
│   └── codefetch.txt
├── github.png
├── midday.code-workspace
├── package.json
├── packages
├── tsconfig.json
└── turbo.json


.cursorrules
```
1 | You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI and Tailwind.
2 |
3 | Code Style and Structure
4 |   - Write concise, technical TypeScript code with accurate examples.
5 |   - Use functional and declarative programming patterns; avoid classes.
6 |   - Prefer iteration and modularization over code duplication.
7 |   - Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
8 |   - Structure files: exported component, subcomponents, helpers, static content, types.
9 |
10 | Naming Conventions
11 |   - Use lowercase with dashes for directories (e.g., components/auth-wizard).
12 |   - Favor named exports for components.
13 |
14 | TypeScript Usage
15 |   - Use TypeScript for all code; prefer interfaces over types.
16 |   - Avoid enums; use maps instead.
17 |   - Use functional components with TypeScript interfaces.
18 |
19 | Syntax and Formatting
20 |   - Use the "function" keyword for pure functions.
21 |   - Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
22 |   - Use declarative JSX.
23 |
24 | UI and Styling
25 |   - Use Shadcn UI, Radix, and Tailwind for components and styling.
26 |   - Implement responsive design with Tailwind CSS; use a mobile-first approach.
27 |
28 | Performance Optimization
29 |   - Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC).
30 |   - Wrap client components in Suspense with fallback.
31 |   - Use dynamic loading for non-critical components.
32 |   - Optimize images: use WebP format, include size data, implement lazy loading.
33 |
34 | Next.js Specifics
35 |   - Use next-safe-action for all server actions:
36 |   - Implement type-safe server actions with proper validation.
37 |   - Utilize the `action` function from next-safe-action for creating actions.
38 |   - Define input schemas using Zod for robust type checking and validation.
39 |   - Handle errors gracefully and return appropriate responses.
40 |   - Use import type { ActionResponse } from '@/types/actions'
41 |   - Ensure all server actions return the ActionResponse type
42 |   - Implement consistent error handling and success responses using ActionResponse
43 |   - Example:
44 |     ```typescript
45 |     'use server'
46 |
47 |     import { createSafeActionClient } from 'next-safe-action'
48 |     import { z } from 'zod'
49 |     import type { ActionResponse } from '@/app/actions/actions'
50 |
51 |     const schema = z.object({
52 |       value: z.string()
53 |     })
54 |
55 |     export const someAction = createSafeActionClient()
56 |       .schema(schema)
57 |       .action(async (input): Promise<ActionResponse> => {
58 |         try {
59 |           // Action logic here
60 |           return { success: true, data: /* result */ }
61 |         } catch (error) {
62 |           return { success: false, error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR, }
63 |         }
64 |       })
65 |     ```
66 |   - Use useQueryState for all query state management.
67 |   - Example:
68 |     ```typescript
69 |     'use client'
70 |
71 |     import { useQueryState } from 'nuqs'
72 |
73 |     export function Demo() {
74 |       const [name, setName] = useQueryState('name')
75 |       return (
76 |         <>
77 |           <input value={name || ''} onChange={e => setName(e.target.value)} />
78 |           <button onClick={() => setName(null)}>Clear</button>
79 |           <p>Hello, {name || 'anonymous visitor'}!</p>
80 |         </>
81 |       )
82 |     }
83 |     ```
84 |
85 | Key Conventions
86 |   - Use 'nuqs' for URL search parameter state management.
87 |   - Optimize Web Vitals (LCP, CLS, FID).
88 |   - Limit 'use client':
89 |     - Favor server components and Next.js SSR.
90 |     - Use only for Web API access in small components.
91 |     - Avoid for data fetching or state management.
92 |
93 |   Follow Next.js docs for Data Fetching, Rendering, and Routing.
94 |
```

.nvmrc
```
1 | 20.11.0
```

SECURITY.md
```
1 | # Security
2 |
3 | Contact: [security@midday.ai](mailto:security@midday.ai)
4 |
5 | Based on [https://supabase.com/.well-known/security.txt](https://supabase.com/.well-known/security.txt)
6 |
7 | At Midday, we consider the security of our systems a top priority. But no matter
8 | how much effort we put into system security, there can still be vulnerabilities
9 | present.
10 |
11 | If you discover a vulnerability, we would like to know about it so we can take
12 | steps to address it as quickly as possible. We would like to ask you to help us
13 | better protect our clients and our systems.
14 |
15 | ## Out of scope vulnerabilities
16 |
17 | - Clickjacking on pages with no sensitive actions.
18 | - Unauthenticated/logout/login CSRF.
19 | - Attacks requiring MITM or physical access to a user's device.
20 | - Any activity that could lead to the disruption of our service (DoS).
21 | - Content spoofing and text injection issues without showing an attack
22 |   vector/without being able to modify HTML/CSS.
23 | - Email spoofing
24 | - Missing DNSSEC, CAA, CSP headers
25 | - Lack of Secure or HTTP only flag on non-sensitive cookies
26 | - Deadlinks
27 |
28 | ## Please do the following
29 |
30 | - E-mail your findings to [security@midday.ai](mailto:security@midday.ai).
31 | - Do not run automated scanners on our infrastructure or dashboard. If you wish
32 |   to do this, contact us and we will set up a sandbox for you.
33 | - Do not take advantage of the vulnerability or problem you have discovered,
34 |   for example by downloading more data than necessary to demonstrate the
35 |   vulnerability or deleting or modifying other people's data,
36 | - Do not reveal the problem to others until it has been resolved,
37 | - Do not use attacks on physical security, social engineering, distributed
38 |   denial of service, spam or applications of third parties,
39 | - Do provide sufficient information to reproduce the problem, so we will be
40 |   able to resolve it as quickly as possible. Usually, the IP address or the URL
41 |   of the affected system and a description of the vulnerability will be
42 |   sufficient, but complex vulnerabilities may require further explanation.
43 |
44 | ## What we promise
45 |
46 | - We will respond to your report within 3 business days with our evaluation of
47 |   the report and an expected resolution date,
48 | - If you have followed the instructions above, we will not take any legal
49 |   action against you in regard to the report,
50 | - We will handle your report with strict confidentiality, and not pass on your
51 |   personal details to third parties without your permission,
52 | - We will keep you informed of the progress towards resolving the problem,
53 | - In the public information concerning the problem reported, we will give your
54 |   name as the discoverer of the problem (unless you desire otherwise), and
55 | - We strive to resolve all problems as quickly as possible, and we would like
56 |   to play an active role in the ultimate publication on the problem after it
57 |   is resolved.
```

biome.json
```
1 | {
2 |   "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
3 |   "organizeImports": {
4 |     "enabled": true
5 |   },
6 |   "linter": {
7 |     "ignore": [".wrangler", "node_modules"],
8 |     "enabled": true,
9 |     "rules": {
10 |       "recommended": true,
11 |       "a11y": {
12 |         "noSvgWithoutTitle": "off",
13 |         "useKeyWithClickEvents": "off"
14 |       },
15 |       "style": {
16 |         "noNonNullAssertion": "off"
17 |       },
18 |       "correctness": {
19 |         "useExhaustiveDependencies": "off"
20 |       }
21 |     }
22 |   },
23 |   "formatter": {
24 |     "indentStyle": "space"
25 |   }
26 | }
```

midday.code-workspace
```
1 | {
2 |   "folders": [
3 |     {
4 |       "name": "project-root",
5 |       "path": "./"
6 |     },
7 |     {
8 |       "name": "supabase-functions",
9 |       "path": "packages/supabase/functions"
10 |     }
11 |   ],
12 |   "settings": {
13 |     "files.exclude": {
14 |       "packages/supabase/functions/": true
15 |     }
16 |   }
17 | }
```

package.json
```
1 | {
2 |   "name": "midday",
3 |   "private": true,
4 |   "workspaces": [
5 |     "packages/*",
6 |     "apps/*",
7 |     "packages/email/*"
8 |   ],
9 |   "scripts": {
10 |     "build": "turbo build",
11 |     "clean": "git clean -xdf node_modules",
12 |     "clean:workspaces": "turbo clean",
13 |     "dev": "turbo dev --parallel",
14 |     "test": "turbo test --parallel",
15 |     "start:dashboard": "turbo start --filter=@midday/dashboard",
16 |     "start:website": "turbo start --filter=@midday/website",
17 |     "dev:api": "turbo dev --filter=@midday/api",
18 |     "dev:dashboard": "turbo dev --filter=@midday/dashboard",
19 |     "build:dashboard": "turbo build --filter=@midday/dashboard",
20 |     "dev:engine": "turbo dev --filter=@midday/engine",
21 |     "dev:website": "turbo dev --filter=@midday/website ",
22 |     "dev:desktop": "turbo dev --filter=@midday/desktop",
23 |     "jobs:dashboard": "turbo jobs --filter=@midday/dashboard",
24 |     "format": "biome format --write .",
25 |     "lint": "turbo lint && manypkg check",
26 |     "typecheck": "turbo typecheck"
27 |   },
28 |   "dependencies": {
29 |     "@biomejs/biome": "1.9.4",
30 |     "@manypkg/cli": "^0.23.0",
31 |     "turbo": "2.3.3",
32 |     "typescript": "^5.7.2"
33 |   },
34 |   "packageManager": "bun@1.1.38",
35 |   "resolutions": {
36 |     "jackspeak": "2.1.1"
37 |   }
38 | }
```

tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json"
3 | }
```

turbo.json
```
1 | {
2 |   "$schema": "https://turborepo.org/schema.json",
3 |   "globalDependencies": ["**/.env"],
4 |   "ui": "stream",
5 |   "tasks": {
6 |     "topo": {
7 |       "dependsOn": ["^topo"]
8 |     },
9 |     "build": {
10 |       "env": [
11 |         "SUPABASE_SERVICE_KEY",
12 |         "SUPABASE_API_KEY",
13 |         "RESEND_API_KEY",
14 |         "RESEND_AUDIENCE_ID",
15 |         "GOCARDLESS_SECRET_ID",
16 |         "GOCARDLESS_SECRET_KEY",
17 |         "UPSTASH_REDIS_REST_URL",
18 |         "UPSTASH_REDIS_REST_TOKEN",
19 |         "NOVU_API_KEY",
20 |         "DUB_API_KEY",
21 |         "API_ROUTE_SECRET",
22 |         "TELLER_CERTIFICATE",
23 |         "TELLER_CERTIFICATE_PRIVATE_KEY",
24 |         "MIDDAY_ENGINE_API_KEY",
25 |         "PLAID_CLIENT_ID",
26 |         "PLAID_SECRET",
27 |         "GITHUB_TOKEN",
28 |         "PLAIN_API_KEY",
29 |         "BASELIME_SERVICE",
30 |         "BASELIME_API_KEY",
31 |         "OPENAI_API_KEY",
32 |         "MISTRAL_API_KEY",
33 |         "OPENPANEL_SECRET_KEY",
34 |         "SENTRY_AUTH_TOKEN",
35 |         "SENTRY_ORG",
36 |         "SENTRY_PROJECT",
37 |         "SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING",
38 |         "SLACK_CLIENT_SECRET",
39 |         "SLACK_CLIENT_ID",
40 |         "SLACK_SIGNING_SECRET"
41 |       ],
42 |       "inputs": ["$TURBO_DEFAULT$", ".env"],
43 |       "dependsOn": ["^build"],
44 |       "outputs": [".next/**", "!.next/cache/**", "next-env.d.ts", ".expo/**"]
45 |     },
46 |     "start": {
47 |       "cache": false
48 |     },
49 |     "test": {
50 |       "cache": false
51 |     },
52 |     "dev": {
53 |       "inputs": ["$TURBO_DEFAULT$", ".env"],
54 |       "persistent": true,
55 |       "cache": false
56 |     },
57 |     "jobs": {
58 |       "persistent": true,
59 |       "cache": false
60 |     },
61 |     "format": {},
62 |     "lint": {
63 |       "dependsOn": ["^topo"]
64 |     },
65 |     "typecheck": {
66 |       "dependsOn": ["^topo"],
67 |       "outputs": ["node_modules/.cache/tsbuildinfo.json"]
68 |     }
69 |   }
70 | }
```

.github/workflows/preview-dashboard.yaml
```
1 | name: Preview Deployment - Dashboard
2 | env:
3 |   VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
4 |   VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_DASHBOARD }}
5 |   TURBO_TOKEN: ${{ secrets.VERCEL_TOKEN }}
6 |   TURBO_TEAM: ${{ secrets.VERCEL_ORG_ID }}
7 |   SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
8 |   SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
9 |   SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
10 |   SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING: true
11 | on:
12 |   push:
13 |     branches-ignore:
14 |       - main
15 |     paths:
16 |       - apps/dashboard/**
17 |       - packages/**
18 | jobs:
19 |   deploy-preview:
20 |     runs-on: ubuntu-latest
21 |     steps:
22 |       - uses: actions/checkout@v4
23 |       - uses: oven-sh/setup-bun@v1
24 |         with:
25 |           bun-version: latest
26 |       - name: Install dependencies
27 |         run: bun install
28 |       # - name: 🔦 Run linter
29 |       #   run: bun run lint --filter=@midday/dashboard
30 |       # - name: 🪐 Check TypeScript
31 |       #   run: bun run typecheck --filter=@midday/dashboard
32 |       - name: 🧪 Run unit tests
33 |         run: bun run test
34 |       - name: 📤 Pull Vercel Environment Information
35 |         run: bunx vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
36 |       - name: 🏗 Build Project Artifacts
37 |         run: bunx vercel build --token=${{ secrets.VERCEL_TOKEN }}
38 |       - name: 🔄 Deploy Background Jobs
39 |         env:
40 |           TRIGGER_ACCESS_TOKEN: ${{ secrets.TRIGGER_ACCESS_TOKEN }}
41 |         run: |
42 |           TRIGGER_PROJECT_ID=${{ secrets.TRIGGER_PROJECT_ID }} bunx trigger.dev@3.3.7 deploy --env staging
43 |         working-directory: apps/dashboard
44 |       - name: 🚀 Deploy to Vercel
45 |         run: bunx vercel deploy --prebuilt --archive=tgz --token=${{ secrets.VERCEL_TOKEN }}
```

.github/workflows/preview-engine.yml
```
1 | name: Preview Deployment - Engine
2 | env:
3 |   CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
4 | on:
5 |   push:
6 |     branches-ignore:
7 |       - main
8 |     paths:
9 |       - apps/engine/**
10 | jobs:
11 |   deploy-preview:
12 |     runs-on: ubuntu-latest
13 |     steps:
14 |       - uses: actions/checkout@v4
15 |       - uses: oven-sh/setup-bun@v1
16 |         with:
17 |           bun-version: latest
18 |       - name: Install dependencies
19 |         run: bun install
20 |       - name: 🔦 Run linter
21 |         run: bun run lint
22 |         working-directory: ./apps/engine
23 |       - name: 🪐 Check TypeScript
24 |         run: bun run check:types
25 |         working-directory: ./apps/engine
26 |       - name: 🧪 Run unit tests
27 |         run: bun test
28 |         working-directory: ./apps/engine
29 |       - name: Deploy Project Artifacts to Cloudflare
30 |         uses: cloudflare/wrangler-action@v3
31 |         with:
32 |           packageManager: bun
33 |           apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
34 |           workingDirectory: "apps/engine"
35 |           wranglerVersion: "3.93.0"
36 |           command: deploy --minify src/index.ts --env staging
```

.github/workflows/preview-website.yml
```
1 | name: Preview Deployment - Website
2 | env:
3 |   VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
4 |   VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_WEBSITE }}
5 |   TURBO_TOKEN: ${{ secrets.VERCEL_TOKEN }}
6 |   TURBO_TEAM: ${{ secrets.VERCEL_ORG_ID }}
7 | on:
8 |   push:
9 |     branches-ignore:
10 |       - main
11 |     paths:
12 |       - apps/website/**
13 |       - packages/**
14 | jobs:
15 |   deploy-preview:
16 |     runs-on: ubuntu-latest
17 |     steps:
18 |       - uses: actions/checkout@v4
19 |       - uses: oven-sh/setup-bun@v1
20 |         with:
21 |           bun-version: latest
22 |       - name: Install dependencies
23 |         run: bun install
24 |       # - name: 🔦 Run linter
25 |       #   run: bun run lint --filter=@midday/website
26 |       # - name: 🪐 Check TypeScript
27 |       #   run: bun run typecheck --filter=@midday/website
28 |       - name: 📤 Pull Vercel Environment Information
29 |         run: bunx vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
30 |       - name: 🏗 Build Project Artifacts
31 |         run: bunx vercel build --token=${{ secrets.VERCEL_TOKEN }}
32 |       - name: Deploy Project Artifacts to Vercel
33 |         run: bunx vercel deploy --prebuilt --archive=tgz --token=${{ secrets.VERCEL_TOKEN }}
```

.github/workflows/production-dashboard.yml
```
1 | name: Production Deployment - Dashboard
2 | env:
3 |   VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
4 |   VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_DASHBOARD }}
5 |   TURBO_TOKEN: ${{ secrets.VERCEL_TOKEN }}
6 |   TURBO_TEAM: ${{ secrets.VERCEL_ORG_ID }}
7 |   SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
8 |   SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
9 |   SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
10 |   SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING: true
11 | on:
12 |   push:
13 |     branches:
14 |       - main
15 |     paths:
16 |       - apps/dashboard/**
17 |       - packages/**
18 | jobs:
19 |   deploy-production:
20 |     runs-on: ubuntu-latest
21 |     steps:
22 |       - uses: actions/checkout@v4
23 |       - uses: oven-sh/setup-bun@v1
24 |         with:
25 |           bun-version: latest
26 |       - name: Install dependencies
27 |         run: bun install
28 |       # - name: 🔦 Run linter
29 |       #   run: bun run lint --filter=@midday/dashboard
30 |       # - name: 🪐 Check TypeScript
31 |       #   run: bun run typecheck --filter=@midday/dashboard
32 |       - name: 🧪 Run unit tests
33 |         run: bun run test
34 |       - name: 📤 Pull Vercel Environment Information
35 |         run: bunx vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
36 |       - name: 🏗 Build Project Artifacts
37 |         run: bunx vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
38 |       - name: 🔄 Deploy Background Jobs
39 |         env:
40 |           TRIGGER_ACCESS_TOKEN: ${{ secrets.TRIGGER_ACCESS_TOKEN }}
41 |         run: |
42 |           TRIGGER_PROJECT_ID=${{ secrets.TRIGGER_PROJECT_ID }} bunx trigger.dev@3.3.7 deploy
43 |         working-directory: apps/dashboard
44 |       - name: 🚀 Deploy to Vercel
45 |         run: |
46 |           bunx vercel deploy --prebuilt --prod --archive=tgz --token=${{ secrets.VERCEL_TOKEN }} > domain.txt
47 |           bunx vercel alias --scope=${{ secrets.VERCEL_ORG_ID }} --token=${{ secrets.VERCEL_TOKEN }} set `cat domain.txt` app.midday.ai
```

.github/workflows/production-email.yml
```
1 | name: Production Deployment - Email
2 | env:
3 |   VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
4 |   VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_EMAIL }}
5 |   TURBO_TOKEN: ${{ secrets.VERCEL_TOKEN }}
6 |   TURBO_TEAM: ${{ secrets.VERCEL_ORG_ID }}
7 | on:
8 |   push:
9 |     branches:
10 |       - main
11 |     paths:
12 |       - packages/email/**
13 | jobs:
14 |   deploy-production:
15 |     runs-on: ubuntu-latest
16 |     steps:
17 |       - uses: actions/checkout@v4
18 |       - uses: oven-sh/setup-bun@v1
19 |         with:
20 |           bun-version: latest
21 |       - name: Install dependencies
22 |         run: bun install
23 |       # - name: 🔦 Run linter
24 |       #   run: bun run lint --filter=@midday/email
25 |       # - name: 🪐 Check TypeScript
26 |       #   run: bun run typecheck --filter=@midday/email
27 |       - name: 📤 Pull Vercel Environment Information
28 |         run: bunx vercel env pull .env --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
29 |       - name: 📤 Pull Vercel Environment Information
30 |         run: bunx vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
31 |       - name: 🏗 Build Project Artifacts
32 |         run: bunx vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
33 |       - name: Deploy Project Artifacts to Vercel
34 |         run: |
35 |           bunx vercel deploy --prebuilt --prod --archive=tgz --token=${{ secrets.VERCEL_TOKEN }} > domain.txt
36 |           bunx vercel alias --scope=${{ secrets.VERCEL_ORG_ID }} --token=${{ secrets.VERCEL_TOKEN }} set `cat domain.txt` email.midday.ai
```

.github/workflows/production-engine.yml
```
1 | name: Production Deployment - Engine
2 | env:
3 |   CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
4 | on:
5 |   push:
6 |     branches:
7 |       - main
8 |     paths:
9 |       - apps/engine/**
10 | jobs:
11 |   deploy-production:
12 |     runs-on: ubuntu-latest
13 |     steps:
14 |       - uses: actions/checkout@v4
15 |       - uses: oven-sh/setup-bun@v1
16 |         with:
17 |           bun-version: latest
18 |       - name: Install dependencies
19 |         run: bun install
20 |       - name: 🔦 Run linter
21 |         run: bun run lint
22 |         working-directory: ./apps/engine
23 |       - name: 🪐 Check TypeScript
24 |         run: bun run check:types
25 |         working-directory: ./apps/engine
26 |       - name: 🧪 Run unit tests
27 |         run: bun test
28 |         working-directory: ./apps/engine
29 |       - name: Deploy Project Artifacts to Cloudflare
30 |         uses: cloudflare/wrangler-action@v3
31 |         with:
32 |           packageManager: bun
33 |           apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
34 |           workingDirectory: "apps/engine"
35 |           wranglerVersion: "3.93.0"
36 |           command: deploy --minify src/index.ts --env production
```

.github/workflows/production-website.yml
```
1 | name: Production Deployment - Website
2 | env:
3 |   VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
4 |   VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_WEBSITE }}
5 |   TURBO_TOKEN: ${{ secrets.VERCEL_TOKEN }}
6 |   TURBO_TEAM: ${{ secrets.VERCEL_ORG_ID }}
7 |   NODE_OPTIONS: --max-old-space-size=4096
8 | on:
9 |   push:
10 |     branches:
11 |       - main
12 |     paths:
13 |       - apps/website/**
14 |       - packages/**
15 |       - "!packages/email/**"
16 | jobs:
17 |   deploy-production:
18 |     runs-on: ubuntu-latest
19 |     steps:
20 |       - uses: actions/checkout@v4
21 |       - uses: oven-sh/setup-bun@v1
22 |         with:
23 |           bun-version: latest
24 |       - name: Install dependencies
25 |         run: bun install
26 |       # - name: 🔦 Run linter
27 |       #   run: bun run lint --filter=@midday/website
28 |       # - name: 🪐 Check TypeScript
29 |       #   run: bun run typecheck --filter=@midday/website
30 |       - name: 📤 Pull Vercel Environment Information
31 |         run: bunx vercel env pull .env --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
32 |       - name: 📤 Pull Vercel Environment Information
33 |         run: bunx vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
34 |       - name: 🏗 Build Project Artifacts
35 |         run: bunx vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
36 |       - name: Deploy Project Artifacts to Vercel
37 |         run: |
38 |           bunx vercel deploy --prebuilt --prod --archive=tgz --token=${{ secrets.VERCEL_TOKEN }} > domain.txt
39 |           bunx vercel alias --scope=${{ secrets.VERCEL_ORG_ID }} --token=${{ secrets.VERCEL_TOKEN }} set `cat domain.txt` midday.ai
```

apps/api/package.json
```
1 | {
2 |   "name": "@midday/api",
3 |   "private": true,
4 |   "scripts": {
5 |     "dev": "supabase start",
6 |     "login": "supabase login",
7 |     "db:reset": ""
8 |   },
9 |   "dependencies": {
10 |     "supabase": "^1.200.3"
11 |   }
12 | }
```

apps/dashboard/image-loader.ts
```
1 | interface ImageLoaderParams {
2 |   src: string;
3 |   width: number;
4 |   quality?: number;
5 | }
6 |
7 | const CDN_URL = "https://midday.ai";
8 |
9 | export default function imageLoader({
10 |   src,
11 |   width,
12 |   quality = 80,
13 | }: ImageLoaderParams): string {
14 |   if (src.startsWith("/_next")) {
15 |     return `${CDN_URL}/cdn-cgi/image/width=${width},quality=${quality}/https://app.midday.ai${src}`;
16 |   }
17 |   return `${CDN_URL}/cdn-cgi/image/width=${width},quality=${quality}/${src}`;
18 | }
```

apps/dashboard/next.config.mjs
```
1 | import "./src/env.mjs";
2 |
3 | import bundleAnalyzer from "@next/bundle-analyzer";
4 | import { withSentryConfig } from "@sentry/nextjs";
5 |
6 | const withBundleAnalyzer = bundleAnalyzer({
7 |   enabled: process.env.ANALYZE === "true",
8 | });
9 |
10 | /** @type {import("next").NextConfig} */
11 | const config = {
12 |   poweredByHeader: false,
13 |   reactStrictMode: true,
14 |   images: {
15 |     loader: "custom",
16 |     loaderFile: "./image-loader.ts",
17 |     remotePatterns: [
18 |       {
19 |         protocol: "https",
20 |         hostname: "**",
21 |       },
22 |     ],
23 |   },
24 |   transpilePackages: ["@midday/ui", "@midday/tailwind", "@midday/invoice"],
25 |   eslint: {
26 |     ignoreDuringBuilds: true,
27 |   },
28 |   logging: {
29 |     fetches: {
30 |       fullUrl: process.env.LOG_FETCHES === "true",
31 |     },
32 |   },
33 |   typescript: {
34 |     ignoreBuildErrors: true,
35 |   },
36 |   experimental: {
37 |     instrumentationHook: process.env.NODE_ENV === "production",
38 |     serverComponentsExternalPackages: ["@trigger.dev/sdk"],
39 |   },
40 |   async headers() {
41 |     return [
42 |       {
43 |         source: "/((?!api/proxy).*)",
44 |         headers: [
45 |           {
46 |             key: "X-Frame-Options",
47 |             value: "DENY",
48 |           },
49 |         ],
50 |       },
51 |     ];
52 |   },
53 | };
54 |
55 | export default withSentryConfig(withBundleAnalyzer(config), {
56 |   silent: !process.env.CI,
57 |   telemetry: false,
58 |   widenClientFileUpload: true,
59 |   hideSourceMaps: true,
60 |   disableLogger: true,
61 |   tunnelRoute: "/monitoring",
62 |   sourcemaps: {
63 |     disable: true,
64 |   },
65 | });
```

apps/dashboard/package.json
```
1 | {
2 |   "name": "@midday/dashboard",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "scripts": {
6 |     "build": "NODE_ENV=production next build",
7 |     "clean": "git clean -xdf .next .turbo node_modules",
8 |     "jobs": "trigger dev",
9 |     "jobs:deploy": "trigger deploy",
10 |     "dev": "TZ=UTC next dev -p 3001",
11 |     "lint": "next lint",
12 |     "format": "biome format --write .",
13 |     "start": "next start",
14 |     "typecheck": "tsc --noEmit"
15 |   },
16 |   "dependencies": {
17 |     "@ai-sdk/openai": "^0.0.66",
18 |     "@date-fns/tz": "^1.1.2",
19 |     "@fast-csv/format": "5.0.0",
20 |     "@hookform/resolvers": "^3.9.0",
21 |     "@midday/app-store": "workspace:*",
22 |     "@midday/events": "workspace:*",
23 |     "@midday/inbox": "workspace:*",
24 |     "@midday/invoice": "workspace:*",
25 |     "@midday/kv": "workspace:*",
26 |     "@midday/location": "workspace:*",
27 |     "@midday/notification": "workspace:*",
28 |     "@midday/supabase": "workspace:*",
29 |     "@midday/ui": "workspace:*",
30 |     "@midday/utils": "workspace:*",
31 |     "@novu/headless": "^2.0.3",
32 |     "@number-flow/react": "^0.4.1",
33 |     "@react-google-maps/api": "^2.20.3",
34 |     "@sentry/nextjs": "^8",
35 |     "@supabase/sentry-js-integration": "^0.3.0",
36 |     "@tanstack/react-table": "^8.20.5",
37 |     "@team-plain/typescript-sdk": "4.7.0",
38 |     "@todesktop/client-active-win": "^0.15.0",
39 |     "@todesktop/client-core": "^1.12.0",
40 |     "@todesktop/runtime": "^1.6.4",
41 |     "@trigger.dev/react-hooks": "3.3.7",
42 |     "@trigger.dev/sdk": "3.3.7",
43 |     "@uidotdev/usehooks": "^2.4.1",
44 |     "@upstash/ratelimit": "^2.0.4",
45 |     "@zip.js/zip.js": "2.7.52",
46 |     "ai": "3.4.9",
47 |     "change-case": "^5.4.4",
48 |     "date-fns": "^4.1.0",
49 |     "dub": "^0.38.1",
50 |     "framer-motion": "^11.12.0",
51 |     "geist": "^1.3.1",
52 |     "little-date": "^1.0.0",
53 |     "lottie-react": "^2.4.0",
54 |     "ms": "^2.1.3",
55 |     "next": "14.2.1",
56 |     "next-international": "1.2.4",
57 |     "next-safe-action": "^7.9.3",
58 |     "next-themes": "^0.3.0",
59 |     "nuqs": "^1.19.3",
60 |     "papaparse": "^5.4.1",
61 |     "react": "18.3.1",
62 |     "react-colorful": "^5.6.1",
63 |     "react-dom": "18.3.1",
64 |     "react-dropzone": "^14.2.3",
65 |     "react-hook-form": "^7.53.0",
66 |     "react-hotkeys-hook": "^4.5.1",
67 |     "react-intersection-observer": "^9.13.1",
68 |     "react-markdown": "^9.0.1",
69 |     "react-plaid-link": "^3.6.0",
70 |     "react-use-draggable-scroll": "^0.4.7",
71 |     "recharts": "^2.12.7",
72 |     "resend": "^4.0.1",
73 |     "sharp": "^0.33.5",
74 |     "tus-js-client": "4.1.0",
75 |     "use-long-press": "^3.2.0",
76 |     "use-places-autocomplete": "^4.0.1",
77 |     "zod": "^3.23.8",
78 |     "zustand": "^4.5.5"
79 |   },
80 |   "devDependencies": {
81 |     "@midday/tsconfig": "workspace:*",
82 |     "@next/bundle-analyzer": "14.2.1",
83 |     "@t3-oss/env-nextjs": "^0.11.1",
84 |     "@todesktop/tailwind-variants": "^1.0.1",
85 |     "@types/node": "^22.7.4",
86 |     "@types/papaparse": "^5.3.15",
87 |     "@types/react": "^18.3.11",
88 |     "@types/react-dom": "^18.3.0",
89 |     "trigger.dev": "3.3.7",
90 |     "typescript": "^5.6.3"
91 |   }
92 | }
```

apps/dashboard/postcss.config.cjs
```
1 | // @ts-expect-error - No types for postcss
2 | module.exports = require("@midday/ui/postcss");
```

apps/dashboard/sentry.client.config.ts
```
1 | import { createClient } from "@midday/supabase/client";
2 | import * as Sentry from "@sentry/nextjs";
3 | import { supabaseIntegration } from "@supabase/sentry-js-integration";
4 |
5 | const client = createClient();
6 |
7 | Sentry.init({
8 |   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
9 |   tracesSampleRate: 1,
10 |   debug: false,
11 |   enabled: process.env.NODE_ENV === "production",
12 |   integrations: [
13 |     supabaseIntegration(client, Sentry, {
14 |       tracing: true,
15 |       breadcrumbs: true,
16 |       errors: true,
17 |     }),
18 |   ],
19 | });
```

apps/dashboard/sentry.edge.config.ts
```
1 | import * as Sentry from "@sentry/nextjs";
2 |
3 | Sentry.init({
4 |   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
5 |   enabled: process.env.NODE_ENV === "production",
6 |   tracesSampleRate: 1,
7 |   debug: false,
8 | });
```

apps/dashboard/sentry.server.config.ts
```
1 | import { createClient } from "@midday/supabase/client";
2 | import * as Sentry from "@sentry/nextjs";
3 | import { supabaseIntegration } from "@supabase/sentry-js-integration";
4 |
5 | const client = createClient();
6 |
7 | Sentry.init({
8 |   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
9 |   tracesSampleRate: 1,
10 |   debug: false,
11 |   enabled: process.env.NODE_ENV === "production",
12 |   integrations: [
13 |     supabaseIntegration(client, Sentry, {
14 |       tracing: true,
15 |       breadcrumbs: true,
16 |       errors: true,
17 |     }),
18 |   ],
19 | });
```

apps/dashboard/tailwind.config.ts
```
1 | import baseConfig from "@midday/ui/tailwind.config";
2 | import type { Config } from "tailwindcss";
3 |
4 | export default {
5 |   content: [
6 |     "./src/**/*.{ts,tsx}",
7 |     "../../packages/ui/src/**/*.{ts,tsx}",
8 |     "../../packages/invoice/src/**/*.{ts,tsx}",
9 |   ],
10 |   presets: [baseConfig],
11 |   plugins: [require("@todesktop/tailwind-variants")],
12 | } satisfies Config;
```

apps/dashboard/trigger.config.ts
```
1 | import { defineConfig } from "@trigger.dev/sdk/v3";
2 |
3 | export default defineConfig({
4 |   project: process.env.TRIGGER_PROJECT_ID!,
5 |   runtime: "node",
6 |   logLevel: "log",
7 |   retries: {
8 |     enabledInDev: false,
9 |     default: {
10 |       maxAttempts: 3,
11 |       minTimeoutInMs: 1000,
12 |       maxTimeoutInMs: 10000,
13 |       factor: 2,
14 |       randomize: true,
15 |     },
16 |   },
17 |   build: {
18 |     external: ["sharp"],
19 |   },
20 |   dirs: ["./jobs/tasks"],
21 | });
```

apps/dashboard/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/nextjs.json",
3 |   "compilerOptions": {
4 |     "baseUrl": ".",
5 |     "paths": {
6 |       "@/*": ["./src/*"]
7 |     },
8 |     "strict": true
9 |   },
10 |   "include": [
11 |     "next-env.d.ts",
12 |     "next.config.js",
13 |     "**/*.ts",
14 |     "**/*.tsx",
15 |     ".next/types/**/*.ts",
16 |     "tailwind.config.ts"
17 |   ],
18 |   "exclude": ["node_modules"]
19 | }
```

apps/dashboard/vercel.json
```
1 | {
2 |   "version": 2,
3 |   "public": false,
4 |   "github": {
5 |     "enabled": false
6 |   },
7 |   "regions": ["fra1", "sfo1", "iad1"]
8 | }
```

apps/docs/examples.mdx
```
1 | ---
2 | title: "Examples"
3 | "og:title": "Midday API Examples - Build with the Midday API"
4 | description: "Explore ideas and examples of what you can build with the Midday API"
5 | icon: github
6 | ---
```

apps/docs/integrations.mdx
```
1 | ---
2 | title: "Integrations"
3 | "og:title": "Midday Integrations: Connect Midday to services"
4 | description: "Integrate Midday with your services."
5 | icon: object-union
6 | ---
```

apps/docs/introduction.mdx
```
1 | ---
2 | title: Introduction
3 | "og:title": "Getting Started with Midday.ai - Documentation"
4 | description: "Midday.ai | Run your business smarter."
5 | icon: rocket
6 | ---
7 |
8 | <Frame>
9 |   <img src="/images/header.png" alt="Midday header" width="1200" height="630" />
10 | </Frame>
11 |
12 | You can self-host Midday on your own cloud infrastructure for greater control over your data. This guide will walk you through the entire process of setting up Midday.
13 |
14 | ## Prerequisites
15 |
16 | Before you begin, make sure you have the following:
17 |
18 | - A [GitHub](https://github.com/) account
19 | - An [Upstash](https://upstash.com/) account
20 | - A [Supabase](https://supabase.com/) account
21 | - A [Vercel](https://vercel.com/) account
```

apps/docs/local-development.mdx
```
1 | ---
2 | title: "Local Development"
3 | "og:title": "How to setup Midday for Local Development"
4 | description: "A guide on how to run Midday's codebase locally."
5 | icon: code
6 | ---
7 |
8 | ###
9 |
10 | ## Introduction
11 |
12 | Midday's codebase is set up in a monorepo via [Turborepo](https://turbo.build/repo) and is fully [open-source on GitHub](https://git.new/midday).
13 |
14 | Here's the monorepo structure:
15 |
16 | ```
17 | apps
18 | ├── api
19 | ├── dashboard
20 | ├── docs
21 | ├── engine
22 | ├── mobile
23 | ├── website
24 | packages
25 | ├── documents
26 | ├── email
27 | ├── events
28 | ├── import
29 | ├── inbox
30 | ├── jobs
31 | ├── kv
32 | ├── location
33 | ├── notification
34 | ├── supabase
35 | ├── tsconfig
36 | ├── ui
37 | ├── utils
38 | ```
39 |
40 | The `apps` directory contains the code for:
41 |
42 | - `api`: The backend for Midday (supabase).
43 | - `dashboard`: Midday's application ([app.midday.ai](https://app.midday.ai)).
44 | - `docs`: Midday's documentation site ([midday.ai/docs](https://midday.ai/docs)).
45 | - `engine`: Midday's bank engine ([midday.ai/engine](https://midday.ai/engine)).
46 | - `mobile`: Midday's mobile app.
47 | - `website`: Midday's website app ([midday.ai](https://midday.ai)).
48 |
49 | The `packages` directory contains the code for:
50 |
51 | - `documents`: OCR for receipts.
52 | - `events`: Analytics library.
53 | - `import`: CSV-importer.
54 | - `inbox`: Inbox utils.
55 | - `jobs`: Background jobs.
56 | - `kv`: Key value storage client.
57 | - `location`: Location related utils.
58 | - `notification`: Notifications client.
59 | - `supabase`: Queries and client.
60 | - `tsconfig`: The TypeScript configuration for Midday's web app.
61 | - `ui`: UI component library.
62 | - `utils`: A collection of utility functions and constants used across Midday's codebase.
63 |
64 | ## Running Midday locally
65 |
66 | To run Midday locally, you'll need to set up the following:
67 |
68 | - A [Supabase](https://supabase.com/) account
69 | - An [Upstash](https://upstash.com/) account
70 |
71 | ## Step 1: Local setup
72 |
73 | First, you'll need to clone the Midday repo and install the dependencies.
74 |
75 | <Steps>
76 |
77 |   <Step title="Clone the repo">
78 |
79 | First, clone the [midday.ai repo](https://d.to/github) into a public GitHub repository.
80 |
81 |     ```bash Terminal
82 |     git clone https://github.com/midday-ai/midday.git
83 |     ```
84 |
85 |   </Step>
86 |
87 |   <Step title="Install dependencies">
88 |
89 |     Run the following command to install the dependencies:
90 |
91 |     ```bash Terminal
92 |     bun i
93 |     ```
94 |
95 |   </Step>
96 |
97 | </Steps>
```

apps/docs/mint.json
```
1 | {
2 |     "$schema": "https://mintlify.com/schema.json",
3 |     "name": "Midday.ai Docs",
4 |     "logo": {
5 |       "dark": "/logos/logotype-dark.svg",
6 |       "light": "/logos/logotype.svg",
7 |       "href": "https://midday.ai"
8 |     },
9 |     "favicon": "/logos/favicon.png",
10 |     "colors": {
11 |       "primary": "#1D1D1D",
12 |       "light": "#F2F1EF",
13 |       "dark": "#1D1D1D",
14 |       "background": {
15 |         "dark": "#121212",
16 |         "light": "#FFFFFF"
17 |       },
18 |       "anchors": {
19 |         "from": "#FF7F57",
20 |         "to": "#9563FF"
21 |       }
22 |     },
23 |     "topbarLinks": [
24 |       {
25 |         "name": "Support",
26 |         "url": "mailto:support@midday.ai"
27 |       }
28 |     ],
29 |     "topbarCtaButton": {
30 |       "name": "Dashboard",
31 |       "url": "https://app.midday.ai"
32 |     },
33 |     "openapi": "https://engine.midday.ai/openapi",
34 |     "tabs": [
35 |       {
36 |         "name": "Engine API Reference",
37 |         "url": "api-reference/engine"
38 |       }
39 |     ],
40 |     "anchors": [
41 |       {
42 |         "name": "Help Center",
43 |         "icon": "question",
44 |         "url": "https://midday.ai/support"
45 |       },
46 |       {
47 |         "name": "GitHub",
48 |         "icon": "github",
49 |         "url": "https://git.new/midday"
50 |       }
51 |     ],
52 |     "navigation": [
53 |       {
54 |         "group": "Getting Started",
55 |         "pages": ["introduction"]
56 |       },
57 |       {
58 |         "group": "Resources",
59 |         "pages": ["integrations", "examples"]
60 |       },
61 |       {
62 |         "group": "Open source",
63 |         "pages": ["local-development", "self-hosting"]
64 |       },
65 |       {
66 |         "group": "Engine API Reference",
67 |         "pages": [
68 |           "api-reference/engine/introduction"
69 |         ]
70 |       },
71 |       {
72 |         "group": "Links",
73 |         "pages": [
74 |           "api-reference/engine/endpoint/get-transactions",
75 |           "api-reference/engine/endpoint/get-accounts",
76 |           "api-reference/engine/endpoint/get-account-balance",
77 |           "api-reference/engine/endpoint/search-institutions",
78 |           "api-reference/engine/endpoint/auth-link-gocardless",
79 |           "api-reference/engine/endpoint/exchange-token-gocardless",
80 |           "api-reference/engine/endpoint/auth-link-plaid",
81 |           "api-reference/engine/endpoint/exchange-token-plaid",
82 |           "api-reference/engine/endpoint/health"
83 |         ]
84 |       }
85 |     ],
86 |     "api": {
87 |       "maintainOrder": true
88 |     },
89 |     "feedback": {
90 |       "thumbsRating": true
91 |     },
92 |     "footerSocials": {
93 |       "twitter": "https://twitter.com/middayai",
94 |       "github": "https://git.new/midday",
95 |       "website": "https://midday.ai",
96 |       "linkedin": "https://www.linkedin.com/company/midday-ai"
97 |     }
98 |   }
```

apps/docs/package.json
```
1 | {
2 |   "name": "@midday/docs",
3 |   "scripts": {
4 |     "dev": "mintlify dev --port 3004",
5 |     "generate:engine": "bunx @mintlify/scraping@latest openapi-file http://localhost:3002/openapi -o api-reference/engine/endpoint"
6 |   },
7 |   "devDependencies": {
8 |     "mintlify": "^4.0.236"
9 |   }
10 | }
```

apps/docs/self-hosting.mdx
```
1 | ---
2 | title: "Self-hosting Midday"
3 | "og:title": "How to self-host Midday in 8 easy steps"
4 | description: "An end-to-end guide on how to self-host Midday"
5 | icon: server
6 | ---
```

apps/engine/.dev.vars-example
```
1 | API_SECRET_KEY=secret
2 | GOCARDLESS_SECRET_ID=
3 | GOCARDLESS_SECRET_KEY=
4 | PLAID_CLIENT_ID=
5 | PLAID_SECRET=
6 | PLAID_ENVIRONMENT=sandbox
7 | TYPESENSE_API_KEY=
8 | TYPESENSE_ENDPOINT=
9 | TYPESENSE_ENDPOINT_US=
10 | TYPESENSE_ENDPOINT_EU=
11 | TYPESENSE_ENDPOINT_AU=
```

apps/engine/package.json
```
1 | {
2 |   "name": "@midday/engine",
3 |   "scripts": {
4 |     "dev": "NODE_ENV=development wrangler dev src/index.ts --port 3002",
5 |     "deploy": "wrangler deploy --minify src/index.ts",
6 |     "clean": "rm -rf .turbo node_modules",
7 |     "lint": "biome check .",
8 |     "format": "biome format --write .",
9 |     "check:types": "tsc --noEmit"
10 |   },
11 |   "dependencies": {
12 |     "@hono/swagger-ui": "^0.5.0",
13 |     "@hono/zod-openapi": "^0.18.3",
14 |     "@hono/zod-validator": "^0.4.1",
15 |     "hono": "^4.6.13",
16 |     "plaid": "^30.0.0",
17 |     "typesense": "^1.8.2",
18 |     "workers-ai-provider": "^0.0.10",
19 |     "xior": "^0.6.1",
20 |     "zod": "^3.23.8"
21 |   },
22 |   "devDependencies": {
23 |     "@cloudflare/workers-types": "^4.20241205.0",
24 |     "@types/bun": "^1.1.14",
25 |     "wrangler": "^3.93.0"
26 |   },
27 |   "exports": {
28 |     "./client": "./src/client/index.ts",
29 |     "./gocardless/utils": "./src/providers/gocardless/utils.ts"
30 |   }
31 | }
```

apps/engine/tsconfig.json
```
1 | {
2 |   "compilerOptions": {
3 |     "moduleResolution": "Bundler",
4 |     "baseUrl": ".",
5 |     "paths": {
6 |       "@/*": ["./src/*"]
7 |     },
8 |     "strict": true,
9 |     "types": ["@cloudflare/workers-types", "bun-types"],
10 |     "jsx": "react-jsx",
11 |     "jsxImportSource": "hono/jsx",
12 |     "lib": ["ESNext"],
13 |     "target": "ESNext",
14 |     "module": "ESNext",
15 |     "moduleDetection": "force",
16 |     "allowJs": true,
17 |     "skipLibCheck": true,
18 |     "noFallthroughCasesInSwitch": true
19 |   }
20 | }
```

apps/engine/wrangler.toml
```
1 | compatibility_date = "2024-11-11"
2 | workers_dev = false
3 | logpush = true
4 |
5 | [observability]
6 | enabled = true
7 |
8 |
9 | [env.production]
10 | name = "engine"
11 | route = { pattern = "engine.midday.ai/*", zone_name = "midday.ai" }
12 |
13 | kv_namespaces = [
14 |   { binding = "KV", id = "1ce9f0355d854a569f72bfccbfbea369" },
15 |   { binding = "ENRICH_KV", id = "1ce9f0355d854a569f72bfccbfbea369" }
16 | ]
17 |
18 | mtls_certificates = [
19 |   { binding = "TELLER_CERT", certificate_id = "76fdbac8-e96b-4a1e-922c-e54891b7371c" }
20 | ]
21 |
22 | r2_buckets = [
23 |   { binding = "STORAGE", bucket_name = "engine-assets", preview_bucket_name = "", jurisdiction = "eu" }
24 | ]
25 |
26 | [env.production.ai]
27 | binding = "AI"
28 | provider = "llama"
29 | model = "llama-3.3"
30 | jurisdiction = "eu"
31 |
32 | [env.staging]
33 | name = "engine-staging"
34 | route = { pattern = "engine-staging.midday.ai/*", zone_name = "midday.ai" }
35 |
36 | kv_namespaces = [
37 |   { binding = "KV", id = "825dc18b2a38463492ff0db06ba99fc8" },
38 |   { binding = "ENRICH_KV", id = "72051e71ec964899a3d0da95df04b92f" }
39 | ]
40 |
41 | mtls_certificates = [
42 |   { binding = "TELLER_CERT", certificate_id = "76fdbac8-e96b-4a1e-922c-e54891b7371c" }
43 | ]
44 |
45 | r2_buckets = [
46 |   { binding = "STORAGE", bucket_name = "engine-assets", preview_bucket_name = "", jurisdiction = "eu" }
47 | ]
48 |
49 | [env.staging.ai]
50 | binding = "AI"
51 | provider = "llama"
52 | model = "llama-3.3"
53 | jurisdiction = "eu"
```

apps/mobile/package.json
```
1 | {
2 |   "name": "mobile",
3 |   "version": "0.0.0",
4 |   "private": true
5 | }
```

apps/website/image-loader.ts
```
1 | interface ImageLoaderParams {
2 |   src: string;
3 |   width: number;
4 |   quality?: number;
5 | }
6 |
7 | export default function imageLoader({
8 |   src,
9 |   width,
10 |   quality = 80,
11 | }: ImageLoaderParams): string {
12 |   return `https://midday.ai/cdn-cgi/image/width=${width},quality=${quality}/${src}`;
13 | }
```

apps/website/next.config.mjs
```
1 | /** @type {import("next").NextConfig} */
2 | const config = {
3 |   poweredByHeader: false,
4 |   reactStrictMode: true,
5 |   transpilePackages: ["@midday/ui", "@midday/tailwind", "next-mdx-remote"],
6 |   eslint: {
7 |     ignoreDuringBuilds: true,
8 |   },
9 |   typescript: {
10 |     ignoreBuildErrors: true,
11 |   },
12 |   experimental: {
13 |     inlineCss: true,
14 |   },
15 |   images: {
16 |     loader: "custom",
17 |     loaderFile: "./image-loader.ts",
18 |     remotePatterns: [
19 |       {
20 |         protocol: "https",
21 |         hostname: "**",
22 |       },
23 |     ],
24 |   },
25 |   async redirects() {
26 |     return [
27 |       {
28 |         source: "/en/(.*)",
29 |         destination: "/",
30 |         permanent: true,
31 |       },
32 |       {
33 |         source: "/public-beta",
34 |         destination: "/",
35 |         permanent: true,
36 |       },
37 |       {
38 |         source: "/pitch",
39 |         destination: "/",
40 |         permanent: true,
41 |       },
42 |     ];
43 |   },
44 | };
45 |
46 | export default config;
```

apps/website/package.json
```
1 | {
2 |   "name": "@midday/website",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "scripts": {
6 |     "build": "NODE_ENV=production next build",
7 |     "clean": "git clean -xdf .next .turbo node_modules",
8 |     "dev": "TZ=UTC next dev --turbopack -p 3000",
9 |     "lint": "next lint",
10 |     "format": "biome format --write .",
11 |     "start": "next start",
12 |     "typecheck": "tsc --noEmit"
13 |   },
14 |   "dependencies": {
15 |     "@midday/supabase": "workspace:*",
16 |     "@midday/ui": "workspace:*",
17 |     "@openpanel/nextjs": "^1.0.7",
18 |     "@openstatus/react": "^0.0.3",
19 |     "@team-plain/typescript-sdk": "5.5.0",
20 |     "@uidotdev/usehooks": "^2.4.1",
21 |     "date-fns": "^4.1.0",
22 |     "framer-motion": "^11.13.5",
23 |     "geist": "^1.3.1",
24 |     "next": "15.1.0",
25 |     "next-mdx-remote": "^5.0.0",
26 |     "next-safe-action": "^7.9.9",
27 |     "react": "19.0.0",
28 |     "react-dom": "19.0.0",
29 |     "react-hls-player": "^3.0.7",
30 |     "react-use-draggable-scroll": "^0.4.7",
31 |     "resend": "^4.0.1",
32 |     "server-only": "^0.0.1",
33 |     "sharp": "^0.33.5",
34 |     "sugar-high": "^0.7.5"
35 |   },
36 |   "devDependencies": {
37 |     "@midday/tsconfig": "workspace:*",
38 |     "@types/node": "^22.10.1",
39 |     "@types/react": "19.0.1",
40 |     "@types/react-dom": "npm:types-react-dom@19.0.0-alpha.3"
41 |   },
42 |   "overrides": {
43 |     "@types/react": "npm:types-react@19.0.0-rc.1",
44 |     "@types/react-dom": "npm:types-react-dom@19.0.0-rc.1"
45 |   }
46 | }
```

apps/website/postcss.config.cjs
```
1 | module.exports = require("@midday/ui/postcss");
```

apps/website/tailwind.config.ts
```
1 | import baseConfig from "@midday/ui/tailwind.config";
2 | import type { Config } from "tailwindcss";
3 |
4 | export default {
5 |   content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
6 |   presets: [baseConfig],
7 |   theme: {
8 |     container: {
9 |       center: true,
10 |     },
11 |   },
12 | } satisfies Config;
```

apps/website/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/nextjs.json",
3 |   "compilerOptions": {
4 |     "baseUrl": ".",
5 |     "paths": {
6 |       "@/*": ["./src/*"]
7 |     }
8 |   },
9 |   "include": [
10 |     "next-env.d.ts",
11 |     "next.config.js",
12 |     "**/*.ts",
13 |     "**/*.tsx",
14 |     ".next/types/**/*.ts",
15 |     "tailwind.config.ts"
16 |   ],
17 |   "exclude": ["node_modules"]
18 | }
```

apps/website/vercel.json
```
1 | {
2 |   "version": 2,
3 |   "public": false,
4 |   "github": {
5 |     "enabled": false
6 |   },
7 |   "regions": ["fra1", "sfo1", "iad1"]
8 | }
```

packages/app-store/package.json
```
1 | {
2 |   "name": "@midday/app-store",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "sideEffects": false,
6 |   "scripts": {
7 |     "clean": "rm -rf .turbo node_modules",
8 |     "lint": "biome check .",
9 |     "format": "biome format --write .",
10 |     "typecheck": "tsc --noEmit"
11 |   },
12 |   "dependencies": {
13 |     "@ai-sdk/openai": "^0.0.66",
14 |     "@slack/bolt": "^3.22.0",
15 |     "@slack/web-api": "^7.5.0",
16 |     "ai": "^3.4.9",
17 |     "zod": "^3.23.8"
18 |   },
19 |   "devDependencies": {
20 |     "@types/node": "^22.7.4",
21 |     "typescript": "^5.6.3"
22 |   },
23 |   "exports": {
24 |     ".": "./src/index.ts",
25 |     "./slack": "./src/slack/index.ts",
26 |     "./slack-notifications": "./src/slack/lib/notifications/transactions.ts",
27 |     "./slack-client": "./src/slack/lib/client.ts",
28 |     "./db": "./src/db/index.ts"
29 |   }
30 | }
```

packages/app-store/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json",
3 |   "include": ["src", "."],
4 |   "exclude": ["node_modules"]
5 | }
```

packages/documents/package.json
```
1 | {
2 |   "name": "@midday/documents",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "main": "src/index.ts",
6 |   "scripts": {
7 |     "clean": "rm -rf .turbo node_modules",
8 |     "lint": "biome check .",
9 |     "format": "biome format --write .",
10 |     "typecheck": "tsc --noEmit",
11 |     "test": "bun test src"
12 |   },
13 |   "dependencies": {
14 |     "@ai-sdk/openai": "^0.0.66",
15 |     "@azure-rest/ai-document-intelligence": "^1.0.0-beta.3",
16 |     "@midday/utils": "workspace:*",
17 |     "ai": "3.4.9",
18 |     "base64-arraybuffer": "^1.0.2",
19 |     "change-case": "^5.4.4",
20 |     "heic-convert": "1.2.4",
21 |     "zod": "^3.23.8"
22 |   },
23 |   "devDependencies": {
24 |     "@types/bun": "^1.1.10",
25 |     "@types/heic-convert": "1.2.3",
26 |     "request": "^2.88.2"
27 |   }
28 | }
```

packages/documents/tsconfig.json
```
1 | {
2 |     "extends": "@midday/tsconfig/nextjs.json",
3 |     "include": ["src"],
4 |     "exclude": ["node_modules"]
5 |   }
```

packages/email/package.json
```
1 | {
2 |   "name": "@midday/email",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "main": "index.ts",
6 |   "scripts": {
7 |     "clean": "rm -rf .turbo node_modules",
8 |     "lint": "biome check .",
9 |     "format": "biome format --write .",
10 |     "typecheck": "tsc --noEmit",
11 |     "dev": "email dev -p 3003",
12 |     "build": "email build",
13 |     "start": "email start"
14 |   },
15 |   "dependencies": {
16 |     "@midday/ui": "workspace:*",
17 |     "@midday/utils": "workspace:*",
18 |     "@react-email/components": "0.0.31",
19 |     "@react-email/render": "0.0.10",
20 |     "@react-email/tailwind": "1.0.4",
21 |     "date-fns": "^4.1.0",
22 |     "react-email": "3.0.4",
23 |     "responsive-react-email": "^0.0.5"
24 |   },
25 |   "devDependencies": {
26 |     "typescript": "^5.7.2"
27 |   }
28 | }
```

packages/email/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json",
3 |   "include": ["emails", "components"],
4 |   "exclude": ["node_modules"],
5 |   "compilerOptions": {
6 |     "baseUrl": ".",
7 |     "module": "NodeNext",
8 |     "moduleResolution": "NodeNext",
9 |     "jsx": "react-jsx",
10 |     "jsxImportSource": "react"
11 |   }
12 | }
```

packages/email/vercel.json
```
1 | {
2 |   "version": 2,
3 |   "public": false,
4 |   "github": {
5 |     "enabled": false
6 |   },
7 |   "regions": ["fra1", "sfo1", "iad1"]
8 | }
```

packages/events/package.json
```
1 | {
2 |   "name": "@midday/events",
3 |   "version": "1.0.0",
4 |   "main": "src/index.ts",
5 |   "private": true,
6 |   "sideEffects": false,
7 |   "scripts": {
8 |     "clean": "rm -rf .turbo node_modules",
9 |     "lint": "biome check .",
10 |     "format": "biome --write .",
11 |     "typecheck": "tsc --noEmit"
12 |   },
13 |   "dependencies": {
14 |     "@openpanel/nextjs": "^1.0.6",
15 |     "@vercel/functions": "^1.5.0"
16 |   },
17 |   "devDependencies": {
18 |     "typescript": "^5.6.3"
19 |   },
20 |   "exports": {
21 |     "./server": "./src/server.ts",
22 |     "./client": "./src/client.tsx",
23 |     "./events": "./src/events.ts"
24 |   }
25 | }
```

packages/events/tsconfig.json
```
1 | {
2 |     "extends": "@midday/tsconfig/nextjs.json",
3 |     "include": ["src"],
4 |     "exclude": ["node_modules"]
5 |   }
```

packages/import/package.json
```
1 | {
2 |   "name": "@midday/import",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "main": "src/index.ts",
6 |   "scripts": {
7 |     "clean": "rm -rf .turbo node_modules",
8 |     "lint": "biome check .",
9 |     "format": "biome format --write .",
10 |     "typecheck": "tsc --noEmit",
11 |     "test": "bun test src"
12 |   },
13 |   "dependencies": {
14 |     "change-case": "^5.4.4",
15 |     "date-fns-tz": "^3.2.0",
16 |     "uuid": "^10.0.0"
17 |   },
18 |   "exports": {
19 |     ".": "./src/index.ts",
20 |     "./mappings": "./src/mappings.ts",
21 |     "./transform": "./src/transform.ts",
22 |     "./validate": "./src/validate.ts"
23 |   }
24 | }
```

packages/inbox/package.json
```
1 | {
2 |   "name": "@midday/inbox",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "main": "src/index.ts",
6 |   "scripts": {
7 |     "clean": "rm -rf .turbo node_modules",
8 |     "lint": "biome check .",
9 |     "format": "biome format --write .",
10 |     "typecheck": "tsc --noEmit",
11 |     "test": "bun test src"
12 |   },
13 |   "dependencies": {
14 |     "zod": "^3.23.8"
15 |   }
16 | }
```

packages/invoice/package.json
```
1 | {
2 |   "name": "@midday/invoice",
3 |   "private": true,
4 |   "main": "src/index.tsx",
5 |   "scripts": {
6 |     "clean": "rm -rf .turbo node_modules",
7 |     "lint": "biome check .",
8 |     "format": "biome format --write .",
9 |     "typecheck": "tsc --noEmit"
10 |   },
11 |   "exports": {
12 |     ".": "./src/index.tsx",
13 |     "./token": "./src/token/index.ts",
14 |     "./number": "./src/utils/number.ts",
15 |     "./templates/html": "./src/templates/html/index.tsx",
16 |     "./templates/pdf": "./src/templates/pdf/index.tsx",
17 |     "./templates/og": "./src/templates/og/index.tsx",
18 |     "./editor": "./src/editor/index.tsx",
19 |     "./calculate": "./src/utils/calculate.ts",
20 |     "./format-to-html": "./src/templates/html/format.tsx",
21 |     "./default": "./src/utils/default.ts",
22 |     "./content": "./src/utils/content.ts"
23 |   },
24 |   "dependencies": {
25 |     "@midday/ui": "workspace:*",
26 |     "@midday/utils": "workspace:*",
27 |     "@react-pdf/renderer": "^4.0.0",
28 |     "date-fns": "^4.1.0",
29 |     "jose": "^5.9.6",
30 |     "qrcode": "^1.5.4"
31 |   }
32 | }
```

packages/invoice/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json",
3 |   "include": ["src"],
4 |   "exclude": ["node_modules"],
5 |   "compilerOptions": {
6 |     "module": "ESNext",
7 |     "moduleResolution": "Node",
8 |     "jsx": "react-jsx",
9 |     "jsxImportSource": "react"
10 |   }
11 | }
```

packages/kv/package.json
```
1 | {
2 |   "name": "@midday/kv",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "main": "src/index.ts",
6 |   "scripts": {
7 |     "clean": "rm -rf .turbo node_modules",
8 |     "lint": "biome check .",
9 |     "format": "biome format --write .",
10 |     "typecheck": "tsc --noEmit"
11 |   },
12 |   "dependencies": {
13 |     "@upstash/redis": "^1.34.2",
14 |     "server-only": "^0.0.1"
15 |   }
16 | }
```

packages/kv/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json",
3 |   "include": ["src"],
4 |   "exclude": ["node_modules"]
5 | }
```

packages/location/package.json
```
1 | {
2 |   "name": "@midday/location",
3 |   "version": "1.0.0",
4 |   "main": "src/index.ts",
5 |   "private": true,
6 |   "sideEffects": false,
7 |   "scripts": {
8 |     "clean": "rm -rf .turbo node_modules",
9 |     "lint": "biome check .",
10 |     "format": "biome --write .",
11 |     "typecheck": "tsc --noEmit"
12 |   },
13 |   "exports": {
14 |     ".": "./src/index.ts",
15 |     "./countries": "./src/countries.ts",
16 |     "./countries-intl": "./src/countries-intl.ts",
17 |     "./currencies": "./src/currencies.ts",
18 |     "./country-flags": "./src/country-flags.ts"
19 |   },
20 |   "devDependencies": {
21 |     "typescript": "^5.6.3"
22 |   }
23 | }
```

packages/location/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json",
3 |   "include": ["src"],
4 |   "exclude": ["node_modules"]
5 | }
```

packages/notification/package.json
```
1 | {
2 |   "name": "@midday/notification",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "main": "src/index.ts",
6 |   "scripts": {
7 |     "clean": "rm -rf .turbo node_modules",
8 |     "lint": "biome check .",
9 |     "format": "biome format --write .",
10 |     "typecheck": "tsc --noEmit"
11 |   },
12 |   "dependencies": {
13 |     "@novu/node": "^2.0.1",
14 |     "nanoid": "^5.0.7"
15 |   },
16 |   "devDependencies": {
17 |     "typescript": "^5.6.3"
18 |   }
19 | }
```

packages/notification/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json",
3 |   "include": ["src"],
4 |   "exclude": ["node_modules"]
5 | }
```

packages/supabase/package.json
```
1 | {
2 |   "name": "@midday/supabase",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "scripts": {
6 |     "clean": "rm -rf .turbo node_modules",
7 |     "lint": "biome check .",
8 |     "format": "biome format --write .",
9 |     "typecheck": "tsc --noEmit",
10 |     "db:generate": "supabase gen types --lang=typescript --project-id $PROJECT_ID --schema public > src/types/db.ts"
11 |   },
12 |   "dependencies": {
13 |     "@date-fns/utc": "^2.1.0",
14 |     "@supabase/postgrest-js": "^1.17.3",
15 |     "@supabase/ssr": "^0.5.1",
16 |     "date-fns": "^4.1.0",
17 |     "react": "18.3.1",
18 |     "server-only": "^0.0.1",
19 |     "supabase": "^1.219.2"
20 |   },
21 |   "devDependencies": {
22 |     "@supabase/supabase-js": "^2.46.1",
23 |     "typescript": "^5.6.3"
24 |   },
25 |   "exports": {
26 |     "./server": "./src/client/server.ts",
27 |     "./client": "./src/client/client.ts",
28 |     "./client-query": "./src/queries/client.ts",
29 |     "./job": "./src/client/job.ts",
30 |     "./mutations": "./src/mutations/index.ts",
31 |     "./middleware": "./src/client/middleware.ts",
32 |     "./queries": "./src/queries/index.ts",
33 |     "./cached-queries": "./src/queries/cached-queries.ts",
34 |     "./storage": "./src/utils/storage.ts",
35 |     "./types": "./src/types/index.ts"
36 |   }
37 | }
```

packages/supabase/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json",
3 |   "include": ["src", "."],
4 |   "exclude": ["node_modules"]
5 | }
```

packages/tsconfig/base.json
```
1 | {
2 | 	"$schema": "https://json.schemastore.org/tsconfig",
3 | 	"display": "Default",
4 | 	"compilerOptions": {
5 | 	  "esModuleInterop": true,
6 | 	  "incremental": false,
7 | 	  "isolatedModules": true,
8 | 	  "lib": ["es2022", "DOM", "DOM.Iterable"],
9 | 	  "module": "NodeNext",
10 | 	  "moduleDetection": "force",
11 | 	  "moduleResolution": "NodeNext",
12 | 	  "noUncheckedIndexedAccess": true,
13 | 	  "resolveJsonModule": true,
14 | 	  "skipLibCheck": true,
15 | 	  "strict": true,
16 | 	  "target": "ES2022"
17 | 	}
18 |   }
```

packages/tsconfig/nextjs.json
```
1 | {
2 |     "$schema": "https://json.schemastore.org/tsconfig",
3 |     "display": "Next.js",
4 |     "extends": "./base.json",
5 |     "compilerOptions": {
6 |       "plugins": [{ "name": "next" }],
7 |       "module": "ESNext",
8 |       "moduleResolution": "Bundler",
9 |       "allowJs": true,
10 |       "jsx": "preserve",
11 |       "noEmit": true
12 |     }
13 |   }
```

packages/tsconfig/package.json
```
1 | {
2 |     "name": "@midday/tsconfig",
3 |     "private": true,
4 |     "version": "1.0.0",
5 |     "files": [
6 |         "base.json"
7 |     ]
8 | }
```

packages/tsconfig/react-library.json
```
1 | {
2 |     "$schema": "https://json.schemastore.org/tsconfig",
3 |     "display": "React Library",
4 |     "extends": "./base.json",
5 |     "compilerOptions": {
6 |       "jsx": "react-jsx"
7 |     }
8 |   }
```

packages/ui/package.json
```
1 | {
2 |   "name": "@midday/ui",
3 |   "version": "1.0.0",
4 |   "private": true,
5 |   "sideEffects": false,
6 |   "files": ["tailwind.config.ts", "postcss.config.js", "globals.css"],
7 |   "scripts": {
8 |     "clean": "rm -rf .turbo node_modules",
9 |     "lint": "biome check .",
10 |     "format": "biome --write .",
11 |     "typecheck": "tsc --noEmit"
12 |   },
13 |   "devDependencies": {
14 |     "autoprefixer": "^10.4.20",
15 |     "react": "18.3.1",
16 |     "react-dom": "18.3.1",
17 |     "typescript": "^5.6.3"
18 |   },
19 |   "exports": {
20 |     "./animated-size-container": "./src/components/animated-size-container.tsx",
21 |     "./accordion": "./src/components/accordion.tsx",
22 |     "./alert-dialog": "./src/components/alert-dialog.tsx",
23 |     "./breadcrumb": "./src/components/breadcrumb.tsx",
24 |     "./alert": "./src/components/alert.tsx",
25 |     "./chart": "./src/components/chart.tsx",
26 |     "./currency-input": "./src/components/currency-input.tsx",
27 |     "./submit-button": "./src/components/submit-button.tsx",
28 |     "./avatar": "./src/components/avatar.tsx",
29 |     "./button": "./src/components/button.tsx",
30 |     "./calendar": "./src/components/calendar.tsx",
31 |     "./card": "./src/components/card.tsx",
32 |     "./slider": "./src/components/slider.tsx",
33 |     "./carousel": "./src/components/carousel.tsx",
34 |     "./checkbox": "./src/components/checkbox.tsx",
35 |     "./collapsible": "./src/components/collapsible.tsx",
36 |     "./combobox": "./src/components/combobox.tsx",
37 |     "./combobox-dropdown": "./src/components/combobox-dropdown.tsx",
38 |     "./command": "./src/components/command.tsx",
39 |     "./context-menu": "./src/components/context-menu.tsx",
40 |     "./date-range-picker": "./src/components/date-range-picker.tsx",
41 |     "./dialog": "./src/components/dialog.tsx",
42 |     "./drawer": "./src/components/drawer.tsx",
43 |     "./dropdown-menu": "./src/components/dropdown-menu.tsx",
44 |     "./form": "./src/components/form.tsx",
45 |     "./editor": "./src/components/editor/index.tsx",
46 |     "./globals.css": "./src/globals.css",
47 |     "./hover-card": "./src/components/hover-card.tsx",
48 |     "./icons": "./src/components/icons.tsx",
49 |     "./input": "./src/components/input.tsx",
50 |     "./input-otp": "./src/components/input-otp.tsx",
51 |     "./label": "./src/components/label.tsx",
52 |     "./navigation-menu": "./src/components/navigation-menu.tsx",
53 |     "./popover": "./src/components/popover.tsx",
54 |     "./postcss": "./postcss.config.js",
55 |     "./progress": "./src/components/progress.tsx",
56 |     "./radio-group": "./src/components/radio-group.tsx",
57 |     "./scroll-area": "./src/components/scroll-area.tsx",
58 |     "./select": "./src/components/select.tsx",
59 |     "./sheet": "./src/components/sheet.tsx",
60 |     "./badge": "./src/components/badge.tsx",
61 |     "./separator": "./src/components/separator.tsx",
62 |     "./skeleton": "./src/components/skeleton.tsx",
63 |     "./spinner": "./src/components/spinner.tsx",
64 |     "./switch": "./src/components/switch.tsx",
65 |     "./multiple-selector": "./src/components/multiple-selector.tsx",
66 |     "./table": "./src/components/table.tsx",
67 |     "./tabs": "./src/components/tabs.tsx",
68 |     "./tailwind.config": "./tailwind.config.ts",
69 |     "./textarea": "./src/components/textarea.tsx",
70 |     "./toast": "./src/components/toast.tsx",
71 |     "./toaster": "./src/components/toaster.tsx",
72 |     "./tooltip": "./src/components/tooltip.tsx",
73 |     "./time-range-input": "./src/components/time-range-input.tsx",
74 |     "./use-toast": "./src/components/use-toast.tsx",
75 |     "./cn": "./src/utils/cn.ts",
76 |     "./truncate": "./src/utils/truncate.ts",
77 |     "./hooks": "./src/hooks/index.ts",
78 |     "./quantity-input": "./src/components/quantity-input.tsx"
79 |   },
80 |   "dependencies": {
81 |     "@mui/icons-material": "^6.1.6",
82 |     "@radix-ui/react-accordion": "^1.2.1",
83 |     "@radix-ui/react-alert-dialog": "^1.1.2",
84 |     "@radix-ui/react-avatar": "^1.1.1",
85 |     "@radix-ui/react-checkbox": "^1.1.2",
86 |     "@radix-ui/react-collapsible": "^1.1.1",
87 |     "@radix-ui/react-context-menu": "^2.2.2",
88 |     "@radix-ui/react-dialog": "^1.1.2",
89 |     "@radix-ui/react-dropdown-menu": "^2.1.2",
90 |     "@radix-ui/react-hover-card": "^1.1.2",
91 |     "@radix-ui/react-icons": "^1.3.0",
92 |     "@radix-ui/react-label": "^2.1.0",
93 |     "@radix-ui/react-navigation-menu": "^1.2.1",
94 |     "@radix-ui/react-popover": "^1.1.2",
95 |     "@radix-ui/react-progress": "^1.1.0",
96 |     "@radix-ui/react-radio-group": "^1.2.1",
97 |     "@radix-ui/react-scroll-area": "^1.2.0",
98 |     "@radix-ui/react-select": "^2.1.2",
99 |     "@radix-ui/react-separator": "^1.1.0",
100 |     "@radix-ui/react-slider": "^1.2.1",
101 |     "@radix-ui/react-slot": "^1.1.0",
102 |     "@radix-ui/react-switch": "^1.1.1",
103 |     "@radix-ui/react-tabs": "^1.1.1",
104 |     "@radix-ui/react-toast": "^1.2.2",
105 |     "@radix-ui/react-tooltip": "^1.1.3",
106 |     "@tiptap/extension-bold": "^2.9.1",
107 |     "@tiptap/extension-link": "^2.9.1",
108 |     "@tiptap/extension-placeholder": "^2.9.1",
109 |     "@tiptap/extension-underline": "^2.9.1",
110 |     "@tiptap/pm": "^2.9.1",
[TRUNCATED]
```

packages/ui/postcss.config.js
```
1 | module.exports = {
2 |   plugins: {
3 |     tailwindcss: {},
4 |     autoprefixer: {},
5 |   },
6 | };
```

packages/ui/tailwind.config.ts
```
1 | import type { Config } from "tailwindcss";
2 |
3 | export default {
4 |   darkMode: ["class"],
5 |   content: ["./src/**/*.{ts,tsx}"],
6 |   safelist: ["dark", "light"],
7 |   theme: {
8 |     extend: {
9 |       colors: {
10 |         fontFamily: {
11 |           sans: "var(--font-geist-sans)",
12 |           mono: "var(--font-geist-mono)",
13 |         },
14 |         border: "hsl(var(--border))",
15 |         input: "hsl(var(--input))",
16 |         ring: "hsl(var(--ring))",
17 |         background: "hsl(var(--background))",
18 |         foreground: "hsl(var(--foreground))",
19 |         primary: {
20 |           DEFAULT: "hsl(var(--primary))",
21 |           foreground: "hsl(var(--primary-foreground))",
22 |         },
23 |         secondary: {
24 |           DEFAULT: "hsl(var(--secondary))",
25 |           foreground: "hsl(var(--secondary-foreground))",
26 |         },
27 |         destructive: {
28 |           DEFAULT: "hsl(var(--destructive))",
29 |           foreground: "hsl(var(--destructive-foreground))",
30 |         },
31 |         muted: {
32 |           DEFAULT: "hsl(var(--muted))",
33 |           foreground: "hsl(var(--muted-foreground))",
34 |         },
35 |         accent: {
36 |           DEFAULT: "hsl(var(--accent))",
37 |           foreground: "hsl(var(--accent-foreground))",
38 |         },
39 |         popover: {
40 |           DEFAULT: "hsl(var(--popover))",
41 |           foreground: "hsl(var(--popover-foreground))",
42 |         },
43 |         card: {
44 |           DEFAULT: "hsl(var(--card))",
45 |           foreground: "hsl(var(--card-foreground))",
46 |         },
47 |       },
48 |       borderRadius: {
49 |         lg: "var(--radius)",
50 |         md: "calc(var(--radius) - 2px)",
51 |         sm: "calc(var(--radius) - 4px)",
52 |       },
53 |       keyframes: {
54 |         "accordion-down": {
55 |           from: { height: "0" },
56 |           to: { height: "var(--radix-accordion-content-height)" },
57 |         },
58 |         "accordion-up": {
59 |           from: { height: "var(--radix-accordion-content-height)" },
60 |           to: { height: "0" },
61 |         },
62 |         jiggle: {
63 |           "0%": {
64 |             transform: "rotate(-4deg)",
65 |           },
66 |           "50%": {
67 |             transform: "rotate(4deg)",
68 |           },
69 |         },
70 |         "caret-blink": {
71 |           "0%,70%,100%": { opacity: "1" },
72 |           "20%,50%": { opacity: "0" },
73 |         },
74 |         scroll: {
75 |           to: {
76 |             transform: "translate(calc(-50% - 0.5rem))",
77 |           },
78 |         },
79 |         moveHorizontal: {
80 |           "0%": {
81 |             transform: "translateX(-50%) translateY(-10%)",
82 |           },
83 |           "50%": {
84 |             transform: "translateX(50%) translateY(10%)",
85 |           },
86 |           "100%": {
87 |             transform: "translateX(-50%) translateY(-10%)",
88 |           },
89 |         },
90 |         moveInCircle: {
91 |           "0%": {
92 |             transform: "rotate(0deg)",
93 |           },
94 |           "50%": {
95 |             transform: "rotate(180deg)",
96 |           },
97 |           "100%": {
98 |             transform: "rotate(360deg)",
99 |           },
100 |         },
101 |         moveVertical: {
102 |           "0%": {
103 |             transform: "translateY(-50%)",
104 |           },
105 |           "50%": {
106 |             transform: "translateY(50%)",
107 |           },
108 |           "100%": {
109 |             transform: "translateY(-50%)",
110 |           },
111 |         },
112 |         "webgl-scale-in-fade": {
113 |           "0%": {
114 |             opacity: "0",
115 |             transform: "scale(.7)",
116 |           },
117 |           "100%": {
118 |             opacity: "1",
119 |             transform: "scale(1)",
120 |           },
121 |         },
122 |         "open-scale-up-fade": {
123 |           "0%": {
124 |             opacity: "0",
125 |             transform: "scale(.98) translateY(5px)",
126 |           },
127 |           "100%": {
128 |             opacity: "1",
129 |             transform: "scale(1) translateY(0)",
130 |           },
131 |         },
132 |       },
133 |       animation: {
134 |         "animate-webgl-scale-in-fade": "webgl-scale-in-fade 1s ease-in-out",
135 |         "open-scale-up-fade": "open-scale-up-fade",
136 |         "accordion-down": "accordion-down 0.2s ease-out",
137 |         "accordion-up": "accordion-up 0.2s ease-out",
138 |         "caret-blink": "caret-blink 1.25s ease-out infinite",
139 |         first: "moveVertical 30s ease infinite",
140 |         second: "moveInCircle 20s reverse infinite",
141 |         third: "moveInCircle 40s linear infinite",
142 |         fourth: "moveHorizontal 40s ease infinite",
143 |         fifth: "moveInCircle 20s ease infinite",
144 |         scroll:
145 |           "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
146 |       },
147 |       screens: {
148 |         "3xl": "1800px",
149 |       },
150 |     },
151 |   },
152 |   plugins: [require("tailwindcss-animate")],
153 | } satisfies Config;
```

packages/ui/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/react-library.json",
3 |   "compilerOptions": {
4 |     "baseUrl": ".",
5 |     "paths": {
6 |       "@/*": ["./src/*"]
7 |     }
8 |   },
9 |   "include": ["src"],
10 |   "exclude": ["node_modules"]
11 | }
```

packages/utils/package.json
```
1 | {
2 |   "name": "@midday/utils",
3 |   "version": "1.0.0",
4 |   "main": "src/index.ts",
5 |   "private": true,
6 |   "sideEffects": false,
7 |   "scripts": {
8 |     "clean": "rm -rf .turbo node_modules",
9 |     "lint": "biome check .",
10 |     "format": "biome --write .",
11 |     "typecheck": "tsc --noEmit"
12 |   },
13 |   "devDependencies": {
14 |     "typescript": "^5.5.4"
15 |   },
16 |   "exports": {
17 |     ".": "./src/index.ts",
18 |     "./envs": "./src/envs.ts",
19 |     "./format": "./src/format.ts"
20 |   }
21 | }
```

packages/utils/tsconfig.json
```
1 | {
2 |   "extends": "@midday/tsconfig/base.json",
3 |   "include": ["."],
4 |   "exclude": ["node_modules"]
5 | }
```

apps/api/supabase/config.toml
```
1 | project_id = "pytddvqiozwrhfbwqazp"
2 |
3 | [api]
4 | enabled = true
5 | port = 54321
6 | schemas = ["public", "storage"]
7 | extra_search_path = ["public", "extensions"]
8 | max_rows = 1000000
9 |
10 | [auth]
11 | site_url = "http://localhost:3001"
12 | additional_redirect_urls = ["https://localhost:3001", "http://localhost:54321/auth/v1/callback"]
13 | jwt_expiry = 36000
14 |
15 | [db]
16 | port = 54322
17 |
18 | [studio]
19 | port = 54323
20 |
21 | [auth.external.google]
22 | enabled = true
23 | client_id = "env(GOOGLE_CLIENT_ID)"
24 | secret = "env(GOOGLE_SECRET)"
25 | redirect_uri = "http://localhost:54321/auth/v1/callback"
26 |
27 | [auth.email]
28 | double_confirm_changes = true
29 | enable_confirmations = true
30 | enable_signup = true
31 |
32 | [analytics]
33 | enabled = true
34 | port = 54327
35 | vector_port = 54328
36 | backend = "postgres"
```

apps/dashboard/src/instrumentation.ts
```
1 | import * as Sentry from "@sentry/nextjs";
2 |
3 | // Errors from Nested React Server Components
4 | export const onRequestError = Sentry.captureRequestError;
5 |
6 | export async function register() {
7 |   if (process.env.NEXT_RUNTIME === "nodejs") {
8 |     await import("../sentry.server.config");
9 |   }
10 |
11 |   if (process.env.NEXT_RUNTIME === "edge") {
12 |     await import("../sentry.edge.config");
13 |   }
14 | }
```

apps/dashboard/src/middleware.ts
```
1 | import { updateSession } from "@midday/supabase/middleware";
2 | import { createClient } from "@midday/supabase/server";
3 | import { createI18nMiddleware } from "next-international/middleware";
4 | import { type NextRequest, NextResponse } from "next/server";
5 |
6 | const I18nMiddleware = createI18nMiddleware({
7 |   locales: ["en"],
8 |   defaultLocale: "en",
9 |   urlMappingStrategy: "rewrite",
10 | });
11 |
12 | export async function middleware(request: NextRequest) {
13 |   const response = await updateSession(request, I18nMiddleware(request));
14 |   const supabase = createClient();
15 |   const url = new URL("/", request.url);
16 |   const nextUrl = request.nextUrl;
17 |
18 |   const pathnameLocale = nextUrl.pathname.split("/", 2)?.[1];
19 |
20 |   // Remove the locale from the pathname
21 |   const pathnameWithoutLocale = pathnameLocale
22 |     ? nextUrl.pathname.slice(pathnameLocale.length + 1)
23 |     : nextUrl.pathname;
24 |
25 |   // Create a new URL without the locale in the pathname
26 |   const newUrl = new URL(pathnameWithoutLocale || "/", request.url);
27 |
28 |   const {
29 |     data: { session },
30 |   } = await supabase.auth.getSession();
31 |
32 |   // Not authenticated
33 |   if (
34 |     !session &&
35 |     newUrl.pathname !== "/login" &&
36 |     !newUrl.pathname.includes("/report") &&
37 |     !newUrl.pathname.includes("/i/")
38 |   ) {
39 |     const encodedSearchParams = `${newUrl.pathname.substring(1)}${
40 |       newUrl.search
41 |     }`;
42 |
43 |     const url = new URL("/login", request.url);
44 |
45 |     if (encodedSearchParams) {
46 |       url.searchParams.append("return_to", encodedSearchParams);
47 |     }
48 |
49 |     return NextResponse.redirect(url);
50 |   }
51 |
52 |   // If authenticated but no full_name redirect to user setup page
53 |   if (
54 |     newUrl.pathname !== "/setup" &&
55 |     newUrl.pathname !== "/teams/create" &&
56 |     session &&
57 |     !session?.user?.user_metadata?.full_name
58 |   ) {
59 |     // Check if the URL contains an invite code
60 |     const inviteCodeMatch = newUrl.pathname.startsWith("/teams/invite/");
61 |
62 |     if (inviteCodeMatch) {
63 |       return NextResponse.redirect(`${url.origin}${newUrl.pathname}`);
64 |     }
65 |
66 |     return NextResponse.redirect(`${url.origin}/setup`);
67 |   }
68 |
69 |   const { data: mfaData } =
70 |     await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
71 |
72 |   // Enrolled for mfa but not verified
73 |   if (
74 |     mfaData &&
75 |     mfaData.nextLevel === "aal2" &&
76 |     mfaData.nextLevel !== mfaData.currentLevel &&
77 |     newUrl.pathname !== "/mfa/verify"
78 |   ) {
79 |     return NextResponse.redirect(`${url.origin}/mfa/verify`);
80 |   }
81 |
82 |   return response;
83 | }
84 |
85 | export const config = {
86 |   matcher: ["/((?!_next/static|_next/image|favicon.ico|api|monitoring).*)"],
87 | };
```

apps/engine/src/index.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import { swaggerUI } from "@hono/swagger-ui";
3 | import { OpenAPIHono } from "@hono/zod-openapi";
4 | import { requestId } from "hono/request-id";
5 | import {
6 |   authMiddleware,
7 |   cacheMiddleware,
8 |   loggingMiddleware,
9 |   securityMiddleware,
10 | } from "./middleware";
11 | import accountRoutes from "./routes/accounts";
12 | import authRoutes from "./routes/auth";
13 | import connectionRoutes from "./routes/connections";
14 | import enrichRoutes from "./routes/enrich";
15 | import healthRoutes from "./routes/health";
16 | import institutionRoutes from "./routes/institutions";
17 | import ratesRoutes from "./routes/rates";
18 | import transactionsRoutes from "./routes/transactions";
19 |
20 | const app = new OpenAPIHono<{ Bindings: Bindings }>({
21 |   defaultHook: (result, c) => {
22 |     if (!result.success) {
23 |       return c.json({ success: false, errors: result.error.errors }, 422);
24 |     }
25 |   },
26 | });
27 |
28 | app.use("*", requestId());
29 | app.use(authMiddleware);
30 | app.use(securityMiddleware);
31 | app.use(loggingMiddleware);
32 | app.get("/institutions", cacheMiddleware);
33 | app.get("/rates", cacheMiddleware);
34 |
35 | app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
36 |   type: "http",
37 |   scheme: "bearer",
38 | });
39 |
40 | app.get(
41 |   "/",
42 |   swaggerUI({
43 |     url: "/openapi",
44 |   }),
45 | );
46 |
47 | app.doc("/openapi", {
48 |   openapi: "3.1.0",
49 |   info: {
50 |     version: "1.0.0",
51 |     title: "Midday Engine API",
52 |   },
53 | });
54 |
55 | const appRoutes = app
56 |   .route("/transactions", transactionsRoutes)
57 |   .route("/accounts", accountRoutes)
58 |   .route("/institutions", institutionRoutes)
59 |   .route("/rates", ratesRoutes)
60 |   .route("/auth", authRoutes)
61 |   .route("/connections", connectionRoutes)
62 |   .route("/health", healthRoutes)
63 |   .route("/enrich", enrichRoutes);
64 |
65 | export type AppType = typeof appRoutes;
66 |
67 | export default app;
```

apps/engine/src/middleware.ts
```
1 | import type { Context, Next } from "hono";
2 | import { env } from "hono/adapter";
3 | import { bearerAuth } from "hono/bearer-auth";
4 | import { cache } from "hono/cache";
5 | import { logger } from "hono/logger";
6 | import { secureHeaders } from "hono/secure-headers";
7 | import { logger as customLogger } from "./utils/logger";
8 |
9 | const PUBLIC_PATHS = ["/", "/openapi", "/health"];
10 |
11 | const authMiddleware = (c: Context, next: Next) => {
12 |   if (PUBLIC_PATHS.includes(c.req.path)) {
13 |     return next();
14 |   }
15 |
16 |   const { API_SECRET_KEY } = env(c);
17 |
18 |   const bearer = bearerAuth({ token: API_SECRET_KEY });
19 |
20 |   return bearer(c, next);
21 | };
22 |
23 | const cacheMiddleware = (c: Context, next: Next) => {
24 |   if (process.env.NODE_ENV === "development") {
25 |     return next();
26 |   }
27 |
28 |   return cache({
29 |     cacheName: "engine",
30 |     cacheControl: "max-age=3600",
31 |   })(c, next);
32 | };
33 |
34 | const securityMiddleware = secureHeaders();
35 | const loggingMiddleware = logger(customLogger);
36 |
37 | export {
38 |   authMiddleware,
39 |   cacheMiddleware,
40 |   securityMiddleware,
41 |   loggingMiddleware,
42 | };
```

apps/engine/tasks/download-gocardless.ts
```
1 | import { getFileExtension } from "@/utils/logo";
2 | import { batchPromises, saveImageFromURL } from "./utils";
3 |
4 | const GO_CARDLESS_CDN = "https://cdn-logos.gocardless.com/ais/";
5 |
6 | async function main() {
7 |   const response = await fetch(
8 |     "https://bankaccountdata.gocardless.com/api/v2/institutions/",
9 |   );
10 |
11 |   const data = await response.json();
12 |
13 |   // @ts-ignore
14 |   const tasks = data?.map(async (institution) => {
15 |     const fileName = `${institution.id}.${getFileExtension(institution.logo)}`;
16 |
17 |     return saveImageFromURL(`${GO_CARDLESS_CDN}/${fileName}`, fileName);
18 |   });
19 |
20 |   await batchPromises(tasks);
21 | }
22 |
23 | main();
```

apps/engine/tasks/download-teller.ts
```
1 | import { batchPromises, getTellerData, saveImageFromURL } from "./utils";
2 |
3 | const TELLER_CDN = "https://teller.io/images/banks";
4 |
5 | async function main() {
6 |   const data = await getTellerData();
7 |
8 |   const tasks = data.map(async (institution) => {
9 |     const fileName = `${institution.id}.jpg`;
10 |
11 |     return saveImageFromURL(`${TELLER_CDN}/${fileName}`, fileName);
12 |   });
13 |
14 |   await batchPromises(tasks);
15 | }
16 |
17 | main();
```

apps/engine/tasks/get-institutions.ts
```
1 | import { GoCardLessApi } from "@/providers/gocardless/gocardless-api";
2 | import { PlaidApi } from "@/providers/plaid/plaid-api";
3 | import { getFileExtension, getLogoURL } from "@/utils/logo";
4 | import { getPopularity, getTellerData, matchLogoURL } from "./utils";
5 |
6 | export async function getGoCardLessInstitutions() {
7 |   const provider = new GoCardLessApi({
8 |     // @ts-ignore
9 |     envs: {
10 |       GOCARDLESS_SECRET_ID: process.env.GOCARDLESS_SECRET_ID!,
11 |       GOCARDLESS_SECRET_KEY: process.env.GOCARDLESS_SECRET_KEY!,
12 |     },
13 |   });
14 |
15 |   const data = await provider.getInstitutions();
16 |
17 |   return data.map((institution) => {
18 |     const ext = getFileExtension(institution.logo);
19 |
20 |     return {
21 |       id: institution.id,
22 |       name: institution.name,
23 |       logo: getLogoURL(institution.id, ext),
24 |       countries: institution.countries,
25 |       available_history: institution.transaction_total_days,
26 |       popularity: getPopularity(institution.id),
27 |       provider: "gocardless",
28 |     };
29 |   });
30 | }
31 |
32 | export async function getTellerInstitutions() {
33 |   const data = await getTellerData();
34 |
35 |   return data.map((institution) => ({
36 |     id: institution.id,
37 |     name: institution.name,
38 |     logo: getLogoURL(institution.id),
39 |     countries: ["US"],
40 |     popularity: getPopularity(institution.id) ?? 10, // Make Teller higher priority,
41 |     provider: "teller",
42 |   }));
43 | }
44 |
45 | export async function getPlaidInstitutions() {
46 |   const provider = new PlaidApi({
47 |     // @ts-ignore
48 |     envs: {
49 |       PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID!,
50 |       PLAID_SECRET: process.env.PLAID_SECRET!,
51 |     },
52 |   });
53 |
54 |   const data = await provider.getInstitutions();
55 |
56 |   return data.map((institution) => {
57 |     return {
58 |       id: institution.institution_id,
59 |       name: institution.name,
60 |       logo: institution.logo
61 |         ? getLogoURL(institution.institution_id)
62 |         : matchLogoURL(institution.institution_id),
63 |       countries: institution.country_codes,
64 |       popularity: getPopularity(institution.institution_id),
65 |       provider: "plaid",
66 |     };
67 |   });
68 | }
69 |
70 | export async function getInstitutions() {
71 |   const data = await Promise.all([
72 |     getGoCardLessInstitutions(),
73 |     getTellerInstitutions(),
74 |     getPlaidInstitutions(),
75 |   ]);
76 |
77 |   return data.flat();
78 | }
```

apps/engine/tasks/import.ts
```
1 | import Typesense from "typesense";
2 | import { getInstitutions } from "./get-institutions";
3 |
4 | const typesense = new Typesense.Client({
5 |   nodes: [
6 |     {
7 |       host: process.env.TYPESENSE_ENDPOINT!,
8 |       port: 443,
9 |       protocol: "https",
10 |     },
11 |   ],
12 |   apiKey: process.env.TYPESENSE_API_KEY!,
13 |   numRetries: 3,
14 |   connectionTimeoutSeconds: 120,
15 |   logLevel: "debug",
16 | });
17 |
18 | // const schema = {
19 | //   name: "institutions",
20 | //   num_documents: 0,
21 | //   fields: [
22 | //     {
23 | //       name: "name",
24 | //       type: "string",
25 | //       facet: false,
26 | //     },
27 | //     {
28 | //       name: "countries",
29 | //       type: "string[]",
30 | //       facet: true,
31 | //     },
32 | //     {
33 | //       name: "provider",
34 | //       type: "string",
35 | //       facet: true,
36 | //     },
37 | //     {
38 | //       name: "popularity",
39 | //       type: "int32",
40 | //       facet: false,
41 | //     },
42 | //   ],
43 | //   default_sorting_field: "popularity",
44 | // };
45 |
46 | async function main() {
47 |   const documents = await getInstitutions();
48 |
49 |   // await typesense.collections("institutions").delete();
50 |
51 |   try {
52 |     // await typesense.collections().create(schema);
53 |     await typesense
54 |       .collections("institutions")
55 |       .documents()
56 |       .import(documents, { action: "upsert" });
57 |   } catch (error) {
58 |     // @ts-ignore
59 |     console.log(error.importResults);
60 |   }
61 | }
62 |
63 | main();
```

apps/engine/tasks/utils.ts
```
1 | import fs from "node:fs";
2 | import path from "node:path";
3 | import { getLogoURL } from "@/utils/logo";
4 |
5 | const PRIORITY_INSTITUTIONS = [
6 |   // US
7 |   "chase", // Chase
8 |   "wells_fargo", // Wells Fargo
9 |   "bank_of_america", // Bank Of America
10 |   "pnc", // PNC
11 |   "credit_one", // CreditOne
12 |   "capital_one", // CapitalOne
13 |   "us_bank", // US Bank
14 |   "usaa", // USAA
15 |   "mercury", // Mercury
16 |   "citibank", // Citibank
17 |   "silicon_valley_bank", // Silicon Valley Bank
18 |   "first_republic", // First Republic
19 |   "brex", // Brex
20 |   "amex", // American Express
21 |   "ins_133680", // Angel List
22 |   "morgan_stanley", // Morgan Stanley
23 |   "truist", // Truist
24 |   "td_bank", // TD Bank
25 |   "ins_29", // KeyBank
26 |   "ins_19", // Regions Bank
27 |   "fifth_third", // Fifth Third Bank
28 |   "ins_111098", // Citizens Bank
29 |   "ins_100103", // Comerica Bank
30 |   "ins_21", // Huntington Bank
31 | ];
32 |
33 | export function getPopularity(id: string) {
34 |   if (PRIORITY_INSTITUTIONS.includes(id)) {
35 |     return 100 - PRIORITY_INSTITUTIONS.indexOf(id);
36 |   }
37 |
38 |   return 0;
39 | }
40 |
41 | export function matchLogoURL(id: string) {
42 |   switch (id) {
43 |     case "ins_56":
44 |       return getLogoURL("chase");
45 |     case "ins_127991":
46 |       return getLogoURL("wells_fargo");
47 |     case "ins_116236":
48 |       return getLogoURL("ins_116236");
49 |     case "ins_133019":
50 |       return getLogoURL("wise");
51 |     case "ins_126265":
52 |     case "ins_126523":
53 |     case "ins_115575":
54 |     case "ins_117163":
55 |       return getLogoURL("vancity");
56 |     case "ins_133354":
57 |       return getLogoURL("ins_133354");
58 |     case "ins_118853":
59 |       return getLogoURL("walmart");
60 |     case "ins_126283":
61 |       return getLogoURL("rocky");
62 |     case "ins_115771":
63 |       return getLogoURL("revelstoke");
64 |     case "ins_133347":
65 |       return getLogoURL("ins_133347");
66 |     case "ins_117642":
67 |       return getLogoURL("ins_117642");
68 |     case "ins_116219":
69 |       return getLogoURL("ins_116219");
70 |     case "ins_119478":
71 |       return getLogoURL("ins_119478");
72 |     case "ins_117634":
73 |       return getLogoURL("ins_117634");
74 |     case "ins_117635":
75 |       return getLogoURL("ins_117635");
76 |     case "ins_117600":
77 |       return getLogoURL("ins_117600");
78 |     case "ins_118849":
79 |     case "ins_129638":
80 |       return getLogoURL("ins_118849");
81 |     case "ins_116229":
82 |       return getLogoURL("ins_116229");
83 |     case "ins_117643":
84 |       return getLogoURL("ins_117643");
85 |     case "ins_118897":
86 |       return getLogoURL("ins_118897");
87 |     case "ins_119483":
88 |       return getLogoURL("ins_119483");
89 |     case "ins_119481":
90 |       return getLogoURL("ins_119481");
91 |     case "ins_117542":
92 |       return getLogoURL("ins_117542");
93 |     case "ins_116216":
94 |       return getLogoURL("ins_116216");
95 |     case "ins_118903":
96 |       return getLogoURL("ins_118903");
97 |     default:
98 |       return null;
99 |   }
100 | }
101 |
102 | export function saveImageFromString(base64String: string, filePath: string) {
103 |   const buffer = Buffer.from(base64String, "base64");
104 |
105 |   try {
106 |     fs.writeFileSync(filePath, buffer);
107 |     console.log(`Image saved successfully to ${filePath}`);
108 |   } catch (err) {
109 |     console.error(`Error saving image: ${err}`);
110 |   }
111 | }
112 |
113 | export async function saveImageFromURL(
114 |   url: string,
115 |   fileName: string,
116 | ): Promise<void> {
117 |   try {
118 |     const response = await fetch(url);
119 |
120 |     if (!response.ok) {
121 |       throw new Error(`Failed to fetch image: ${response.statusText}`);
122 |     }
123 |
124 |     const buffer = await response.arrayBuffer();
125 |
126 |     const fullPath = path.resolve(path.join("tasks", "logos", fileName));
127 |
128 |     // @ts-ignore
129 |     fs.writeFile(fullPath, buffer, (err) => {
130 |       if (err) {
131 |         throw new Error(`Failed to save image: ${err.message}`);
132 |       }
133 |       console.log(`Image saved to ${fullPath}`);
134 |     });
135 |   } catch (error) {
136 |     console.error(`Error: ${error}`);
137 |   }
138 | }
139 |
140 | export function saveFile(filePath: string, content: string) {
141 |   try {
142 |     fs.writeFileSync(filePath, content);
143 |     console.log(`File saved successfully to ${filePath}`);
144 |   } catch (err) {
145 |     console.error(`Error saving file: ${err}`);
146 |   }
147 | }
148 |
149 | const TELLER_ENDPOINT = "https://api.teller.io/institutions";
150 |
151 | type TellerResponse = {
152 |   id: string;
153 |   name: string;
154 |   capabilities: string[];
155 | };
156 |
157 | export async function getTellerData() {
158 |   const response = await fetch(TELLER_ENDPOINT);
159 |
160 |   const data = (await response.json()) as TellerResponse[];
161 |
[TRUNCATED]
```

packages/app-store/src/index.ts
```
1 | import calApp from "./cal/config";
2 | import fortnoxApp from "./fortnox/config";
3 | import quickBooksApp from "./quick-books/config";
4 | import raycastApp from "./raycast/config";
5 | import slackApp from "./slack/config";
6 | import vismaApp from "./visma/config";
7 | import xeroApp from "./xero/config";
8 | import zapierApp from "./zapier/config";
9 |
10 | export const apps = [
11 |   slackApp,
12 |   raycastApp,
13 |   quickBooksApp,
14 |   xeroApp,
15 |   calApp,
16 |   fortnoxApp,
17 |   vismaApp,
18 |   zapierApp,
19 | ];
```

packages/documents/src/client.ts
```
1 | import { ExpenseProcessor } from "./processors/expense/expense-processor";
2 | import { InvoiceProcessor } from "./processors/invoice/invoice-processor";
3 | import type {
4 |   DocumentClientParams,
5 |   GetDocumentRequest,
6 |   GetDocumentResponse,
7 | } from "./types";
8 |
9 | export class DocumentClient {
10 |   #processor;
11 |
12 |   constructor({ contentType }: DocumentClientParams) {
13 |     switch (contentType) {
14 |       case "application/pdf":
15 |         this.#processor = new InvoiceProcessor();
16 |         break;
17 |       default:
18 |         this.#processor = new ExpenseProcessor();
19 |     }
20 |   }
21 |
22 |   public async getDocument(
23 |     params: GetDocumentRequest,
24 |   ): Promise<GetDocumentResponse> {
25 |     return this.#processor.getDocument(params);
26 |   }
27 | }
```

packages/documents/src/index.ts
```
1 | export * from "./client";
2 | export * from "./prepare";
3 | export * from "./utils";
4 | export * from "./processors/layout";
```

packages/documents/src/interface.ts
```
1 | import type { GetDocumentRequest, GetDocumentResponse } from "./types";
2 |
3 | export interface Processor {
4 |   getDocument: (params: GetDocumentRequest) => Promise<GetDocumentResponse>;
5 | }
```

packages/documents/src/prepare.ts
```
1 | import { stripSpecialCharacters } from "@midday/utils";
2 | import { decode } from "base64-arraybuffer";
3 | import convert from "heic-convert";
4 | import sharp from "sharp";
5 | import type { Document, DocumentResponse } from "./types";
6 |
7 | const MAX_SIZE = 1500;
8 |
9 | export async function prepareDocument(
10 |   document: Document,
11 | ): Promise<DocumentResponse> {
12 |   const buffer = decode(document.Content);
13 |   const fileName = document.Name.split(".")?.at(0) ?? "File";
14 |   const sanitizedName = stripSpecialCharacters(fileName);
15 |
16 |   switch (document.ContentType) {
17 |     case "application/octet-stream":
18 |     case "application/pdf": {
19 |       return {
20 |         content: buffer,
21 |         mimeType: "application/pdf",
22 |         size: document.ContentLength,
23 |         name: fileName,
24 |         fileName: `${sanitizedName}.pdf`,
25 |       };
26 |     }
27 |     case "image/heic": {
28 |       const decodedImage = await convert({
29 |         // @ts-ignore
30 |         buffer: new Uint8Array(buffer),
31 |         format: "JPEG",
32 |         quality: 1,
33 |       });
34 |
35 |       const image = await sharp(decodedImage)
36 |         .rotate()
37 |         .resize({ width: MAX_SIZE })
38 |         .toFormat("jpeg")
39 |         .toBuffer();
40 |
41 |       return {
42 |         content: image,
43 |         mimeType: "image/jpeg",
44 |         size: image.byteLength,
45 |         name: fileName,
46 |         fileName: `${sanitizedName}.jpg`,
47 |       };
48 |     }
49 |     default: {
50 |       const image = await sharp(buffer)
51 |         .rotate()
52 |         .resize({ width: MAX_SIZE })
53 |         .toFormat("jpeg")
54 |         .toBuffer();
55 |
56 |       return {
57 |         content: image,
58 |         mimeType: "image/jpeg",
59 |         size: image.byteLength,
60 |         name: fileName,
61 |         fileName: `${sanitizedName}.jpg`,
62 |       };
63 |     }
64 |   }
65 | }
```

packages/documents/src/types.ts
```
1 | export type Document = {
2 |   Content: string;
3 |   ContentType: string;
4 |   ContentLength: number;
5 |   Name: string;
6 | };
7 |
8 | export type MimeType = "application/pdf" | "image/jpeg";
9 |
10 | export type DocumentResponse = {
11 |   content: Buffer | ArrayBuffer;
12 |   mimeType: MimeType;
13 |   size: number;
14 |   fileName: string;
15 |   name: string;
16 | };
17 |
18 | export type DocumentClientParams = {
19 |   contentType: string;
20 | };
21 |
22 | export type GetDocumentRequest = {
23 |   content: string;
24 | };
25 |
26 | export type GetDocumentResponse = {
27 |   name?: string | null;
28 |   date?: string | null;
29 |   amount?: number | null;
30 |   currency?: string | null;
31 |   website?: string | null;
32 |   type?: string | null;
33 |   description?: string | null;
34 | };
35 |
36 | export interface Attachment {
37 |   ContentLength: number;
38 |   Content: string;
39 |   Name: string;
40 |   ContentType: string;
41 |   ContentID: string;
42 | }
43 |
44 | export type Attachments = Attachment[];
```

packages/documents/src/utils.test.ts
```
1 | import { expect, test } from "bun:test";
2 | import { getAllowedAttachments, getDomainFromEmail } from "./utils";
3 |
4 | test("Get domain from email", () => {
5 |   expect(getDomainFromEmail("invoice@supabase.com")).toMatch("supabase.com");
6 | });
7 |
8 | test("Should return 2 allowed attachments", () => {
9 |   expect(
10 |     getAllowedAttachments([
11 |       {
12 |         ContentLength: 51899,
13 |         Name: "DigitalOcean Invoice 2023 Apr (33-11).pdf",
14 |         ContentType: "application/pdf",
15 |         ContentID: "",
16 |         Content: "",
17 |       },
18 |       {
19 |         ContentLength: 51899,
20 |         Name: "Photo.jpg",
21 |         ContentType: "image/jpeg",
22 |         ContentID: "",
23 |         Content: "",
24 |       },
25 |       {
26 |         ContentLength: 673,
27 |         Name: "ergerwed",
28 |         ContentType: "application/pgp-keys",
29 |         ContentID: "",
30 |         Content: "",
31 |       },
32 |       {
33 |         ContentLength: 249,
34 |         Name: "wedwed",
35 |         ContentType: "application/pgp-signature",
36 |         ContentID: "",
37 |         Content: "",
38 |       },
39 |     ]),
40 |   ).toBeArrayOfSize(2);
41 | });
```

packages/documents/src/utils.ts
```
1 | import type { DocumentFieldOutput } from "@azure-rest/ai-document-intelligence";
2 | import type { Attachments } from "./types";
3 |
4 | export const allowedMimeTypes = [
5 |   "image/heic",
6 |   "image/png",
7 |   "image/jpeg",
8 |   "image/jpg",
9 |   "application/pdf",
10 |   "application/octet-stream",
11 | ];
12 |
13 | export function getAllowedAttachments(attachments?: Attachments) {
14 |   return attachments?.filter((attachment) =>
15 |     allowedMimeTypes.includes(attachment.ContentType),
16 |   );
17 | }
18 |
19 | export function getCurrency(field?: DocumentFieldOutput) {
20 |   return field?.valueCurrency?.currencyCode ?? "USD";
21 | }
22 |
23 | export function extractRootDomain(content?: string) {
24 |   const domainPattern =
25 |     /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/|$)/g;
26 |
27 |   const match = content?.match(domainPattern);
28 |
29 |   if (!match) {
30 |     return null;
31 |   }
32 |
33 |   const matchWithoutProtocol = match
34 |     .at(0)
35 |     ?.replace(/(?:https?:\/\/)?(?:www\.)?/, "");
36 |
37 |   const rootDomain = matchWithoutProtocol?.split("/").at(0);
38 |
39 |   return rootDomain;
40 | }
41 |
42 | export function getDomainFromEmail(email?: string | null): string | null {
43 |   const emailPattern = /^[^\s@]+@([^\s@]+)$/;
44 |   const match = email?.match(emailPattern);
45 |   const domain = match?.at(1);
46 |
47 |   if (!domain) return null;
48 |
49 |   const domainParts = domain.split(".");
50 |
51 |   if (domainParts.length > 2) {
52 |     return domainParts.slice(-2).join(".");
53 |   }
54 |
55 |   return domain;
56 | }
```

packages/email/components/column.tsx
```
1 | import { Img, Row, Section, Text } from "@react-email/components";
2 |
3 | type Props = {
4 |   title: string;
5 |   description: string;
6 |   imgSrc: string;
7 |   footer?: string;
8 | };
9 |
10 | export function Column({ title, description, footer, imgSrc }: Props) {
11 |   return (
12 |     <Section className="text-left p-0 m-0 text-left">
13 |       <Section className="p-0 m-0 w-full w-full w-[265px] inline-block align-top box-border mb-4 md:mb-0 text-left">
14 |         <Section className="text-left p-0 m-0 pb-10">
15 |           <Img src={imgSrc} alt={title} className="w-[245px]" />
16 |         </Section>
17 |       </Section>
18 |       <Section className="inline-block align-top box-border w-full w-[280px] text-left">
19 |         <Section className="text-left p-0 m-0">
20 |           <Text className="pt-0 m-0 font-medium mb-2">{title}</Text>
21 |           <Text className="text-[#707070] p-0 m-0">{description}</Text>
22 |           <Text className="text-[#707070] p-0 mt-2">{footer}</Text>
23 |         </Section>
24 |       </Section>
25 |     </Section>
26 |   );
27 | }
```

packages/email/components/dual-column.tsx
```
1 | import { Section } from "@react-email/section";
2 | import type React from "react";
3 |
4 | interface DualColumnProps {
5 |   styles?: Omit<
6 |     React.CSSProperties,
7 |     "padding" | "paddingLeft" | "paddingRight" | "paddingTop" | "paddingBottom"
8 |   >;
9 |   pX?: number;
10 |   pY?: number;
11 |   columnOneContent: React.ReactNode;
12 |   columnOneStyles?: React.CSSProperties;
13 |   columnTwoContent: React.ReactNode;
14 |   columnTwoStyles?: React.CSSProperties;
15 | }
16 |
17 | export const DualColumn: React.FC<DualColumnProps> = ({
18 |   pX = 0,
19 |   pY = 0,
20 |   columnOneContent,
21 |   columnTwoContent,
22 |   columnOneStyles,
23 |   columnTwoStyles,
24 |   styles,
25 | }) => {
26 |   const colMaxWidth = pX ? (600 - 2 * pX) / 2 : 600 / 2;
27 |
28 |   return (
29 |     <Section
30 |     //   style={{ ...twoColumnWrapper, ...styles, padding: `${pY}px ${pX}px` }}
31 |     >
32 |       <Section
33 |         style={{
34 |           //   ...twoColumnCol,
35 |           ...columnOneStyles,
36 |           maxWidth: colMaxWidth,
37 |         }}
38 |       >
39 |         {columnOneContent}
40 |       </Section>
41 |       <Section
42 |       // style={{ ...twoColumnCol, ...columnTwoStyles, maxWidth: colMaxWidth }}
43 |       >
44 |         {columnTwoContent}
45 |       </Section>
46 |     </Section>
47 |   );
48 | };
```

packages/email/components/footer.tsx
```
1 | import { getEmailUrl } from "@midday/utils/envs";
2 | import {
3 |   Column,
4 |   Hr,
5 |   Img,
6 |   Link,
7 |   Row,
8 |   Section,
9 |   Text,
10 | } from "@react-email/components";
11 | import { TripleColumn } from "responsive-react-email";
12 |
13 | const baseUrl = getEmailUrl();
14 |
15 | export function Footer() {
16 |   return (
17 |     <Section className="w-full">
18 |       <Hr />
19 |
20 |       <br />
21 |
22 |       <Text className="text-[21px] font-regular">
23 |         Run your business smarter.
24 |       </Text>
25 |
26 |       <br />
27 |
28 |       <TripleColumn
29 |         pX={0}
30 |         pY={0}
31 |         styles={{ textAlign: "left" }}
32 |         columnOneContent={
33 |           <Section className="text-left p-0 m-0">
34 |             <Row>
35 |               <Text className="font-medium">Features</Text>
36 |             </Row>
37 |
38 |             <Row className="mb-1.5">
39 |               <Link
40 |                 className="text-[#707070] text-[14px]"
41 |                 href="https://go.midday.ai/bOp4NOx"
42 |               >
43 |                 Overview
44 |               </Link>
45 |             </Row>
46 |             <Row className="mb-1.5">
47 |               <Link
48 |                 className="text-[#707070] text-[14px]"
49 |                 href="https://go.midday.ai/VFcNsmQ"
50 |               >
51 |                 Inbox
52 |               </Link>
53 |             </Row>
54 |             <Row className="mb-1.5">
55 |               <Link
56 |                 className="text-[#707070] text-[14px]"
57 |                 href="https://go.midday.ai/uA06kWO"
58 |               >
59 |                 Vault
60 |               </Link>
61 |             </Row>
62 |             <Row className="mb-1.5">
63 |               <Link
64 |                 className="text-[#707070] text-[14px]"
65 |                 href="https://go.midday.ai/x7Fow9L"
66 |               >
67 |                 Tracker
68 |               </Link>
69 |             </Row>
70 |
71 |             <Row className="mb-1.5">
72 |               <Link
73 |                 className="text-[#707070] text-[14px]"
74 |                 href="https://go.midday.ai/fkYXc95"
75 |               >
76 |                 Invoice
77 |               </Link>
78 |             </Row>
79 |
80 |             <Row className="mb-1.5">
81 |               <Link
82 |                 className="text-[#707070] text-[14px]"
83 |                 href="https://go.midday.ai/dEnP9h5"
84 |               >
85 |                 Pricing
86 |               </Link>
87 |             </Row>
88 |
89 |             <Row className="mb-1.5">
90 |               <Link
91 |                 className="text-[#707070] text-[14px]"
92 |                 href="https://go.midday.ai/E24P3oY"
93 |               >
94 |                 Engine
95 |               </Link>
96 |             </Row>
97 |
98 |             <Row className="mb-1.5">
99 |               <Link
100 |                 className="text-[#707070] text-[14px]"
101 |                 href="https://midday.ai/download"
102 |               >
103 |                 Download
104 |               </Link>
105 |             </Row>
106 |           </Section>
107 |         }
108 |         columnOneStyles={{ paddingRight: 0, paddingLeft: 0, width: 185 }}
109 |         columnTwoContent={
110 |           <Section className="text-left p-0 m-0">
111 |             <Row>
112 |               <Text className="font-medium">Resources</Text>
113 |             </Row>
114 |             <Row className="mb-1.5">
115 |               <Link
116 |                 className="text-[#707070] text-[14px]"
117 |                 href="https://go.midday.ai/fhEy5CL"
118 |               >
119 |                 Homepage
120 |               </Link>
121 |             </Row>
122 |             <Row className="mb-1.5">
123 |               <Link
124 |                 className="text-[#707070] text-[14px]"
125 |                 href="https://git.new/midday"
126 |               >
127 |                 Github
128 |               </Link>
129 |             </Row>
130 |             <Row className="mb-1.5">
131 |               <Link
132 |                 className="text-[#707070] text-[14px]"
133 |                 href="https://go.midday.ai/ZrhEMbR"
134 |               >
135 |                 Support
136 |               </Link>
137 |             </Row>
138 |             <Row className="mb-1.5">
139 |               <Link
140 |                 className="text-[#707070] text-[14px]"
141 |                 href="https://go.midday.ai/rofdWKi"
142 |               >
143 |                 Terms of service
144 |               </Link>
145 |             </Row>
146 |             <Row className="mb-1.5">
147 |               <Link
148 |                 className="text-[#707070] text-[14px]"
149 |                 href="https://go.midday.ai/TJIL5mQ"
150 |               >
151 |                 Privacy policy
152 |               </Link>
153 |             </Row>
154 |
155 |             <Row className="mb-1.5">
156 |               <Link
157 |                 className="text-[#707070] text-[14px]"
158 |                 href="https://go.midday.ai/IQ1kcN0"
159 |               >
160 |                 Branding
161 |               </Link>
162 |             </Row>
163 |
164 |             <Row className="mb-1.5">
165 |               <Link
166 |                 className="text-[#707070] text-[14px]"
167 |                 href="https://go.midday.ai/x5ohOs7"
168 |               >
169 |                 Feature Request
170 |               </Link>
171 |             </Row>
172 |           </Section>
173 |         }
[TRUNCATED]
```

packages/email/components/get-started.tsx
```
1 | import { Button, Section } from "@react-email/components";
2 |
3 | export function GetStarted() {
4 |   return (
5 |     <Section className="text-center mt-[50px] mb-[50px]">
6 |       <Button
7 |         className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
8 |         href="https://go.midday.ai/VmJhYxE"
9 |       >
10 |         Get started
11 |       </Button>
12 |     </Section>
13 |   );
14 | }
```

packages/email/components/logo.tsx
```
1 | import { getEmailUrl } from "@midday/utils/envs";
2 | import { Img, Section } from "@react-email/components";
3 |
4 | const baseUrl = getEmailUrl();
5 |
6 | export function Logo() {
7 |   return (
8 |     <Section className="mt-[32px]">
9 |       <Img
10 |         src={`${baseUrl}/email/logo.png`}
11 |         width="45"
12 |         height="45"
13 |         alt="Midday"
14 |         className="my-0 mx-auto block"
15 |       />
16 |     </Section>
17 |   );
18 | }
```

packages/email/emails/connection-expire.tsx
```
1 | import {
2 |   Body,
3 |   Button,
4 |   Container,
5 |   Font,
6 |   Heading,
7 |   Html,
8 |   Preview,
9 |   Section,
10 |   Tailwind,
11 |   Text,
12 | } from "@react-email/components";
13 | import { addDays, formatDistance } from "date-fns";
14 | import { Footer } from "../components/footer";
15 | import { Logo } from "../components/logo";
16 |
17 | interface Props {
18 |   fullName: string;
19 |   expiresAt: string;
20 |   bankName: string;
21 |   teamName: string;
22 | }
23 |
24 | export const ConnectionExpireEmail = ({
25 |   fullName = "Viktor Hofte",
26 |   expiresAt = addDays(new Date(), 4).toISOString(),
27 |   bankName = "Revolut",
28 |   teamName = "Midday",
29 | }: Props) => {
30 |   const firstName = fullName.split(" ").at(0);
31 |   const text = `Hi ${firstName}, We wanted to inform you that our connection to your bank ${bankName} for your team ${teamName} will expire in ${formatDistance(new Date(expiresAt), new Date())}.`;
32 |
33 |   return (
34 |     <Html>
35 |       <Tailwind>
36 |         <head>
37 |           <Font
38 |             fontFamily="Geist"
39 |             fallbackFontFamily="Helvetica"
40 |             webFont={{
41 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
42 |               format: "woff2",
43 |             }}
44 |             fontWeight={400}
45 |             fontStyle="normal"
46 |           />
47 |
48 |           <Font
49 |             fontFamily="Geist"
50 |             fallbackFontFamily="Helvetica"
51 |             webFont={{
52 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
53 |               format: "woff2",
54 |             }}
55 |             fontWeight={500}
56 |             fontStyle="normal"
57 |           />
58 |         </head>
59 |         <Preview>{text}</Preview>
60 |
61 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
62 |           <Container
63 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
64 |             style={{ borderStyle: "solid", borderWidth: 1 }}
65 |           >
66 |             <Logo />
67 |             <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
68 |               Bank Connection Expiring Soon
69 |             </Heading>
70 |
71 |             <br />
72 |
73 |             <span className="font-medium">Hi {firstName},</span>
74 |             <Text className="text-[#121212]">
75 |               We hope you're having a great day!
76 |               <br />
77 |               <br />
78 |               We wanted to inform you that our connection to your bank{" "}
79 |               <strong>{bankName}</strong> for your team{" "}
80 |               <strong>{teamName}</strong> will expire in{" "}
81 |               {formatDistance(new Date(expiresAt), new Date())}. To ensure that
82 |               Midday continues to run smoothly, please reconnect your bank.
83 |               <br />
84 |               <br />
85 |               The good news? It only takes 60 seconds to get everything back on
86 |               track!
87 |             </Text>
88 |
89 |             <Section className="text-center mt-[50px] mb-[50px]">
90 |               <Button
91 |                 className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
92 |                 href="https://go.midday.ai/34Xt7XK"
93 |               >
94 |                 Reconnect
95 |               </Button>
96 |             </Section>
97 |
98 |             <Text className="text-[#121212]">
99 |               If you have any questions, please don't hesitate to reach out by
100 |               just replying to this email.
101 |             </Text>
102 |
103 |             <br />
104 |
105 |             <Footer />
106 |           </Container>
107 |         </Body>
108 |       </Tailwind>
109 |     </Html>
110 |   );
111 | };
112 |
113 | export default ConnectionExpireEmail;
```

packages/email/emails/connection-issue.tsx
```
1 | import {
2 |   Body,
3 |   Button,
4 |   Container,
5 |   Font,
6 |   Heading,
7 |   Html,
8 |   Preview,
9 |   Section,
10 |   Tailwind,
11 |   Text,
12 | } from "@react-email/components";
13 | import { Footer } from "../components/footer";
14 | import { Logo } from "../components/logo";
15 |
16 | interface Props {
17 |   fullName: string;
18 |   bankName: string;
19 |   teamName: string;
20 | }
21 |
22 | export const ConnectionIssueEmail = ({
23 |   fullName = "Viktor Hofte",
24 |   bankName = "Revolut",
25 |   teamName = "Midday",
26 | }: Props) => {
27 |   const firstName = fullName.split(" ").at(0);
28 |   const text = `Hi ${firstName}, We wanted to inform you that our connection to your bank ${bankName} for your team ${teamName} is currently disconnected.`;
29 |
30 |   return (
31 |     <Html>
32 |       <Tailwind>
33 |         <head>
34 |           <Font
35 |             fontFamily="Geist"
36 |             fallbackFontFamily="Helvetica"
37 |             webFont={{
38 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
39 |               format: "woff2",
40 |             }}
41 |             fontWeight={400}
42 |             fontStyle="normal"
43 |           />
44 |
45 |           <Font
46 |             fontFamily="Geist"
47 |             fallbackFontFamily="Helvetica"
48 |             webFont={{
49 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
50 |               format: "woff2",
51 |             }}
52 |             fontWeight={500}
53 |             fontStyle="normal"
54 |           />
55 |         </head>
56 |         <Preview>{text}</Preview>
57 |
58 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
59 |           <Container
60 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
61 |             style={{ borderStyle: "solid", borderWidth: 1 }}
62 |           >
63 |             <Logo />
64 |             <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
65 |               Bank Connection Issue
66 |             </Heading>
67 |
68 |             <br />
69 |
70 |             <span className="font-medium">Hi {firstName},</span>
71 |             <Text className="text-[#121212]">
72 |               We hope you're having a great day!
73 |               <br />
74 |               <br />
75 |               We wanted to let you know that your bank{" "}
76 |               <strong>{bankName}</strong> for team <strong>{teamName}</strong>{" "}
77 |               is currently disconnected. To keep Midday running smoothly, we'll
78 |               need you to reconnect your bank.
79 |               <br />
80 |               <br />
81 |               The good news? It only takes 60 seconds to get everything back on
82 |               track!
83 |             </Text>
84 |
85 |             <Section className="text-center mt-[50px] mb-[50px]">
86 |               <Button
87 |                 className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
88 |                 href="https://go.midday.ai/34Xt7XK"
89 |               >
90 |                 Reconnect
91 |               </Button>
92 |             </Section>
93 |
94 |             <Text className="text-[#121212]">
95 |               If you have any questions, please don't hesitate to reach out by
96 |               just replying to this email.
97 |             </Text>
98 |
99 |             <br />
100 |
101 |             <Footer />
102 |           </Container>
103 |         </Body>
104 |       </Tailwind>
105 |     </Html>
106 |   );
107 | };
108 |
109 | export default ConnectionIssueEmail;
```

packages/email/emails/invite.tsx
```
1 | import { getAppUrl } from "@midday/utils/envs";
2 | import {
3 |   Body,
4 |   Button,
5 |   Container,
6 |   Font,
7 |   Head,
8 |   Heading,
9 |   Html,
10 |   Link,
11 |   Preview,
12 |   Section,
13 |   Tailwind,
14 |   Text,
15 | } from "@react-email/components";
16 | import { Footer } from "../components/footer";
17 | import { Logo } from "../components/logo";
18 | import { getI18n } from "../locales";
19 |
20 | interface Props {
21 |   email?: string;
22 |   invitedByEmail?: string;
23 |   invitedByName?: string;
24 |   teamName?: string;
25 |   inviteCode?: string;
26 |   ip?: string;
27 |   location?: string;
28 |   locale: string;
29 | }
30 |
31 | const baseAppUrl = getAppUrl();
32 |
33 | export const InviteEmail = ({
34 |   invitedByEmail = "bukinoshita@example.com",
35 |   invitedByName = "Pontus Abrahamsson",
36 |   email = "pontus@lostisland.co",
37 |   teamName = "Acme Co",
38 |   inviteCode = "jnwe9203frnwefl239jweflasn1230oqef",
39 |   ip = "204.13.186.218",
40 |   location = "São Paulo, Brazil",
41 |   locale = "en",
42 | }: Props) => {
43 |   const { t } = getI18n({ locale });
44 |   const inviteLink = `${baseAppUrl}/teams/invite/${inviteCode}`;
45 |
46 |   return (
47 |     <Html>
48 |       <Tailwind>
49 |         <head>
50 |           <Font
51 |             fontFamily="Geist"
52 |             fallbackFontFamily="Helvetica"
53 |             webFont={{
54 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
55 |               format: "woff2",
56 |             }}
57 |             fontWeight={400}
58 |             fontStyle="normal"
59 |           />
60 |
61 |           <Font
62 |             fontFamily="Geist"
63 |             fallbackFontFamily="Helvetica"
64 |             webFont={{
65 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
66 |               format: "woff2",
67 |             }}
68 |             fontWeight={500}
69 |             fontStyle="normal"
70 |           />
71 |         </head>
72 |         <Preview>{t("invite.preview", { teamName })}</Preview>
73 |
74 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
75 |           <Container
76 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
77 |             style={{ borderStyle: "solid", borderWidth: 1 }}
78 |           >
79 |             <Logo />
80 |             <Heading className="mx-0 my-[30px] p-0 text-[24px] font-normal text-[#121212] text-center">
81 |               {t("invite.title1")} <strong>{teamName}</strong>{" "}
82 |               {t("invite.title2")} <strong>Midday</strong>
83 |             </Heading>
84 |
85 |             <Text className="text-[14px] leading-[24px] text-[#121212]">
86 |               {invitedByName} (
87 |               <Link
88 |                 href={`mailto:${invitedByEmail}`}
89 |                 className="text-[#121212] no-underline"
90 |               >
91 |                 {invitedByEmail}
92 |               </Link>
93 |               ) {t("invite.link1")} <strong>{teamName}</strong>{" "}
94 |               {t("invite.link2")} <strong>Midday</strong>.
95 |             </Text>
96 |             <Section className="mb-[42px] mt-[32px] text-center">
97 |               <Button
98 |                 className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
99 |                 href={inviteLink}
100 |               >
101 |                 {t("invite.join")}
102 |               </Button>
103 |             </Section>
104 |
105 |             <Text className="text-[14px] leading-[24px] text-[#707070] break-all">
106 |               {t("invite.link3")}:{" "}
107 |               <Link href={inviteLink} className="text-[#707070] underline">
108 |                 {inviteLink}
109 |               </Link>
110 |             </Text>
111 |
112 |             <br />
113 |             <Section>
114 |               <Text className="text-[12px] leading-[24px] text-[#666666]">
115 |                 {t("invite.footer1")}{" "}
116 |                 <span className="text-[#121212] ">{email}</span>.{" "}
117 |                 {t("invite.footer2")}{" "}
118 |                 <span className="text-[#121212] ">{ip}</span>{" "}
119 |                 {t("invite.footer3")}{" "}
120 |                 <span className="text-[#121212] ">{location}</span>.{" "}
121 |                 {t("invite.footer4")}
122 |               </Text>
123 |             </Section>
124 |
125 |             <br />
126 |
127 |             <Footer />
128 |           </Container>
129 |         </Body>
130 |       </Tailwind>
131 |     </Html>
132 |   );
133 | };
134 |
135 | export default InviteEmail;
```

packages/email/emails/invoice-comment.tsx
```
1 | import {
2 |   Body,
3 |   Button,
4 |   Container,
5 |   Font,
6 |   Heading,
7 |   Html,
8 |   Preview,
9 |   Section,
10 |   Tailwind,
11 |   Text,
12 | } from "@react-email/components";
13 | import { Footer } from "../components/footer";
14 | import { Logo } from "../components/logo";
15 |
16 | interface Props {
17 |   invoiceNumber: string;
18 |   link: string;
19 | }
20 |
21 | export const InvoiceCommentEmail = ({
22 |   invoiceNumber = "INV-0001",
23 |   link = "https://app.midday.ai/i/1234567890",
24 | }: Props) => {
25 |   const text = `New comment on Invoice ${invoiceNumber}`;
26 |
27 |   return (
28 |     <Html>
29 |       <Tailwind>
30 |         <head>
31 |           <Font
32 |             fontFamily="Geist"
33 |             fallbackFontFamily="Helvetica"
34 |             webFont={{
35 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
36 |               format: "woff2",
37 |             }}
38 |             fontWeight={400}
39 |             fontStyle="normal"
40 |           />
41 |
42 |           <Font
43 |             fontFamily="Geist"
44 |             fallbackFontFamily="Helvetica"
45 |             webFont={{
46 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
47 |               format: "woff2",
48 |             }}
49 |             fontWeight={500}
50 |             fontStyle="normal"
51 |           />
52 |         </head>
53 |         <Preview>{text}</Preview>
54 |
55 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
56 |           <Container
57 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
58 |             style={{ borderStyle: "solid", borderWidth: 1 }}
59 |           >
60 |             <Logo />
61 |             <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
62 |               New comment on Invoice <br /> {invoiceNumber}
63 |             </Heading>
64 |
65 |             <br />
66 |
67 |             <Text className="text-[#121212]">
68 |               Check the latest update on your invoice and respond directly by
69 |               viewing the invoice.
70 |             </Text>
71 |
72 |             <Section className="text-center mt-[50px] mb-[50px]">
73 |               <Button
74 |                 className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
75 |                 href={link}
76 |               >
77 |                 View invoice
78 |               </Button>
79 |             </Section>
80 |
81 |             <br />
82 |
83 |             <Footer />
84 |           </Container>
85 |         </Body>
86 |       </Tailwind>
87 |     </Html>
88 |   );
89 | };
90 |
91 | export default InvoiceCommentEmail;
```

packages/email/emails/invoice-overdue.tsx
```
1 | import {
2 |   Body,
3 |   Button,
4 |   Container,
5 |   Font,
6 |   Heading,
7 |   Html,
8 |   Preview,
9 |   Section,
10 |   Tailwind,
11 |   Text,
12 | } from "@react-email/components";
13 | import { Footer } from "../components/footer";
14 | import { Logo } from "../components/logo";
15 |
16 | interface Props {
17 |   customerName: string;
18 |   invoiceNumber: string;
19 |   link: string;
20 | }
21 |
22 | export const InvoiceOverdueEmail = ({
23 |   customerName = "Customer",
24 |   invoiceNumber = "INV-0001",
25 |   link = "https://app.midday.ai/invoices?invoiceId=40b25275-258c-48e0-9678-57324cd770a6&type=details",
26 | }: Props) => {
27 |   const text = `Invoice ${invoiceNumber} is now overdue`;
28 |
29 |   return (
30 |     <Html>
31 |       <Tailwind>
32 |         <head>
33 |           <Font
34 |             fontFamily="Geist"
35 |             fallbackFontFamily="Helvetica"
36 |             webFont={{
37 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
38 |               format: "woff2",
39 |             }}
40 |             fontWeight={400}
41 |             fontStyle="normal"
42 |           />
43 |
44 |           <Font
45 |             fontFamily="Geist"
46 |             fallbackFontFamily="Helvetica"
47 |             webFont={{
48 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
49 |               format: "woff2",
50 |             }}
51 |             fontWeight={500}
52 |             fontStyle="normal"
53 |           />
54 |         </head>
55 |         <Preview>{text}</Preview>
56 |
57 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
58 |           <Container
59 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
60 |             style={{ borderStyle: "solid", borderWidth: 1 }}
61 |           >
62 |             <Logo />
63 |             <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
64 |               Invoice {invoiceNumber} <br />
65 |               is now overdue
66 |             </Heading>
67 |
68 |             <br />
69 |
70 |             <Text className="text-[#121212]">
71 |               Invoice <span className="font-medium">{invoiceNumber}</span> to{" "}
72 |               <span className="font-medium">{customerName}</span> is now
73 |               overdue. We've checked your account but haven't found a matching
74 |               transaction.
75 |               <br />
76 |               <br />
77 |               Please review the invoice details page to verify if payment has
78 |               been made through another method.
79 |               <br />
80 |               <br />
81 |               If needed, you can send a payment reminder to your customer or
82 |               update the invoice status manually if it has already been paid.
83 |               <br />
84 |               <br />
85 |             </Text>
86 |
87 |             <Section className="text-center mt-[50px] mb-[50px]">
88 |               <Button
89 |                 className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
90 |                 href={link}
91 |               >
92 |                 View invoice details
93 |               </Button>
94 |             </Section>
95 |
96 |             <br />
97 |
98 |             <Footer />
99 |           </Container>
100 |         </Body>
101 |       </Tailwind>
102 |     </Html>
103 |   );
104 | };
105 |
106 | export default InvoiceOverdueEmail;
```

packages/email/emails/invoice-paid.tsx
```
1 | import {
2 |   Body,
3 |   Button,
4 |   Container,
5 |   Font,
6 |   Heading,
7 |   Html,
8 |   Preview,
9 |   Section,
10 |   Tailwind,
11 |   Text,
12 | } from "@react-email/components";
13 | import { Footer } from "../components/footer";
14 | import { Logo } from "../components/logo";
15 |
16 | interface Props {
17 |   invoiceNumber: string;
18 |   link: string;
19 | }
20 |
21 | export const InvoicePaidEmail = ({
22 |   invoiceNumber = "INV-0001",
23 |   link = "https://app.midday.ai/invoices?invoiceId=40b25275-258c-48e0-9678-57324cd770a6&type=details",
24 | }: Props) => {
25 |   const text = `Invoice ${invoiceNumber} has been paid`;
26 |
27 |   return (
28 |     <Html>
29 |       <Tailwind>
30 |         <head>
31 |           <Font
32 |             fontFamily="Geist"
33 |             fallbackFontFamily="Helvetica"
34 |             webFont={{
35 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
36 |               format: "woff2",
37 |             }}
38 |             fontWeight={400}
39 |             fontStyle="normal"
40 |           />
41 |
42 |           <Font
43 |             fontFamily="Geist"
44 |             fallbackFontFamily="Helvetica"
45 |             webFont={{
46 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
47 |               format: "woff2",
48 |             }}
49 |             fontWeight={500}
50 |             fontStyle="normal"
51 |           />
52 |         </head>
53 |         <Preview>{text}</Preview>
54 |
55 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
56 |           <Container
57 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
58 |             style={{ borderStyle: "solid", borderWidth: 1 }}
59 |           >
60 |             <Logo />
61 |             <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
62 |               Invoice {invoiceNumber} <br /> has been Paid
63 |             </Heading>
64 |
65 |             <br />
66 |
67 |             <Text className="text-[#121212]">
68 |               Great news! We found a matching transaction for this invoice in
69 |               your account and have marked it accordingly.
70 |               <br />
71 |               <br />
72 |               The invoice has been linked to the transaction in your records.
73 |               Please take a moment to check that everything looks right.
74 |             </Text>
75 |
76 |             <Section className="text-center mt-[50px] mb-[50px]">
77 |               <Button
78 |                 className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
79 |                 href={link}
80 |               >
81 |                 View invoice details
82 |               </Button>
83 |             </Section>
84 |
85 |             <br />
86 |
87 |             <Footer />
88 |           </Container>
89 |         </Body>
90 |       </Tailwind>
91 |     </Html>
92 |   );
93 | };
94 |
95 | export default InvoicePaidEmail;
```

packages/email/emails/invoice-reminder.tsx
```
1 | import {
2 |   Body,
3 |   Button,
4 |   Container,
5 |   Font,
6 |   Heading,
7 |   Html,
8 |   Preview,
9 |   Section,
10 |   Tailwind,
11 |   Text,
12 | } from "@react-email/components";
13 | import { Footer } from "../components/footer";
14 | import { Logo } from "../components/logo";
15 |
16 | interface Props {
17 |   companyName: string;
18 |   teamName: string;
19 |   invoiceNumber: string;
20 |   link: string;
21 | }
22 |
23 | export const InvoiceReminderEmail = ({
24 |   companyName = "Customer",
25 |   teamName = "Midday",
26 |   invoiceNumber = "INV-0001",
27 |   link = "https://app.midday.ai/i/1234567890",
28 | }: Props) => {
29 |   const text = `Reminder: Payment for ${invoiceNumber}`;
30 |
31 |   return (
32 |     <Html>
33 |       <Tailwind>
34 |         <head>
35 |           <Font
36 |             fontFamily="Geist"
37 |             fallbackFontFamily="Helvetica"
38 |             webFont={{
39 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
40 |               format: "woff2",
41 |             }}
42 |             fontWeight={400}
43 |             fontStyle="normal"
44 |           />
45 |
46 |           <Font
47 |             fontFamily="Geist"
48 |             fallbackFontFamily="Helvetica"
49 |             webFont={{
50 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
51 |               format: "woff2",
52 |             }}
53 |             fontWeight={500}
54 |             fontStyle="normal"
55 |           />
56 |         </head>
57 |         <Preview>{text}</Preview>
58 |
59 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
60 |           <Container
61 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
62 |             style={{ borderStyle: "solid", borderWidth: 1 }}
63 |           >
64 |             <Logo />
65 |             <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
66 |               Payment Reminder: Invoice {invoiceNumber} <br />
67 |               from {teamName}
68 |             </Heading>
69 |
70 |             <br />
71 |
72 |             <span className="font-medium">Hi {companyName},</span>
73 |             <Text className="text-[#121212]">
74 |               This is a friendly reminder about your pending invoice. We kindly
75 |               ask you to review and process the payment at your earliest
76 |               convenience. If you have any questions or need clarification,
77 |               please don't hesitate to reply to this email.
78 |             </Text>
79 |
80 |             <Section className="text-center mt-[50px] mb-[50px]">
81 |               <Button
82 |                 className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
83 |                 href={link}
84 |               >
85 |                 View invoice
86 |               </Button>
87 |             </Section>
88 |
89 |             <br />
90 |
91 |             <Footer />
92 |           </Container>
93 |         </Body>
94 |       </Tailwind>
95 |     </Html>
96 |   );
97 | };
98 |
99 | export default InvoiceReminderEmail;
```

packages/email/emails/invoice.tsx
```
1 | import {
2 |   Body,
3 |   Button,
4 |   Container,
5 |   Font,
6 |   Heading,
7 |   Html,
8 |   Preview,
9 |   Section,
10 |   Tailwind,
11 |   Text,
12 | } from "@react-email/components";
13 | import { Footer } from "../components/footer";
14 | import { Logo } from "../components/logo";
15 |
16 | interface Props {
17 |   customerName: string;
18 |   teamName: string;
19 |   link: string;
20 | }
21 |
22 | export const InvoiceEmail = ({
23 |   customerName = "Customer",
24 |   teamName = "Midday",
25 |   link = "https://app.midday.ai/i/1234567890",
26 | }: Props) => {
27 |   const text = `You’ve Received an Invoice from ${teamName}`;
28 |
29 |   return (
30 |     <Html>
31 |       <Tailwind>
32 |         <head>
33 |           <Font
34 |             fontFamily="Geist"
35 |             fallbackFontFamily="Helvetica"
36 |             webFont={{
37 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
38 |               format: "woff2",
39 |             }}
40 |             fontWeight={400}
41 |             fontStyle="normal"
42 |           />
43 |
44 |           <Font
45 |             fontFamily="Geist"
46 |             fallbackFontFamily="Helvetica"
47 |             webFont={{
48 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
49 |               format: "woff2",
50 |             }}
51 |             fontWeight={500}
52 |             fontStyle="normal"
53 |           />
54 |         </head>
55 |         <Preview>{text}</Preview>
56 |
57 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
58 |           <Container
59 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
60 |             style={{ borderStyle: "solid", borderWidth: 1 }}
61 |           >
62 |             <Logo />
63 |             <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
64 |               You’ve Received an Invoice <br /> from {teamName}
65 |             </Heading>
66 |
67 |             <br />
68 |
69 |             <span className="font-medium">Hi {customerName},</span>
70 |             <Text className="text-[#121212]">
71 |               Please review your invoice and make sure to pay it on time. If you
72 |               have any questions, feel free to reply to this email.
73 |             </Text>
74 |
75 |             <Section className="text-center mt-[50px] mb-[50px]">
76 |               <Button
77 |                 className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
78 |                 href={link}
79 |               >
80 |                 View invoice
81 |               </Button>
82 |             </Section>
83 |
84 |             <br />
85 |
86 |             <Footer />
87 |           </Container>
88 |         </Body>
89 |       </Tailwind>
90 |     </Html>
91 |   );
92 | };
93 |
94 | export default InvoiceEmail;
```

packages/email/emails/transactions.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { getAppUrl } from "@midday/utils/envs";
3 | import {
4 |   Body,
5 |   Button,
6 |   Container,
7 |   Font,
8 |   Heading,
9 |   Html,
10 |   Link,
11 |   Preview,
12 |   Section,
13 |   Tailwind,
14 |   Text,
15 | } from "@react-email/components";
16 | import { format } from "date-fns";
17 | import { Footer } from "../components/footer";
18 | import { Logo } from "../components/logo";
19 | import { getI18n } from "../locales";
20 |
21 | type Transaction = {
22 |   id: string;
23 |   date: string;
24 |   amount: number;
25 |   name: string;
26 |   currency: string;
27 |   category?: string;
28 | };
29 |
30 | interface Props {
31 |   fullName: string;
32 |   transactions: Transaction[];
33 |   locale: string;
34 |   teamName: string;
35 | }
36 |
37 | const defaultTransactions = [
38 |   {
39 |     id: "1",
40 |     date: new Date().toISOString(),
41 |     amount: -1000,
42 |     currency: "USD",
43 |     name: "Spotify",
44 |   },
45 |   {
46 |     id: "2",
47 |     date: new Date().toISOString(),
48 |     amount: 1000,
49 |     currency: "USD",
50 |     name: "H23504959",
51 |     category: "income",
52 |   },
53 |   {
54 |     id: "3",
55 |     date: new Date().toISOString(),
56 |     amount: -1000,
57 |     currency: "USD",
58 |     name: "Webflow",
59 |   },
60 |   {
61 |     id: "4",
62 |     date: new Date().toISOString(),
63 |     amount: -1000,
64 |     currency: "USD",
65 |     name: "Netflix",
66 |   },
67 |   {
68 |     id: "5",
69 |     date: new Date().toISOString(),
70 |     amount: -2500,
71 |     currency: "USD",
72 |     name: "Adobe Creative Cloud",
73 |   },
74 |   {
75 |     id: "6",
76 |     date: new Date().toISOString(),
77 |     amount: -1499,
78 |     currency: "USD",
79 |     name: "Amazon Prime",
80 |   },
81 |   {
82 |     id: "7",
83 |     date: new Date().toISOString(),
84 |     amount: -999,
85 |     currency: "USD",
86 |     name: "Disney+",
87 |   },
88 |   {
89 |     id: "8",
90 |     date: new Date().toISOString(),
91 |     amount: -1299,
92 |     currency: "USD",
93 |     name: "Microsoft 365",
94 |   },
95 |   {
96 |     id: "9",
97 |     date: new Date().toISOString(),
98 |     amount: -899,
99 |     currency: "USD",
100 |     name: "Apple Music",
101 |   },
102 |   {
103 |     id: "10",
104 |     date: new Date().toISOString(),
105 |     amount: -1599,
106 |     currency: "USD",
107 |     name: "HBO Max",
108 |   },
109 |   {
110 |     id: "11",
111 |     date: new Date().toISOString(),
112 |     amount: -1999,
113 |     currency: "USD",
114 |     name: "Adobe Photoshop",
115 |   },
116 |   {
117 |     id: "12",
118 |     date: new Date().toISOString(),
119 |     amount: -799,
120 |     currency: "USD",
121 |     name: "YouTube Premium",
122 |   },
123 |   {
124 |     id: "13",
125 |     date: new Date().toISOString(),
126 |     amount: -1499,
127 |     currency: "USD",
128 |     name: "Dropbox Plus",
129 |   },
130 |   {
131 |     id: "14",
132 |     date: new Date().toISOString(),
133 |     amount: -999,
134 |     currency: "USD",
135 |     name: "Nintendo Online",
136 |   },
137 |   {
138 |     id: "15",
139 |     date: new Date().toISOString(),
140 |     amount: -1299,
141 |     currency: "USD",
142 |     name: "Slack",
143 |   },
144 | ];
145 |
146 | const baseAppUrl = getAppUrl();
147 |
148 | export const TransactionsEmail = ({
149 |   fullName = "Viktor Hofte",
150 |   transactions = defaultTransactions,
151 |   locale = "en",
152 |   teamName = "Viktor Hofte AB",
153 | }: Props) => {
154 |   const { t } = getI18n({ locale });
155 |   const firstName = fullName.split(" ").at(0);
156 |
157 |   const previewText = t("transactions.preview", {
158 |     firstName,
159 |     numberOfTransactions: transactions.length,
160 |   });
161 |
162 |   const displayedTransactions = transactions.slice(0, 10);
163 |
164 |   return (
165 |     <Html>
166 |       <Tailwind>
167 |         <head>
168 |           <Font
169 |             fontFamily="Geist"
170 |             fallbackFontFamily="Helvetica"
171 |             webFont={{
172 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
173 |               format: "woff2",
174 |             }}
175 |             fontWeight={400}
176 |             fontStyle="normal"
177 |           />
178 |
179 |           <Font
180 |             fontFamily="Geist"
181 |             fallbackFontFamily="Helvetica"
182 |             webFont={{
183 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
184 |               format: "woff2",
185 |             }}
186 |             fontWeight={500}
187 |             fontStyle="normal"
188 |           />
189 |         </head>
190 |         <Preview>{previewText}</Preview>
191 |
192 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
193 |           <Container
194 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
195 |             style={{ borderStyle: "solid", borderWidth: 1 }}
196 |           >
197 |             <Logo />
[TRUNCATED]
```

packages/email/emails/welcome.tsx
```
1 | import { getEmailUrl } from "@midday/utils/envs";
2 | import {
3 |   Body,
4 |   Container,
5 |   Font,
6 |   Heading,
7 |   Html,
8 |   Img,
9 |   Link,
10 |   Preview,
11 |   Tailwind,
12 |   Text,
13 | } from "@react-email/components";
14 | import { Footer } from "../components/footer";
15 | import { GetStarted } from "../components/get-started";
16 | import { Logo } from "../components/logo";
17 |
18 | interface Props {
19 |   fullName: string;
20 | }
21 |
22 | const baseUrl = getEmailUrl();
23 |
24 | export const WelcomeEmail = ({ fullName = "Viktor Hofte" }: Props) => {
25 |   const firstName = fullName.split(" ").at(0);
26 |   const text = `Hi ${firstName}, Welcome to Midday! I'm Pontus, one of the founders. It's really important to us that you have a great experience ramping up.`;
27 |
28 |   return (
29 |     <Html>
30 |       <Tailwind>
31 |         <head>
32 |           <Font
33 |             fontFamily="Geist"
34 |             fallbackFontFamily="Helvetica"
35 |             webFont={{
36 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
37 |               format: "woff2",
38 |             }}
39 |             fontWeight={400}
40 |             fontStyle="normal"
41 |           />
42 |
43 |           <Font
44 |             fontFamily="Geist"
45 |             fallbackFontFamily="Helvetica"
46 |             webFont={{
47 |               url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
48 |               format: "woff2",
49 |             }}
50 |             fontWeight={500}
51 |             fontStyle="normal"
52 |           />
53 |         </head>
54 |         <Preview>{text}</Preview>
55 |
56 |         <Body className="bg-[#fff] my-auto mx-auto font-sans">
57 |           <Container
58 |             className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
59 |             style={{ borderStyle: "solid", borderWidth: 1 }}
60 |           >
61 |             <Logo />
62 |             <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
63 |               Welcome to Midday
64 |             </Heading>
65 |
66 |             <br />
67 |
68 |             <span className="font-medium">Hi {firstName},</span>
69 |             <Text className="text-[#121212]">
70 |               Welcome to Midday! I'm Pontus, one of the founders.
71 |               <br />
72 |               <br />
73 |               We've been working on Midday for the past months, and during this
74 |               time, we've implemented the basic functionality to get started.
75 |               However, with your feedback, we can make the right decisions to
76 |               help run your business smarter.
77 |               <br />
78 |               <br />
79 |               During our beta phase, you may encounter some bugs, but we
80 |               genuinely want all your feedback.
81 |               <br />
82 |               <br />
83 |               Should you have any questions, please don't hesitate to reply
84 |               directly to this email or to{" "}
85 |               <Link
86 |                 href="https://cal.com/pontus-midday/15min"
87 |                 className="text-[#121212] underline"
88 |               >
89 |                 schedule a call with me
90 |               </Link>
91 |               .
92 |             </Text>
93 |
94 |             <br />
95 |
96 |             <Img
97 |               src={`${baseUrl}/email/founders.jpeg`}
98 |               alt="Founders"
99 |               className="my-0 mx-auto block w-full"
100 |             />
101 |
102 |             <Text className="text-[#707070]">Best regards, founders</Text>
103 |
104 |             <Img
105 |               src={`${baseUrl}/email/signature.png`}
106 |               alt="Signature"
107 |               className="block w-full w-[143px] h-[20px]"
108 |             />
109 |
110 |             <br />
111 |             <br />
112 |
113 |             <GetStarted />
114 |
115 |             <br />
116 |
117 |             <Footer />
118 |           </Container>
119 |         </Body>
120 |       </Tailwind>
121 |     </Html>
122 |   );
123 | };
124 |
125 | export default WelcomeEmail;
```

packages/email/locales/index.ts
```
1 | import { type TranslationParams, translations } from "./translations";
2 |
3 | type Options = {
4 |   locale?: string;
5 | };
6 |
7 | const supportedLocales = ["en", "sv"];
8 |
9 | export function getI18n({ locale = "en" }: Options) {
10 |   // Ensure locale is supported, fallback to English if not
11 |   const safeLocale = supportedLocales.includes(locale) ? locale : "en";
12 |
13 |   // Get translations for the locale
14 |   const getTranslation = (key: string, params?: TranslationParams) => {
15 |     const translationSet = translations(safeLocale, params);
16 |
17 |     if (!translationSet || !(key in translationSet)) {
18 |       return key; // Fallback to key if translation missing
19 |     }
20 |
21 |     return translationSet[key];
22 |   };
23 |
24 |   return {
25 |     t: getTranslation,
26 |   };
27 | }
```

packages/email/locales/translations.ts
```
1 | export interface TranslationParams {
2 |   [key: string]: string | number | undefined;
3 | }
4 |
5 | export function translations(locale: string, params?: TranslationParams) {
6 |   switch (locale) {
7 |     case "en":
8 |       return {
9 |         "notifications.match": `We matched the transaction “${params?.transactionName}” against “${params?.fileName}”`,
10 |         "notifications.transactions":
11 |           params?.numberOfTransactions &&
12 |           typeof params?.numberOfTransactions === "number" &&
13 |           params?.numberOfTransactions > 1
14 |             ? `You have ${params?.numberOfTransactions} new transactions`
15 |             : `You have a new transaction of ${params?.amount} from ${params?.name}`,
16 |         "notifications.invoicePaid": `Invoice ${params?.invoiceNumber} has been paid`,
17 |         "notifications.invoiceOverdue": `Invoice ${params?.invoiceNumber} is overdue`,
18 |         "transactions.subject": "New transactions",
19 |         "transactions.preview": `Hi ${params?.firstName}, You have ${
20 |           params?.numberOfTransactions
21 |         } ${
22 |           params?.numberOfTransactions > 1
23 |             ? "new transactions"
24 |             : "new transaction"
25 |         }`,
26 |         "transactions.title1": "You have ",
27 |         "transactions.title2": `${params?.numberOfTransactions} ${
28 |           params?.numberOfTransactions > 1
29 |             ? "new transactions"
30 |             : "new transaction"
31 |         }`,
32 |         "transactions.description1": `Hi ${params?.firstName}`,
33 |         "transactions.description2": "We found",
34 |         "transactions.description3": `${params?.numberOfTransactions} ${
35 |           params?.numberOfTransactions > 1
36 |             ? "new transactions"
37 |             : "new transaction"
38 |         }`,
39 |         "transactions.description4": `for your team ${params?.teamName}, we will try to match those against receipts in your inbox for up to 45 days. Additionally, you can simply reply to this email with the receipts.`,
40 |         "transactions.button": "View transactions",
41 |         "transactions.settings": "Notification preferences",
42 |         "transactions.amount": "Amount",
43 |         "transactions.date": "Date",
44 |         "transactions.description": "Description",
45 |         "invite.subject": `${params?.invitedByName} invited you to the ${params?.teamName} team on Midday`,
46 |         "invite.preview": `Join ${params?.teamName} on Midday`,
47 |         "invite.title1": "Join",
48 |         "invite.title2": "on",
49 |         "invite.link1": "has invited you to the",
50 |         "invite.link2": "team on",
51 |         "invite.join": "Join the team",
52 |         "invite.link3": "or copy and paste this URL into your browser",
53 |         "invite.footer1": "This invitation was intended for",
54 |         "invite.footer2": "This invite was sent from",
55 |         "invite.footer3": "located in",
56 |         "invite.footer4":
57 |           "If you were not expecting this invitation, you can ignore this email. If you are concerned about your account's safety, please reply to this email to get in touch with us.",
58 |         "invoice.overdue.subject": `Invoice #${params?.invoiceNumber} is overdue`,
59 |         "invoice.paid.subject": `Invoice #${params?.invoiceNumber} has been paid`,
60 |       };
61 |     case "sv":
62 |       return {
63 |         "notifications.match": `Vi matchade transaktionen “${params?.transactionName}” mot “${params?.fileName}”`,
64 |         "notifications.transactions":
65 |           params?.numberOfTransactions &&
66 |           typeof params?.numberOfTransactions === "number" &&
67 |           params?.numberOfTransactions > 1
68 |             ? `Du har ${params?.numberOfTransactions} nya transaktioner`
69 |             : `Du har en ny transaktion på ${params?.amount} från ${params?.name}`,
70 |         "notifications.invoicePaid": `Faktura ${params?.invoiceNumber} har betalats`,
71 |         "notifications.invoiceOverdue": `Faktura ${params?.invoiceNumber} är försenad`,
72 |         "transactions.subject": "Nya transaktioner",
73 |         "transactions.preview": `Hej ${params?.firstName}, Vi hittade ${
74 |           params?.numberOfTransactions
75 |         } ${
76 |           params?.numberOfTransactions > 1
77 |             ? "nya transaktioner"
78 |             : "nya transaktion"
79 |         } .`,
80 |         "transactions.title1": "Du har ",
81 |         "transactions.title2": `${params?.numberOfTransactions} ${
82 |           params?.numberOfTransactions > 1
83 |             ? "nya transaktioner"
84 |             : "nya transaktion"
85 |         }`,
86 |         "transactions.description1": `Hej ${params?.firstName}`,
87 |         "transactions.description2": "Vi hittade",
88 |         "transactions.description3": `${params?.numberOfTransactions} ${
89 |           params?.numberOfTransactions > 1
90 |             ? "nya transaktioner"
91 |             : "nya transaktion"
92 |         }`,
93 |         "transactions.description4":
94 |           "på ditt konto som vi försöker matcha mot kvitton i din inkorg i upp till 45 dagar. Du kan också svara på detta email med dina kvitton.",
95 |         "transactions.button": "Visa transaktioner",
96 |         "transactions.footer":
97 |           " Nam imperdiet congue volutpat. Nulla quis facilisis lacus. Vivamus convallis sit amet lectus eget tincidunt. Vestibulum vehicula rutrum nisl, sed faucibus neque. Donec lacus mi, rhoncus at dictum eget, pulvinar at metus. Donec cursus tellus erat, a hendrerit elit rutrum ut. Fusce quis tristique ligula. Etiam sit amet enim vitae mauris auctor blandit id et nibh.",
98 |         "transactions.settings": "Inställningar",
99 |         "transactions.amount": "Belopp",
100 |         "transactions.date": "Datum",
101 |         "transactions.description": "Beskrivning",
102 |         "invite.subject": `${params?.invitedByName} bjöd in dig till ${params?.teamName} på Midday`,
103 |         "invite.preview": `Gå med i ${params?.teamName} på Midday`,
104 |         "invite.title1": "Gå med",
105 |         "invite.title2": "på",
[TRUNCATED]
```

packages/events/src/client.tsx
```
1 | import {
2 |   OpenPanelComponent,
3 |   type PostEventPayload,
4 |   useOpenPanel,
5 | } from "@openpanel/nextjs";
6 |
7 | const isProd = process.env.NODE_ENV === "production";
8 |
9 | const Provider = () => (
10 |   <OpenPanelComponent
11 |     clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
12 |     trackAttributes={true}
13 |     trackScreenViews={isProd}
14 |     trackOutgoingLinks={isProd}
15 |   />
16 | );
17 |
18 | const track = (options: { event: string } & PostEventPayload["properties"]) => {
19 |   const { track: openTrack } = useOpenPanel();
20 |
21 |   if (!isProd) {
22 |     console.log("Track", options);
23 |     return;
24 |   }
25 |
26 |   const { event, ...rest } = options;
27 |
28 |   openTrack(event, rest);
29 | };
30 |
31 | export { Provider, track };
```

packages/events/src/events.ts
```
1 | export const LogEvents = {
2 |   Waitlist: {
3 |     name: "User Joined Waitlist",
4 |     channel: "waitlist",
5 |   },
6 |   SignIn: {
7 |     name: "User Signed In",
8 |     channel: "login",
9 |   },
10 |   SignOut: {
11 |     name: "User Signed Out",
12 |     channel: "login",
13 |   },
14 |   Registered: {
15 |     name: "User Registered",
16 |     channel: "registered",
17 |   },
18 |   ProjectCreated: {
19 |     name: "Project Created",
20 |     channel: "tracker",
21 |   },
22 |   ProjectDeleted: {
23 |     name: "Project Deleted",
24 |     channel: "tracker",
25 |   },
26 |   ProjectUpdated: {
27 |     name: "Project Updated",
28 |     channel: "tracker",
29 |   },
30 |   ProjectReport: {
31 |     name: "Project Report",
32 |     channel: "report",
33 |   },
34 |   TrackerCreateEntry: {
35 |     name: "Tracker Create Entry",
36 |     channel: "tracker",
37 |   },
38 |   TrackerDeleteEntry: {
39 |     name: "Tracker Delete Entry",
40 |     channel: "tracker",
41 |   },
42 |   ConnectBankCompleted: {
43 |     name: "Connect Bank Completed",
44 |     channel: "bank",
45 |   },
46 |   ConnectBankProvider: {
47 |     name: "Connect Bank Provider",
48 |     channel: "bank",
49 |   },
50 |   ConnectBankCanceled: {
51 |     name: "Connect Bank Canceled",
52 |     channel: "bank",
53 |   },
54 |   ConnectBankAuthorized: {
55 |     name: "Connect Bank Authorized",
56 |     channel: "bank",
57 |   },
58 |   GoCardLessLinkFailed: {
59 |     name: "GoCardLess Link Failed",
60 |     channel: "gocardless",
61 |   },
62 |   ConnectBankFailed: {
63 |     name: "Connect Bank Failed",
64 |     channel: "bank",
65 |   },
66 |   BankAccountCreate: {
67 |     name: "Create Bank Account",
68 |     channel: "bank",
69 |   },
70 |   DeleteBank: {
71 |     name: "Delete Bank",
72 |     channel: "bank",
73 |   },
74 |   UpdateBank: {
75 |     name: "Update Bank",
76 |     channel: "bank",
77 |   },
78 |   OverviewReport: {
79 |     name: "Overview Report",
80 |     channel: "report",
81 |   },
82 |   AcceptInvite: {
83 |     name: "Accept Invite",
84 |     channel: "invite",
85 |   },
86 |   DeleteInvite: {
87 |     name: "Delete Invite",
88 |     channel: "invite",
89 |   },
90 |   DeclineInvite: {
91 |     name: "Decline Invite",
92 |     channel: "invite",
93 |   },
94 |   InviteTeamMembers: {
95 |     name: "Invite Team Member",
96 |     channel: "invite",
97 |   },
98 |   UserRoleChange: {
99 |     name: "User Role Change",
100 |     channel: "user",
101 |   },
102 |   DeleteUser: {
103 |     name: "Delete User",
104 |     channel: "user",
105 |   },
106 |   ChangeTeam: {
107 |     name: "Change Team",
108 |     channel: "team",
109 |   },
110 |   CreateTeam: {
111 |     name: "Create Team",
112 |     channel: "team",
113 |   },
114 |   LeaveTeam: {
115 |     name: "Leave Team",
116 |     channel: "team",
117 |   },
118 |   DeleteTeam: {
119 |     name: "Delete Team",
120 |     channel: "team",
121 |   },
122 |   DeleteTeamMember: {
123 |     name: "Delete Team Member",
124 |     channel: "team",
125 |   },
126 |   CreateAttachment: {
127 |     name: "Create Attachment",
128 |     channel: "transaction",
129 |   },
130 |   ExportTransactions: {
131 |     name: "Export Transaction",
132 |     channel: "transaction",
133 |   },
134 |   DeleteAttachment: {
135 |     name: "Delete Attachment",
136 |     channel: "transaction",
137 |   },
138 |   TransactionsManualSync: {
139 |     name: "Manual Sync",
140 |     channel: "transaction",
141 |   },
142 |   CreateFolder: {
143 |     name: "Create Folder",
144 |     channel: "vault",
145 |   },
146 |   DeleteFolder: {
147 |     name: "Delete Folder",
148 |     channel: "vault",
149 |   },
150 |   DeleteFile: {
151 |     name: "Delete File",
152 |     channel: "vault",
153 |   },
154 |   ShareFile: {
155 |     name: "Share File",
156 |     channel: "vault",
157 |   },
158 |   MfaVerify: {
159 |     name: "MFA Verify",
160 |     channel: "security",
161 |   },
162 |   SendFeedback: {
163 |     name: "Send Feedback",
164 |     channel: "feedback",
165 |   },
166 |   InboxInbound: {
167 |     name: "Inbox Inbound",
168 |     channel: "inbox",
169 |   },
170 |   ImportTransactions: {
171 |     name: "Import Transactions",
172 |     channel: "import",
173 |   },
174 |   SupportTicket: {
175 |     name: "Support Ticket",
176 |     channel: "support",
177 |   },
178 |   CategoryCreate: {
179 |     name: "Category Create",
180 |     channel: "category",
181 |   },
182 |   CategoryDelete: {
183 |     name: "Category Delete",
184 |     channel: "category",
185 |   },
186 |   CreateTransaction: {
187 |     name: "Create Transaction",
188 |     channel: "transaction",
189 |   },
190 |   UpdateBaseCurrency: {
191 |     name: "Update Base Currency",
192 |     channel: "transaction",
193 |   },
194 |   UpdateCurrency: {
195 |     name: "Update Currency",
196 |     channel: "transaction",
197 |   },
198 |   DisconnectApp: {
199 |     name: "Disconnect App",
200 |     channel: "app",
201 |   },
202 |   UpdateAppSettings: {
203 |     name: "Update App Settings",
204 |     channel: "app",
205 |   },
206 |   GoCardLessLinkCreated: {
207 |     name: "GoCardLess Link Created",
208 |     channel: "gocardless",
209 |   },
210 |   CreateCustomer: {
211 |     name: "Create Customer",
212 |     channel: "customer",
213 |   },
214 |   DeleteCustomer: {
215 |     name: "Delete Customer",
216 |     channel: "customer",
217 |   },
218 |   CreateTag: {
219 |     name: "Create Tag",
220 |     channel: "tag",
221 |   },
222 |   CreateTransactionTag: {
223 |     name: "Create Transaction Tag",
224 |     channel: "tag",
225 |   },
226 |   DeleteTransactionTag: {
227 |     name: "Delete Transaction Tag",
228 |     channel: "tag",
229 |   },
[TRUNCATED]
```

packages/events/src/server.ts
```
1 | import { OpenPanel, type PostEventPayload } from "@openpanel/nextjs";
2 | import { waitUntil } from "@vercel/functions";
3 | import { cookies } from "next/headers";
4 |
5 | type Props = {
6 |   userId?: string;
7 |   fullName?: string | null;
8 | };
9 |
10 | export const setupAnalytics = async (options?: Props) => {
11 |   const { userId, fullName } = options ?? {};
12 |   const trackingConsent =
13 |     !cookies().has("tracking-consent") ||
14 |     cookies().get("tracking-consent")?.value === "1";
15 |
16 |   const client = new OpenPanel({
17 |     clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!,
18 |     clientSecret: process.env.OPENPANEL_SECRET_KEY!,
19 |   });
20 |
21 |   if (trackingConsent && userId && fullName) {
22 |     const [firstName, lastName] = fullName.split(" ");
23 |
24 |     waitUntil(
25 |       client.identify({
26 |         profileId: userId,
27 |         firstName,
28 |         lastName,
29 |       }),
30 |     );
31 |   }
32 |
33 |   return {
34 |     track: (options: { event: string } & PostEventPayload["properties"]) => {
35 |       if (process.env.NODE_ENV !== "production") {
36 |         console.log("Track", options);
37 |         return;
38 |       }
39 |
40 |       const { event, ...rest } = options;
41 |
42 |       waitUntil(client.track(event, rest));
43 |     },
44 |   };
45 | };
```

packages/import/src/index.ts
```
1 | export * from "./utils";
```

packages/import/src/mappings.ts
```
1 | import type { Transaction } from "./types";
2 |
3 | export const mapTransactions = (
4 |   data: Record<string, string>[],
5 |   mappings: Record<string, string>,
6 |   currency: string,
7 |   teamId: string,
8 |   bankAccountId: string,
9 | ): Transaction[] => {
10 |   return data.map((row) => ({
11 |     ...(Object.fromEntries(
12 |       Object.entries(mappings)
13 |         .filter(([_, value]) => value !== "")
14 |         .map(([key, value]) => [key, row[value]]),
15 |     ) as Transaction),
16 |     currency,
17 |     teamId,
18 |     bankAccountId,
19 |   }));
20 | };
```

packages/import/src/transform.ts
```
1 | import { capitalCase } from "change-case";
2 | import { v4 as uuidv4 } from "uuid";
3 | import type { Transaction } from "./types";
4 | import { formatAmountValue, formatDate } from "./utils";
5 |
6 | export function transform({
7 |   transaction,
8 |   inverted,
9 | }: {
10 |   transaction: Transaction;
11 |   inverted: boolean;
12 | }) {
13 |   return {
14 |     internal_id: `${transaction.teamId}_${uuidv4()}`,
15 |     team_id: transaction.teamId,
16 |     status: "posted",
17 |     method: "other",
18 |     date: formatDate(transaction.date),
19 |     amount: formatAmountValue({ amount: transaction.amount, inverted }),
20 |     name: transaction?.description && capitalCase(transaction.description),
21 |     manual: true,
22 |     category_slug:
23 |       formatAmountValue({ amount: transaction.amount, inverted }) > 0
24 |         ? "income"
25 |         : null,
26 |     bank_account_id: transaction.bankAccountId,
27 |     currency: transaction.currency.toUpperCase(),
28 |     notified: true,
29 |   };
30 | }
```

packages/import/src/types.ts
```
1 | export type Transaction = {
2 |   date: string;
3 |   description: string;
4 |   amount: string;
5 |   teamId: string;
6 |   bankAccountId: string;
7 |   currency: string;
8 | };
```

packages/import/src/utils.test.ts
```
1 | import { describe, expect, it } from "bun:test";
2 | import { formatAmountValue, formatDate } from "./utils";
3 |
4 | describe("formatAmountValue", () => {
5 |   it("should handle numbers with comma as decimal separator", () => {
6 |     expect(formatAmountValue({ amount: "1.234,56" })).toBe(1234.56);
7 |   });
8 |
9 |   it("should handle numbers with period as thousands separator", () => {
10 |     expect(formatAmountValue({ amount: "1.234.56" })).toBe(1234.56);
11 |   });
12 |
13 |   it("should handle numbers with period as decimal separator", () => {
14 |     expect(formatAmountValue({ amount: "1234.56" })).toBe(1234.56);
15 |   });
16 |
17 |   it("should handle plain numbers", () => {
18 |     expect(formatAmountValue({ amount: "1234" })).toBe(1234);
19 |   });
20 |
21 |   it("should invert the amount when inverted is true", () => {
22 |     expect(formatAmountValue({ amount: "1234.56", inverted: true })).toBe(
23 |       -1234.56,
24 |     );
25 |   });
26 |
27 |   it("should handle negative numbers", () => {
28 |     expect(formatAmountValue({ amount: "-1234.56" })).toBe(-1234.56);
29 |   });
30 |
31 |   it("should invert negative numbers when inverted is true", () => {
32 |     expect(formatAmountValue({ amount: "-1234.56", inverted: true })).toBe(
33 |       1234.56,
34 |     );
35 |   });
36 |
37 |   it("should handle zero", () => {
38 |     expect(formatAmountValue({ amount: "0" })).toBe(0);
39 |     expect(formatAmountValue({ amount: "0", inverted: true })).toBe(-0);
40 |   });
41 | });
42 |
43 | describe("formatDate", () => {
44 |   it("should format a valid date string", () => {
45 |     expect(formatDate("2023-05-15")).toBe("2023-05-15");
46 |   });
47 |
48 |   it("should handle date strings with non-date characters", () => {
49 |     expect(formatDate("2023/05/15")).toBe("2023-05-15");
50 |     expect(formatDate("May 15, 2023")).toBe("2023-05-15");
51 |   });
52 |
53 |   it("should return undefined for invalid date strings", () => {
54 |     expect(formatDate("invalid-date")).toBeUndefined();
55 |     expect(formatDate("2023-13-45")).toBeUndefined();
56 |   });
57 |
58 |   it("should handle different date formats", () => {
59 |     expect(formatDate("05/15/2023")).toBe("2023-05-15");
60 |   });
61 |
62 |   it("should handle dates with time", () => {
63 |     expect(formatDate("2023-05-15T14:30:00")).toBe("2023-05-15");
64 |   });
65 |
66 |   it("should handle dates dot separated", () => {
67 |     expect(formatDate("04.09.2024")).toBe("2024-09-04");
68 |   });
69 |
70 |   it("should handle dates with time", () => {
71 |     expect(formatDate("08.05.2024 09:12:07")).toBe("2024-05-08");
72 |   });
73 |
74 |   it("should handle dates 07/Aug/2024", () => {
75 |     expect(formatDate("07/Aug/2024")).toBe("2024-08-07");
76 |   });
77 |
78 |   it("should handle dates 24-08-2024", () => {
79 |     expect(formatDate("24-08-2024")).toBe("2024-08-24");
80 |   });
81 |
82 |   it("should handle dates in dd-MM-yyyy format", () => {
83 |     expect(formatDate("24-09-2024")).toBe("2024-09-24");
84 |   });
85 |
86 |   it("should handle short date format", () => {
87 |     expect(formatDate("11/4/24")).toBe("2024-04-11");
88 |   });
89 | });
```

packages/import/src/utils.ts
```
1 | import { isValid, parse, parseISO } from "date-fns";
2 |
3 | function ensureValidYear(dateString: string | undefined): string | undefined {
4 |   if (!dateString) return undefined;
5 |
6 |   const [year, month, day] = dateString.split("-");
7 |   const correctedYear =
8 |     year?.length === 4
9 |       ? year.startsWith("20")
10 |         ? year
11 |         : `20${year.slice(2)}`
12 |       : `20${year}`;
13 |
14 |   return `${correctedYear}-${month}-${day}`;
15 | }
16 |
17 | export function formatDate(date: string) {
18 |   const formats = [
19 |     "dd/MMM/yyyy",
20 |     "dd/MM/yyyy",
21 |     "yyyy-MM-dd",
22 |     "MM/dd/yyyy",
23 |     "dd.MM.yyyy",
24 |     "dd-MM-yyyy",
25 |     "yyyy/MM/dd",
26 |     "MM-dd-yyyy",
27 |     "yyyy.MM.dd",
28 |     "dd MMM yyyy",
29 |     "MMM dd, yyyy",
30 |     "MMMM dd, yyyy",
31 |     "yyyy-MM-dd'T'HH:mm:ss",
32 |     "yyyy-MM-dd HH:mm:ss",
33 |     "dd/MM/yyyy HH:mm:ss",
34 |     "MM/dd/yyyy HH:mm:ss",
35 |     "yyyy/MM/dd HH:mm:ss",
36 |     "dd.MM.yyyy HH:mm:ss",
37 |     "dd-MM-yyyy HH:mm:ss",
38 |     "yyyy-MM-dd'T'HH:mm:ss.SSSZ",
39 |     "yyyy-MM-dd'T'HH:mm:ss",
40 |     "d/M/yy",
41 |   ];
42 |
43 |   for (const format of formats) {
44 |     const parsedDate = parse(date, format, new Date());
45 |     if (isValid(parsedDate)) {
46 |       return ensureValidYear(parsedDate.toISOString().split("T")[0]);
47 |     }
48 |   }
49 |
50 |   try {
51 |     const parsedDate = parseISO(date);
52 |     if (isValid(parsedDate)) {
53 |       return ensureValidYear(parsedDate.toISOString().split("T")[0]);
54 |     }
55 |   } catch {
56 |     // Continue if parseISO fails
57 |   }
58 |
59 |   // If the date includes a time, we don't need to remove the time.
60 |   const value = date.includes("T") ? date : date.replace(/[^0-9-\.\/]/g, "");
61 |
62 |   try {
63 |     const parsedDate = parseISO(value);
64 |     if (isValid(parsedDate)) {
65 |       return ensureValidYear(parsedDate.toISOString().split("T")[0]);
66 |     }
67 |   } catch {
68 |     // Continue if parseISO fails
69 |   }
70 |
71 |   // If all parsing attempts fail, return undefined
72 |   return undefined;
73 | }
74 |
75 | export function formatAmountValue({
76 |   amount,
77 |   inverted,
78 | }: { amount: string; inverted?: boolean }) {
79 |   let value: number;
80 |
81 |   // Handle special minus sign (−) by replacing with standard minus (-)
82 |   const normalizedAmount = amount.replace(/−/g, "-");
83 |
84 |   if (normalizedAmount.includes(",")) {
85 |     // Remove thousands separators and replace the comma with a period.
86 |     value = +normalizedAmount.replace(/\./g, "").replace(",", ".");
87 |   } else if (normalizedAmount.match(/\.\d{2}$/)) {
88 |     // If it ends with .XX, it's likely a decimal; remove internal periods.
89 |     value = +normalizedAmount.replace(/\.(?=\d{3})/g, "");
90 |   } else {
91 |     // If neither condition is met, convert the amount directly to a number
92 |     value = +normalizedAmount;
93 |   }
94 |
95 |   if (inverted) {
96 |     return +(value * -1);
97 |   }
98 |
99 |   return value;
100 | }
```

packages/import/src/validate.ts
```
1 | import { z } from "zod";
2 | import type { Transaction } from "./types";
3 |
4 | export const createTransactionSchema = z.object({
5 |   name: z.string(),
6 |   currency: z.string(),
7 |   bank_account_id: z.string(),
8 |   team_id: z.string(),
9 |   internal_id: z.string(),
10 |   status: z.enum(["posted", "pending"]),
11 |   method: z.enum(["card", "bank", "other"]),
12 |   date: z.coerce.date(),
13 |   amount: z.number(),
14 |   manual: z.boolean(),
15 |   category_slug: z.string().nullable(),
16 | });
17 |
18 | export const validateTransactions = (transactions: Transaction[]) => {
19 |   const processedTransactions = transactions.map((transaction) =>
20 |     createTransactionSchema.safeParse(transaction),
21 |   );
22 |
23 |   const validTransactions = processedTransactions.filter(
24 |     (transaction) => transaction.success,
25 |   );
26 |
27 |   const invalidTransactions = processedTransactions.filter(
28 |     (transaction) => !transaction.success,
29 |   );
30 |
31 |   return {
32 |     validTransactions: validTransactions.map((transaction) => transaction.data),
33 |     invalidTransactions: invalidTransactions.map(
34 |       (transaction) => transaction.error,
35 |     ),
36 |   };
37 | };
```

packages/inbox/src/index.ts
```
1 | export * from "./schema";
2 | export * from "./utils";
```

packages/inbox/src/schema.ts
```
1 | import { z } from "zod";
2 |
3 | export const inboxAttachment = z.object({
4 |   Name: z.string(),
5 |   Content: z.string(),
6 |   ContentType: z.string(),
7 |   ContentID: z.string(),
8 |   ContentLength: z.number(),
9 | });
10 |
11 | export const inboxWebhookPostSchema = z.object({
12 |   OriginalRecipient: z.union([
13 |     z
14 |       .string({ required_error: "OriginalRecipient is required" })
15 |       .email({ message: "Invalid email format" })
16 |       .endsWith("@inbox.midday.ai", { message: "Invalid email domain" }),
17 |     z
18 |       .string({ required_error: "OriginalRecipient is required" })
19 |       .email({ message: "Invalid email format" })
20 |       .endsWith("@inbox.staging.midday.ai", {
21 |         message: "Invalid email domain",
22 |       }),
23 |   ]),
24 |   Attachments: z.array(inboxAttachment).optional(),
25 |   Subject: z.string().optional(),
26 |   TextBody: z.string().optional(),
27 |   HtmlBody: z.string().optional(),
28 |   FromFull: z.object({
29 |     Name: z.string(),
30 |     Email: z.string(),
31 |   }),
32 |   MessageID: z.string({ required_error: "MessageID is required" }),
33 | });
```

packages/inbox/src/tsconfig.json
```
1 | {
2 |     "extends": "@midday/tsconfig/base.json",
3 |     "include": ["src"],
4 |     "exclude": ["node_modules"]
5 |   }
```

packages/inbox/src/utils.test.ts
```
1 | import { expect, test } from "bun:test";
2 | import { getInboxEmail, getInboxIdFromEmail } from ".";
3 |
4 | test("Get inbox id from email", () => {
5 |   expect(getInboxIdFromEmail("egr34f@inbox.midday.ai")).toMatch("egr34f");
6 | });
7 |
8 | test("Get inbox email by id", () => {
9 |   expect(getInboxEmail("egr34f")).toMatch("egr34f@inbox.staging.midday.ai");
10 | });
```

packages/inbox/src/utils.ts
```
1 | export function getInboxIdFromEmail(email: string) {
2 |   return email.split("@").at(0);
3 | }
4 |
5 | export function getInboxEmail(inboxId: string) {
6 |   if (process.env.NODE_ENV !== "production") {
7 |     return `${inboxId}@inbox.staging.midday.ai`;
8 |   }
9 |
10 |   return `${inboxId}@inbox.midday.ai`;
11 | }
```

packages/invoice/src/index.tsx
```
1 | export * from "./templates/html";
2 | export * from "./templates/pdf";
3 | export * from "./templates/og";
4 | export * from "./editor";
5 | export * from "./utils/logo";
6 |
7 | export { renderToStream, renderToBuffer } from "@react-pdf/renderer";
```

packages/kv/src/index.ts
```
1 | import "server-only";
2 |
3 | import { Redis } from "@upstash/redis";
4 |
5 | export const client = new Redis({
6 |   url: process.env.UPSTASH_REDIS_REST_URL!,
7 |   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
8 | });
```

packages/location/src/countries-intl.json
```
1 | [
2 |   {
3 |     "name": "Afghanistan",
4 |     "alpha2": "AF",
5 |     "alpha3": "AFG",
6 |     "numeric": "004",
7 |     "locales": ["ps-AF", "fa-AF", "uz-Arab-AF"],
8 |     "default_locale": "ps-AF",
9 |     "currency": "AFN",
10 |     "latitude": "33.93911",
11 |     "longitude": "67.709953",
12 |     "currency_name": "Afghani",
13 |     "languages": ["ps", "uz", "tk"],
14 |     "capital": "Kabul",
15 |     "emoji": "🇦🇫",
16 |     "emojiU": "U+1F1E6 U+1F1EB",
17 |     "fips": "AF",
18 |     "internet": "AF",
19 |     "continent": "Asia",
20 |     "region": "South Asia"
21 |   },
22 |   {
23 |     "name": "Albania",
24 |     "alpha2": "AL",
25 |     "alpha3": "ALB",
26 |     "numeric": "008",
27 |     "locales": ["sq-AL"],
28 |     "default_locale": "sq-AL",
29 |     "currency": "ALL",
30 |     "latitude": "41.153332",
31 |     "longitude": "20.168331",
32 |     "currency_name": "Lek",
33 |     "languages": ["sq"],
34 |     "capital": "Tirana",
35 |     "emoji": "🇦🇱",
36 |     "emojiU": "U+1F1E6 U+1F1F1",
37 |     "fips": "AL",
38 |     "internet": "AL",
39 |     "continent": "Europe",
40 |     "region": "South East Europe"
41 |   },
42 |   {
43 |     "name": "Algeria",
44 |     "alpha2": "DZ",
45 |     "alpha3": "DZA",
46 |     "numeric": "012",
47 |     "locales": ["ar-DZ", "kab-DZ"],
48 |     "default_locale": "ar-DZ",
49 |     "currency": "DZD",
50 |     "latitude": "28.033886",
51 |     "longitude": "1.659626",
52 |     "currency_name": "Algerian Dinar",
53 |     "languages": ["ar"],
54 |     "capital": "Algiers",
55 |     "emoji": "🇩🇿",
56 |     "emojiU": "U+1F1E9 U+1F1FF",
57 |     "fips": "AG",
58 |     "internet": "DZ",
59 |     "continent": "Africa",
60 |     "region": "Northern Africa"
61 |   },
62 |   {
63 |     "name": "American Samoa",
64 |     "alpha2": "AS",
65 |     "alpha3": "ASM",
66 |     "numeric": "016",
67 |     "locales": ["en-AS"],
68 |     "default_locale": "en-AS",
69 |     "currency": "USD",
70 |     "latitude": "-14.270972",
71 |     "longitude": "-170.132217",
72 |     "currency_name": "US Dollar",
73 |     "languages": ["en", "sm"],
74 |     "capital": "Pago Pago",
75 |     "emoji": "🇦🇸",
76 |     "emojiU": "U+1F1E6 U+1F1F8",
77 |     "fips": "AQ",
78 |     "internet": "AS",
79 |     "continent": "Oceania",
80 |     "region": "Pacific"
81 |   },
82 |   {
83 |     "name": "Andorra",
84 |     "alpha2": "AD",
85 |     "alpha3": "AND",
86 |     "numeric": "020",
87 |     "locales": ["ca"],
88 |     "default_locale": "ca",
89 |     "currency": "EUR",
90 |     "latitude": "42.546245",
91 |     "longitude": "1.601554",
92 |     "currency_name": "Euro",
93 |     "languages": ["ca"],
94 |     "capital": "Andorra la Vella",
95 |     "emoji": "🇦🇩",
96 |     "emojiU": "U+1F1E6 U+1F1E9",
97 |     "fips": "AN",
98 |     "internet": "AD",
99 |     "continent": "Europe",
100 |     "region": "South West Europe"
101 |   },
102 |   {
103 |     "name": "Angola",
104 |     "alpha2": "AO",
105 |     "alpha3": "AGO",
106 |     "numeric": "024",
107 |     "locales": ["pt"],
108 |     "default_locale": "pt",
109 |     "currency": "AOA",
110 |     "latitude": "-11.202692",
111 |     "longitude": "17.873887",
112 |     "currency_name": "Kwanza",
113 |     "languages": ["pt"],
114 |     "capital": "Luanda",
115 |     "emoji": "🇦🇴",
116 |     "emojiU": "U+1F1E6 U+1F1F4",
117 |     "fips": "AO",
118 |     "internet": "AO",
119 |     "continent": "Africa",
120 |     "region": "Southern Africa"
121 |   },
122 |   {
123 |     "name": "Anguilla",
124 |     "alpha2": "AI",
125 |     "alpha3": "AIA",
126 |     "numeric": "660",
127 |     "locales": ["en"],
128 |     "default_locale": "en",
129 |     "currency": "XCD",
130 |     "latitude": "18.220554",
131 |     "longitude": "-63.068615",
132 |     "currency_name": "East Caribbean Dollar",
133 |     "languages": ["en"],
134 |     "capital": "The Valley",
135 |     "emoji": "🇦🇮",
136 |     "emojiU": "U+1F1E6 U+1F1EE",
137 |     "fips": "AV",
138 |     "internet": "AI",
139 |     "continent": "Americas",
140 |     "region": "West Indies"
141 |   },
142 |   {
143 |     "name": "Antigua and Barbuda",
144 |     "alpha2": "AG",
145 |     "alpha3": "ATG",
146 |     "numeric": "028",
147 |     "locales": ["en"],
148 |     "default_locale": "en",
149 |     "currency": "XCD",
150 |     "latitude": "17.060816",
151 |     "longitude": "-61.796428",
152 |     "currency_name": "East Caribbean Dollar",
153 |     "languages": ["en"],
154 |     "capital": "Saint John's",
155 |     "emoji": "🇦🇬",
156 |     "emojiU": "U+1F1E6 U+1F1EC",
157 |     "fips": "AC",
158 |     "internet": "AG",
159 |     "continent": "Americas",
160 |     "region": "West Indies"
161 |   },
162 |   {
163 |     "name": "Argentina",
164 |     "alpha2": "AR",
165 |     "alpha3": "ARG",
166 |     "numeric": "032",
167 |     "locales": ["es-AR"],
168 |     "default_locale": "es-AR",
169 |     "currency": "ARS",
170 |     "latitude": "-38.416097",
171 |     "longitude": "-63.616672",
172 |     "currency_name": "Argentine Peso",
173 |     "languages": ["es", "gn"],
174 |     "capital": "Buenos Aires",
175 |     "emoji": "🇦🇷",
176 |     "emojiU": "U+1F1E6 U+1F1F7",
177 |     "fips": "AR",
178 |     "internet": "AR",
179 |     "continent": "Americas",
180 |     "region": "South America"
181 |   },
182 |   {
183 |     "name": "Armenia",
184 |     "alpha2": "AM",
185 |     "alpha3": "ARM",
186 |     "numeric": "051",
187 |     "locales": ["hy-AM"],
188 |     "default_locale": "hy-AM",
189 |     "currency": "AMD",
190 |     "latitude": "40.069099",
191 |     "longitude": "45.038189",
[TRUNCATED]
```

packages/location/src/countries-intl.ts
```
1 | import countries from "./countries-intl.json";
2 |
3 | export { countries };
```

packages/location/src/countries.json
```
1 | [
2 |     {
3 |       "cca2": "AW",
4 |       "currencies": { "AWG": { "name": "Aruban florin", "symbol": "ƒ" } },
5 |       "languages": { "nld": "Dutch", "pap": "Papiamento" },
6 |       "flag": "🇦🇼"
7 |     },
8 |     {
9 |       "cca2": "AF",
10 |       "currencies": { "AFN": { "name": "Afghan afghani", "symbol": "؋" } },
11 |       "languages": { "prs": "Dari", "pus": "Pashto", "tuk": "Turkmen" },
12 |       "flag": "🇦🇫"
13 |     },
14 |     {
15 |       "cca2": "AO",
16 |       "currencies": { "AOA": { "name": "Angolan kwanza", "symbol": "Kz" } },
17 |       "languages": { "por": "Portuguese" },
18 |       "flag": "🇦🇴"
19 |     },
20 |     {
21 |       "cca2": "AI",
22 |       "currencies": {
23 |         "XCD": { "name": "Eastern Caribbean dollar", "symbol": "$" }
24 |       },
25 |       "languages": { "eng": "English" },
26 |       "flag": "🇦🇮"
27 |     },
28 |     {
29 |       "cca2": "AX",
30 |       "currencies": { "EUR": { "name": "Euro", "symbol": "€" } },
31 |       "languages": { "swe": "Swedish" },
32 |       "flag": "🇦🇽"
33 |     },
34 |     {
35 |       "cca2": "AL",
36 |       "currencies": { "ALL": { "name": "Albanian lek", "symbol": "L" } },
37 |       "languages": { "sqi": "Albanian" },
38 |       "flag": "🇦🇱"
39 |     },
40 |     {
41 |       "cca2": "AD",
42 |       "currencies": { "EUR": { "name": "Euro", "symbol": "€" } },
43 |       "languages": { "cat": "Catalan" },
44 |       "flag": "🇦🇩"
45 |     },
46 |     {
47 |       "cca2": "AE",
48 |       "currencies": {
49 |         "AED": { "name": "United Arab Emirates dirham", "symbol": "د.إ" }
50 |       },
51 |       "languages": { "ara": "Arabic" },
52 |       "flag": "🇦🇪"
53 |     },
54 |     {
55 |       "cca2": "AR",
56 |       "currencies": { "ARS": { "name": "Argentine peso", "symbol": "$" } },
57 |       "languages": { "grn": "Guaraní", "spa": "Spanish" },
58 |       "flag": "🇦🇷"
59 |     },
60 |     {
61 |       "cca2": "AM",
62 |       "currencies": { "AMD": { "name": "Armenian dram", "symbol": "֏" } },
63 |       "languages": { "hye": "Armenian" },
64 |       "flag": "🇦🇲"
65 |     },
66 |     {
67 |       "cca2": "AS",
68 |       "currencies": { "USD": { "name": "United States dollar", "symbol": "$" } },
69 |       "languages": { "eng": "English", "smo": "Samoan" },
70 |       "flag": "🇦🇸"
71 |     },
72 |     { "cca2": "AQ", "currencies": [], "languages": {}, "flag": "🇦🇶" },
73 |     {
74 |       "cca2": "TF",
75 |       "currencies": { "EUR": { "name": "Euro", "symbol": "€" } },
76 |       "languages": { "fra": "French" },
77 |       "flag": "🇹🇫"
78 |     },
79 |     {
80 |       "cca2": "AG",
81 |       "currencies": {
82 |         "XCD": { "name": "Eastern Caribbean dollar", "symbol": "$" }
83 |       },
84 |       "languages": { "eng": "English" },
85 |       "flag": "🇦🇬"
86 |     },
87 |     {
88 |       "cca2": "AU",
89 |       "currencies": { "AUD": { "name": "Australian dollar", "symbol": "$" } },
90 |       "languages": { "eng": "English" },
91 |       "flag": "🇦🇺"
92 |     },
93 |     {
94 |       "cca2": "AT",
95 |       "currencies": { "EUR": { "name": "Euro", "symbol": "€" } },
96 |       "languages": { "bar": "Austro-Bavarian German" },
97 |       "flag": "🇦🇹"
98 |     },
99 |     {
100 |       "cca2": "AZ",
101 |       "currencies": { "AZN": { "name": "Azerbaijani manat", "symbol": "₼" } },
102 |       "languages": { "aze": "Azerbaijani", "rus": "Russian" },
103 |       "flag": "🇦🇿"
104 |     },
105 |     {
106 |       "cca2": "BI",
107 |       "currencies": { "BIF": { "name": "Burundian franc", "symbol": "Fr" } },
108 |       "languages": { "fra": "French", "run": "Kirundi" },
109 |       "flag": "🇧🇮"
110 |     },
111 |     {
112 |       "cca2": "BE",
113 |       "currencies": { "EUR": { "name": "Euro", "symbol": "€" } },
114 |       "languages": { "deu": "German", "fra": "French", "nld": "Dutch" },
115 |       "flag": "🇧🇪"
116 |     },
117 |     {
118 |       "cca2": "BJ",
119 |       "currencies": {
120 |         "XOF": { "name": "West African CFA franc", "symbol": "Fr" }
121 |       },
122 |       "languages": { "fra": "French" },
123 |       "flag": "🇧🇯"
124 |     },
125 |     {
126 |       "cca2": "BF",
127 |       "currencies": {
128 |         "XOF": { "name": "West African CFA franc", "symbol": "Fr" }
129 |       },
130 |       "languages": { "fra": "French" },
131 |       "flag": "🇧🇫"
132 |     },
133 |     {
134 |       "cca2": "BD",
135 |       "currencies": { "BDT": { "name": "Bangladeshi taka", "symbol": "৳" } },
136 |       "languages": { "ben": "Bengali" },
137 |       "flag": "🇧🇩"
138 |     },
139 |     {
140 |       "cca2": "BG",
141 |       "currencies": { "BGN": { "name": "Bulgarian lev", "symbol": "лв" } },
142 |       "languages": { "bul": "Bulgarian" },
143 |       "flag": "🇧🇬"
144 |     },
145 |     {
146 |       "cca2": "BH",
147 |       "currencies": { "BHD": { "name": "Bahraini dinar", "symbol": ".د.ب" } },
148 |       "languages": { "ara": "Arabic" },
149 |       "flag": "🇧🇭"
150 |     },
151 |     {
152 |       "cca2": "BS",
153 |       "currencies": {
154 |         "BSD": { "name": "Bahamian dollar", "symbol": "$" },
155 |         "USD": { "name": "United States dollar", "symbol": "$" }
156 |       },
157 |       "languages": { "eng": "English" },
158 |       "flag": "🇧🇸"
159 |     },
160 |     {
161 |       "cca2": "BA",
162 |       "currencies": {
163 |         "BAM": { "name": "Bosnia and Herzegovina convertible mark", "symbol": "" }
164 |       },
165 |       "languages": { "bos": "Bosnian", "hrv": "Croatian", "srp": "Serbian" },
166 |       "flag": "🇧🇦"
167 |     },
168 |     {
169 |       "cca2": "BL",
170 |       "currencies": { "EUR": { "name": "Euro", "symbol": "€" } },
171 |       "languages": { "fra": "French" },
172 |       "flag": "🇧🇱"
173 |     },
174 |     {
175 |       "cca2": "SH",
176 |       "currencies": {
177 |         "GBP": { "name": "Pound sterling", "symbol": "£" },
178 |         "SHP": { "name": "Saint Helena pound", "symbol": "£" }
179 |       },
180 |       "languages": { "eng": "English" },
181 |       "flag": "🇸🇭"
182 |     },
183 |     {
184 |       "cca2": "BY",
185 |       "currencies": { "BYN": { "name": "Belarusian ruble", "symbol": "Br" } },
186 |       "languages": { "bel": "Belarusian", "rus": "Russian" },
187 |       "flag": "🇧🇾"
188 |     },
189 |     {
[TRUNCATED]
```

packages/location/src/countries.ts
```
1 | import countries from "./countries.json";
2 |
3 | export { countries };
```

packages/location/src/country-flags.ts
```
1 | export default {
2 |   AC: {
3 |     code: "AC",
4 |     unicode: "U+1F1E6 U+1F1E8",
5 |     name: "Ascension Island",
6 |     emoji: "🇦🇨",
7 |   },
8 |   AD: {
9 |     code: "AD",
10 |     unicode: "U+1F1E6 U+1F1E9",
11 |     name: "Andorra",
12 |     emoji: "🇦🇩",
13 |   },
14 |   AE: {
15 |     code: "AE",
16 |     unicode: "U+1F1E6 U+1F1EA",
17 |     name: "United Arab Emirates",
18 |     emoji: "🇦🇪",
19 |   },
20 |   AF: {
21 |     code: "AF",
22 |     unicode: "U+1F1E6 U+1F1EB",
23 |     name: "Afghanistan",
24 |     emoji: "🇦🇫",
25 |   },
26 |   AG: {
27 |     code: "AG",
28 |     unicode: "U+1F1E6 U+1F1EC",
29 |     name: "Antigua & Barbuda",
30 |     emoji: "🇦🇬",
31 |   },
32 |   AI: {
33 |     code: "AI",
34 |     unicode: "U+1F1E6 U+1F1EE",
35 |     name: "Anguilla",
36 |     emoji: "🇦🇮",
37 |   },
38 |   AL: {
39 |     code: "AL",
40 |     unicode: "U+1F1E6 U+1F1F1",
41 |     name: "Albania",
42 |     emoji: "🇦🇱",
43 |   },
44 |   AM: {
45 |     code: "AM",
46 |     unicode: "U+1F1E6 U+1F1F2",
47 |     name: "Armenia",
48 |     emoji: "🇦🇲",
49 |   },
50 |   AO: {
51 |     code: "AO",
52 |     unicode: "U+1F1E6 U+1F1F4",
53 |     name: "Angola",
54 |     emoji: "🇦🇴",
55 |   },
56 |   AQ: {
57 |     code: "AQ",
58 |     unicode: "U+1F1E6 U+1F1F6",
59 |     name: "Antarctica",
60 |     emoji: "🇦🇶",
61 |   },
62 |   AR: {
63 |     code: "AR",
64 |     unicode: "U+1F1E6 U+1F1F7",
65 |     name: "Argentina",
66 |     emoji: "🇦🇷",
67 |   },
68 |   AS: {
69 |     code: "AS",
70 |     unicode: "U+1F1E6 U+1F1F8",
71 |     name: "American Samoa",
72 |     emoji: "🇦🇸",
73 |   },
74 |   AT: {
75 |     code: "AT",
76 |     unicode: "U+1F1E6 U+1F1F9",
77 |     name: "Austria",
78 |     emoji: "🇦🇹",
79 |   },
80 |   AU: {
81 |     code: "AU",
82 |     unicode: "U+1F1E6 U+1F1FA",
83 |     name: "Australia",
84 |     emoji: "🇦🇺",
85 |   },
86 |   AW: {
87 |     code: "AW",
88 |     unicode: "U+1F1E6 U+1F1FC",
89 |     name: "Aruba",
90 |     emoji: "🇦🇼",
91 |   },
92 |   AX: {
93 |     code: "AX",
94 |     unicode: "U+1F1E6 U+1F1FD",
95 |     name: "Åland Islands",
96 |     emoji: "🇦🇽",
97 |   },
98 |   AZ: {
99 |     code: "AZ",
100 |     unicode: "U+1F1E6 U+1F1FF",
101 |     name: "Azerbaijan",
102 |     emoji: "🇦🇿",
103 |   },
104 |   BA: {
105 |     code: "BA",
106 |     unicode: "U+1F1E7 U+1F1E6",
107 |     name: "Bosnia & Herzegovina",
108 |     emoji: "🇧🇦",
109 |   },
110 |   BB: {
111 |     code: "BB",
112 |     unicode: "U+1F1E7 U+1F1E7",
113 |     name: "Barbados",
114 |     emoji: "🇧🇧",
115 |   },
116 |   BD: {
117 |     code: "BD",
118 |     unicode: "U+1F1E7 U+1F1E9",
119 |     name: "Bangladesh",
120 |     emoji: "🇧🇩",
121 |   },
122 |   BE: {
123 |     code: "BE",
124 |     unicode: "U+1F1E7 U+1F1EA",
125 |     name: "Belgium",
126 |     emoji: "🇧🇪",
127 |   },
128 |   BF: {
129 |     code: "BF",
130 |     unicode: "U+1F1E7 U+1F1EB",
131 |     name: "Burkina Faso",
132 |     emoji: "🇧🇫",
133 |   },
134 |   BG: {
135 |     code: "BG",
136 |     unicode: "U+1F1E7 U+1F1EC",
137 |     name: "Bulgaria",
138 |     emoji: "🇧🇬",
139 |   },
140 |   BH: {
141 |     code: "BH",
142 |     unicode: "U+1F1E7 U+1F1ED",
143 |     name: "Bahrain",
144 |     emoji: "🇧🇭",
145 |   },
146 |   BI: {
147 |     code: "BI",
148 |     unicode: "U+1F1E7 U+1F1EE",
149 |     name: "Burundi",
150 |     emoji: "🇧🇮",
151 |   },
152 |   BJ: {
153 |     code: "BJ",
154 |     unicode: "U+1F1E7 U+1F1EF",
155 |     name: "Benin",
156 |     emoji: "🇧🇯",
157 |   },
158 |   BL: {
159 |     code: "BL",
160 |     unicode: "U+1F1E7 U+1F1F1",
161 |     name: "St. Barthélemy",
162 |     emoji: "🇧🇱",
163 |   },
164 |   BM: {
165 |     code: "BM",
166 |     unicode: "U+1F1E7 U+1F1F2",
167 |     name: "Bermuda",
168 |     emoji: "🇧🇲",
169 |   },
170 |   BN: {
171 |     code: "BN",
172 |     unicode: "U+1F1E7 U+1F1F3",
173 |     name: "Brunei",
174 |     emoji: "🇧🇳",
175 |   },
176 |   BO: {
177 |     code: "BO",
178 |     unicode: "U+1F1E7 U+1F1F4",
179 |     name: "Bolivia",
180 |     emoji: "🇧🇴",
181 |   },
182 |   BQ: {
183 |     code: "BQ",
184 |     unicode: "U+1F1E7 U+1F1F6",
185 |     name: "Caribbean Netherlands",
186 |     emoji: "🇧🇶",
187 |   },
188 |   BR: {
189 |     code: "BR",
190 |     unicode: "U+1F1E7 U+1F1F7",
191 |     name: "Brazil",
192 |     emoji: "🇧🇷",
193 |   },
194 |   BS: {
195 |     code: "BS",
196 |     unicode: "U+1F1E7 U+1F1F8",
197 |     name: "Bahamas",
198 |     emoji: "🇧🇸",
199 |   },
200 |   BT: {
201 |     code: "BT",
202 |     unicode: "U+1F1E7 U+1F1F9",
203 |     name: "Bhutan",
204 |     emoji: "🇧🇹",
205 |   },
206 |   BV: {
207 |     code: "BV",
208 |     unicode: "U+1F1E7 U+1F1FB",
209 |     name: "Bouvet Island",
210 |     emoji: "🇧🇻",
211 |   },
212 |   BW: {
213 |     code: "BW",
214 |     unicode: "U+1F1E7 U+1F1FC",
215 |     name: "Botswana",
216 |     emoji: "🇧🇼",
217 |   },
218 |   BY: {
219 |     code: "BY",
220 |     unicode: "U+1F1E7 U+1F1FE",
221 |     name: "Belarus",
[TRUNCATED]
```

packages/location/src/currencies.ts
```
1 | /**
2 |  * An object that maps a 2 char country code to its official 3 char currency code.
3 |  * [View all supported countries](https://github.com/sumup-oss/intl-js/blob/main/src/data/currencies.ts).
4 |  */
5 | export const currencies = {
6 |   // Andorra
7 |   AD: "EUR",
8 |   // United Arab Emirates
9 |   AE: "AED",
10 |   // Afghanistan
11 |   AF: "AFN",
12 |   // Antigua and Barbuda
13 |   AG: "XCD",
14 |   // Anguilla
15 |   AI: "XCD",
16 |   // Albania
17 |   AL: "ALL",
18 |   // Armenia
19 |   AM: "AMD",
20 |   // Netherlands Antilles
21 |   AN: "ANG",
22 |   // Angola
23 |   AO: "AOA",
24 |   // Antarctica
25 |   AQ: "AQD",
26 |   // Argentina
27 |   AR: "ARS",
28 |   // American Samoa
29 |   AS: "USD",
30 |   // Austria
31 |   AT: "EUR",
32 |   // Australia
33 |   AU: "AUD",
34 |   // Aruba
35 |   AW: "ANG",
36 |   // Aland Islands
37 |   AX: "EUR",
38 |   // Azerbaijan
39 |   AZ: "AZN",
40 |   // Bosnia and Herzegovina
41 |   BA: "BAM",
42 |   // Barbados
43 |   BB: "BBD",
44 |   // Bangladesh
45 |   BD: "BDT",
46 |   // Belgium
47 |   BE: "EUR",
48 |   // Burkina Faso
49 |   BF: "XOF",
50 |   // Bulgaria
51 |   BG: "BGN",
52 |   // Bahrain
53 |   BH: "BHD",
54 |   // Burundi
55 |   BI: "BIF",
56 |   // Benin
57 |   BJ: "XOF",
58 |   // Saint Barthelemy
59 |   BL: "EUR",
60 |   // Bermuda
61 |   BM: "BMD",
62 |   // Brunei Darussalam
63 |   BN: "BND",
64 |   // Bolivia
65 |   BO: "BOB",
66 |   // Brazil
67 |   BR: "BRL",
68 |   // Bahamas
69 |   BS: "BSD",
70 |   // Bhutan
71 |   BT: "INR",
72 |   // Bouvet Island
73 |   BV: "NOK",
74 |   // Botswana
75 |   BW: "BWP",
76 |   // Belarus
77 |   BY: "BYR",
78 |   // Belize
79 |   BZ: "BZD",
80 |   // Canada
81 |   CA: "CAD",
82 |   // Cocos (Keeling) Islands
83 |   CC: "AUD",
84 |   // Congo
85 |   CD: "CDF",
86 |   // Central African Republic
87 |   CF: "XAF",
88 |   // Congo Republic of the Democratic
89 |   CG: "XAF",
90 |   // Switzerland
91 |   CH: "CHF",
92 |   // Ivory Coast
93 |   CI: "XOF",
94 |   // Cook Islands
95 |   CK: "NZD",
96 |   // Chile
97 |   CL: "CLP",
98 |   // Cameroon
99 |   CM: "XAF",
100 |   // China
101 |   CN: "CNY",
102 |   // Colombia
103 |   CO: "COP",
104 |   // Costa Rica
105 |   CR: "CRC",
106 |   // Cuba
107 |   CU: "CUP",
108 |   // Cape Verde
109 |   CV: "CVE",
110 |   // Christmas Island
111 |   CX: "AUD",
112 |   // Cyprus
113 |   CY: "EUR",
114 |   // Czech Republic
115 |   CZ: "CZK",
116 |   // Germany
117 |   DE: "EUR",
118 |   // Djibouti
119 |   DJ: "DJF",
120 |   // Denmark
121 |   DK: "DKK",
122 |   // Dominica
123 |   DM: "XCD",
124 |   // Dominican Republic
125 |   DO: "DOP",
126 |   // Algeria
127 |   DZ: "DZD",
128 |   // Ecuador
129 |   EC: "USD",
130 |   // Estonia
131 |   EE: "EUR",
132 |   // Egypt
133 |   EG: "EGP",
134 |   // Western Sahara
135 |   EH: "MAD",
136 |   // Eritrea
137 |   ER: "ERN",
138 |   // Spain
139 |   ES: "EUR",
140 |   // Ethiopia
141 |   ET: "ETB",
142 |   // Finland
143 |   FI: "EUR",
144 |   // Fiji
145 |   FJ: "FJD",
146 |   // Falkland Islands (Malvinas)
147 |   FK: "FKP",
148 |   // Micronesia Federated States of
149 |   FM: "USD",
150 |   // Faroe Islands
151 |   FO: "DKK",
152 |   // France
153 |   FR: "EUR",
154 |   // Gabon
155 |   GA: "XAF",
156 |   // United Kingdom
157 |   GB: "GBP",
158 |   // Grenada
159 |   GD: "XCD",
160 |   // Georgia
161 |   GE: "GEL",
162 |   // French Guiana
163 |   GF: "EUR",
164 |   // Guernsey
165 |   GG: "GGP",
166 |   // Ghana
167 |   GH: "GHS",
168 |   // Gibraltar
169 |   GI: "GIP",
170 |   // Greenland
171 |   GL: "DKK",
172 |   // Gambia
173 |   GM: "GMD",
174 |   // Guinea
175 |   GN: "GNF",
176 |   // Guadeloupe
177 |   GP: "EUR",
178 |   // Equatorial Guinea
179 |   GQ: "XAF",
180 |   // Greece
181 |   GR: "EUR",
182 |   // South Georgia and the South Sandwich Islands
183 |   GS: "GBP",
184 |   // Guatemala
185 |   GT: "GTQ",
186 |   // Guam
187 |   GU: "USD",
188 |   // Guinea-Bissau
189 |   GW: "XOF",
190 |   // Guyana
191 |   GY: "GYD",
192 |   // Hong Kong
193 |   HK: "HKD",
194 |   // Heard and Mc Donald Islands
195 |   HM: "AUD",
196 |   // Honduras
197 |   HN: "HNL",
198 |   // Croatia (Hrvatska)
199 |   HR: "EUR",
200 |   // Haiti
201 |   HT: "HTG",
202 |   // Hungary
203 |   HU: "HUF",
204 |   // Indonesia
205 |   ID: "IDR",
206 |   // Ireland
207 |   IE: "EUR",
208 |   // Israel
209 |   IL: "ILS",
210 |   // Isle of Man
211 |   IM: "GBP",
212 |   // India
[TRUNCATED]
```

packages/location/src/eu-countries.ts
```
1 | export const EU_COUNTRY_CODES = [
2 |   "AT",
3 |   "BE",
4 |   "BG",
5 |   "HR",
6 |   "CY",
7 |   "CZ",
8 |   "DK",
9 |   "EE",
10 |   "FI",
11 |   "FR",
12 |   "DE",
13 |   "GR",
14 |   "HU",
15 |   "IE",
16 |   "IT",
17 |   "LV",
18 |   "LT",
19 |   "LU",
20 |   "MT",
21 |   "NL",
22 |   "PL",
23 |   "PT",
24 |   "RO",
25 |   "SK",
26 |   "SI",
27 |   "ES",
28 |   "SE",
29 |   "GB",
30 |   "GI",
31 |   "IS",
32 |   "LI",
33 |   "NO",
34 |   "CH",
35 |   "ME",
36 |   "MK",
37 |   "RS",
38 |   "TR",
39 |   "AL",
40 |   "BA",
41 |   "XK",
42 |   "AD",
43 |   "BY",
44 |   "MD",
45 |   "MC",
46 |   "RU",
47 |   "UA",
48 |   "VA",
49 |   "AX",
50 |   "FO",
51 |   "GL",
52 |   "SJ",
53 |   "IM",
54 |   "JE",
55 |   "GG",
56 |   "RS",
57 |   "ME",
58 |   "XK",
59 |   "RS",
60 | ];
```

packages/location/src/index.ts
```
1 | import { headers } from "next/headers";
2 | import countries from "./countries.json";
3 | import flags from "./country-flags";
4 | import { currencies } from "./currencies";
5 | import { EU_COUNTRY_CODES } from "./eu-countries";
6 | import timezones from "./timezones.json";
7 |
8 | export function getCountryCode() {
9 |   return headers().get("x-vercel-ip-country") || "SE";
10 | }
11 |
12 | export function getTimezone() {
13 |   return headers().get("x-vercel-ip-timezone") || "Europe/Berlin";
14 | }
15 |
16 | export function getLocale() {
17 |   return headers().get("x-vercel-ip-locale") || "en-US";
18 | }
19 |
20 | export function getTimezones() {
21 |   return timezones;
22 | }
23 | export function getCurrency() {
24 |   const countryCode = getCountryCode();
25 |
26 |   return currencies[countryCode as keyof typeof currencies];
27 | }
28 |
29 | export function getDateFormat() {
30 |   const country = getCountryCode();
31 |
32 |   // US uses MM/dd/yyyy
33 |   if (country === "US") {
34 |     return "MM/dd/yyyy";
35 |   }
36 |
37 |   // China, Japan, Korea, Taiwan use yyyy-MM-dd
38 |   if (["CN", "JP", "KR", "TW"].includes(country)) {
39 |     return "yyyy-MM-dd";
40 |   }
41 |   // Most Latin American, African, and some Asian countries use dd/MM/yyyy
42 |   if (["AU", "NZ", "IN", "ZA", "BR", "AR"].includes(country)) {
43 |     return "dd/MM/yyyy";
44 |   }
45 |
46 |   // Default to yyyy-MM-dd for other countries
47 |   return "yyyy-MM-dd";
48 | }
49 |
50 | export function getCountryInfo() {
51 |   const country = getCountryCode();
52 |
53 |   const countryInfo = countries.find((x) => x.cca2 === country);
54 |
55 |   const currencyCode =
56 |     countryInfo && Object.keys(countryInfo.currencies)?.at(0);
57 |   const currency = countryInfo?.currencies[currencyCode];
58 |   const languages =
59 |     countryInfo && Object.values(countryInfo.languages).join(", ");
60 |
61 |   return {
62 |     currencyCode,
63 |     currency,
64 |     languages,
65 |   };
66 | }
67 |
68 | export function isEU() {
69 |   const countryCode = getCountryCode();
70 |
71 |   if (countryCode && EU_COUNTRY_CODES.includes(countryCode)) {
72 |     return true;
73 |   }
74 |
75 |   return false;
76 | }
77 |
78 | export function getCountry() {
79 |   const country = getCountryCode();
80 |
81 |   return flags[country];
82 | }
```

packages/location/src/timezones.json
```
1 | [
2 |   {
3 |     "label": "Pacific/Midway (GMT-11:00)",
4 |     "tzCode": "Pacific/Midway",
5 |     "name": "(GMT-11:00) Midway",
6 |     "utc": "-11:00"
7 |   },
8 |   {
9 |     "label": "Pacific/Niue (GMT-11:00)",
10 |     "tzCode": "Pacific/Niue",
11 |     "name": "(GMT-11:00) Alofi",
12 |     "utc": "-11:00"
13 |   },
14 |   {
15 |     "label": "Pacific/Pago_Pago (GMT-11:00)",
16 |     "tzCode": "Pacific/Pago_Pago",
17 |     "name": "(GMT-11:00) Pago Pago, Tāfuna, Ta`ū, Taulaga",
18 |     "utc": "-11:00"
19 |   },
20 |   {
21 |     "label": "America/Adak (GMT-10:00)",
22 |     "tzCode": "America/Adak",
23 |     "name": "(GMT-10:00) Adak",
24 |     "utc": "-10:00"
25 |   },
26 |   {
27 |     "label": "Pacific/Honolulu (GMT-10:00)",
28 |     "tzCode": "Pacific/Honolulu",
29 |     "name": "(GMT-10:00) Honolulu, East Honolulu, Pearl City, Hilo, Kailua",
30 |     "utc": "-10:00"
31 |   },
32 |   {
33 |     "label": "Pacific/Rarotonga (GMT-10:00)",
34 |     "tzCode": "Pacific/Rarotonga",
35 |     "name": "(GMT-10:00) Avarua",
36 |     "utc": "-10:00"
37 |   },
38 |   {
39 |     "label": "Pacific/Tahiti (GMT-10:00)",
40 |     "tzCode": "Pacific/Tahiti",
41 |     "name": "(GMT-10:00) Faaa, Papeete, Punaauia, Pirae, Mahina",
42 |     "utc": "-10:00"
43 |   },
44 |   {
45 |     "label": "Pacific/Marquesas (GMT-09:30)",
46 |     "tzCode": "Pacific/Marquesas",
47 |     "name": "(GMT-09:30) Taiohae",
48 |     "utc": "-09:30"
49 |   },
50 |   {
51 |     "label": "America/Anchorage (GMT-09:00)",
52 |     "tzCode": "America/Anchorage",
53 |     "name": "(GMT-09:00) Anchorage, Fairbanks, Eagle River, Badger, Knik-Fairview",
54 |     "utc": "-09:00"
55 |   },
56 |   {
57 |     "label": "America/Juneau (GMT-09:00)",
58 |     "tzCode": "America/Juneau",
59 |     "name": "(GMT-09:00) Juneau",
60 |     "utc": "-09:00"
61 |   },
62 |   {
63 |     "label": "America/Metlakatla (GMT-09:00)",
64 |     "tzCode": "America/Metlakatla",
65 |     "name": "(GMT-09:00) Metlakatla",
66 |     "utc": "-09:00"
67 |   },
68 |   {
69 |     "label": "America/Nome (GMT-09:00)",
70 |     "tzCode": "America/Nome",
71 |     "name": "(GMT-09:00) Nome",
72 |     "utc": "-09:00"
73 |   },
74 |   {
75 |     "label": "America/Sitka (GMT-09:00)",
76 |     "tzCode": "America/Sitka",
77 |     "name": "(GMT-09:00) Sitka, Ketchikan",
78 |     "utc": "-09:00"
79 |   },
80 |   {
81 |     "label": "America/Yakutat (GMT-09:00)",
82 |     "tzCode": "America/Yakutat",
83 |     "name": "(GMT-09:00) Yakutat",
84 |     "utc": "-09:00"
85 |   },
86 |   {
87 |     "label": "Pacific/Gambier (GMT-09:00)",
88 |     "tzCode": "Pacific/Gambier",
89 |     "name": "(GMT-09:00) Gambier",
90 |     "utc": "-09:00"
91 |   },
92 |   {
93 |     "label": "America/Los_Angeles (GMT-08:00)",
94 |     "tzCode": "America/Los_Angeles",
95 |     "name": "(GMT-08:00) Los Angeles, San Diego, San Jose, San Francisco, Seattle",
96 |     "utc": "-08:00"
97 |   },
98 |   {
99 |     "label": "America/Tijuana (GMT-08:00)",
100 |     "tzCode": "America/Tijuana",
101 |     "name": "(GMT-08:00) Tijuana, Mexicali, Ensenada, Rosarito, Tecate",
102 |     "utc": "-08:00"
103 |   },
104 |   {
105 |     "label": "America/Vancouver (GMT-08:00)",
106 |     "tzCode": "America/Vancouver",
107 |     "name": "(GMT-08:00) Vancouver, Surrey, Okanagan, Victoria, Burnaby",
108 |     "utc": "-08:00"
109 |   },
110 |   {
111 |     "label": "Pacific/Pitcairn (GMT-08:00)",
112 |     "tzCode": "Pacific/Pitcairn",
113 |     "name": "(GMT-08:00) Adamstown",
114 |     "utc": "-08:00"
115 |   },
116 |   {
117 |     "label": "America/Boise (GMT-07:00)",
118 |     "tzCode": "America/Boise",
119 |     "name": "(GMT-07:00) Boise, Meridian, Nampa, Idaho Falls, Pocatello",
120 |     "utc": "-07:00"
121 |   },
122 |   {
123 |     "label": "America/Cambridge_Bay (GMT-07:00)",
124 |     "tzCode": "America/Cambridge_Bay",
125 |     "name": "(GMT-07:00) Cambridge Bay",
126 |     "utc": "-07:00"
127 |   },
128 |   {
129 |     "label": "America/Chihuahua (GMT-07:00)",
130 |     "tzCode": "America/Chihuahua",
131 |     "name": "(GMT-07:00) Chihuahua, Ciudad Delicias, Cuauhtémoc, Parral, Nuevo Casas Grandes",
132 |     "utc": "-07:00"
133 |   },
134 |   {
135 |     "label": "America/Creston (GMT-07:00)",
136 |     "tzCode": "America/Creston",
137 |     "name": "(GMT-07:00) Creston",
138 |     "utc": "-07:00"
139 |   },
140 |   {
141 |     "label": "America/Dawson (GMT-07:00)",
142 |     "tzCode": "America/Dawson",
143 |     "name": "(GMT-07:00) Dawson",
144 |     "utc": "-07:00"
145 |   },
146 |   {
147 |     "label": "America/Dawson_Creek (GMT-07:00)",
148 |     "tzCode": "America/Dawson_Creek",
149 |     "name": "(GMT-07:00) Fort St. John, Dawson Creek",
150 |     "utc": "-07:00"
151 |   },
152 |   {
153 |     "label": "America/Denver (GMT-07:00)",
154 |     "tzCode": "America/Denver",
155 |     "name": "(GMT-07:00) Denver, El Paso, Albuquerque, Colorado Springs, Aurora",
156 |     "utc": "-07:00"
157 |   },
[TRUNCATED]
```

packages/notification/src/index.ts
```
1 | import { Novu } from "@novu/node";
2 | import { nanoid } from "nanoid";
3 |
4 | const novu = new Novu(process.env.NOVU_API_KEY!);
5 |
6 | const API_ENDPOINT = "https://api.novu.co/v1";
7 |
8 | export enum TriggerEvents {
9 |   TransactionNewInApp = "transaction_new_in_app",
10 |   TransactionsNewInApp = "transactions_new_in_app",
11 |   TransactionNewEmail = "transaction_new_email",
12 |   InboxNewInApp = "inbox_new_in_app",
13 |   MatchNewInApp = "match_in_app",
14 |   InvoicePaidInApp = "invoice_paid_in_app",
15 |   InvoicePaidEmail = "invoice_paid_email",
16 |   InvoiceOverdueInApp = "invoice_overdue_in_app",
17 |   InvoiceOverdueEmail = "invoice_overdue_email",
18 | }
19 |
20 | export enum NotificationTypes {
21 |   Transaction = "transaction",
22 |   Transactions = "transactions",
23 |   Inbox = "inbox",
24 |   Match = "match",
25 |   Invoice = "invoice",
26 | }
27 |
28 | type TriggerUser = {
29 |   subscriberId: string;
30 |   email: string;
31 |   fullName: string;
32 |   avatarUrl?: string;
33 |   teamId: string;
34 | };
35 |
36 | type TriggerPayload = {
37 |   name: TriggerEvents;
38 |   payload: any;
39 |   user: TriggerUser;
40 |   replyTo?: string;
41 |   tenant?: string; // NOTE: Currently no way to listen for messages with tenant, we use team_id + user_id for unique
42 | };
43 |
44 | export async function trigger(data: TriggerPayload) {
45 |   try {
46 |     await novu.trigger(data.name, {
47 |       to: {
48 |         ...data.user,
49 |         //   Prefix subscriber id with team id
50 |         subscriberId: `${data.user.teamId}_${data.user.subscriberId}`,
51 |       },
52 |       payload: data.payload,
53 |       tenant: data.tenant,
54 |       overrides: {
55 |         email: {
56 |           replyTo: data.replyTo,
57 |           // @ts-ignore
58 |           headers: {
59 |             "X-Entity-Ref-ID": nanoid(),
60 |           },
61 |         },
62 |       },
63 |     });
64 |   } catch (error) {
65 |     console.log(error);
66 |   }
67 | }
68 |
69 | export async function triggerBulk(events: TriggerPayload[]) {
70 |   try {
71 |     await novu.bulkTrigger(
72 |       events.map((data) => ({
73 |         name: data.name,
74 |         to: {
75 |           ...data.user,
76 |           //   Prefix subscriber id with team id
77 |           subscriberId: `${data.user.teamId}_${data.user.subscriberId}`,
78 |         },
79 |         payload: data.payload,
80 |         tenant: data.tenant,
81 |         overrides: {
82 |           email: {
83 |             replyTo: data.replyTo,
84 |             headers: {
85 |               "X-Entity-Ref-ID": nanoid(),
86 |             },
87 |           },
88 |         },
89 |       })),
90 |     );
91 |   } catch (error) {
92 |     console.log(error);
93 |   }
94 | }
95 |
96 | type GetSubscriberPreferencesParams = {
97 |   teamId: string;
98 |   subscriberId: string;
99 | };
100 |
101 | export async function getSubscriberPreferences({
102 |   subscriberId,
103 |   teamId,
104 | }: GetSubscriberPreferencesParams) {
105 |   const response = await fetch(
106 |     `${API_ENDPOINT}/subscribers/${teamId}_${subscriberId}/preferences?includeInactiveChannels=false`,
107 |     {
108 |       method: "GET",
109 |       headers: {
110 |         Authorization: `ApiKey ${process.env.NOVU_API_KEY!}`,
111 |       },
112 |     },
113 |   );
114 |
115 |   return response.json();
116 | }
117 |
118 | type UpdateSubscriberPreferenceParams = {
119 |   subscriberId: string;
120 |   teamId: string;
121 |   templateId: string;
122 |   type: string;
123 |   enabled: boolean;
124 | };
125 |
126 | export async function updateSubscriberPreference({
127 |   subscriberId,
128 |   teamId,
129 |   templateId,
130 |   type,
131 |   enabled,
132 | }: UpdateSubscriberPreferenceParams) {
133 |   const response = await fetch(
134 |     `${API_ENDPOINT}/subscribers/${teamId}_${subscriberId}/preferences/${templateId}`,
135 |     {
136 |       method: "PATCH",
137 |       headers: {
138 |         Authorization: `ApiKey ${process.env.NOVU_API_KEY!}`,
139 |         "Content-Type": "application/json",
140 |       },
141 |       body: JSON.stringify({
142 |         channel: {
143 |           type,
144 |           enabled,
145 |         },
146 |       }),
147 |     },
148 |   );
149 |
150 |   return response.json();
151 | }
```

packages/ui/src/globals.css
```
1 | @tailwind base;
2 | @tailwind components;
3 | @tailwind utilities;
4 |
5 | @layer base {
6 |   :root {
7 |     --background: 0, 0%, 100%;
8 |     --foreground: 0, 0%, 7%;
9 |     --card: 45 18% 96%;
10 |     --card-foreground: 240 10% 3.9%;
11 |     --popover: 45 18% 96%;
12 |     --popover-foreground: 240 10% 3.9%;
13 |     --primary: 240 5.9% 10%;
14 |     --primary-foreground: 0 0% 98%;
15 |     --secondary: 40, 11%, 89%;
16 |     --secondary-foreground: 240 5.9% 10%;
17 |     --muted: 40, 11%, 89%;
18 |     --muted-foreground: 240 3.8% 46.1%;
19 |     --accent: 40, 10%, 94%;
20 |     --accent-foreground: 240 5.9% 10%;
21 |     --destructive: 0 84.2% 60.2%;
22 |     --destructive-foreground: 0 0% 98%;
23 |     --muted-foreground: 0, 0%, 38%;
24 |     --border: 45, 5%, 85%;
25 |     --input: 240 5.9% 90%;
26 |     --ring: 240 5.9% 10%;
27 |     --radius: 0.5rem;
28 |   }
29 |
30 |   .dark {
31 |     --background: 0, 0%, 7%;
32 |     --foreground: 0 0% 98%;
33 |     --card: 0, 0%, 7%;
34 |     --card-foreground: 0 0% 98%;
35 |     --popover: 0, 0%, 7%;
36 |     --popover-foreground: 0 0% 98%;
37 |     --primary: 0 0% 98%;
38 |     --primary-foreground: 240 5.9% 10%;
39 |     --secondary: 0, 0%, 11%;
40 |     --secondary-foreground: 0 0% 98%;
41 |     --muted: 0, 0%, 11%;
42 |     --muted-foreground: 240 5% 64.9%;
43 |     --accent: 0, 0%, 11%;
44 |     --accent-foreground: 0 0% 98%;
45 |     --destructive: 359, 100%, 61%;
46 |     --destructive-foreground: 0, 0%, 100%;
47 |     --muted-foreground: 0, 0%, 38%;
48 |     --border: 0, 0%, 17%;
49 |     --input: 0, 0%, 11%;
50 |     --ring: 240 4.9% 83.9%;
51 |   }
52 | }
53 |
54 | @layer base {
55 |   * {
56 |     @apply border-border;
57 |   }
58 |   body {
59 |     font-family: var(--font-sans), system-ui, sans-serif;
60 |     @apply bg-background text-foreground;
61 |   }
62 | }
63 |
64 |  .scrollbar-hide::-webkit-scrollbar {
65 |   display: none;
66 | }
67 |
68 |  .scrollbar-hide {
69 |   -ms-overflow-style: none;
70 |   scrollbar-width: none;
71 | }
72 |
73 | [type="search"]::-webkit-search-cancel-button,
74 | [type="search"]::-webkit-search-decoration {
75 |   -webkit-appearance: none;
76 |   appearance: none;
77 | }
78 |
79 | @keyframes dialog-overlay-show {
80 |   from {
81 |     opacity: 0;
82 |   }
83 |   to {
84 |     opacity: 1;
85 |   }
86 | }
87 |
88 | @keyframes dialog-overlay-hide {
89 |   from {
90 |     opacity: 1;
91 |   }
92 |   to {
93 |     opacity: 0;
94 |   }
95 | }
96 |
97 | @keyframes dialog-content-show {
98 |   from {
99 |     opacity: 0;
100 |     transform: translate(-50%, -50%) scale(0.97);
101 |   }
102 |   to {
103 |     opacity: 1;
104 |     transform: translate(-50%, -50%) scale(1);
105 |   }
106 | }
107 |
108 | @keyframes dialog-content-hide {
109 |   from {
110 |     opacity: 1;
111 |     transform: translate(-50%, -50%) scale(1);
112 |   }
113 |   to {
114 |     opacity: 0;
115 |     transform: translate(-50%, -50%) scale(0.97);
116 |   }
117 | }
118 |
119 | /* Spinner */
120 | .loading-wrapper {
121 |   height: var(--spinner-size);
122 |   width: var(--spinner-size);
123 |   position: absolute;
124 |   inset: 0;
125 |   z-index: 10;
126 | }
127 |
128 | .loading-wrapper[data-visible='false'] {
129 |   transform-origin: center;
130 |   animation: fade-out 0.2s ease forwards;
131 | }
132 |
133 | .spinner {
134 |   position: relative;
135 |   top: 50%;
136 |   left: 50%;
137 |   height: var(--spinner-size);
138 |   width: var(--spinner-size);
139 | }
140 |
141 | .loading-parent {
142 |   display: flex;
143 |   height: 16px;
144 |   width: 16px;
145 |   position: relative;
146 |   justify-content: flex-start;
147 |   align-items: center;
148 |   flex-shrink: 0;
149 |   margin-left: -3px;
150 |   margin-right: 4px;
151 | }
152 |
153 | .loading-bar {
154 |   animation: loading 1.2s linear infinite;
155 |   background: hsl(0, 0%, 43.5%);
156 |   border-radius: 6px;
157 |   height: 8%;
158 |   left: -10%;
159 |   position: absolute;
160 |   top: -3.9%;
161 |   width: 24%;
162 | }
163 |
164 | .loading-bar:nth-child(1) {
165 |   animation-delay: -1.2s;
166 |   /* Rotate trick to avoid adding an additional pixel in some sizes */
167 |   transform: rotate(0.0001deg) translate(146%);
168 | }
169 |
170 | .loading-bar:nth-child(2) {
171 |   animation-delay: -1.1s;
172 |   transform: rotate(30deg) translate(146%);
173 | }
174 |
175 | .loading-bar:nth-child(3) {
176 |   animation-delay: -1s;
[TRUNCATED]
```

packages/utils/src/envs.ts
```
1 | export function getAppUrl() {
2 |   if (
3 |     process.env.VERCEL_ENV === "production" ||
4 |     process.env.NODE_ENV === "production"
5 |   ) {
6 |     return "https://app.midday.ai";
7 |   }
8 |
9 |   if (process.env.VERCEL_ENV === "preview") {
10 |     return `https://${process.env.VERCEL_URL}`;
11 |   }
12 |
13 |   return "http://localhost:3001";
14 | }
15 |
16 | export function getEmailUrl() {
17 |   if (process.env.NODE_ENV === "development") {
18 |     return "http://localhost:3000";
19 |   }
20 |
21 |   return "https://midday.ai";
22 | }
23 |
24 | export function getWebsiteUrl() {
25 |   if (
26 |     process.env.VERCEL_ENV === "production" ||
27 |     process.env.NODE_ENV === "production"
28 |   ) {
29 |     return "https://midday.ai";
30 |   }
31 |
32 |   if (process.env.VERCEL_ENV === "preview") {
33 |     return `https://${process.env.VERCEL_URL}`;
34 |   }
35 |
36 |   return "http://localhost:3000";
37 | }
38 |
39 | export function getCdnUrl() {
40 |   return "https://cdn.midday.ai";
41 | }
```

packages/utils/src/format.ts
```
1 | type FormatAmountParams = {
2 |   currency: string;
3 |   amount: number;
4 |   locale?: string;
5 |   minimumFractionDigits?: number;
6 |   maximumFractionDigits?: number;
7 | };
8 |
9 | export function formatAmount({
10 |   currency,
11 |   amount,
12 |   locale = "en-US",
13 |   minimumFractionDigits,
14 |   maximumFractionDigits,
15 | }: FormatAmountParams) {
16 |   if (!currency) {
17 |     return;
18 |   }
19 |
20 |   return Intl.NumberFormat(locale, {
21 |     style: "currency",
22 |     currency,
23 |     minimumFractionDigits,
24 |     maximumFractionDigits,
25 |   }).format(amount);
26 | }
```

packages/utils/src/index.ts
```
1 | export function stripSpecialCharacters(inputString: string) {
2 |   // Remove special characters and spaces, keep alphanumeric, hyphens/underscores, and dots
3 |   return inputString
4 |     .replace(/[^a-zA-Z0-9-_\s.]/g, "") // Remove special chars except hyphen/underscore/dot
5 |     .replace(/\s+/g, "-") // Replace spaces with hyphens
6 |     .toLowerCase(); // Convert to lowercase for consistency
7 | }
8 |
9 | export function shuffle(array: any) {
10 |   for (let i = array.length - 1; i > 0; i--) {
11 |     const j = Math.floor(Math.random() * (i + 1));
12 |     [array[i], array[j]] = [array[j], array[i]];
13 |   }
14 |   return array;
15 | }
16 |
17 | export enum FileType {
18 |   Pdf = "application/pdf",
19 |   Heic = "image/heic",
20 | }
21 |
22 | export const isSupportedFilePreview = (type: FileType) => {
23 |   if (!type) {
24 |     return false;
25 |   }
26 |
27 |   if (type === FileType.Heic) {
28 |     return false;
29 |   }
30 |
31 |   if (type?.startsWith("image")) {
32 |     return true;
33 |   }
34 |
35 |   switch (type) {
36 |     case FileType.Pdf:
37 |       return true;
38 |     default:
39 |       return false;
40 |   }
41 | };
```

apps/api/supabase/migrations/20240624104607_remote_schema.sql
```
1 |
2 | SET statement_timeout = 0;
3 | SET lock_timeout = 0;
4 | SET idle_in_transaction_session_timeout = 0;
5 | SET client_encoding = 'UTF8';
6 | SET standard_conforming_strings = on;
7 | SELECT pg_catalog.set_config('search_path', '', false);
8 | SET check_function_bodies = false;
9 | SET xmloption = content;
10 | SET client_min_messages = warning;
11 | SET row_security = off;
12 |
13 | CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";
14 |
15 | CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";
16 |
17 | CREATE SCHEMA IF NOT EXISTS "private";
18 |
19 | ALTER SCHEMA "private" OWNER TO "postgres";
20 |
21 | COMMENT ON SCHEMA "public" IS 'standard public schema';
22 |
23 | CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
24 |
25 | CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";
26 |
27 | CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
28 |
29 | CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
30 |
31 | CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
32 |
33 | CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";
34 |
35 | CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
36 |
37 | CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";
38 |
39 | CREATE TYPE "public"."account_type" AS ENUM (
40 |     'depository',
41 |     'credit',
42 |     'other_asset',
43 |     'loan',
44 |     'other_liability'
45 | );
46 |
47 | ALTER TYPE "public"."account_type" OWNER TO "postgres";
48 |
49 | CREATE TYPE "public"."bankProviders" AS ENUM (
50 |     'gocardless',
51 |     'plaid',
52 |     'teller'
53 | );
54 |
55 | ALTER TYPE "public"."bankProviders" OWNER TO "postgres";
56 |
57 | CREATE TYPE "public"."bank_providers" AS ENUM (
58 |     'gocardless',
59 |     'plaid',
60 |     'teller'
61 | );
62 |
63 | ALTER TYPE "public"."bank_providers" OWNER TO "postgres";
64 |
65 | CREATE TYPE "public"."inbox_status" AS ENUM (
66 |     'processing',
67 |     'pending',
68 |     'archived',
69 |     'new',
70 |     'deleted'
71 | );
72 |
73 | ALTER TYPE "public"."inbox_status" OWNER TO "postgres";
74 |
75 | CREATE TYPE "public"."metrics_record" AS (
76 | 	"date" "date",
77 | 	"value" integer
78 | );
79 |
80 | ALTER TYPE "public"."metrics_record" OWNER TO "postgres";
81 |
82 | CREATE TYPE "public"."reportTypes" AS ENUM (
83 |     'profit',
84 |     'revenue',
85 |     'burn_rate'
86 | );
87 |
88 | ALTER TYPE "public"."reportTypes" OWNER TO "postgres";
89 |
90 | CREATE TYPE "public"."teamRoles" AS ENUM (
91 |     'owner',
92 |     'member'
93 | );
94 |
95 | ALTER TYPE "public"."teamRoles" OWNER TO "postgres";
96 |
97 | CREATE TYPE "public"."trackerStatus" AS ENUM (
98 |     'in_progress',
99 |     'completed'
100 | );
101 |
102 | ALTER TYPE "public"."trackerStatus" OWNER TO "postgres";
103 |
104 | CREATE TYPE "public"."transactionCategories" AS ENUM (
105 |     'travel',
106 |     'office_supplies',
107 |     'meals',
108 |     'software',
109 |     'rent',
110 |     'income',
111 |     'equipment',
112 |     'transfer',
113 |     'internet_and_telephone',
114 |     'facilities_expenses',
115 |     'activity',
116 |     'uncategorized',
117 |     'taxes',
118 |     'other',
119 |     'salary',
120 |     'fees'
121 | );
122 |
123 | ALTER TYPE "public"."transactionCategories" OWNER TO "postgres";
124 |
125 | CREATE TYPE "public"."transactionMethods" AS ENUM (
126 |     'payment',
127 |     'card_purchase',
128 |     'card_atm',
129 |     'transfer',
130 |     'other',
131 |     'unknown',
132 |     'ach',
133 |     'interest',
134 |     'deposit',
135 |     'wire',
136 |     'fee'
137 | );
138 |
139 | ALTER TYPE "public"."transactionMethods" OWNER TO "postgres";
140 |
141 | CREATE TYPE "public"."transactionStatus" AS ENUM (
142 |     'posted',
143 |     'pending',
144 |     'excluded',
145 |     'completed'
146 | );
147 |
148 | ALTER TYPE "public"."transactionStatus" OWNER TO "postgres";
149 |
150 | CREATE OR REPLACE FUNCTION "private"."get_invites_for_authenticated_user"() RETURNS SETOF "uuid"
151 |     LANGUAGE "sql" STABLE SECURITY DEFINER
152 |     SET "search_path" TO 'public'
153 |     AS $$
154 |   select team_id
155 |   from user_invites
156 |   where email = auth.jwt() ->> 'email'
157 | $$;
158 |
159 | ALTER FUNCTION "private"."get_invites_for_authenticated_user"() OWNER TO "postgres";
160 |
161 | CREATE OR REPLACE FUNCTION "private"."get_teams_for_authenticated_user"() RETURNS SETOF "uuid"
162 |     LANGUAGE "sql" STABLE SECURITY DEFINER
163 |     SET "search_path" TO 'public'
164 |     AS $$
165 |   select team_id
166 |   from users_on_team
167 |   where user_id = auth.uid()
168 | $$;
169 |
[TRUNCATED]
```

apps/api/supabase/migrations/20240625111157_remote_schema.sql
```
1 | create or replace view "private"."current_user_teams" as  SELECT ( SELECT auth.uid() AS uid) AS user_id,
2 |     t.team_id
3 |    FROM users_on_team t
4 |   WHERE (t.user_id = ( SELECT auth.uid() AS uid));
5 |
6 |
7 |
8 | drop policy "Enable read access for all users" on "public"."users_on_team";
9 |
10 | set check_function_bodies = off;
11 |
12 | create or replace view "public"."current_user_teams" as  SELECT ( SELECT auth.uid() AS uid) AS user_id,
13 |     t.team_id
14 |    FROM users_on_team t
15 |   WHERE (t.user_id = ( SELECT auth.uid() AS uid));
16 |
17 |
18 | CREATE OR REPLACE FUNCTION public.get_current_user_team_id()
19 |  RETURNS uuid
20 |  LANGUAGE plpgsql
21 | AS $function$
22 | BEGIN
23 |   RETURN (SELECT team_id FROM users WHERE id = (SELECT auth.uid()));
24 | END;
25 | $function$
26 | ;
27 |
28 | create policy "New Policy Name"
29 | on "public"."users_on_team"
30 | as permissive
31 | for select
32 | to authenticated
33 | using ((EXISTS ( SELECT 1
34 |    FROM private.current_user_teams cut
35 |   WHERE ((cut.user_id = ( SELECT auth.uid() AS uid)) AND (cut.team_id = users_on_team.team_id)))));
36 |
37 |
38 |
```

apps/api/supabase/migrations/20240625112143_remote_schema.sql
```
1 | drop policy "New Policy Name" on "public"."users_on_team";
2 |
3 | drop view if exists "public"."current_user_teams";
4 |
5 | create policy "Select for current user teams"
6 | on "public"."users_on_team"
7 | as permissive
8 | for select
9 | to authenticated
10 | using ((EXISTS ( SELECT 1
11 |    FROM private.current_user_teams cut
12 |   WHERE ((cut.user_id = ( SELECT auth.uid() AS uid)) AND (cut.team_id = users_on_team.team_id)))));
13 |
14 |
15 |
```

apps/api/supabase/migrations/20240703160414_remote_schema.sql
```
1 | drop trigger if exists "update_enrich_transaction_trigger" on "public"."transactions";
2 |
3 | drop function if exists "public"."get_spending_v2"(team_id uuid, date_from date, date_to date, currency_target text);
4 |
5 | create table "public"."total_amount" (
6 |     "sum" numeric
7 | );
8 |
9 |
10 | CREATE INDEX reports_team_id_idx ON public.reports USING btree (team_id);
11 |
12 | CREATE INDEX tracker_entries_team_id_idx ON public.tracker_entries USING btree (team_id);
13 |
14 | CREATE INDEX tracker_projects_team_id_idx ON public.tracker_projects USING btree (team_id);
15 |
16 | CREATE INDEX tracker_reports_team_id_idx ON public.tracker_reports USING btree (team_id);
17 |
18 | CREATE INDEX transaction_categories_team_id_idx ON public.transaction_categories USING btree (team_id);
19 |
20 | CREATE INDEX transaction_enrichments_category_slug_team_id_idx ON public.transaction_enrichments USING btree (category_slug, team_id);
21 |
22 | CREATE INDEX transactions_assigned_id_idx ON public.transactions USING btree (assigned_id);
23 |
24 | CREATE INDEX transactions_bank_account_id_idx ON public.transactions USING btree (bank_account_id);
25 |
26 | CREATE INDEX user_invites_team_id_idx ON public.user_invites USING btree (team_id);
27 |
28 | CREATE INDEX users_on_team_user_id_idx ON public.users_on_team USING btree (user_id);
29 |
30 | CREATE INDEX users_team_id_idx ON public.users USING btree (team_id);
31 |
32 | set check_function_bodies = off;
33 |
34 | CREATE OR REPLACE FUNCTION public.get_spending(team_id uuid, date_from date, date_to date, currency_target text)
35 |  RETURNS TABLE(name text, slug text, amount numeric, currency text, color text, percentage numeric)
36 |  LANGUAGE plpgsql
37 | AS $function$declare
38 |     total_amount numeric;
39 | begin
40 |     select sum(t.amount) into total_amount
41 |     from transactions as t
42 |     where t.team_id = get_spending.team_id
43 |         and t.category_slug != 'transfer'
44 |         and t.currency = currency_target
45 |         and t.date >= date_from
46 |         and t.date <= date_to
47 |         and t.amount < 0;
48 |
49 |     return query
50 |     select
51 |         coalesce(category.name, 'Uncategorized') AS name,
52 |         coalesce(category.slug, 'uncategorized') as slug,
53 |         sum(t.amount) as amount,
54 |         t.currency,
55 |         coalesce(category.color, '#606060') as color,
56 |         case
57 |             when ((sum(t.amount) / total_amount) * 100) > 1 then
58 |                 round((sum(t.amount) / total_amount) * 100)
59 |             else
60 |                 round((sum(t.amount) / total_amount) * 100, 2)
61 |         end as percentage
62 |     from
63 |         transactions as t
64 |     left join
65 |         transaction_categories as category on t.team_id = category.team_id and t.category_slug = category.slug
66 |     where
67 |         t.team_id = get_spending.team_id
68 |         and t.category_slug != 'transfer'
69 |         and t.currency = currency_target
70 |         and t.date >= date_from
71 |         and t.date <= date_to
72 |         and t.amount < 0
73 |     group by
74 |         category.name,
75 |         coalesce(category.slug, 'uncategorized'),
76 |         t.currency,
77 |         category.color
78 |     order by
79 |         sum(t.amount) asc;
80 | end;$function$
81 | ;
82 |
83 | grant delete on table "public"."total_amount" to "anon";
84 |
85 | grant insert on table "public"."total_amount" to "anon";
86 |
87 | grant references on table "public"."total_amount" to "anon";
88 |
89 | grant select on table "public"."total_amount" to "anon";
90 |
91 | grant trigger on table "public"."total_amount" to "anon";
92 |
93 | grant truncate on table "public"."total_amount" to "anon";
94 |
95 | grant update on table "public"."total_amount" to "anon";
96 |
97 | grant delete on table "public"."total_amount" to "authenticated";
98 |
99 | grant insert on table "public"."total_amount" to "authenticated";
100 |
101 | grant references on table "public"."total_amount" to "authenticated";
102 |
103 | grant select on table "public"."total_amount" to "authenticated";
104 |
105 | grant trigger on table "public"."total_amount" to "authenticated";
106 |
107 | grant truncate on table "public"."total_amount" to "authenticated";
108 |
109 | grant update on table "public"."total_amount" to "authenticated";
110 |
111 | grant delete on table "public"."total_amount" to "service_role";
112 |
113 | grant insert on table "public"."total_amount" to "service_role";
114 |
[TRUNCATED]
```

apps/api/supabase/migrations/20240917165251_remote_schema.sql
```
1 | create type "public"."connection_status" as enum ('disconnected', 'connected', 'unknown');
2 |
3 | create type "public"."inbox_type" as enum ('invoice', 'expense');
4 |
5 | create type "public"."transaction_frequency" as enum ('weekly', 'biweekly', 'monthly', 'semi_monthly', 'annually', 'irregular', 'unknown');
6 |
7 | drop trigger if exists "match_transaction" on "public"."transactions";
8 |
9 | drop trigger if exists "enrich_transaction" on "public"."transactions";
10 |
11 | revoke delete on table "public"."total_amount" from "anon";
12 |
13 | revoke insert on table "public"."total_amount" from "anon";
14 |
15 | revoke references on table "public"."total_amount" from "anon";
16 |
17 | revoke select on table "public"."total_amount" from "anon";
18 |
19 | revoke trigger on table "public"."total_amount" from "anon";
20 |
21 | revoke truncate on table "public"."total_amount" from "anon";
22 |
23 | revoke update on table "public"."total_amount" from "anon";
24 |
25 | revoke delete on table "public"."total_amount" from "authenticated";
26 |
27 | revoke insert on table "public"."total_amount" from "authenticated";
28 |
29 | revoke references on table "public"."total_amount" from "authenticated";
30 |
31 | revoke select on table "public"."total_amount" from "authenticated";
32 |
33 | revoke trigger on table "public"."total_amount" from "authenticated";
34 |
35 | revoke truncate on table "public"."total_amount" from "authenticated";
36 |
37 | revoke update on table "public"."total_amount" from "authenticated";
38 |
39 | revoke delete on table "public"."total_amount" from "service_role";
40 |
41 | revoke insert on table "public"."total_amount" from "service_role";
42 |
43 | revoke references on table "public"."total_amount" from "service_role";
44 |
45 | revoke select on table "public"."total_amount" from "service_role";
46 |
47 | revoke trigger on table "public"."total_amount" from "service_role";
48 |
49 | revoke truncate on table "public"."total_amount" from "service_role";
50 |
51 | revoke update on table "public"."total_amount" from "service_role";
52 |
53 | drop table "public"."total_amount";
54 |
55 | alter type "public"."reportTypes" rename to "reportTypes__old_version_to_be_dropped";
56 |
57 | create type "public"."reportTypes" as enum ('profit', 'revenue', 'burn_rate', 'expense');
58 |
59 | create table "public"."documents" (
60 |     "id" uuid not null default gen_random_uuid(),
61 |     "name" text,
62 |     "created_at" timestamp with time zone default now(),
63 |     "metadata" jsonb,
64 |     "path_tokens" text[],
65 |     "team_id" uuid,
66 |     "parent_id" text,
67 |     "object_id" uuid,
68 |     "owner_id" uuid,
69 |     "tag" text,
70 |     "title" text,
71 |     "body" text,
72 |     "fts" tsvector generated always as (to_tsvector('english'::regconfig, ((title || ' '::text) || body))) stored
73 | );
74 |
75 |
76 | alter table "public"."documents" enable row level security;
77 |
78 | create table "public"."exchange_rates" (
79 |     "id" uuid not null default gen_random_uuid(),
80 |     "base" text,
81 |     "rate" numeric,
82 |     "target" text,
83 |     "updated_at" timestamp with time zone
84 | );
85 |
86 |
87 | alter table "public"."exchange_rates" enable row level security;
88 |
89 | alter table "public"."reports" alter column type type "public"."reportTypes" using type::text::"public"."reportTypes";
90 |
91 | drop type "public"."reportTypes__old_version_to_be_dropped";
92 |
93 | alter table "public"."bank_accounts" drop column "last_accessed";
94 |
95 | alter table "public"."bank_accounts" add column "base_balance" numeric;
96 |
97 | alter table "public"."bank_accounts" add column "base_currency" text;
98 |
99 | alter table "public"."bank_connections" add column "error_details" text;
100 |
101 | alter table "public"."bank_connections" add column "last_accessed" timestamp with time zone;
102 |
103 | alter table "public"."bank_connections" add column "reference_id" text;
104 |
105 | alter table "public"."bank_connections" add column "status" connection_status default 'connected'::connection_status;
106 |
107 | alter table "public"."inbox" drop column "due_date";
108 |
109 | alter table "public"."inbox" add column "base_amount" numeric;
110 |
111 | alter table "public"."inbox" add column "base_currency" text;
112 |
113 | alter table "public"."inbox" add column "date" date;
114 |
115 | alter table "public"."inbox" add column "description" text;
116 |
117 | alter table "public"."inbox" add column "type" inbox_type;
118 |
119 | alter table "public"."teams" add column "base_currency" text;
120 |
121 | alter table "public"."teams" add column "document_classification" boolean default false;
122 |
123 | alter table "public"."transaction_enrichments" alter column "system" set default false;
124 |
125 | alter table "public"."transactions" drop column "currency_rate";
126 |
[TRUNCATED]
```

apps/api/supabase/migrations/20240917165404_remote_schema.sql
```
1 | CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
2 |
3 | CREATE TRIGGER user_registered AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION webhook('webhook/registered');
4 |
5 |
6 | set check_function_bodies = off;
7 |
8 | CREATE OR REPLACE FUNCTION storage.handle_empty_folder_placeholder()
9 |  RETURNS trigger
10 |  LANGUAGE plpgsql
11 | AS $function$
12 | DECLARE
13 |     name_tokens text[];
14 |     modified_name text;
15 | BEGIN
16 |     -- Split the name into an array of tokens based on '/'
17 |     name_tokens := string_to_array(NEW.name, '/');
18 |
19 |     -- Check if the last item in name_tokens is '.emptyFolderPlaceholder'
20 |     IF name_tokens[array_length(name_tokens, 1)] = '.emptyFolderPlaceholder' THEN
21 |
22 |         -- Change the last item to '.folderPlaceholder'
23 |         name_tokens[array_length(name_tokens, 1)] := '.folderPlaceholder';
24 |
25 |         -- Reassemble the tokens back into a string
26 |         modified_name := array_to_string(name_tokens, '/');
27 |
28 |         -- Insert a new row with the modified name
29 |         INSERT INTO storage.objects (bucket_id, name, owner, owner_id, team_id, parent_path)
30 |         VALUES (
31 |             NEW.bucket_id,
32 |             modified_name,
33 |             NEW.owner,
34 |             NEW.owner_id,
35 |             NEW.team_id,
36 |             NEW.parent_path
37 |         );
38 |     END IF;
39 |
40 |     -- Insert the original row
41 |     RETURN NEW;
42 | END;
43 | $function$
44 | ;
45 |
46 | CREATE OR REPLACE FUNCTION storage.extension(name text)
47 |  RETURNS text
48 |  LANGUAGE plpgsql
49 | AS $function$
50 | DECLARE
51 | _parts text[];
52 | _filename text;
53 | BEGIN
54 |     select string_to_array(name, '/') into _parts;
55 |     select _parts[array_length(_parts,1)] into _filename;
56 |     -- @todo return the last part instead of 2
57 |     return split_part(_filename, '.', 2);
58 | END
59 | $function$
60 | ;
61 |
62 | CREATE OR REPLACE FUNCTION storage.filename(name text)
63 |  RETURNS text
64 |  LANGUAGE plpgsql
65 | AS $function$
66 | DECLARE
67 | _parts text[];
68 | BEGIN
69 |     select string_to_array(name, '/') into _parts;
70 |     return _parts[array_length(_parts,1)];
71 | END
72 | $function$
73 | ;
74 |
75 | CREATE OR REPLACE FUNCTION storage.foldername(name text)
76 |  RETURNS text[]
77 |  LANGUAGE plpgsql
78 | AS $function$
79 | DECLARE
80 | _parts text[];
81 | BEGIN
82 |     select string_to_array(name, '/') into _parts;
83 |     return _parts[1:array_length(_parts,1)-1];
84 | END
85 | $function$
86 | ;
87 |
88 | create policy "Give members access to team folder 1oj01fe_0"
89 | on "storage"."objects"
90 | as permissive
91 | for select
92 | to public
93 | using (((bucket_id = 'avatars'::text) AND (EXISTS ( SELECT 1
94 |    FROM users_on_team
95 |   WHERE ((users_on_team.user_id = auth.uid()) AND ((users_on_team.team_id)::text = (storage.foldername(objects.name))[1]))))));
96 |
97 |
98 | create policy "Give members access to team folder 1oj01fe_1"
99 | on "storage"."objects"
100 | as permissive
101 | for insert
102 | to public
103 | with check (((bucket_id = 'avatars'::text) AND (EXISTS ( SELECT 1
104 |    FROM users_on_team
105 |   WHERE ((users_on_team.user_id = auth.uid()) AND ((users_on_team.team_id)::text = (storage.foldername(objects.name))[1]))))));
106 |
107 |
108 | create policy "Give members access to team folder 1oj01fe_2"
109 | on "storage"."objects"
110 | as permissive
111 | for update
112 | to public
113 | using (((bucket_id = 'avatars'::text) AND (EXISTS ( SELECT 1
114 |    FROM users_on_team
115 |   WHERE ((users_on_team.user_id = auth.uid()) AND ((users_on_team.team_id)::text = (storage.foldername(objects.name))[1]))))));
116 |
117 |
118 | create policy "Give members access to team folder 1oj01fe_3"
119 | on "storage"."objects"
120 | as permissive
121 | for delete
122 | to public
123 | using (((bucket_id = 'avatars'::text) AND (EXISTS ( SELECT 1
124 |    FROM users_on_team
125 |   WHERE ((users_on_team.user_id = auth.uid()) AND ((users_on_team.team_id)::text = (storage.foldername(objects.name))[1]))))));
126 |
127 |
128 | create policy "Give members access to team folder 1uo56a_0"
129 | on "storage"."objects"
130 | as permissive
131 | for select
132 | to authenticated
133 | using (((bucket_id = 'vault'::text) AND (EXISTS ( SELECT 1
[TRUNCATED]
```

apps/api/supabase/migrations/20241007083408_remote_schema.sql
```
1 | drop policy "Entries can be updated by a member of the team" on "public"."tracker_entries";
2 |
3 | create table "public"."apps" (
4 |     "id" uuid not null default gen_random_uuid(),
5 |     "team_id" uuid default gen_random_uuid(),
6 |     "config" jsonb,
7 |     "created_at" timestamp with time zone default now(),
8 |     "app_id" text not null,
9 |     "created_by" uuid default gen_random_uuid(),
10 |     "settings" jsonb
11 | );
12 |
13 |
14 | alter table "public"."apps" enable row level security;
15 |
16 | alter table "public"."tracker_entries" alter column "start" set data type timestamp with time zone using "start"::timestamp with time zone;
17 |
18 | alter table "public"."tracker_entries" alter column "stop" set data type timestamp with time zone using "stop"::timestamp with time zone;
19 |
20 | alter table "public"."users" add column "time_format" numeric default '24'::numeric;
21 |
22 | CREATE UNIQUE INDEX integrations_pkey ON public.apps USING btree (id);
23 |
24 | CREATE UNIQUE INDEX unique_app_id_team_id ON public.apps USING btree (app_id, team_id);
25 |
26 | alter table "public"."apps" add constraint "integrations_pkey" PRIMARY KEY using index "integrations_pkey";
27 |
28 | alter table "public"."apps" add constraint "apps_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE not valid;
29 |
30 | alter table "public"."apps" validate constraint "apps_created_by_fkey";
31 |
32 | alter table "public"."apps" add constraint "integrations_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;
33 |
34 | alter table "public"."apps" validate constraint "integrations_team_id_fkey";
35 |
36 | alter table "public"."apps" add constraint "unique_app_id_team_id" UNIQUE using index "unique_app_id_team_id";
37 |
38 | set check_function_bodies = off;
39 |
40 | CREATE OR REPLACE FUNCTION public.get_assigned_users_for_project(tracker_projects)
41 |  RETURNS json
42 |  LANGUAGE sql
43 | AS $function$
44 |   SELECT COALESCE(
45 |     (SELECT json_agg(
46 |       json_build_object(
47 |         'user_id', u.id,
48 |         'full_name', u.full_name,
49 |         'avatar_url', u.avatar_url
50 |       )
51 |     )
52 |     FROM (
53 |       SELECT DISTINCT u.id, u.full_name, u.avatar_url
54 |       FROM public.users u
55 |       JOIN public.tracker_entries te ON u.id = te.assigned_id
56 |       WHERE te.project_id = $1.id
57 |     ) u
58 |   ), '[]'::json);
59 | $function$
60 | ;
61 |
62 | CREATE OR REPLACE FUNCTION public.get_project_total_amount(tracker_projects)
63 |  RETURNS numeric
64 |  LANGUAGE sql
65 | AS $function$
66 |   SELECT COALESCE(
67 |     (SELECT
68 |       CASE
69 |         WHEN $1.rate IS NOT NULL THEN
70 |           ROUND(SUM(te.duration) * $1.rate / 3600, 2)
71 |         ELSE
72 |           0
73 |       END
74 |     FROM public.tracker_entries te
75 |     WHERE te.project_id = $1.id
76 |     ), 0
77 |   );
78 | $function$
79 | ;
80 |
81 | CREATE OR REPLACE FUNCTION public.get_runway_v4(team_id text, date_from date, date_to date, base_currency text DEFAULT NULL::text)
82 |  RETURNS numeric
83 |  LANGUAGE plpgsql
84 | AS $function$
85 | declare
86 |     target_currency text;
87 |     total_balance numeric;
88 |     avg_burn_rate numeric;
89 |     number_of_months numeric;
90 | begin
91 |     if get_runway_v4.base_currency is not null then
92 |         target_currency := get_runway_v4.base_currency;
93 |     else
94 |         select teams.base_currency into target_currency
95 |         from teams
96 |         where teams.id = get_runway_v4.team_id;
97 |     end if;
98 |
99 |     select * from get_total_balance_v3(team_id, target_currency) into total_balance;
100 |
101 |     select (extract(year FROM date_to) - extract(year FROM date_from)) * 12 +
102 |            extract(month FROM date_to) - extract(month FROM date_from)
103 |     into number_of_months;
104 |
105 |     select round(avg(value))
106 |     from get_burn_rate_v3(team_id, date_from, date_to, target_currency)
107 |     into avg_burn_rate;
108 |
109 |     if avg_burn_rate = 0 then
110 |         return null;
111 |     else
112 |         return round(total_balance / avg_burn_rate);
113 |     end if;
114 | end;
115 |
116 | $function$
117 | ;
118 |
119 | CREATE OR REPLACE FUNCTION public.calculate_bank_account_base_balance()
120 |  RETURNS trigger
121 |  LANGUAGE plpgsql
122 | AS $function$declare
123 |     team_base_currency text;
124 |     exchange_rate numeric;
125 | begin
[TRUNCATED]
```

apps/api/supabase/migrations/seed.sql
```
1 |
2 | SELECT vault.create_secret('http://localhost:3001/api', 'WEBHOOK_ENDPOINT', 'Webhook endpoint URL');
3 | SELECT vault.create_secret('6c369443-1a88-444e-b459-7e662c1fff9e', 'WEBHOOK_SECRET', 'Webhook secret key');
```

apps/dashboard/jobs/utils/base-currency.ts
```
1 | type GetAccountBalanceParams = {
2 |   currency: string;
3 |   balance: number;
4 |   baseCurrency: string;
5 |   rate: number | null;
6 | };
7 |
8 | export function getAccountBalance({
9 |   currency,
10 |   balance,
11 |   baseCurrency,
12 |   rate,
13 | }: GetAccountBalanceParams) {
14 |   if (currency === baseCurrency) {
15 |     return balance;
16 |   }
17 |
18 |   return +(balance * (rate ?? 1)).toFixed(2);
19 | }
20 |
21 | type GetTransactionAmountParams = {
22 |   amount: number;
23 |   currency: string;
24 |   baseCurrency: string;
25 |   rate: number | null;
26 | };
27 |
28 | export function getTransactionAmount({
29 |   amount,
30 |   currency,
31 |   baseCurrency,
32 |   rate,
33 | }: GetTransactionAmountParams) {
34 |   if (currency === baseCurrency) {
35 |     return amount;
36 |   }
37 |
38 |   return +(amount * (rate ?? 1)).toFixed(2);
39 | }
```

apps/dashboard/jobs/utils/blob.ts
```
1 | export async function blobToSerializable(blob: Blob) {
2 |   const arrayBuffer = await blob.arrayBuffer();
3 |   return Array.from(new Uint8Array(arrayBuffer));
4 | }
5 |
6 | export function serializableToBlob(array: number[], contentType = "") {
7 |   return new Blob([new Uint8Array(array)], { type: contentType });
8 | }
```

apps/dashboard/jobs/utils/generate-cron-tag.ts
```
1 | export function generateCronTag(teamId: string): string {
2 |   // Use teamId to generate a deterministic random minute and hour
3 |   const hash = Array.from(teamId).reduce(
4 |     (acc, char) => acc + char.charCodeAt(0),
5 |     0,
6 |   );
7 |
8 |   // Generate minute (0-59) and hour (0-23) based on hash
9 |   const minute = hash % 60;
10 |   const hour = hash % 24;
11 |
12 |   // Return cron expression that runs daily at the generated time
13 |   // Format: minute hour * * *
14 |   return `${minute} ${hour} * * *`;
15 | }
```

apps/dashboard/jobs/utils/inbox-notifications.ts
```
1 | import { NotificationTypes } from "@midday/notification";
2 | import { triggerBulk } from "@midday/notification";
3 | import { TriggerEvents } from "@midday/notification";
4 | import { createClient } from "@midday/supabase/job";
5 |
6 | export async function handleInboxNotifications({
7 |   inboxId,
8 |   description,
9 |   teamId,
10 | }: {
11 |   inboxId: string;
12 |   description: string;
13 |   teamId: string;
14 | }) {
15 |   const supabase = createClient();
16 |
17 |   // Get all users on team
18 |   const { data: usersData } = await supabase
19 |     .from("users_on_team")
20 |     .select("user:users(id, full_name, avatar_url, email, locale)")
21 |     .eq("team_id", teamId)
22 |     .eq("role", "owner")
23 |     .throwOnError();
24 |
25 |   if (!usersData?.length) {
26 |     return;
27 |   }
28 |
29 |   const notificationEvents = await Promise.all(
30 |     usersData.map(async ({ user }) => {
31 |       if (!user) return [];
32 |
33 |       return [
34 |         {
35 |           name: TriggerEvents.InboxNewInApp,
36 |           payload: {
37 |             recordId: inboxId,
38 |             description,
39 |             type: NotificationTypes.Inbox,
40 |           },
41 |           user: {
42 |             subscriberId: user.id,
43 |             teamId,
44 |             email: user.email,
45 |             fullName: user.full_name,
46 |             avatarUrl: user.avatar_url,
47 |           },
48 |         },
49 |       ];
50 |     }),
51 |   );
52 |
53 |   if (notificationEvents.length) {
54 |     triggerBulk(notificationEvents?.flat());
55 |   }
56 | }
```

apps/dashboard/jobs/utils/invoice-notifications.tsx
```
1 | import { InvoiceOverdueEmail } from "@midday/email/emails/invoice-overdue";
2 | import { InvoicePaidEmail } from "@midday/email/emails/invoice-paid";
3 | import { getI18n } from "@midday/email/locales";
4 | import {
5 |   NotificationTypes,
6 |   TriggerEvents,
7 |   triggerBulk,
8 | } from "@midday/notification";
9 | import { getAppUrl } from "@midday/utils/envs";
10 | import { render } from "@react-email/render";
11 | import { logger } from "@trigger.dev/sdk/v3";
12 |
13 | export async function handlePaidInvoiceNotifications({
14 |   user,
15 |   invoiceId,
16 |   invoiceNumber,
17 | }: {
18 |   user: any[];
19 |   invoiceId: string;
20 |   invoiceNumber: string;
21 | }) {
22 |   const link = `${getAppUrl()}/invoices?invoiceId=${invoiceId}&type=details`;
23 |
24 |   const paidNotificationEvents = user
25 |     ?.map(({ user, team_id }) => {
26 |       const { t } = getI18n({ locale: user?.locale ?? "en" });
27 |
28 |       if (!user) {
29 |         return null;
30 |       }
31 |
32 |       return {
33 |         name: TriggerEvents.InvoicePaidInApp,
34 |         payload: {
35 |           type: NotificationTypes.Invoice,
36 |           recordId: invoiceId,
37 |           description: t("notifications.invoicePaid", {
38 |             invoiceNumber,
39 |           }),
40 |         },
41 |         user: {
42 |           subscriberId: user.id,
43 |           teamId: team_id,
44 |           email: user.email,
45 |           fullName: user.full_name,
46 |           avatarUrl: user.avatar_url,
47 |         },
48 |       };
49 |     })
50 |     .filter(Boolean);
51 |
52 |   try {
53 |     await triggerBulk(paidNotificationEvents);
54 |   } catch (error) {
55 |     await logger.error("Paid invoice notification", { error });
56 |   }
57 |
58 |   const paidEmailPromises = user
59 |     ?.map(async ({ user, team_id }) => {
60 |       const { t } = getI18n({ locale: user?.locale ?? "en" });
61 |
62 |       if (!user) {
63 |         return null;
64 |       }
65 |
66 |       const html = await render(
67 |         <InvoicePaidEmail invoiceNumber={invoiceNumber} link={link} />,
68 |       );
69 |
70 |       return {
71 |         name: TriggerEvents.InvoicePaidEmail,
72 |         payload: {
73 |           subject: t("invoice.paid.subject", { invoiceNumber }),
74 |           html,
75 |         },
76 |         user: {
77 |           subscriberId: user.id,
78 |           teamId: team_id,
79 |           email: user.email,
80 |           fullName: user.full_name,
81 |           avatarUrl: user.avatar_url,
82 |         },
83 |       };
84 |     })
85 |     .filter(Boolean);
86 |
87 |   const validPaidEmailPromises = await Promise.all(paidEmailPromises);
88 |
89 |   try {
90 |     await triggerBulk(validPaidEmailPromises);
91 |   } catch (error) {
92 |     await logger.error("Paid invoice email", { error });
93 |   }
94 | }
95 |
96 | export async function handleOverdueInvoiceNotifications({
97 |   user,
98 |   invoiceId,
99 |   invoiceNumber,
100 |   customerName,
101 | }: {
102 |   user: any[];
103 |   invoiceId: string;
104 |   invoiceNumber: string;
105 |   customerName: string;
106 | }) {
107 |   const link = `${getAppUrl()}/invoices?invoiceId=${invoiceId}&type=details`;
108 |
109 |   const overdueNotificationEvents = user
110 |     ?.map(({ user, team_id }) => {
111 |       const { t } = getI18n({ locale: user?.locale ?? "en" });
112 |
113 |       if (!user) {
114 |         return null;
115 |       }
116 |
117 |       return {
118 |         name: TriggerEvents.InvoiceOverdueInApp,
119 |         payload: {
120 |           type: NotificationTypes.Invoice,
121 |           recordId: invoiceId,
122 |           description: t("notifications.invoiceOverdue", {
123 |             invoiceNumber,
124 |           }),
125 |         },
126 |         user: {
127 |           subscriberId: user.id,
128 |           teamId: team_id,
129 |           email: user.email,
130 |           fullName: user.full_name,
131 |           avatarUrl: user.avatar_url,
132 |         },
133 |       };
134 |     })
135 |     .filter(Boolean);
136 |
137 |   try {
138 |     await triggerBulk(overdueNotificationEvents);
139 |   } catch (error) {
140 |     await logger.error("Overdue invoice notification", { error });
141 |   }
142 |
143 |   const overdueEmailPromises = user
144 |     ?.map(async ({ user, team_id }) => {
145 |       const { t } = getI18n({ locale: user?.locale ?? "en" });
146 |
147 |       if (!user) {
148 |         return null;
149 |       }
150 |
151 |       const html = await render(
152 |         <InvoiceOverdueEmail
153 |           invoiceNumber={invoiceNumber}
154 |           customerName={customerName}
155 |           link={link}
156 |         />,
157 |       );
158 |
159 |       return {
160 |         name: TriggerEvents.InvoiceOverdueEmail,
161 |         payload: {
162 |           subject: t("invoice.overdue.subject", { invoiceNumber }),
163 |           html,
164 |         },
165 |         user: {
166 |           subscriberId: user.id,
167 |           teamId: team_id,
168 |           email: user.email,
169 |           fullName: user.full_name,
170 |           avatarUrl: user.avatar_url,
171 |         },
172 |       };
173 |     })
174 |     .filter(Boolean);
175 |
176 |   const validOverdueEmailPromises = await Promise.all(overdueEmailPromises);
177 |
178 |   try {
179 |     await triggerBulk(validOverdueEmailPromises);
180 |   } catch (error) {
181 |     await logger.error("Overdue invoice email", { error });
182 |   }
183 | }
```

apps/dashboard/jobs/utils/parse-error.ts
```
1 | export function parseAPIError(error: unknown) {
2 |   if (typeof error === "object" && error !== null && "error" in error) {
3 |     const apiError = error as { error: { code: string; message: string } };
4 |     return {
5 |       code: apiError.error.code,
6 |       message: apiError.error.message,
7 |     };
8 |   }
9 |   return { code: "unknown", message: "An unknown error occurred" };
10 | }
```

apps/dashboard/jobs/utils/process-batch.ts
```
1 | export async function processBatch<T, R>(
2 |   items: T[],
3 |   limit: number,
4 |   fn: (batch: T[]) => Promise<R[]>,
5 | ): Promise<R[]> {
6 |   const batches: T[][] = [];
7 |   let result: R[] = [];
8 |
9 |   // Split the items into batches
10 |   for (let i = 0; i < items?.length; i += limit) {
11 |     batches.push(items.slice(i, i + limit));
12 |   }
13 |
14 |   // Process batches serially
15 |   for (const batch of batches) {
16 |     const processedBatch = await fn(batch);
17 |     result = result.concat(processedBatch);
18 |   }
19 |
20 |   return result;
21 | }
```

apps/dashboard/jobs/utils/revalidate-cache.ts
```
1 | export async function revalidateCache({
2 |   tag,
3 |   id,
4 | }: {
5 |   tag: string;
6 |   id: string;
7 | }) {
8 |   return fetch(
9 |     `${process.env.MIDDAY_PUBLIC_APP_URL}/api/webhook/cache/revalidate`,
10 |     {
11 |       headers: {
12 |         Authorization: `Bearer ${process.env.MIDDAY_CACHE_API_SECRET}`,
13 |       },
14 |       method: "POST",
15 |       body: JSON.stringify({ tag, id }),
16 |     },
17 |   );
18 | }
```

apps/dashboard/jobs/utils/transaction-notifications.tsx
```
1 | import { sendSlackTransactionNotifications } from "@midday/app-store/slack-notifications";
2 | import TransactionsEmail from "@midday/email/emails/transactions";
3 | import { getI18n } from "@midday/email/locales";
4 | import { getInboxEmail } from "@midday/inbox";
5 | import {
6 |   NotificationTypes,
7 |   TriggerEvents,
8 |   triggerBulk,
9 | } from "@midday/notification";
10 | import { createClient } from "@midday/supabase/job";
11 | import { render } from "@react-email/render";
12 | import { logger } from "@trigger.dev/sdk/v3";
13 |
14 | interface User {
15 |   id: string;
16 |   full_name: string;
17 |   avatar_url: string;
18 |   email: string;
19 |   locale: string;
20 | }
21 |
22 | interface Team {
23 |   inbox_id: string;
24 |   name: string;
25 | }
26 |
27 | interface UserData {
28 |   user: User;
29 |   team_id: string;
30 |   team: Team;
31 | }
32 |
33 | interface Transaction {
34 |   id: string;
35 |   date: string;
36 |   amount: number;
37 |   name: string;
38 |   currency: string;
39 |   category: string;
40 |   status: string;
41 | }
42 |
43 | export async function handleTransactionNotifications(
44 |   usersData: UserData[],
45 |   transactions: Transaction[],
46 | ) {
47 |   const notificationEvents = usersData.map(({ user, team_id }) => {
48 |     const { t } = getI18n({ locale: user.locale ?? "en" });
49 |
50 |     return {
51 |       name: TriggerEvents.TransactionsNewInApp,
52 |       payload: {
53 |         type: NotificationTypes.Transactions,
54 |         from: transactions[transactions.length - 1]?.date,
55 |         to: transactions[0]?.date,
56 |         description: t("notifications.transactions", {
57 |           numberOfTransactions: transactions.length,
58 |           // For single transaction
59 |           amount: transactions[0]?.amount,
60 |           name: transactions[0]?.name,
61 |         }),
62 |       },
63 |       user: {
64 |         subscriberId: user.id,
65 |         teamId: team_id,
66 |         email: user.email,
67 |         fullName: user.full_name,
68 |         avatarUrl: user.avatar_url,
69 |       },
70 |     };
71 |   });
72 |
73 |   const validNotificationEvents = notificationEvents.filter(Boolean);
74 |
75 |   try {
76 |     await triggerBulk(validNotificationEvents);
77 |   } catch (error) {
78 |     await logger.error("Transaction notifications", { error });
79 |   }
80 |
81 |   return validNotificationEvents;
82 | }
83 |
84 | export async function handleTransactionEmails(
85 |   usersData: UserData[],
86 |   transactions: Transaction[],
87 | ) {
88 |   const emailPromises = usersData.map(async ({ user, team_id, team }) => {
89 |     const { t } = getI18n({ locale: user.locale ?? "en" });
90 |
91 |     const html = await render(
92 |       <TransactionsEmail
93 |         fullName={user.full_name}
94 |         transactions={transactions}
95 |         locale={user.locale ?? "en"}
96 |         teamName={team.name}
97 |       />,
98 |     );
99 |
100 |     return {
101 |       name: TriggerEvents.TransactionNewEmail,
102 |       payload: {
103 |         subject: t("transactions.subject"),
104 |         html,
105 |       },
106 |       replyTo: getInboxEmail(team.inbox_id),
107 |       user: {
108 |         subscriberId: user.id,
109 |         teamId: team_id,
110 |         email: user.email,
111 |         fullName: user.full_name,
112 |         avatarUrl: user.avatar_url,
113 |       },
114 |     };
115 |   });
116 |
117 |   const validEmailPromises = await Promise.all(emailPromises);
118 |
119 |   try {
120 |     await triggerBulk(validEmailPromises);
121 |     logger.info("Transaction emails sent", {
122 |       count: validEmailPromises.length,
123 |     });
124 |   } catch (error) {
125 |     logger.error("Transaction emails", { error });
126 |   }
127 |
128 |   return validEmailPromises;
129 | }
130 |
131 | export async function handleTransactionSlackNotifications(
132 |   teamId: string,
133 |   transactions: Transaction[],
134 | ) {
135 |   const supabase = createClient();
136 |
137 |   // TODO: Get correct locale for formatting the amount
138 |   const slackTransactions = transactions.map((transaction) => ({
139 |     amount: Intl.NumberFormat("en-US", {
140 |       style: "currency",
141 |       currency: transaction.currency,
142 |     }).format(transaction.amount),
143 |     name: transaction.name,
144 |   }));
145 |
146 |   await sendSlackTransactionNotifications({
147 |     teamId,
148 |     transactions: slackTransactions,
149 |     supabase,
150 |   });
151 | }
```

apps/dashboard/jobs/utils/transform.test.ts
```
1 | import { expect, test } from "bun:test";
2 | import { transformTransaction } from "./transform";
3 |
4 | test("transformTransaction should correctly transform transaction data", () => {
5 |   const mockTransaction = {
6 |     id: "123456",
7 |     name: "Coffee Shop",
8 |     description: "Morning coffee",
9 |     date: "2023-05-15",
10 |     amount: 5.5,
11 |     currency: "USD",
12 |     method: "card",
13 |     category: "meals",
14 |     balance: 100.5,
15 |     status: "posted" as "posted" | "pending",
16 |   };
17 |
18 |   const teamId = "team123";
19 |   const bankAccountId = "account456";
20 |
21 |   const result = transformTransaction({
22 |     transaction: mockTransaction,
23 |     teamId,
24 |     bankAccountId,
25 |   });
26 |
27 |   expect(result).toEqual({
28 |     name: "Coffee Shop",
29 |     description: "Morning coffee",
30 |     date: "2023-05-15",
31 |     amount: 5.5,
32 |     currency: "USD",
33 |     method: "card",
34 |     internal_id: "team123_123456",
35 |     category_slug: "meals",
36 |     bank_account_id: "account456",
37 |     balance: 100.5,
38 |     team_id: "team123",
39 |     status: "posted",
40 |   });
41 | });
42 |
43 | test("transformTransaction should handle null values correctly", () => {
44 |   const mockTransaction = {
45 |     id: "789012",
46 |     name: "Unknown Transaction",
47 |     description: null,
48 |     date: "2023-05-16",
49 |     amount: 10.0,
50 |     currency: "EUR",
51 |     method: null,
52 |     category: null,
53 |     balance: null,
54 |     status: "pending" as "posted" | "pending",
55 |   };
56 |
57 |   const teamId = "team456";
58 |   const bankAccountId = "account789";
59 |
60 |   const result = transformTransaction({
61 |     transaction: mockTransaction,
62 |     teamId,
63 |     bankAccountId,
64 |   });
65 |
66 |   expect(result).toEqual({
67 |     name: "Unknown Transaction",
68 |     description: null,
69 |     date: "2023-05-16",
70 |     amount: 10.0,
71 |     currency: "EUR",
72 |     method: null,
73 |     internal_id: "team456_789012",
74 |     category_slug: null,
75 |     bank_account_id: "account789",
76 |     balance: null,
77 |     team_id: "team456",
78 |     status: "pending",
79 |   });
80 | });
```

apps/dashboard/jobs/utils/transform.ts
```
1 | import type { Transactions } from "@midday-ai/engine/resources/transactions";
2 | import type { Database } from "@midday/supabase/types";
3 |
4 | type TransformTransactionData = {
5 |   transaction: Transactions.Data;
6 |   teamId: string;
7 |   bankAccountId: string;
8 |   notified?: boolean;
9 | };
10 |
11 | type Transaction = {
12 |   name: string;
13 |   internal_id: string;
14 |   category_slug: string | null;
15 |   bank_account_id: string;
16 |   description: string | null;
17 |   balance: number | null;
18 |   currency: string;
19 |   method: string | null;
20 |   amount: number;
21 |   team_id: string;
22 |   date: string;
23 |   status: "posted" | "pending";
24 |   notified?: boolean;
25 | };
26 |
27 | export function transformTransaction({
28 |   transaction,
29 |   teamId,
30 |   bankAccountId,
31 |   notified,
32 | }: TransformTransactionData): Transaction {
33 |   return {
34 |     name: transaction.name,
35 |     description: transaction.description,
36 |     date: transaction.date,
37 |     amount: transaction.amount,
38 |     currency: transaction.currency,
39 |     method: transaction.method,
40 |     internal_id: `${teamId}_${transaction.id}`,
41 |     category_slug: transaction.category,
42 |     bank_account_id: bankAccountId,
43 |     balance: transaction.balance,
44 |     team_id: teamId,
45 |     status: transaction.status,
46 |     // If the transactions are being synced manually, we don't want to notify
47 |     // And using upsert, we don't want to override the notified value
48 |     ...(notified ? { notified } : {}),
49 |   };
50 | }
51 |
52 | export function getClassification(
53 |   type: Database["public"]["Enums"]["account_type"],
54 | ) {
55 |   switch (type) {
56 |     case "credit":
57 |       return "credit";
58 |     default:
59 |       return "depository";
60 |   }
61 | }
```

apps/dashboard/jobs/utils/trigger-batch.ts
```
1 | import type { BatchRunHandle } from "@trigger.dev/sdk/v3";
2 |
3 | const BATCH_SIZE = 100;
4 |
5 | interface BatchItem<T> {
6 |   payload: T;
7 | }
8 |
9 | interface BatchTriggerTask<T> {
10 |   batchTrigger: (
11 |     items: BatchItem<T>[],
12 |   ) => Promise<BatchRunHandle<string, T, void>>;
13 | }
14 |
15 | export async function triggerBatch<T>(data: T[], task: BatchTriggerTask<T>) {
16 |   for (let i = 0; i < data.length; i += BATCH_SIZE) {
17 |     const chunk = data.slice(i, i + BATCH_SIZE);
18 |
19 |     await task.batchTrigger(
20 |       chunk.map((item) => ({
21 |         payload: item,
22 |       })),
23 |     );
24 |   }
25 | }
```

apps/dashboard/jobs/utils/trigger-sequence.ts
```
1 | import type { BatchRunHandle, TaskRunOptions } from "@trigger.dev/sdk/v3";
2 |
3 | interface TriggerTask<T> {
4 |   batchTriggerAndWait: (
5 |     items: { payload: T }[],
6 |     options?: TaskRunOptions & { delayMinutes?: number },
7 |   ) => Promise<BatchRunHandle<string, T, void>>;
8 | }
9 |
10 | export async function triggerSequenceAndWait<T>(
11 |   items: T[],
12 |   task: TriggerTask<T>,
13 |   options?: TaskRunOptions & { delayMinutes?: number },
14 | ) {
15 |   const { delayMinutes = 1, ...restOptions } = options ?? {};
16 |
17 |   const batchItems = items.map((item, i) => ({
18 |     payload: item,
19 |     options: {
20 |       ...restOptions,
21 |       delay: `${i * delayMinutes}min`,
22 |     },
23 |   }));
24 |
25 |   return task.batchTriggerAndWait(batchItems, restOptions);
26 | }
```

apps/dashboard/jobs/utils/update-invocie.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { logger } from "@trigger.dev/sdk/v3";
3 | import { sendInvoiceNotifications } from "jobs/tasks/invoice/notifications/send-notifications";
4 |
5 | export async function updateInvoiceStatus({
6 |   invoiceId,
7 |   status,
8 | }: {
9 |   invoiceId: string;
10 |   status: "overdue" | "paid";
11 | }): Promise<void> {
12 |   const supabase = createClient();
13 |
14 |   const { data: updatedInvoice } = await supabase
15 |     .from("invoices")
16 |     .update({ status })
17 |     .eq("id", invoiceId)
18 |     .select("id, invoice_number, status, team_id, customer_name")
19 |     .single();
20 |
21 |   if (
22 |     !updatedInvoice?.invoice_number ||
23 |     !updatedInvoice?.team_id ||
24 |     !updatedInvoice?.customer_name
25 |   ) {
26 |     logger.error("Invoice data is missing");
27 |     return;
28 |   }
29 |
30 |   logger.info(`Invoice status changed to ${status}`);
31 |
32 |   await sendInvoiceNotifications.trigger({
33 |     invoiceId,
34 |     invoiceNumber: updatedInvoice.invoice_number,
35 |     status: updatedInvoice.status as "paid" | "overdue",
36 |     teamId: updatedInvoice.team_id,
37 |     customerName: updatedInvoice.customer_name,
38 |   });
39 | }
```

apps/dashboard/public/assets/setup-animation-dark.json
```
[TRUNCATED]
```

apps/dashboard/public/assets/setup-animation.json
```
[TRUNCATED]
```

apps/dashboard/src/actions/accept-invite-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import {
5 |   revalidatePath as revalidatePathFunc,
6 |   revalidateTag,
7 | } from "next/cache";
8 | import { authActionClient } from "./safe-action";
9 | import { acceptInviteSchema } from "./schema";
10 |
11 | export const acceptInviteAction = authActionClient
12 |   .schema(acceptInviteSchema)
13 |   .metadata({
14 |     name: "accept-invite",
15 |     track: {
16 |       event: LogEvents.AcceptInvite.name,
17 |       channel: LogEvents.AcceptInvite.channel,
18 |     },
19 |   })
20 |   .action(
21 |     async ({
22 |       parsedInput: { id, revalidatePath },
23 |       ctx: { user, supabase },
24 |     }) => {
25 |       const { data: inviteData } = await supabase
26 |         .from("user_invites")
27 |         .select("*")
28 |         .eq("id", id)
29 |         .single();
30 |
31 |       if (!inviteData) {
32 |         return;
33 |       }
34 |
35 |       await supabase.from("users_on_team").insert({
36 |         user_id: user.id,
37 |         role: inviteData.role,
38 |         team_id: user.team_id as string,
39 |       });
40 |
41 |       await supabase.from("user_invites").delete().eq("id", id);
42 |
43 |       if (revalidatePath) {
44 |         revalidatePathFunc(revalidatePath);
45 |       }
46 |
47 |       revalidateTag(`teams_${user.id}`);
48 |
49 |       return id;
50 |     },
51 |   );
```

apps/dashboard/src/actions/bulk-update-transactions-action.ts
```
1 | "use server";
2 |
3 | import { revalidateTag } from "next/cache";
4 | import { authActionClient } from "./safe-action";
5 | import { bulkUpdateTransactionsSchema } from "./schema";
6 |
7 | export const bulkUpdateTransactionsAction = authActionClient
8 |   .schema(bulkUpdateTransactionsSchema)
9 |   .metadata({
10 |     name: "bulk-update-transactions",
11 |   })
12 |   .action(
13 |     async ({ parsedInput: { type, ...payload }, ctx: { user, supabase } }) => {
14 |       if (type === "tags") {
15 |         const data = await supabase
16 |           .from("transaction_tags")
17 |           .insert(
18 |             payload.data.map(({ id, ...params }) => ({
19 |               transaction_id: id,
20 |               tag_id: params.tag_id,
21 |               team_id: user.team_id!,
22 |             })),
23 |           )
24 |           .select();
25 |
26 |         revalidateTag(`transactions_${user.team_id}`);
27 |
28 |         return data;
29 |       }
30 |
31 |       const updatePromises = payload.data.map(async ({ id, ...params }) => {
32 |         return supabase
33 |           .from("transactions")
34 |           .update(params)
35 |           .eq("id", id)
36 |           .eq("team_id", user.team_id)
37 |           .select();
38 |       });
39 |
40 |       const data = await Promise.all(updatePromises);
41 |
42 |       revalidateTag(`transactions_${user.team_id}`);
43 |       revalidateTag(`spending_${user.team_id}`);
44 |       revalidateTag(`metrics_${user.team_id}`);
45 |       revalidateTag(`current_burn_rate_${user.team_id}`);
46 |       revalidateTag(`burn_rate_${user.team_id}`);
47 |       revalidateTag(`expenses_${user.team_id}`);
48 |
49 |       return data;
50 |     },
51 |   );
```

apps/dashboard/src/actions/change-chart-period-action.ts
```
1 | "use server";
2 |
3 | import { revalidateTag } from "next/cache";
4 | import { authActionClient } from "./safe-action";
5 | import { changeChartPeriodSchema } from "./schema";
6 |
7 | export const changeChartPeriodAction = authActionClient
8 |   .schema(changeChartPeriodSchema)
9 |   .metadata({
10 |     name: "change-chart-period",
11 |   })
12 |   .action(async ({ parsedInput: value, ctx: { user } }) => {
13 |     revalidateTag(`chart_${user.team_id}`);
14 |
15 |     return value;
16 |   });
```

apps/dashboard/src/actions/change-chart-type-action.ts
```
1 | "use server";
2 |
3 | import { Cookies } from "@/utils/constants";
4 | import { addYears } from "date-fns";
5 | import { revalidateTag } from "next/cache";
6 | import { cookies } from "next/headers";
7 | import { authActionClient } from "./safe-action";
8 | import { changeChartTypeSchema } from "./schema";
9 |
10 | export const changeChartTypeAction = authActionClient
11 |   .schema(changeChartTypeSchema)
12 |   .metadata({
13 |     name: "change-chart-type",
14 |   })
15 |   .action(async ({ parsedInput: value, ctx: { user } }) => {
16 |     cookies().set({
17 |       name: Cookies.ChartType,
18 |       value,
19 |       expires: addYears(new Date(), 1),
20 |     });
21 |
22 |     revalidateTag(`chart_${user.team_id}`);
23 |
24 |     return value;
25 |   });
```

apps/dashboard/src/actions/change-spending-period-action.ts
```
1 | "use server";
2 |
3 | import { Cookies } from "@/utils/constants";
4 | import { addYears } from "date-fns";
5 | import { revalidateTag } from "next/cache";
6 | import { cookies } from "next/headers";
7 | import { authActionClient } from "./safe-action";
8 | import { changeSpendingPeriodSchema } from "./schema";
9 |
10 | export const changeSpendingPeriodAction = authActionClient
11 |   .schema(changeSpendingPeriodSchema)
12 |   .metadata({
13 |     name: "change-spending-period",
14 |   })
15 |   .action(async ({ parsedInput: params, ctx: { user } }) => {
16 |     cookies().set({
17 |       name: Cookies.SpendingPeriod,
18 |       value: JSON.stringify(params),
19 |       expires: addYears(new Date(), 1),
20 |     });
21 |
22 |     revalidateTag(`spending_${user.team_id}`);
23 |
24 |     return params;
25 |   });
```

apps/dashboard/src/actions/change-team-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { updateUser } from "@midday/supabase/mutations";
5 | import { revalidateTag } from "next/cache";
6 | import { redirect } from "next/navigation";
7 | import { authActionClient } from "./safe-action";
8 | import { changeTeamSchema } from "./schema";
9 |
10 | export const changeTeamAction = authActionClient
11 |   .schema(changeTeamSchema)
12 |   .metadata({
13 |     name: "change-team",
14 |     track: {
15 |       event: LogEvents.ChangeTeam.name,
16 |       channel: LogEvents.ChangeTeam.channel,
17 |     },
18 |   })
19 |   .action(
20 |     async ({ parsedInput: { teamId, redirectTo }, ctx: { supabase } }) => {
21 |       const user = await updateUser(supabase, { team_id: teamId });
22 |
23 |       if (!user?.data) {
24 |         return;
25 |       }
26 |
27 |       revalidateTag(`user_${user.data.id}`);
28 |
29 |       redirect(redirectTo);
30 |     },
31 |   );
```

apps/dashboard/src/actions/change-transactions-period-action.ts
```
1 | "use server";
2 |
3 | import { Cookies } from "@/utils/constants";
4 | import { addYears } from "date-fns";
5 | import { revalidateTag } from "next/cache";
6 | import { cookies } from "next/headers";
7 | import { authActionClient } from "./safe-action";
8 | import { changeTransactionsPeriodSchema } from "./schema";
9 |
10 | export const changeTransactionsPeriodAction = authActionClient
11 |   .schema(changeTransactionsPeriodSchema)
12 |   .metadata({
13 |     name: "change-transactions-period",
14 |   })
15 |   .action(async ({ parsedInput: value, ctx: { user } }) => {
16 |     cookies().set({
17 |       name: Cookies.TransactionsPeriod,
18 |       value,
19 |       expires: addYears(new Date(), 1),
20 |     });
21 |
22 |     revalidateTag(`transactions_${user.team_id}`);
23 |
24 |     return value;
25 |   });
```

apps/dashboard/src/actions/change-user-role-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { updateUserTeamRole } from "@midday/supabase/mutations";
5 | import { revalidatePath as revalidatePathFunc } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { changeUserRoleSchema } from "./schema";
8 |
9 | export const changeUserRoleAction = authActionClient
10 |   .schema(changeUserRoleSchema)
11 |   .metadata({
12 |     name: "change-user-role",
13 |     track: {
14 |       event: LogEvents.UserRoleChange.name,
15 |       channel: LogEvents.UserRoleChange.channel,
16 |     },
17 |   })
18 |   .action(
19 |     async ({
20 |       parsedInput: { userId, teamId, role, revalidatePath },
21 |       ctx: { supabase },
22 |     }) => {
23 |       const { data } = await updateUserTeamRole(supabase, {
24 |         userId,
25 |         teamId,
26 |         role,
27 |       });
28 |
29 |       if (revalidatePath) {
30 |         revalidatePathFunc(revalidatePath);
31 |       }
32 |
33 |       return data;
34 |     },
35 |   );
```

apps/dashboard/src/actions/connect-bank-account-action.ts
```
1 | "use server";
2 |
3 | import { getMostFrequentCurrency } from "@/utils/currency";
4 | import { LogEvents } from "@midday/events/events";
5 | import { getTeamSettings } from "@midday/supabase/cached-queries";
6 | import { createBankConnection } from "@midday/supabase/mutations";
7 | import { initialBankSetup } from "jobs/tasks/bank/setup/initial";
8 | import { revalidateTag } from "next/cache";
9 | import { authActionClient } from "./safe-action";
10 | import { connectBankAccountSchema } from "./schema";
11 |
12 | export const connectBankAccountAction = authActionClient
13 |   .schema(connectBankAccountSchema)
14 |   .metadata({
15 |     name: "connect-bank-account",
16 |     track: {
17 |       event: LogEvents.ConnectBankCompleted.name,
18 |       channel: LogEvents.ConnectBankCompleted.channel,
19 |     },
20 |   })
21 |   .action(
22 |     async ({
23 |       parsedInput: {
24 |         provider,
25 |         accounts,
26 |         accessToken,
27 |         enrollmentId,
28 |         referenceId,
29 |       },
30 |       ctx: { supabase, user },
31 |     }) => {
32 |       const teamId = user.team_id;
33 |
34 |       if (!teamId) {
35 |         throw new Error("Team ID is required");
36 |       }
37 |
38 |       const { data } = await getTeamSettings();
39 |
40 |       const selectedCurrency = getMostFrequentCurrency(accounts);
41 |
42 |       // Update team settings with base currency if not set
43 |       if (!data?.base_currency && selectedCurrency && teamId) {
44 |         await supabase
45 |           .from("teams")
46 |           .update({
47 |             base_currency: selectedCurrency,
48 |           })
49 |           .eq("id", teamId);
50 |       }
51 |
52 |       const { data: bankConnection } = await createBankConnection(supabase, {
53 |         accessToken,
54 |         enrollmentId,
55 |         referenceId,
56 |         teamId,
57 |         userId: user.id,
58 |         accounts,
59 |         provider,
60 |       });
61 |
62 |       const event = await initialBankSetup.trigger({
63 |         teamId,
64 |         connectionId: bankConnection?.id,
65 |       });
66 |
67 |       revalidateTag(`bank_accounts_${teamId}`);
68 |       revalidateTag(`bank_accounts_currencies_${teamId}`);
69 |       revalidateTag(`bank_connections_${teamId}`);
70 |
71 |       return event;
72 |     },
73 |   );
```

apps/dashboard/src/actions/create-attachments-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { createAttachments } from "@midday/supabase/mutations";
5 | import { revalidateTag } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { createAttachmentsSchema } from "./schema";
8 |
9 | export const createAttachmentsAction = authActionClient
10 |   .schema(createAttachmentsSchema)
11 |   .metadata({
12 |     name: "create-attachments",
13 |     track: {
14 |       event: LogEvents.CreateAttachment.name,
15 |       channel: LogEvents.CreateAttachment.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: files, ctx: { user, supabase } }) => {
19 |     const data = await createAttachments(supabase, files);
20 |
21 |     revalidateTag(`transactions_${user.team_id}`);
22 |
23 |     return data;
24 |   });
```

apps/dashboard/src/actions/create-bank-account-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { nanoid } from "nanoid";
5 | import { revalidateTag } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { createBankAccountSchema } from "./schema";
8 |
9 | export const createBankAccountAction = authActionClient
10 |   .schema(createBankAccountSchema)
11 |   .metadata({
12 |     name: "create-bank-account",
13 |     track: {
14 |       event: LogEvents.BankAccountCreate.name,
15 |       channel: LogEvents.BankAccountCreate.channel,
16 |     },
17 |   })
18 |   .action(
19 |     async ({ parsedInput: { name, currency }, ctx: { user, supabase } }) => {
20 |       const { data, error } = await supabase
21 |         .from("bank_accounts")
22 |         .insert({
23 |           name,
24 |           currency,
25 |           team_id: user.team_id,
26 |           created_by: user.id,
27 |           enabled: true,
28 |           account_id: nanoid(),
29 |           manual: true,
30 |         })
31 |         .select("id, name")
32 |         .single();
33 |
34 |       if (error) {
35 |         throw Error(error.message);
36 |       }
37 |
38 |       revalidateTag(`bank_accounts_${user.team_id}`);
39 |       revalidateTag(`bank_accounts_currencies_${user.team_id}`);
40 |
41 |       return data;
42 |     },
43 |   );
```

apps/dashboard/src/actions/create-categories-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { createCategoriesSchema } from "./schema";
7 |
8 | export const createCategoriesAction = authActionClient
9 |   .schema(createCategoriesSchema)
10 |   .metadata({
11 |     name: "create-categories",
12 |     track: {
13 |       event: LogEvents.CategoryCreate.name,
14 |       channel: LogEvents.CategoryCreate.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: { categories }, ctx: { user, supabase } }) => {
18 |     const teamId = user.team_id;
19 |
20 |     const { data } = await supabase
21 |       .from("transaction_categories")
22 |       .insert(
23 |         categories.map((category) => ({
24 |           ...category,
25 |           team_id: teamId,
26 |         })),
27 |       )
28 |       .select("id, name, color, vat, slug");
29 |
30 |     revalidateTag(`transaction_categories_${teamId}`);
31 |
32 |     return data;
33 |   });
```

apps/dashboard/src/actions/create-customer-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { generateToken } from "@midday/invoice/token";
5 | import { revalidateTag } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { createCustomerSchema } from "./schema";
8 |
9 | export const createCustomerAction = authActionClient
10 |   .schema(createCustomerSchema)
11 |   .metadata({
12 |     name: "create-customer",
13 |     track: {
14 |       event: LogEvents.CreateCustomer.name,
15 |       channel: LogEvents.CreateCustomer.channel,
16 |     },
17 |   })
18 |   .action(
19 |     async ({ parsedInput: { tags, ...input }, ctx: { user, supabase } }) => {
20 |       const token = await generateToken(user.id);
21 |
22 |       const { data } = await supabase
23 |         .from("customers")
24 |         .upsert(
25 |           {
26 |             ...input,
27 |             token,
28 |             team_id: user.team_id,
29 |           },
30 |           {
31 |             onConflict: "id",
32 |           },
33 |         )
34 |         .select("id, name")
35 |         .single();
36 |
37 |       if (tags?.length) {
38 |         await supabase.from("customer_tags").insert(
39 |           tags.map((tag) => ({
40 |             tag_id: tag.id,
41 |             customer_id: data?.id,
42 |             team_id: user.team_id!,
43 |           })),
44 |         );
45 |       }
46 |
47 |       revalidateTag(`customers_${user.team_id}`);
48 |
49 |       return data;
50 |     },
51 |   );
```

apps/dashboard/src/actions/create-folder-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { createFolder } from "@midday/supabase/storage";
5 | import { revalidatePath } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { createFolderSchema } from "./schema";
8 |
9 | export const createFolderAction = authActionClient
10 |   .schema(createFolderSchema)
11 |   .metadata({
12 |     name: "create-folder",
13 |     track: {
14 |       event: LogEvents.CreateFolder.name,
15 |       channel: LogEvents.CreateFolder.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: value, ctx: { user, supabase } }) => {
19 |     const data = await createFolder(supabase, {
20 |       bucket: "vault",
21 |       path: [user.team_id, value.path],
22 |       name: value.name,
23 |     });
24 |
25 |     revalidatePath("/vault");
26 |
27 |     return data;
28 |   });
```

apps/dashboard/src/actions/create-tag-action.tsx
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { authActionClient } from "./safe-action";
5 | import { createTagSchema } from "./schema";
6 |
7 | export const createTagAction = authActionClient
8 |   .schema(createTagSchema)
9 |   .metadata({
10 |     name: "create-tag",
11 |     track: {
12 |       event: LogEvents.CreateTag.name,
13 |       channel: LogEvents.CreateTag.channel,
14 |     },
15 |   })
16 |   .action(async ({ parsedInput: { name }, ctx: { user, supabase } }) => {
17 |     const { data } = await supabase
18 |       .from("tags")
19 |       .insert({
20 |         name,
21 |         team_id: user.team_id!,
22 |       })
23 |       .select("id, name")
24 |       .single();
25 |
26 |     return data;
27 |   });
```

apps/dashboard/src/actions/create-team-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { getCurrency } from "@midday/location";
5 | import { createTeam, updateUser } from "@midday/supabase/mutations";
6 | import { revalidateTag } from "next/cache";
7 | import { redirect } from "next/navigation";
8 | import { authActionClient } from "./safe-action";
9 | import { createTeamSchema } from "./schema";
10 |
11 | export const createTeamAction = authActionClient
12 |   .schema(createTeamSchema)
13 |   .metadata({
14 |     name: "create-team",
15 |     track: {
16 |       event: LogEvents.CreateTeam.name,
17 |       channel: LogEvents.CreateTeam.channel,
18 |     },
19 |   })
20 |   .action(async ({ parsedInput: { name, redirectTo }, ctx: { supabase } }) => {
21 |     const currency = getCurrency();
22 |     const team_id = await createTeam(supabase, { name, currency });
23 |     const user = await updateUser(supabase, { team_id });
24 |
25 |     if (!user?.data) {
26 |       return;
27 |     }
28 |
29 |     revalidateTag(`user_${user.data.id}`);
30 |     revalidateTag(`teams_${user.data.id}`);
31 |
32 |     if (redirectTo) {
33 |       redirect(redirectTo);
34 |     }
35 |
36 |     return team_id;
37 |   });
```

apps/dashboard/src/actions/create-tracker-entries-action.ts
```
1 | "use server";
2 |
3 | import { Cookies } from "@/utils/constants";
4 | import { UTCDate } from "@date-fns/utc";
5 | import { revalidateTag } from "next/cache";
6 | import { cookies } from "next/headers";
7 | import { z } from "zod";
8 | import { authActionClient } from "./safe-action";
9 |
10 | export const createTrackerEntriesAction = authActionClient
11 |   .schema(
12 |     z.object({
13 |       id: z.string().optional(),
14 |       start: z.string(),
15 |       stop: z.string(),
16 |       dates: z.array(z.string()),
17 |       assigned_id: z.string(),
18 |       project_id: z.string(),
19 |       description: z.string().optional(),
20 |       duration: z.number(),
21 |     }),
22 |   )
23 |   .metadata({
24 |     name: "create-tracker-entries",
25 |   })
26 |   .action(
27 |     async ({ parsedInput: { dates, ...params }, ctx: { supabase, user } }) => {
28 |       cookies().set(Cookies.LastProject, params.project_id);
29 |
30 |       const entries = dates.map((date) => ({
31 |         ...params,
32 |         team_id: user.team_id,
33 |         date: new UTCDate(date).toISOString(),
34 |         start: new UTCDate(params.start).toISOString(),
35 |         stop: new UTCDate(params.stop).toISOString(),
36 |       }));
37 |
38 |       const { data, error } = await supabase
39 |         .from("tracker_entries")
40 |         .upsert(entries, {
41 |           ignoreDuplicates: false,
42 |         })
43 |         .select(
44 |           "*, assigned:assigned_id(id, full_name, avatar_url), project:project_id(id, name, rate, currency)",
45 |         );
46 |
47 |       if (error) {
48 |         throw error;
49 |       }
50 |
51 |       revalidateTag(`tracker_entries_${user.team_id}`);
52 |       revalidateTag(`tracker_projects_${user.team_id}`);
53 |
54 |       return data;
55 |     },
56 |   );
```

apps/dashboard/src/actions/create-transaction-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { createAttachments } from "@midday/supabase/mutations";
5 | import { nanoid } from "nanoid";
6 | import { revalidateTag } from "next/cache";
7 | import { authActionClient } from "./safe-action";
8 | import { createTransactionSchema } from "./schema";
9 |
10 | export const createTransactionAction = authActionClient
11 |   .schema(createTransactionSchema)
12 |   .metadata({
13 |     name: "create-transaction",
14 |     track: {
15 |       event: LogEvents.CreateTransaction.name,
16 |       channel: LogEvents.CreateTransaction.channel,
17 |     },
18 |   })
19 |   .action(
20 |     async ({
21 |       parsedInput: { attachments, ...transaction },
22 |       ctx: { user, supabase },
23 |     }) => {
24 |       const teamId = user.team_id;
25 |
26 |       const { data: accountData } = await supabase
27 |         .from("bank_accounts")
28 |         .select("id, currency")
29 |         .eq("id", transaction.bank_account_id)
30 |         .is("currency", null)
31 |         .single();
32 |
33 |       // If the account currency is not set, set it to the transaction currency
34 |       // Usually this is the case for new accounts
35 |       if (!accountData?.currency) {
36 |         await supabase
37 |           .from("bank_accounts")
38 |           .update({
39 |             currency: transaction.currency,
40 |             base_currency: transaction.currency,
41 |           })
42 |           .eq("id", transaction.bank_account_id);
43 |       }
44 |
45 |       const { data } = await supabase
46 |         .from("transactions")
47 |         .insert({
48 |           ...transaction,
49 |           team_id: teamId,
50 |           method: "other",
51 |           manual: true,
52 |           notified: true,
53 |           internal_id: `${teamId}_${nanoid()}`,
54 |         })
55 |         .select("*")
56 |         .single();
57 |
58 |       if (attachments && data) {
59 |         await createAttachments(
60 |           supabase,
61 |           attachments.map((attachment) => ({
62 |             ...attachment,
63 |             transaction_id: data.id,
64 |           })),
65 |         );
66 |       }
67 |
68 |       revalidateTag(`transactions_${teamId}`);
69 |       revalidateTag(`spending_${teamId}`);
70 |       revalidateTag(`metrics_${teamId}`);
71 |       revalidateTag(`insights_${teamId}`);
72 |
73 |       return data;
74 |     },
75 |   );
```

apps/dashboard/src/actions/create-transaction-tag-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { createTransactionTagSchema } from "./schema";
7 |
8 | export const createTransactionTagAction = authActionClient
9 |   .schema(createTransactionTagSchema)
10 |   .metadata({
11 |     name: "create-transaction-tag",
12 |     track: {
13 |       event: LogEvents.CreateTransactionTag.name,
14 |       channel: LogEvents.CreateTransactionTag.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({
19 |       parsedInput: { tagId, transactionId },
20 |       ctx: { user, supabase },
21 |     }) => {
22 |       const { data } = await supabase.from("transaction_tags").insert({
23 |         tag_id: tagId,
24 |         transaction_id: transactionId,
25 |         team_id: user.team_id!,
26 |       });
27 |
28 |       revalidateTag(`transactions_${user.team_id}`);
29 |
30 |       return data;
31 |     },
32 |   );
```

apps/dashboard/src/actions/create-transactions-action.ts
```
1 | "use server";
2 |
3 | import { processPromisesBatch } from "@/utils/process";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { createTransactionsSchema } from "./schema";
7 |
8 | const BATCH_LIMIT = 300;
9 |
10 | export const createTransactionsAction = authActionClient
11 |   .schema(createTransactionsSchema)
12 |   .metadata({
13 |     name: "create-transactions",
14 |   })
15 |   .action(
16 |     async ({
17 |       parsedInput: { currency, transactions, accountId },
18 |       ctx: { user, supabase },
19 |     }) => {
20 |       const teamId = user.team_id;
21 |
22 |       // Update account with currency if not set
23 |       await supabase
24 |         .from("bank_accounts")
25 |         .update({
26 |           currency,
27 |         })
28 |         .eq("id", accountId)
29 |         .is("currency", null);
30 |
31 |       // NOTE: We will get all the transactions at once for each account so
32 |       // we need to guard against massive payloads
33 |       await processPromisesBatch(transactions, BATCH_LIMIT, async (batch) => {
34 |         await supabase.from("transactions").upsert(batch, {
35 |           onConflict: "internal_id",
36 |           ignoreDuplicates: true,
37 |         });
38 |       });
39 |
40 |       revalidateTag(`bank_connections_${teamId}`);
41 |       revalidateTag(`transactions_${teamId}`);
42 |       revalidateTag(`spending_${teamId}`);
43 |       revalidateTag(`metrics_${teamId}`);
44 |       revalidateTag(`bank_accounts_${teamId}`);
45 |       revalidateTag(`insights_${teamId}`);
46 |
47 |       return;
48 |     },
49 |   );
```

apps/dashboard/src/actions/decline-invite-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidatePath as revalidatePathFunc } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { declineInviteSchema } from "./schema";
7 |
8 | export const declineInviteAction = authActionClient
9 |   .schema(declineInviteSchema)
10 |   .metadata({
11 |     name: "decline-invite",
12 |     track: {
13 |       event: LogEvents.DeclineInvite.name,
14 |       channel: LogEvents.DeclineInvite.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({ parsedInput: { id, revalidatePath }, ctx: { supabase } }) => {
19 |       const data = await supabase
20 |         .from("user_invites")
21 |         .delete()
22 |         .eq("id", id)
23 |         .select();
24 |
25 |       if (revalidatePath) {
26 |         revalidatePathFunc(revalidatePath);
27 |       }
28 |
29 |       return data;
30 |     },
31 |   );
```

apps/dashboard/src/actions/delete-attachment-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { deleteAttachment } from "@midday/supabase/mutations";
5 | import { revalidateTag } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { deleteAttachmentSchema } from "./schema";
8 |
9 | export const deleteAttachmentAction = authActionClient
10 |   .schema(deleteAttachmentSchema)
11 |   .metadata({
12 |     name: "delete-attachment",
13 |     track: {
14 |       event: LogEvents.DeleteAttachment.name,
15 |       channel: LogEvents.DeleteAttachment.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: files, ctx: { user, supabase } }) => {
19 |     const data = await deleteAttachment(supabase, files);
20 |
21 |     if (!data?.transaction_id) {
22 |       return null;
23 |     }
24 |
25 |     revalidateTag(`transactions_${user.team_id}`);
26 |
27 |     // Find inbox by attachment_id and delete attachment_id
28 |     await supabase
29 |       .from("inbox")
30 |       .update({
31 |         transaction_id: null,
32 |       })
33 |       .eq("transaction_id", data.transaction_id);
34 |
35 |     return data;
36 |   });
```

apps/dashboard/src/actions/delete-bank-account-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { deleteBankAccount } from "@midday/supabase/mutations";
5 | import { revalidateTag } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { deleteBankAccountSchema } from "./schema";
8 |
9 | export const deleteBankAccountAction = authActionClient
10 |   .schema(deleteBankAccountSchema)
11 |   .metadata({
12 |     name: "delete-bank-account",
13 |     track: {
14 |       event: LogEvents.DeleteBank.name,
15 |       channel: LogEvents.DeleteBank.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: { id }, ctx: { user, supabase } }) => {
19 |     await deleteBankAccount(supabase, id);
20 |
21 |     revalidateTag(`bank_accounts_${user.team_id}`);
22 |     revalidateTag(`bank_accounts_currencies_${user.team_id}`);
23 |     revalidateTag(`bank_connections_${user.team_id}`);
24 |     revalidateTag(`transactions_${user.team_id}`);
25 |     revalidateTag(`metrics_${user.team_id}`);
26 |     revalidateTag(`current_burn_rate_${user.team_id}`);
27 |     revalidateTag(`burn_rate_${user.team_id}`);
28 |     revalidateTag(`spending_${user.team_id}`);
29 |     revalidateTag(`insights_${user.team_id}`);
30 |     revalidateTag(`expenses_${user.team_id}`);
31 |   });
```

apps/dashboard/src/actions/delete-categories-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import {
5 |   revalidatePath as revalidatePathFunc,
6 |   revalidateTag,
7 | } from "next/cache";
8 | import { authActionClient } from "./safe-action";
9 | import { deleteCategoriesSchema } from "./schema";
10 |
11 | export const deleteCategoriesAction = authActionClient
12 |   .schema(deleteCategoriesSchema)
13 |   .metadata({
14 |     name: "delete-categories",
15 |     track: {
16 |       event: LogEvents.CategoryDelete.name,
17 |       channel: LogEvents.CategoryDelete.channel,
18 |     },
19 |   })
20 |   .action(
21 |     async ({
22 |       parsedInput: { ids, revalidatePath },
23 |       ctx: { user, supabase },
24 |     }) => {
25 |       const response = await supabase
26 |         .from("transaction_categories")
27 |         .delete()
28 |         .in("id", ids)
29 |         .eq("system", false)
30 |         .select();
31 |
32 |       revalidatePathFunc(revalidatePath);
33 |       revalidateTag(`transactions_${user.team_id}`);
34 |       revalidateTag(`spending_${user.team_id}`);
35 |
36 |       return response;
37 |     },
38 |   );
```

apps/dashboard/src/actions/delete-customer-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { z } from "zod";
6 | import { authActionClient } from "./safe-action";
7 |
8 | export const deleteCustomerAction = authActionClient
9 |   .schema(z.object({ id: z.string().uuid() }))
10 |   .metadata({
11 |     name: "delete-customer",
12 |     track: {
13 |       event: LogEvents.DeleteCustomer.name,
14 |       channel: LogEvents.DeleteCustomer.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: input, ctx: { user, supabase } }) => {
18 |     const { data } = await supabase
19 |       .from("customers")
20 |       .delete()
21 |       .eq("id", input.id)
22 |       .select("id");
23 |
24 |     revalidateTag(`customers_${user.team_id}`);
25 |     revalidateTag(`invoices_${user.team_id}`);
26 |
27 |     return data;
28 |   });
```

apps/dashboard/src/actions/delete-file-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { remove } from "@midday/supabase/storage";
5 | import { revalidatePath } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { deleteFileSchema } from "./schema";
8 |
9 | export const deleteFileAction = authActionClient
10 |   .schema(deleteFileSchema)
11 |   .metadata({
12 |     name: "delete-file",
13 |     track: {
14 |       event: LogEvents.DeleteFile.name,
15 |       channel: LogEvents.DeleteFile.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: { path, id }, ctx: { user, supabase } }) => {
19 |     await remove(supabase, {
20 |       bucket: "vault",
21 |       path: [user.team_id, ...path],
22 |     });
23 |
24 |     revalidatePath("/vault");
25 |
26 |     return id;
27 |   });
```

apps/dashboard/src/actions/delete-folder-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { deleteFolder } from "@midday/supabase/storage";
5 | import { revalidatePath } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { deleteFolderSchema } from "./schema";
8 |
9 | export const deleteFolderAction = authActionClient
10 |   .schema(deleteFolderSchema)
11 |   .metadata({
12 |     name: "delete-folder",
13 |     track: {
14 |       event: LogEvents.DeleteFolder.name,
15 |       channel: LogEvents.DeleteFolder.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: { path }, ctx: { user, supabase } }) => {
19 |     await deleteFolder(supabase, {
20 |       bucket: "vault",
21 |       path: [user.team_id, ...path],
22 |     });
23 |
24 |     revalidatePath("/vault");
25 |
26 |     return;
27 |   });
```

apps/dashboard/src/actions/delete-invite-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidatePath as revalidatePathFunc } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { deleteInviteSchema } from "./schema";
7 |
8 | export const deleteInviteAction = authActionClient
9 |   .schema(deleteInviteSchema)
10 |   .metadata({
11 |     name: "delete-invite",
12 |     track: {
13 |       event: LogEvents.DeleteInvite.name,
14 |       channel: LogEvents.DeleteInvite.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({ parsedInput: { id, revalidatePath }, ctx: { supabase } }) => {
19 |       await supabase.from("user_invites").delete().eq("id", id);
20 |
21 |       if (revalidatePath) {
22 |         revalidatePathFunc(revalidatePath);
23 |       }
24 |
25 |       return id;
26 |     },
27 |   );
```

apps/dashboard/src/actions/delete-tag-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { deleteTagSchema } from "./schema";
7 |
8 | export const deleteTagAction = authActionClient
9 |   .schema(deleteTagSchema)
10 |   .metadata({
11 |     name: "delete-tag",
12 |     track: {
13 |       event: LogEvents.DeleteTag.name,
14 |       channel: LogEvents.DeleteTag.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: { id }, ctx: { supabase, user } }) => {
18 |     const { data } = await supabase
19 |       .from("tags")
20 |       .delete()
21 |       .eq("id", id)
22 |       .select("id, name")
23 |       .single();
24 |
25 |     revalidateTag(`tracker_projects_${user.team_id}`);
26 |     revalidateTag(`transactions_${user.team_id}`);
27 |
28 |     return data;
29 |   });
```

apps/dashboard/src/actions/delete-team-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { deleteTeam } from "jobs/tasks/team/delete";
5 | import { revalidateTag } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { deleteTeamSchema } from "./schema";
8 |
9 | export const deleteTeamAction = authActionClient
10 |   .schema(deleteTeamSchema)
11 |   .metadata({
12 |     name: "delete-team",
13 |     track: {
14 |       event: LogEvents.DeleteTeam.name,
15 |       channel: LogEvents.DeleteTeam.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: { teamId }, ctx: { user, supabase } }) => {
19 |     const { data: teamData } = await supabase
20 |       .from("teams")
21 |       .delete()
22 |       .eq("id", teamId)
23 |       .select("id, bank_connections(access_token, provider, reference_id)")
24 |       .single();
25 |
26 |     await deleteTeam.trigger({
27 |       teamId,
28 |       connections: teamData?.bank_connections ?? [],
29 |     });
30 |
31 |     revalidateTag(`user_${user.id}`);
32 |     revalidateTag(`teams_${user.id}`);
33 |
34 |     return teamId;
35 |   });
```

apps/dashboard/src/actions/delete-team-member-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { deleteTeamMember } from "@midday/supabase/mutations";
5 | import { revalidatePath as revalidatePathFunc } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { deleteTeamMemberSchema } from "./schema";
8 |
9 | export const deleteTeamMemberAction = authActionClient
10 |   .schema(deleteTeamMemberSchema)
11 |   .metadata({
12 |     name: "delete-team-member",
13 |     track: {
14 |       event: LogEvents.DeleteTeamMember.name,
15 |       channel: LogEvents.DeleteTeamMember.channel,
16 |     },
17 |   })
18 |   .action(
19 |     async ({
20 |       parsedInput: { revalidatePath, teamId, userId },
21 |       ctx: { supabase },
22 |     }) => {
23 |       const { data } = await deleteTeamMember(supabase, { teamId, userId });
24 |
25 |       if (revalidatePath) {
26 |         revalidatePathFunc(revalidatePath);
27 |       }
28 |
29 |       return data;
30 |     },
31 |   );
```

apps/dashboard/src/actions/delete-tracker-entry.ts
```
1 | "use server";
2 |
3 | import { revalidateTag } from "next/cache";
4 | import { z } from "zod";
5 | import { authActionClient } from "./safe-action";
6 |
7 | export const deleteTrackerEntryAction = authActionClient
8 |   .schema(
9 |     z.object({
10 |       id: z.string(),
11 |     }),
12 |   )
13 |   .metadata({
14 |     name: "delete-tracker-entry",
15 |   })
16 |   .action(async ({ parsedInput: { id }, ctx: { supabase, user } }) => {
17 |     const { data, error } = await supabase
18 |       .from("tracker_entries")
19 |       .delete()
20 |       .eq("id", id)
21 |       .select();
22 |
23 |     if (error) {
24 |       throw error;
25 |     }
26 |
27 |     revalidateTag(`tracker_entries_${user.team_id}`);
28 |
29 |     return data;
30 |   });
```

apps/dashboard/src/actions/delete-transaction-tag-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { deleteTransactionTagSchema } from "./schema";
7 |
8 | export const deleteTransactionTagAction = authActionClient
9 |   .schema(deleteTransactionTagSchema)
10 |   .metadata({
11 |     name: "delete-transaction-tag",
12 |     track: {
13 |       event: LogEvents.DeleteTransactionTag.name,
14 |       channel: LogEvents.DeleteTransactionTag.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({
19 |       parsedInput: { tagId, transactionId },
20 |       ctx: { user, supabase },
21 |     }) => {
22 |       const { data } = await supabase
23 |         .from("transaction_tags")
24 |         .delete()
25 |         .eq("transaction_id", transactionId)
26 |         .eq("tag_id", tagId);
27 |
28 |       revalidateTag(`transactions_${user.team_id}`);
29 |
30 |       return data;
31 |     },
32 |   );
```

apps/dashboard/src/actions/delete-transactions-action.ts
```
1 | "use server";
2 |
3 | import { revalidateTag } from "next/cache";
4 | import { authActionClient } from "./safe-action";
5 | import { deleteTransactionSchema } from "./schema";
6 |
7 | export const deleteTransactionsAction = authActionClient
8 |   .schema(deleteTransactionSchema)
9 |   .metadata({
10 |     name: "delete-transactions",
11 |   })
12 |   .action(async ({ parsedInput: { ids }, ctx: { user, supabase } }) => {
13 |     await supabase
14 |       .from("transactions")
15 |       .delete()
16 |       .in("id", ids)
17 |       .is("manual", true);
18 |
19 |     revalidateTag(`transactions_${user.team_id}`);
20 |     revalidateTag(`spending_${user.team_id}`);
21 |     revalidateTag(`metrics_${user.team_id}`);
22 |     revalidateTag(`current_burn_rate_${user.team_id}`);
23 |     revalidateTag(`burn_rate_${user.team_id}`);
24 |     revalidateTag(`expenses_${user.team_id}`);
25 |   });
```

apps/dashboard/src/actions/delete-user-action.ts
```
1 | "use server";
2 |
3 | import { resend } from "@/utils/resend";
4 | import { LogEvents } from "@midday/events/events";
5 | import { setupAnalytics } from "@midday/events/server";
6 | import { getUser } from "@midday/supabase/cached-queries";
7 | import { deleteUser } from "@midday/supabase/mutations";
8 | import { createClient } from "@midday/supabase/server";
9 | import { redirect } from "next/navigation";
10 |
11 | export const deleteUserAction = async () => {
12 |   const supabase = createClient();
13 |   const user = await getUser();
14 |
15 |   const { data: membersData } = await supabase
16 |     .from("users_on_team")
17 |     .select("team_id, team:team_id(id, name, members:users_on_team(id))")
18 |     .eq("user_id", user?.data?.id);
19 |
20 |   const teamIds = membersData
21 |     ?.filter(({ team }) => team?.members.length === 1)
22 |     .map(({ team_id }) => team_id);
23 |
24 |   if (teamIds?.length) {
25 |     // Delete all teams with only one member
26 |     await supabase.from("teams").delete().in("id", teamIds);
27 |   }
28 |
29 |   const userId = await deleteUser(supabase);
30 |
31 |   await resend.contacts.remove({
32 |     email: user.data?.email!,
33 |     audienceId: process.env.RESEND_AUDIENCE_ID!,
34 |   });
35 |
36 |   const analytics = await setupAnalytics({
37 |     userId,
38 |   });
39 |
40 |   analytics.track({
41 |     event: LogEvents.DeleteUser.name,
42 |     user_id: userId,
43 |     channel: LogEvents.DeleteUser.channel,
44 |   });
45 |
46 |   redirect("/");
47 | };
```

apps/dashboard/src/actions/disconnect-app-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidatePath } from "next/cache";
5 | import { z } from "zod";
6 | import { authActionClient } from "./safe-action";
7 |
8 | export const disconnectAppAction = authActionClient
9 |   .schema(
10 |     z.object({
11 |       appId: z.string(),
12 |     }),
13 |   )
14 |   .metadata({
15 |     name: "disconnect-app",
16 |     track: {
17 |       event: LogEvents.DisconnectApp.name,
18 |       channel: LogEvents.DisconnectApp.channel,
19 |     },
20 |   })
21 |   .action(async ({ parsedInput: { appId }, ctx: { supabase, user } }) => {
22 |     const { data } = await supabase
23 |       .from("apps")
24 |       .delete()
25 |       .eq("app_id", appId)
26 |       .eq("team_id", user.team_id)
27 |       .select();
28 |
29 |     revalidatePath("/apps");
30 |
31 |     return data;
32 |   });
```

apps/dashboard/src/actions/export-transactions-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { exportTransactions } from "jobs/tasks/transactions/export";
5 | import { authActionClient } from "./safe-action";
6 | import { exportTransactionsSchema } from "./schema";
7 |
8 | export const exportTransactionsAction = authActionClient
9 |   .schema(exportTransactionsSchema)
10 |   .metadata({
11 |     name: "export-transactions",
12 |     track: {
13 |       event: LogEvents.ExportTransactions.name,
14 |       channel: LogEvents.ExportTransactions.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: transactionIds, ctx: { user } }) => {
18 |     if (!user.team_id || !user.locale) {
19 |       throw new Error("User not found");
20 |     }
21 |
22 |     const event = await exportTransactions.trigger({
23 |       teamId: user.team_id,
24 |       locale: user.locale,
25 |       transactionIds,
26 |     });
27 |
28 |     return event;
29 |   });
```

apps/dashboard/src/actions/hide-connect-flow-action.ts
```
1 | "use server";
2 |
3 | import { Cookies } from "@/utils/constants";
4 | import { addYears } from "date-fns";
5 | import { cookies } from "next/headers";
6 | import { authActionClient } from "./safe-action";
7 |
8 | export const hideConnectFlowAction = authActionClient
9 |   .metadata({
10 |     name: "hide-connect-flow",
11 |   })
12 |   .action(async () => {
13 |     cookies().set({
14 |       name: Cookies.HideConnectFlow,
15 |       value: "true",
16 |       expires: addYears(new Date(), 1),
17 |     });
18 |   });
```

apps/dashboard/src/actions/inbox-upload-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { inboxUpload } from "jobs/tasks/inbox/upload";
5 | import { authActionClient } from "./safe-action";
6 | import { inboxUploadSchema } from "./schema";
7 |
8 | export const inboxUploadAction = authActionClient
9 |   .schema(inboxUploadSchema)
10 |   .metadata({
11 |     name: "inbox-upload",
12 |     track: {
13 |       event: LogEvents.InboxUpload.name,
14 |       channel: LogEvents.InboxUpload.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: uploads, ctx: { user } }) => {
18 |     if (!user.team_id) {
19 |       throw new Error("No team id");
20 |     }
21 |
22 |     const results = await inboxUpload.batchTrigger(
23 |       uploads.map((upload, idx) => ({
24 |         payload: {
25 |           ...upload,
26 |           id: `upload-${idx}`,
27 |           teamId: user.team_id!,
28 |         },
29 |       })),
30 |     );
31 |
32 |     return results;
33 |   });
```

apps/dashboard/src/actions/invalidate-cache-action.ts
```
1 | "use server";
2 |
3 | import { revalidateTag } from "next/cache";
4 |
5 | export async function invalidateCacheAction(tags: string[]) {
6 |   return Promise.all(tags.map(async (tag) => revalidateTag(tag)));
7 | }
```

apps/dashboard/src/actions/invite-team-members-action.ts
```
1 | "use server";
2 |
3 | import { resend } from "@/utils/resend";
4 | import InviteEmail from "@midday/email/emails/invite";
5 | import { getI18n } from "@midday/email/locales";
6 | import { LogEvents } from "@midday/events/events";
7 | import { render } from "@react-email/render";
8 | import { nanoid } from "nanoid";
9 | import { revalidatePath as revalidatePathFunc } from "next/cache";
10 | import { headers } from "next/headers";
11 | import { redirect } from "next/navigation";
12 | import { authActionClient } from "./safe-action";
13 | import { inviteTeamMembersSchema } from "./schema";
14 |
15 | export const inviteTeamMembersAction = authActionClient
16 |   .schema(inviteTeamMembersSchema)
17 |   .metadata({
18 |     name: "invite-team-members",
19 |     track: {
20 |       event: LogEvents.InviteTeamMembers.name,
21 |       channel: LogEvents.InviteTeamMembers.channel,
22 |     },
23 |   })
24 |   .action(
25 |     async ({
26 |       parsedInput: { invites, redirectTo, revalidatePath },
27 |       ctx: { user, supabase },
28 |     }) => {
29 |       const { t } = getI18n({ locale: user.locale });
30 |
31 |       const location = headers().get("x-vercel-ip-city") ?? "Unknown";
32 |       const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
33 |
34 |       const data = invites?.map((invite) => ({
35 |         ...invite,
36 |         team_id: user.team_id,
37 |         invited_by: user.id,
38 |       }));
39 |
40 |       const { data: invtesData } = await supabase
41 |         .from("user_invites")
42 |         .upsert(data, {
43 |           onConflict: "email, team_id",
44 |           ignoreDuplicates: false,
45 |         })
46 |         .select("email, code, user:invited_by(*), team:team_id(*)");
47 |
48 |       const emails = invtesData?.map(async (invites) => ({
49 |         from: "Midday <middaybot@midday.ai>",
50 |         to: [invites.email],
51 |         subject: t("invite.subject", {
52 |           invitedByName: invites.user.full_name,
53 |           teamName: invites.team.name,
54 |         }),
55 |         headers: {
56 |           "X-Entity-Ref-ID": nanoid(),
57 |         },
58 |         html: await render(
59 |           InviteEmail({
60 |             invitedByEmail: invites.user.email,
61 |             invitedByName: invites.user.full_name,
62 |             email: invites.email,
63 |             teamName: invites.team.name,
64 |             inviteCode: invites.code,
65 |             ip,
66 |             location,
67 |             locale: user.locale,
68 |           }),
69 |         ),
70 |       }));
71 |
72 |       const htmlEmails = await Promise.all(emails);
73 |
74 |       await resend.batch.send(htmlEmails);
75 |
76 |       if (revalidatePath) {
77 |         revalidatePathFunc(revalidatePath);
78 |       }
79 |
80 |       if (redirectTo) {
81 |         redirect(redirectTo);
82 |       }
83 |     },
84 |   );
```

apps/dashboard/src/actions/leave-team-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { getTeamMembers } from "@midday/supabase/cached-queries";
5 | import { leaveTeam } from "@midday/supabase/mutations";
6 | import {
7 |   revalidatePath as revalidatePathFunc,
8 |   revalidateTag,
9 | } from "next/cache";
10 | import { redirect } from "next/navigation";
11 | import { authActionClient } from "./safe-action";
12 | import { leaveTeamSchema } from "./schema";
13 |
14 | export const leaveTeamAction = authActionClient
15 |   .schema(leaveTeamSchema)
16 |   .metadata({
17 |     name: "leave-team",
18 |     track: {
19 |       event: LogEvents.LeaveTeam.name,
20 |       channel: LogEvents.LeaveTeam.channel,
21 |     },
22 |   })
23 |   .action(
24 |     async ({
25 |       parsedInput: { teamId, role, redirectTo, revalidatePath },
26 |       ctx: { user, supabase },
27 |     }) => {
28 |       const { data: teamMembersData } = await getTeamMembers();
29 |
30 |       const totalOwners = teamMembersData.filter(
31 |         (member) => member.role === "owner",
32 |       ).length;
33 |
34 |       if (role === "owner" && totalOwners === 1) {
35 |         throw Error("Action not allowed");
36 |       }
37 |
38 |       const { data, error } = await leaveTeam(supabase, {
39 |         teamId,
40 |         userId: user.id,
41 |       });
42 |
43 |       revalidateTag(`user_${user.id}`);
44 |       revalidateTag(`teams_${user.id}`);
45 |
46 |       if (revalidatePath) {
47 |         revalidatePathFunc(revalidatePath);
48 |       }
49 |
50 |       if (redirectTo) {
51 |         redirect(redirectTo);
52 |       }
53 |
54 |       return data;
55 |     },
56 |   );
```

apps/dashboard/src/actions/mfa-verify-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidatePath } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { mfaVerifySchema } from "./schema";
7 |
8 | export const mfaVerifyAction = authActionClient
9 |   .schema(mfaVerifySchema)
10 |   .metadata({
11 |     name: "mfa-verify",
12 |     track: {
13 |       event: LogEvents.MfaVerify.name,
14 |       channel: LogEvents.MfaVerify.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({
19 |       parsedInput: { factorId, challengeId, code },
20 |       ctx: { supabase },
21 |     }) => {
22 |       const { data } = await supabase.auth.mfa.verify({
23 |         factorId,
24 |         challengeId,
25 |         code,
26 |       });
27 |
28 |       revalidatePath("/account/security");
29 |
30 |       return data;
31 |     },
32 |   );
```

apps/dashboard/src/actions/safe-action.ts
```
1 | import { logger } from "@/utils/logger";
2 | import { setupAnalytics } from "@midday/events/server";
3 | import { client as RedisClient } from "@midday/kv";
4 | import { getUser } from "@midday/supabase/cached-queries";
5 | import { createClient } from "@midday/supabase/server";
6 | import * as Sentry from "@sentry/nextjs";
7 | import { Ratelimit } from "@upstash/ratelimit";
8 | import {
9 |   DEFAULT_SERVER_ERROR_MESSAGE,
10 |   createSafeActionClient,
11 | } from "next-safe-action";
12 | import { headers } from "next/headers";
13 | import { z } from "zod";
14 |
15 | const ratelimit = new Ratelimit({
16 |   limiter: Ratelimit.fixedWindow(10, "10s"),
17 |   redis: RedisClient,
18 | });
19 |
20 | export const actionClient = createSafeActionClient({
21 |   handleReturnedServerError(e) {
22 |     if (e instanceof Error) {
23 |       return e.message;
24 |     }
25 |
26 |     return DEFAULT_SERVER_ERROR_MESSAGE;
27 |   },
28 | });
29 |
30 | export const actionClientWithMeta = createSafeActionClient({
31 |   handleReturnedServerError(e) {
32 |     if (e instanceof Error) {
33 |       return e.message;
34 |     }
35 |
36 |     return DEFAULT_SERVER_ERROR_MESSAGE;
37 |   },
38 |   defineMetadataSchema() {
39 |     return z.object({
40 |       name: z.string(),
41 |       track: z
42 |         .object({
43 |           event: z.string(),
44 |           channel: z.string(),
45 |         })
46 |         .optional(),
47 |     });
48 |   },
49 | });
50 |
51 | export const authActionClient = actionClientWithMeta
52 |   .use(async ({ next, clientInput, metadata }) => {
53 |     const result = await next({ ctx: null });
54 |
55 |     if (process.env.NODE_ENV === "development") {
56 |       logger("Input ->", clientInput);
57 |       logger("Result ->", result.data);
58 |       logger("Metadata ->", metadata);
59 |
60 |       return result;
61 |     }
62 |
63 |     return result;
64 |   })
65 |   .use(async ({ next, metadata }) => {
66 |     const ip = headers().get("x-forwarded-for");
67 |
68 |     const { success, remaining } = await ratelimit.limit(
69 |       `${ip}-${metadata.name}`,
70 |     );
71 |
72 |     if (!success) {
73 |       throw new Error("Too many requests");
74 |     }
75 |
76 |     return next({
77 |       ctx: {
78 |         ratelimit: {
79 |           remaining,
80 |         },
81 |       },
82 |     });
83 |   })
84 |   .use(async ({ next, metadata }) => {
85 |     const user = await getUser();
86 |     const supabase = createClient();
87 |
88 |     if (!user?.data) {
89 |       throw new Error("Unauthorized");
90 |     }
91 |
92 |     const analytics = await setupAnalytics({
93 |       userId: user.data.id,
94 |       fullName: user.data.full_name,
95 |     });
96 |
97 |     if (metadata?.track) {
98 |       analytics.track(metadata.track);
99 |     }
100 |
101 |     return Sentry.withServerActionInstrumentation(metadata.name, async () => {
102 |       return next({
103 |         ctx: {
104 |           supabase,
105 |           analytics,
106 |           user: user.data,
107 |         },
108 |       });
109 |     });
110 |   });
```

apps/dashboard/src/actions/schema.ts
```
1 | import { isValid } from "date-fns";
2 | import { z } from "zod";
3 |
4 | export const updateUserSchema = z.object({
5 |   full_name: z.string().min(2).max(32).optional(),
6 |   email: z.string().email().optional(),
7 |   avatar_url: z.string().url().optional(),
8 |   locale: z.string().optional(),
9 |   week_starts_on_monday: z.boolean().optional(),
10 |   timezone: z.string().optional(),
11 |   time_format: z.number().optional(),
12 |   date_format: z.enum(["dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"]).optional(),
13 |   revalidatePath: z.string().optional(),
14 | });
15 |
16 | export const createTagSchema = z.object({ name: z.string() });
17 | export const createTransactionTagSchema = z.object({
18 |   tagId: z.string(),
19 |   transactionId: z.string(),
20 | });
21 |
22 | export const deleteTagSchema = z.object({
23 |   id: z.string(),
24 | });
25 |
26 | export const updateTagSchema = z.object({
27 |   id: z.string(),
28 |   name: z.string(),
29 | });
30 |
31 | export const deleteTransactionTagSchema = z.object({
32 |   tagId: z.string(),
33 |   transactionId: z.string(),
34 | });
35 |
36 | export const deleteProjectTagSchema = z.object({
37 |   tagId: z.string(),
38 |   projectId: z.string(),
39 | });
40 |
41 | export const createProjectTagSchema = z.object({
42 |   tagId: z.string(),
43 |   projectId: z.string(),
44 | });
45 |
46 | export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
47 |
48 | export const trackingConsentSchema = z.boolean();
49 |
50 | export const sendSupportSchema = z.object({
51 |   subject: z.string(),
52 |   priority: z.string(),
53 |   type: z.string(),
54 |   message: z.string(),
55 |   url: z.string().optional(),
56 | });
57 |
58 | export const updateTeamSchema = z.object({
59 |   name: z.string().min(2).max(32).optional(),
60 |   email: z.string().email().optional(),
61 |   inbox_email: z.string().email().optional().nullable(),
62 |   inbox_forwarding: z.boolean().optional().nullable(),
63 |   logo_url: z.string().url().optional(),
64 |   base_currency: z.string().optional(),
65 |   document_classification: z.boolean().optional(),
66 |   revalidatePath: z.string().optional(),
67 | });
68 |
69 | export type UpdateTeamFormValues = z.infer<typeof updateTeamSchema>;
70 |
71 | export const subscribeSchema = z.object({
72 |   email: z.string().email(),
73 | });
74 |
75 | export const deleteBankAccountSchema = z.object({
76 |   id: z.string().uuid(),
77 | });
78 |
79 | export const updateBankAccountSchema = z.object({
80 |   id: z.string().uuid(),
81 |   name: z.string().optional(),
82 |   enabled: z.boolean().optional(),
83 |   balance: z.number().optional(),
84 |   type: z
85 |     .enum(["depository", "credit", "other_asset", "loan", "other_liability"])
86 |     .optional()
87 |     .nullable(),
88 | });
89 |
90 | export type DeleteBankAccountFormValues = z.infer<
91 |   typeof deleteBankAccountSchema
92 | >;
93 |
94 | export const updateSubscriberPreferenceSchema = z.object({
95 |   templateId: z.string(),
96 |   teamId: z.string(),
97 |   revalidatePath: z.string(),
98 |   subscriberId: z.string(),
99 |   type: z.string(),
100 |   enabled: z.boolean(),
101 | });
102 |
103 | export const changeSpendingPeriodSchema = z.object({
104 |   id: z.string(),
105 |   from: z.string().datetime(),
106 |   to: z.string().datetime(),
107 | });
108 |
109 | export const changeChartTypeSchema = z.enum([
110 |   "profit",
111 |   "revenue",
112 |   "expense",
113 |   "burn_rate",
114 | ]);
115 |
116 | export const changeChartPeriodSchema = z.object({
117 |   from: z.string().optional(),
118 |   to: z.string().optional(),
119 | });
120 |
121 | export const changeTransactionsPeriodSchema = z.enum([
122 |   "all",
123 |   "income",
124 |   "expense",
125 | ]);
126 |
127 | export const createAttachmentsSchema = z.array(
128 |   z.object({
129 |     path: z.array(z.string()),
130 |     name: z.string(),
131 |     size: z.number(),
132 |     transaction_id: z.string(),
133 |     type: z.string(),
134 |   }),
135 | );
136 |
137 | export const deleteAttachmentSchema = z.string();
138 |
139 | export const exportTransactionsSchema = z.array(z.string());
140 |
141 | export const deleteFileSchema = z.object({
142 |   id: z.string(),
143 |   path: z.array(z.string()),
144 | });
145 |
146 | export const deleteFolderSchema = z.object({
147 |   path: z.array(z.string()),
148 | });
149 |
150 | export const createFolderSchema = z.object({
151 |   path: z.string(),
152 |   name: z.string(),
153 | });
154 |
155 | export const unenrollMfaSchema = z.object({
156 |   factorId: z.string(),
157 | });
158 |
159 | export const mfaVerifySchema = z.object({
160 |   factorId: z.string(),
161 |   challengeId: z.string(),
162 |   code: z.string(),
163 | });
164 |
165 | export const shareFileSchema = z.object({
[TRUNCATED]
```

apps/dashboard/src/actions/search-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "./safe-action";
4 | import { searchSchema } from "./schema";
5 |
6 | export const searchAction = authActionClient
7 |   .schema(searchSchema)
8 |   .metadata({
9 |     name: "search",
10 |   })
11 |   .action(async ({ parsedInput: params, ctx: { supabase } }) => {
12 |     const { query, limit = 10 } = params;
13 |
14 |     const { data: documents } = await supabase
15 |       .from("inbox")
16 |       .select("*")
17 |       .textSearch("fts", `'${query}':*`)
18 |       .limit(limit);
19 |
20 |     return documents;
21 |   });
```

apps/dashboard/src/actions/send-feedback-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { PlainClient } from "@team-plain/typescript-sdk";
5 | import { authActionClient } from "./safe-action";
6 | import { sendFeedbackSchema } from "./schema";
7 |
8 | const client = new PlainClient({
9 |   apiKey: process.env.PLAIN_API_KEY!,
10 | });
11 |
12 | export const sendFeebackAction = authActionClient
13 |   .schema(sendFeedbackSchema)
14 |   .metadata({
15 |     name: "send-feedback",
16 |     track: {
17 |       event: LogEvents.SendFeedback.name,
18 |       channel: LogEvents.SendFeedback.channel,
19 |     },
20 |   })
21 |   .action(async ({ parsedInput: { feedback }, ctx: { user } }) => {
22 |     const customer = await client.upsertCustomer({
23 |       identifier: {
24 |         emailAddress: user.email,
25 |       },
26 |       onCreate: {
27 |         fullName: user.full_name,
28 |         externalId: user.id,
29 |         email: {
30 |           email: user.email,
31 |           isVerified: true,
32 |         },
33 |       },
34 |       onUpdate: {},
35 |     });
36 |
37 |     const response = await client.createThread({
38 |       title: "Feedback",
39 |       customerIdentifier: {
40 |         customerId: customer.data?.customer.id,
41 |       },
42 |       // Feedback
43 |       labelTypeIds: ["lt_01HV93GFTZAKESXMVY8X371ADG"],
44 |       components: [
45 |         {
46 |           componentText: {
47 |             text: feedback,
48 |           },
49 |         },
50 |       ],
51 |     });
52 |
53 |     return response;
54 |   });
```

apps/dashboard/src/actions/send-support-action.tsx
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { PlainClient, ThreadFieldSchemaType } from "@team-plain/typescript-sdk";
5 | import { authActionClient } from "./safe-action";
6 | import { sendSupportSchema } from "./schema";
7 |
8 | const client = new PlainClient({
9 |   apiKey: process.env.PLAIN_API_KEY!,
10 | });
11 |
12 | const mapToPriorityNumber = (priority: string) => {
13 |   switch (priority) {
14 |     case "low":
15 |       return 0;
16 |     case "normal":
17 |       return 1;
18 |     case "high":
19 |       return 2;
20 |     case "urgent":
21 |       return 3;
22 |     default:
23 |       return 1;
24 |   }
25 | };
26 |
27 | export const sendSupportAction = authActionClient
28 |   .schema(sendSupportSchema)
29 |   .metadata({
30 |     name: "send-support",
31 |     track: {
32 |       event: LogEvents.SupportTicket.name,
33 |       channel: LogEvents.SupportTicket.channel,
34 |     },
35 |   })
36 |   .action(async ({ parsedInput: data, ctx: { user } }) => {
37 |     const customer = await client.upsertCustomer({
38 |       identifier: {
39 |         emailAddress: user.email,
40 |       },
41 |       onCreate: {
42 |         fullName: user.full_name,
43 |         externalId: user.id,
44 |         email: {
45 |           email: user.email,
46 |           isVerified: true,
47 |         },
48 |       },
49 |       onUpdate: {},
50 |     });
51 |
52 |     const response = await client.createThread({
53 |       title: data.subject,
54 |       description: data.message,
55 |       priority: mapToPriorityNumber(data.priority),
56 |       customerIdentifier: {
57 |         customerId: customer.data?.customer.id,
58 |       },
59 |       // Support
60 |       labelTypeIds: ["lt_01HV93FQT6NSC1EN2HHA6BG9WK"],
61 |       components: [
62 |         {
63 |           componentText: {
64 |             text: data.message,
65 |           },
66 |         },
67 |       ],
68 |       threadFields: data.url
69 |         ? [
70 |             {
71 |               type: ThreadFieldSchemaType.String,
72 |               key: "url",
73 |               stringValue: data.url,
74 |             },
75 |           ]
76 |         : undefined,
77 |     });
78 |
79 |     return response;
80 |   });
```

apps/dashboard/src/actions/share-file-action.ts
```
1 | "use server";
2 |
3 | import { dub } from "@/utils/dub";
4 | import { LogEvents } from "@midday/events/events";
5 | import { share } from "@midday/supabase/storage";
6 | import { authActionClient } from "./safe-action";
7 | import { shareFileSchema } from "./schema";
8 |
9 | export const shareFileAction = authActionClient
10 |   .schema(shareFileSchema)
11 |   .metadata({
12 |     name: "share-file",
13 |     track: {
14 |       event: LogEvents.ShareFile.name,
15 |       channel: LogEvents.ShareFile.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: value, ctx: { supabase, user } }) => {
19 |     const response = await share(supabase, {
20 |       bucket: "vault",
21 |       path: `${user.team_id}/${value.filepath}`,
22 |       expireIn: value.expireIn,
23 |       options: {
24 |         download: true,
25 |       },
26 |     });
27 |
28 |     if (!response.data) {
29 |       return null;
30 |     }
31 |
32 |     const link = await dub.links.create({
33 |       url: response?.data?.signedUrl,
34 |     });
35 |
36 |     return link?.shortLink;
37 |   });
```

apps/dashboard/src/actions/sign-out-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { setupAnalytics } from "@midday/events/server";
5 | import { getSession } from "@midday/supabase/cached-queries";
6 | import { createClient } from "@midday/supabase/server";
7 | import { revalidateTag } from "next/cache";
8 | import { redirect } from "next/navigation";
9 |
10 | export async function signOutAction() {
11 |   const supabase = createClient();
12 |   const {
13 |     data: { session },
14 |   } = await getSession();
15 |
16 |   await supabase.auth.signOut({
17 |     scope: "local",
18 |   });
19 |
20 |   const analytics = await setupAnalytics({
21 |     userId: session?.user?.id,
22 |     fullName: session?.user?.user_metadata?.full_name,
23 |   });
24 |
25 |   analytics.track({
26 |     event: LogEvents.SignOut.name,
27 |     channel: LogEvents.SignOut.channel,
28 |   });
29 |
30 |   revalidateTag(`user_${session?.user?.id}`);
31 |
32 |   return redirect("/login");
33 | }
```

apps/dashboard/src/actions/subscribe-action.ts
```
1 | "use server";
2 |
3 | import { resend } from "@/utils/resend";
4 | import { authActionClient } from "./safe-action";
5 | import { subscribeSchema } from "./schema";
6 |
7 | export const subscribeAction = authActionClient
8 |   .schema(subscribeSchema)
9 |   .metadata({
10 |     name: "subscribe",
11 |   })
12 |   .action(async ({ parsedInput: { email } }) => {
13 |     return resend.contacts.create({
14 |       email,
15 |       audienceId: process.env.RESEND_AUDIENCE_ID!,
16 |     });
17 |   });
```

apps/dashboard/src/actions/tracking-consent-action.ts
```
1 | "use server";
2 |
3 | import { Cookies } from "@/utils/constants";
4 | import { addYears } from "date-fns";
5 | import { cookies } from "next/headers";
6 | import { actionClient } from "./safe-action";
7 | import { trackingConsentSchema } from "./schema";
8 |
9 | export const trackingConsentAction = actionClient
10 |   .schema(trackingConsentSchema)
11 |   .action(async ({ parsedInput: value }) => {
12 |     cookies().set({
13 |       name: Cookies.TrackingConsent,
14 |       value: value ? "1" : "0",
15 |       expires: addYears(new Date(), 1),
16 |     });
17 |
18 |     return value;
19 |   });
```

apps/dashboard/src/actions/unenroll-mfa-action.ts
```
1 | "use server";
2 |
3 | import { revalidatePath } from "next/cache";
4 | import { authActionClient } from "./safe-action";
5 | import { unenrollMfaSchema } from "./schema";
6 |
7 | export const unenrollMfaAction = authActionClient
8 |   .schema(unenrollMfaSchema)
9 |   .metadata({
10 |     name: "unenroll-mfa",
11 |   })
12 |   .action(async ({ parsedInput: { factorId }, ctx: { supabase } }) => {
13 |     const { data, error } = await supabase.auth.mfa.unenroll({
14 |       factorId,
15 |       issuer: "app.midday.ai",
16 |     });
17 |
18 |     if (error) {
19 |       throw Error(error.message);
20 |     }
21 |
22 |     revalidatePath("/account/security");
23 |
24 |     return data;
25 |   });
```

apps/dashboard/src/actions/update-app-settings-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidatePath } from "next/cache";
5 | import { z } from "zod";
6 | import { authActionClient } from "./safe-action";
7 |
8 | export const updateAppSettingsAction = authActionClient
9 |   .schema(
10 |     z.object({
11 |       app_id: z.string(),
12 |       option: z.object({
13 |         id: z.string(),
14 |         value: z.unknown(),
15 |       }),
16 |     }),
17 |   )
18 |   .metadata({
19 |     name: "update-app-settings",
20 |     track: {
21 |       event: LogEvents.UpdateAppSettings.name,
22 |       channel: LogEvents.UpdateAppSettings.channel,
23 |     },
24 |   })
25 |   .action(
26 |     async ({ parsedInput: { app_id, option }, ctx: { user, supabase } }) => {
27 |       const { data: existingApp } = await supabase
28 |         .from("apps")
29 |         .select("settings")
30 |         .eq("app_id", app_id)
31 |         .eq("team_id", user.team_id)
32 |         .single();
33 |
34 |       if (!existingApp) {
35 |         throw new Error("App not found");
36 |       }
37 |
38 |       const updatedSettings = existingApp?.settings.map((setting) => {
39 |         if (setting.id === option.id) {
40 |           return { ...setting, value: option.value };
41 |         }
42 |         return setting;
43 |       });
44 |
45 |       const { data, error } = await supabase
46 |         .from("apps")
47 |         .update({ settings: updatedSettings })
48 |         .eq("app_id", app_id)
49 |         .eq("team_id", user.team_id)
50 |         .select()
51 |         .single();
52 |
53 |       if (!data) {
54 |         throw new Error("Failed to update app settings");
55 |       }
56 |
57 |       revalidatePath("/apps");
58 |
59 |       return data;
60 |     },
61 |   );
```

apps/dashboard/src/actions/update-bank-account-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { updateBankAccount } from "@midday/supabase/mutations";
5 | import { revalidateTag } from "next/cache";
6 | import { authActionClient } from "./safe-action";
7 | import { updateBankAccountSchema } from "./schema";
8 |
9 | export const updateBankAccountAction = authActionClient
10 |   .schema(updateBankAccountSchema)
11 |   .metadata({
12 |     name: "update-bank-account",
13 |     track: {
14 |       event: LogEvents.UpdateBank.name,
15 |       channel: LogEvents.UpdateBank.channel,
16 |     },
17 |   })
18 |   .action(async ({ parsedInput: params, ctx: { user, supabase } }) => {
19 |     const { data } = await updateBankAccount(supabase, {
20 |       teamId: user.team_id,
21 |       ...params,
22 |     });
23 |
24 |     revalidateTag(`bank_accounts_${user.team_id}`);
25 |     revalidateTag(`bank_accounts_currencies_${user.team_id}`);
26 |     revalidateTag(`bank_connections_${user.team_id}`);
27 |     revalidateTag(`transactions_${user.team_id}`);
28 |
29 |     return data;
30 |   });
```

apps/dashboard/src/actions/update-category-action.ts
```
1 | "use server";
2 |
3 | import { revalidateTag } from "next/cache";
4 | import { authActionClient } from "./safe-action";
5 | import { updateCategorySchema } from "./schema";
6 |
7 | export const updateCategoryAction = authActionClient
8 |   .schema(updateCategorySchema)
9 |   .metadata({
10 |     name: "update-category",
11 |   })
12 |   .action(
13 |     async ({
14 |       parsedInput: { id, name, color, description, vat },
15 |       ctx: { user, supabase },
16 |     }) => {
17 |       await supabase
18 |         .from("transaction_categories")
19 |         .update({ name, color, description, vat })
20 |         .eq("id", id);
21 |
22 |       revalidateTag(`transaction_categories_${user.team_id}`);
23 |       revalidateTag(`transactions_${user.team_id}`);
24 |       revalidateTag(`spending_${user.team_id}`);
25 |     },
26 |   );
```

apps/dashboard/src/actions/update-column-visibility-action.ts
```
1 | "use server";
2 |
3 | import type { VisibilityState } from "@tanstack/react-table";
4 | import { addYears } from "date-fns";
5 | import { cookies } from "next/headers";
6 |
7 | type Props = {
8 |   key: string;
9 |   data: VisibilityState;
10 | };
11 |
12 | export async function updateColumnVisibilityAction({ key, data }: Props) {
13 |   cookies().set(key, JSON.stringify(data), {
14 |     expires: addYears(new Date(), 1),
15 |   });
16 |
17 |   return Promise.resolve(data);
18 | }
```

apps/dashboard/src/actions/update-document-action.ts
```
1 | "use server";
2 |
3 | import { revalidatePath } from "next/cache";
4 | import { z } from "zod";
5 | import { authActionClient } from "./safe-action";
6 |
7 | export const updateDocumentAction = authActionClient
8 |   .schema(
9 |     z.object({
10 |       id: z.string().uuid(),
11 |       tag: z.string().optional(),
12 |     }),
13 |   )
14 |   .metadata({
15 |     name: "update-document",
16 |   })
17 |   .action(
18 |     async ({ parsedInput: { id, ...payload }, ctx: { user, supabase } }) => {
19 |       const { data } = await supabase
20 |         .from("documents")
21 |         .update(payload)
22 |         .eq("id", id)
23 |         .select()
24 |         .single();
25 |
26 |       revalidatePath("/vault");
27 |
28 |       return data;
29 |     },
30 |   );
```

apps/dashboard/src/actions/update-menu-action.ts
```
1 | "use server";
2 |
3 | import { Cookies } from "@/utils/constants";
4 | import { addYears } from "date-fns";
5 | import { cookies } from "next/headers";
6 | import { authActionClient } from "./safe-action";
7 | import { updaterMenuSchema } from "./schema";
8 |
9 | export const updateMenuAction = authActionClient
10 |   .schema(updaterMenuSchema)
11 |   .metadata({
12 |     name: "update-menu",
13 |   })
14 |   .action(async ({ parsedInput: value }) => {
15 |     cookies().set({
16 |       name: Cookies.MenuConfig,
17 |       value: JSON.stringify(value),
18 |       expires: addYears(new Date(), 1),
19 |     });
20 |
21 |     return value;
22 |   });
```

apps/dashboard/src/actions/update-similar-transactions-action.ts
```
1 | "use server";
2 |
3 | import { updateSimilarTransactionsCategory } from "@midday/supabase/mutations";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { updateSimilarTransactionsCategorySchema } from "./schema";
7 |
8 | export const updateSimilarTransactionsCategoryAction = authActionClient
9 |   .schema(updateSimilarTransactionsCategorySchema)
10 |   .metadata({
11 |     name: "update-similar-transactions-category",
12 |   })
13 |   .action(async ({ parsedInput: { id }, ctx: { user, supabase } }) => {
14 |     await updateSimilarTransactionsCategory(supabase, {
15 |       team_id: user.team_id,
16 |       id,
17 |     });
18 |
19 |     revalidateTag(`transactions_${user.team_id}`);
20 |     revalidateTag(`spending_${user.team_id}`);
21 |     revalidateTag(`metrics_${user.team_id}`);
22 |     revalidateTag(`current_burn_rate_${user.team_id}`);
23 |     revalidateTag(`burn_rate_${user.team_id}`);
24 |     revalidateTag(`expenses_${user.team_id}`);
25 |   });
```

apps/dashboard/src/actions/update-similar-transactions-recurring.ts
```
1 | "use server";
2 |
3 | import { updateSimilarTransactionsRecurring } from "@midday/supabase/mutations";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { updateSimilarTransactionsRecurringSchema } from "./schema";
7 |
8 | export const updateSimilarTransactionsRecurringAction = authActionClient
9 |   .schema(updateSimilarTransactionsRecurringSchema)
10 |   .metadata({
11 |     name: "update-similar-transactions-recurring",
12 |   })
13 |   .action(async ({ parsedInput: { id }, ctx: { user, supabase } }) => {
14 |     await updateSimilarTransactionsRecurring(supabase, {
15 |       team_id: user.team_id,
16 |       id,
17 |     });
18 |
19 |     revalidateTag(`transactions_${user.team_id}`);
20 |     revalidateTag(`spending_${user.team_id}`);
21 |     revalidateTag(`metrics_${user.team_id}`);
22 |     revalidateTag(`current_burn_rate_${user.team_id}`);
23 |     revalidateTag(`burn_rate_${user.team_id}`);
24 |     revalidateTag(`expenses_${user.team_id}`);
25 |   });
```

apps/dashboard/src/actions/update-subscriber-preference-action.ts
```
1 | "use server";
2 |
3 | import { updateSubscriberPreference } from "@midday/notification";
4 | import { revalidatePath as revalidatePathFunc } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { updateSubscriberPreferenceSchema } from "./schema";
7 |
8 | export const updateSubscriberPreferenceAction = authActionClient
9 |   .schema(updateSubscriberPreferenceSchema)
10 |   .metadata({
11 |     name: "update-subscriber-preference",
12 |   })
13 |   .action(async ({ parsedInput: { revalidatePath, ...data } }) => {
14 |     const preference = await updateSubscriberPreference(data);
15 |
16 |     revalidatePathFunc(revalidatePath);
17 |
18 |     return preference;
19 |   });
```

apps/dashboard/src/actions/update-tag-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { updateTagSchema } from "./schema";
7 |
8 | export const updateTagAction = authActionClient
9 |   .schema(updateTagSchema)
10 |   .metadata({
11 |     name: "update-tag",
12 |     track: {
13 |       event: LogEvents.UpdateTag.name,
14 |       channel: LogEvents.UpdateTag.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: { name, id }, ctx: { supabase, user } }) => {
18 |     const { data } = await supabase
19 |       .from("tags")
20 |       .update({
21 |         name,
22 |       })
23 |       .eq("id", id)
24 |       .select("id, name")
25 |       .single();
26 |
27 |     revalidateTag(`tracker_projects_${user.team_id}`);
28 |
29 |     // TODO: Fix transaction sheet rerendering
30 |     // revalidateTag(`transactions_${user.team_id}`);
31 |
32 |     return data;
33 |   });
```

apps/dashboard/src/actions/update-team-action.ts
```
1 | "use server";
2 |
3 | import { updateTeam } from "@midday/supabase/mutations";
4 | import {
5 |   revalidatePath as revalidatePathFunc,
6 |   revalidateTag,
7 | } from "next/cache";
8 | import { authActionClient } from "./safe-action";
9 | import { updateTeamSchema } from "./schema";
10 |
11 | export const updateTeamAction = authActionClient
12 |   .schema(updateTeamSchema)
13 |   .metadata({
14 |     name: "update-team",
15 |   })
16 |   .action(
17 |     async ({
18 |       parsedInput: { revalidatePath, ...data },
19 |       ctx: { user, supabase },
20 |     }) => {
21 |       const team = await updateTeam(supabase, data);
22 |
23 |       if (revalidatePath) {
24 |         revalidatePathFunc(revalidatePath);
25 |       }
26 |
27 |       revalidateTag(`user_${user.id}`);
28 |
29 |       return team;
30 |     },
31 |   );
```

apps/dashboard/src/actions/update-transaction-action.ts
```
1 | "use server";
2 |
3 | import { updateTransaction } from "@midday/supabase/mutations";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "./safe-action";
6 | import { updateTransactionSchema } from "./schema";
7 |
8 | export const updateTransactionAction = authActionClient
9 |   .schema(updateTransactionSchema)
10 |   .metadata({
11 |     name: "update-transaction",
12 |   })
13 |   .action(
14 |     async ({ parsedInput: { id, ...payload }, ctx: { user, supabase } }) => {
15 |       const { data } = await updateTransaction(supabase, id, payload);
16 |
17 |       revalidateTag(`transactions_${user.team_id}`);
18 |       revalidateTag(`spending_${user.team_id}`);
19 |       revalidateTag(`metrics_${user.team_id}`);
20 |       revalidateTag(`current_burn_rate_${user.team_id}`);
21 |       revalidateTag(`burn_rate_${user.team_id}`);
22 |       revalidateTag(`expenses_${user.team_id}`);
23 |
24 |       return data;
25 |     },
26 |   );
```

apps/dashboard/src/actions/update-user-action.ts
```
1 | "use server";
2 |
3 | import { updateUser } from "@midday/supabase/mutations";
4 | import {
5 |   revalidatePath as nextRevalidatePath,
6 |   revalidateTag,
7 | } from "next/cache";
8 | import { authActionClient } from "./safe-action";
9 | import { updateUserSchema } from "./schema";
10 |
11 | export const updateUserAction = authActionClient
12 |   .schema(updateUserSchema)
13 |   .metadata({
14 |     name: "update-user",
15 |   })
16 |   .action(
17 |     async ({
18 |       parsedInput: { revalidatePath, ...data },
19 |       ctx: { user, supabase },
20 |     }) => {
21 |       await updateUser(supabase, data);
22 |
23 |       if (data.full_name) {
24 |         await supabase.auth.updateUser({
25 |           data: { full_name: data.full_name },
26 |         });
27 |       }
28 |
29 |       if (data.email) {
30 |         await supabase.auth.updateUser({
31 |           data: { email: data.email },
32 |         });
33 |       }
34 |
35 |       revalidateTag(`user_${user.id}`);
36 |
37 |       if (revalidatePath) {
38 |         nextRevalidatePath(revalidatePath);
39 |       }
40 |
41 |       return user;
42 |     },
43 |   );
```

apps/dashboard/src/actions/validate-vat-number-action.ts
```
1 | "use server";
2 |
3 | import { z } from "zod";
4 | import { authActionClient } from "./safe-action";
5 |
6 | const ENDPOINT = "https://api.vatcheckapi.com/v2/check";
7 |
8 | export const validateVatNumberAction = authActionClient
9 |   .schema(
10 |     z.object({
11 |       vat_number: z.string().min(7),
12 |       country_code: z.string(),
13 |     }),
14 |   )
15 |   .metadata({
16 |     name: "validate-vat-number",
17 |   })
18 |   .action(async ({ parsedInput: { vat_number, country_code } }) => {
19 |     const response = await fetch(
20 |       `${ENDPOINT}?vat_number=${vat_number}&country_code=${country_code}&apikey=${process.env.VATCHECKAPI_API_KEY}`,
21 |       {
22 |         method: "GET",
23 |       },
24 |     );
25 |
26 |     const data = await response.json();
27 |
28 |     return data;
29 |   });
```

apps/dashboard/src/actions/verify-otp-action.ts
```
1 | "use server";
2 |
3 | import { Cookies } from "@/utils/constants";
4 | import { createClient } from "@midday/supabase/server";
5 | import { addYears } from "date-fns";
6 | import { cookies } from "next/headers";
7 | import { redirect } from "next/navigation";
8 | import { actionClient } from "./safe-action";
9 | import { verifyOtpSchema } from "./schema";
10 |
11 | export const verifyOtpAction = actionClient
12 |   .schema(verifyOtpSchema)
13 |
14 |   .action(async ({ parsedInput: { email, token } }) => {
15 |     const supabase = createClient();
16 |
17 |     await supabase.auth.verifyOtp({
18 |       email,
19 |       token,
20 |       type: "email",
21 |     });
22 |
23 |     cookies().set(Cookies.PreferredSignInProvider, "otp", {
24 |       expires: addYears(new Date(), 1),
25 |     });
26 |
27 |     redirect("/");
28 |   });
```

apps/dashboard/src/app/global-error.tsx
```
1 | "use client";
2 |
3 | import * as Sentry from "@sentry/nextjs";
4 | import NextError from "next/error";
5 | import { useEffect } from "react";
6 |
7 | export default function GlobalError({
8 |   error,
9 | }: {
10 |   error: Error & { digest?: string };
11 | }) {
12 |   useEffect(() => {
13 |     Sentry.captureException(error);
14 |   }, [error]);
15 |
16 |   return (
17 |     <html lang="en">
18 |       <body>
19 |         <NextError statusCode={0} />
20 |       </body>
21 |     </html>
22 |   );
23 | }
```

apps/dashboard/src/components/add-account-button.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { useQueryState } from "nuqs";
5 |
6 | export function AddAccountButton({ onClick }: { onClick?: () => void }) {
7 |   const [_, setStep] = useQueryState("step");
8 |
9 |   const handleClick = () => {
10 |     setStep("connect");
11 |     onClick?.();
12 |   };
13 |
14 |   return (
15 |     <Button
16 |       data-event="Add account"
17 |       data-icon="🏦"
18 |       data-channel="bank"
19 |       onClick={handleClick}
20 |     >
21 |       Add account
22 |     </Button>
23 |   );
24 | }
```

apps/dashboard/src/components/add-transactions.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import {
5 |   DropdownMenu,
6 |   DropdownMenuContent,
7 |   DropdownMenuItem,
8 |   DropdownMenuTrigger,
9 | } from "@midday/ui/dropdown-menu";
10 | import { Icons } from "@midday/ui/icons";
11 | import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
12 |
13 | export function AddTransactions() {
14 |   const [_, setParams] = useQueryStates({
15 |     step: parseAsString,
16 |     hide: parseAsBoolean,
17 |     "create-transaction": parseAsBoolean,
18 |   });
19 |
20 |   return (
21 |     <DropdownMenu>
22 |       <DropdownMenuTrigger asChild>
23 |         <Button variant="outline" size="icon">
24 |           <Icons.Add size={17} />
25 |         </Button>
26 |       </DropdownMenuTrigger>
27 |       <DropdownMenuContent sideOffset={10} align="end">
28 |         <DropdownMenuItem
29 |           onClick={() => setParams({ step: "connect" })}
30 |           className="space-x-2"
31 |         >
32 |           <Icons.Accounts size={18} />
33 |           <span>Connect account</span>
34 |         </DropdownMenuItem>
35 |         <DropdownMenuItem
36 |           onClick={() => setParams({ step: "import", hide: true })}
37 |           className="space-x-2"
38 |         >
39 |           <Icons.Import size={18} />
40 |           <span>Import/backfill</span>
41 |         </DropdownMenuItem>
42 |         <DropdownMenuItem
43 |           onClick={() => setParams({ "create-transaction": true })}
44 |           className="space-x-2"
45 |         >
46 |           <Icons.CreateTransaction size={18} />
47 |           <span>Create transaction</span>
48 |         </DropdownMenuItem>
49 |       </DropdownMenuContent>
50 |     </DropdownMenu>
51 |   );
52 | }
```

apps/dashboard/src/components/amount-range.tsx
```
1 | "use client";
2 |
3 | import { useSliderWithInput } from "@/hooks/use-slider-with-input";
4 | import { useUserContext } from "@/store/user/hook";
5 | import { createClient } from "@midday/supabase/client";
6 | import { Button } from "@midday/ui/button";
7 | import { Input } from "@midday/ui/input";
8 | import { Label } from "@midday/ui/label";
9 | import { Slider } from "@midday/ui/slider";
10 | import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";
11 | import { useEffect, useState } from "react";
12 |
13 | type Item = {
14 |   id: string;
15 |   amount: number;
16 | };
17 |
18 | export function AmountRange() {
19 |   const [items, setItems] = useState<Item[]>([]);
20 |   const tick_count = 40;
21 |   const supabase = createClient();
22 |   const { team_id } = useUserContext((state) => state.data);
23 |
24 |   const minValue =
25 |     items.length > 0 ? Math.min(...items.map((item) => item.amount)) : 0;
26 |   const maxValue =
27 |     items.length > 0 ? Math.max(...items.map((item) => item.amount)) : 0;
28 |
29 |   const [amountRange, setAmountRange] = useQueryState(
30 |     "amount_range",
31 |     parseAsArrayOf(parseAsInteger),
32 |   );
33 |
34 |   const {
35 |     sliderValue,
36 |     inputValues,
37 |     validateAndUpdateValue,
38 |     handleInputChange,
39 |     handleSliderChange,
40 |     setValues,
41 |   } = useSliderWithInput({
42 |     minValue,
43 |     maxValue,
44 |     initialValue: amountRange || [],
45 |   });
46 |
47 |   const amountStep = (maxValue - minValue) / tick_count;
48 |
49 |   const itemCounts = Array(tick_count)
50 |     .fill(0)
51 |     .map((_, tick) => {
52 |       const rangeMin = minValue + tick * amountStep;
53 |       const rangeMax = minValue + (tick + 1) * amountStep;
54 |       return items.filter(
55 |         (item) => item.amount >= rangeMin && item.amount < rangeMax,
56 |       ).length;
57 |     });
58 |
59 |   const maxCount = Math.max(...itemCounts);
60 |
61 |   const handleSliderValueChange = (values: number[]) => {
62 |     handleSliderChange(values);
63 |   };
64 |
65 |   const countItemsInRange = (min: number, max: number) => {
66 |     return items.filter((item) => item.amount >= min && item.amount <= max)
67 |       .length;
68 |   };
69 |
70 |   const isBarInSelectedRange = (
71 |     index: number,
72 |     minValue: number,
73 |     amountStep: number,
74 |     sliderValue: number[],
75 |   ) => {
76 |     const rangeMin = minValue + index * amountStep;
77 |     const rangeMax = minValue + (index + 1) * amountStep;
78 |     return (
79 |       countItemsInRange(sliderValue[0], sliderValue[1]) > 0 &&
80 |       rangeMin <= sliderValue[1] &&
81 |       rangeMax >= sliderValue[0]
82 |     );
83 |   };
84 |
85 |   useEffect(() => {
86 |     async function fetchItems() {
87 |       const { data } = await supabase
88 |         .rpc("get_transactions_amount_range_data", {
89 |           team_id,
90 |         })
91 |         .select("*");
92 |
93 |       setItems(data);
94 |     }
95 |
96 |     if (!items.length) {
97 |       fetchItems();
98 |     }
99 |   }, []);
100 |
101 |   useEffect(() => {
102 |     setValues([minValue, maxValue]);
103 |   }, [minValue, maxValue]);
104 |
105 |   const totalCount = countItemsInRange(
106 |     sliderValue[0] ?? minValue,
107 |     sliderValue[1] ?? maxValue,
108 |   );
109 |
110 |   return (
111 |     <div className="space-y-4">
112 |       <div>
113 |         <div className="flex h-12 w-full items-end px-3" aria-hidden="true">
114 |           {itemCounts.map((count, i) => (
115 |             <div
116 |               key={`histogram-bar-${i.toString()}`}
117 |               className="flex flex-1 justify-center"
118 |               style={{
119 |                 height: `${(count / maxCount) * 100}%`,
120 |               }}
121 |             >
122 |               <span
123 |                 data-selected={isBarInSelectedRange(
124 |                   i,
125 |                   minValue,
126 |                   amountStep,
127 |                   sliderValue,
128 |                 )}
129 |                 className="h-full w-full bg-primary/20"
130 |               />
131 |             </div>
132 |           ))}
133 |         </div>
134 |         <Slider
135 |           value={sliderValue}
136 |           onValueChange={handleSliderValueChange}
137 |           min={minValue}
138 |           max={maxValue}
139 |           aria-label="Amount range"
140 |         />
141 |       </div>
142 |
143 |       <div className="flex items-center justify-between gap-4">
144 |         <div className="space-y-1">
145 |           <Label htmlFor="min-amount" className="text-xs">
146 |             Min amount
147 |           </Label>
148 |
149 |           <Input
150 |             id="min-amount"
151 |             className="w-full font-mono text-xs"
152 |             type="text"
153 |             inputMode="decimal"
154 |             value={inputValues[0]}
155 |             onChange={(e) => handleInputChange(e, 0)}
156 |             onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
157 |             onKeyDown={(e) => {
158 |               if (e.key === "Enter") {
159 |                 validateAndUpdateValue(inputValues[0], 0);
160 |               }
161 |             }}
162 |             aria-label="Enter minimum amount"
163 |           />
164 |         </div>
165 |         <div className="space-y-1">
[TRUNCATED]
```

apps/dashboard/src/components/animated-number.tsx
```
1 | "use client";
2 |
3 | import { useUserContext } from "@/store/user/hook";
4 | import NumberFlow from "@number-flow/react";
5 |
6 | type Props = {
7 |   value: number;
8 |   currency: string;
9 |   minimumFractionDigits?: number;
10 |   maximumFractionDigits?: number;
11 |   locale?: string;
12 | };
13 |
14 | export function AnimatedNumber({
15 |   value,
16 |   currency,
17 |   minimumFractionDigits,
18 |   maximumFractionDigits,
19 |   locale,
20 | }: Props) {
21 |   const user = useUserContext((state) => state.data);
22 |   const localeToUse = locale || user?.locale;
23 |
24 |   return (
25 |     <NumberFlow
26 |       value={value}
27 |       format={{
28 |         style: "currency",
29 |         currency: currency ?? "USD",
30 |         minimumFractionDigits,
31 |         maximumFractionDigits,
32 |       }}
33 |       willChange
34 |       locales={localeToUse}
35 |     />
36 |   );
37 | }
```

apps/dashboard/src/components/app-settings.tsx
```
1 | import { updateAppSettingsAction } from "@/actions/update-app-settings-action";
2 | import { Label } from "@midday/ui/label";
3 | import { Switch } from "@midday/ui/switch";
4 | import { useAction } from "next-safe-action/hooks";
5 |
6 | type AppSettingsItem = {
7 |   id: string;
8 |   label: string;
9 |   description: string;
10 |   type: "switch" | "text" | "select";
11 |   required: boolean;
12 |   value: string | boolean;
13 | };
14 |
15 | function AppSettingsItem({
16 |   setting,
17 |   appId,
18 | }: {
19 |   setting: AppSettingsItem;
20 |   appId: string;
21 | }) {
22 |   const updateAppSettings = useAction(updateAppSettingsAction);
23 |
24 |   switch (setting.type) {
25 |     case "switch":
26 |       return (
27 |         <div className="flex items-center justify-between">
28 |           <div className="pr-4 space-y-1">
29 |             <Label className="text-[#878787]">{setting.label}</Label>
30 |             <p className="text-xs text-[#878787]">{setting.description}</p>
31 |           </div>
32 |           <Switch
33 |             disabled={updateAppSettings.isPending}
34 |             checked={Boolean(setting.value)}
35 |             onCheckedChange={(checked) => {
36 |               updateAppSettings.execute({
37 |                 app_id: appId,
38 |                 option: {
39 |                   id: setting.id,
40 |                   value: Boolean(checked),
41 |                 },
42 |               });
43 |             }}
44 |           />
45 |         </div>
46 |       );
47 |     default:
48 |       return null;
49 |   }
50 | }
51 |
52 | export function AppSettings({
53 |   settings,
54 |   appId,
55 | }: {
56 |   settings: AppSettingsItem[];
57 |   appId: string;
58 | }) {
59 |   return (
60 |     <div>
61 |       {settings.map((setting) => (
62 |         <div key={setting.id}>
63 |           <AppSettingsItem setting={setting} appId={appId} />
64 |         </div>
65 |       ))}
66 |     </div>
67 |   );
68 | }
```

apps/dashboard/src/components/app.tsx
```
1 | import { disconnectAppAction } from "@/actions/disconnect-app-action";
2 | import {
3 |   Accordion,
4 |   AccordionContent,
5 |   AccordionItem,
6 |   AccordionTrigger,
7 | } from "@midday/ui/accordion";
8 | import { Button } from "@midday/ui/button";
9 | import { Card, CardContent, CardHeader, CardTitle } from "@midday/ui/card";
10 | import { ScrollArea } from "@midday/ui/scroll-area";
11 | import { Sheet, SheetContent, SheetHeader } from "@midday/ui/sheet";
12 | import { useAction } from "next-safe-action/hooks";
13 | import Image from "next/image";
14 | import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
15 | import { useState } from "react";
16 | import { AppSettings } from "./app-settings";
17 |
18 | export function App({
19 |   id,
20 |   logo: Logo,
21 |   name,
22 |   short_description,
23 |   description,
24 |   settings,
25 |   onInitialize,
26 |   images,
27 |   active,
28 |   installed,
29 |   category,
30 |   userSettings,
31 | }: {
32 |   id: string;
33 |   logo: React.ComponentType;
34 |   name: string;
35 |   short_description: string;
36 |   description: string;
37 |   settings: Record<string, any>;
38 |   onInitialize: () => void;
39 |   images: string[];
40 |   active?: boolean;
41 |   installed?: boolean;
42 |   category: string;
43 |   userSettings: Record<string, any>;
44 | }) {
45 |   const [params, setParams] = useQueryStates({
46 |     app: parseAsString,
47 |     settings: parseAsBoolean,
48 |   });
49 |
50 |   const [isLoading, setLoading] = useState(false);
51 |   const disconnectApp = useAction(disconnectAppAction);
52 |
53 |   const handleDisconnect = () => {
54 |     disconnectApp.execute({ appId: id });
55 |   };
56 |
57 |   const handleOnInitialize = async () => {
58 |     setLoading(true);
59 |     await onInitialize();
60 |     setLoading(false);
61 |   };
62 |
63 |   return (
64 |     <Card key={id} className="w-full flex flex-col">
65 |       <Sheet open={params.app === id} onOpenChange={() => setParams(null)}>
66 |         <div className="pt-6 px-6 h-16 flex items-center justify-between">
67 |           <Logo />
68 |
69 |           {installed && (
70 |             <div className="text-green-600 bg-green-100 text-[10px] dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full font-mono">
71 |               Installed
72 |             </div>
73 |           )}
74 |         </div>
75 |
76 |         <CardHeader className="pb-0">
77 |           <div className="flex items-center space-x-2 pb-4">
78 |             <CardTitle className="text-md font-medium leading-none p-0 m-0">
79 |               {name}
80 |             </CardTitle>
81 |             {!active && (
82 |               <span className="text-[#878787] bg-[#F2F1EF] text-[10px] dark:bg-[#1D1D1D] px-3 py-1 rounded-full font-mono">
83 |                 Coming soon
84 |               </span>
85 |             )}
86 |           </div>
87 |         </CardHeader>
88 |         <CardContent className="text-xs text-[#878787] pb-4">
89 |           {short_description}
90 |         </CardContent>
91 |
92 |         <div className="px-6 pb-6 flex gap-2 mt-auto">
93 |           <Button
94 |             variant="outline"
95 |             className="w-full"
96 |             disabled={!active}
97 |             onClick={() => setParams({ app: id })}
98 |           >
99 |             Details
100 |           </Button>
101 |
102 |           {installed ? (
103 |             <Button
104 |               variant="outline"
105 |               className="w-full"
106 |               onClick={handleDisconnect}
107 |             >
108 |               {disconnectApp.status === "executing"
109 |                 ? "Disconnecting..."
110 |                 : "Disconnect"}
111 |             </Button>
112 |           ) : (
113 |             <Button
114 |               variant="outline"
115 |               className="w-full"
116 |               onClick={handleOnInitialize}
117 |               disabled={!onInitialize || !active || isLoading}
118 |             >
119 |               Install
120 |             </Button>
121 |           )}
122 |         </div>
123 |
124 |         <SheetContent>
125 |           <SheetHeader>
126 |             <div className="mb-4">
127 |               <Image
128 |                 src={images[0]}
129 |                 alt={name}
130 |                 width={465}
131 |                 height={290}
132 |                 quality={100}
133 |               />
134 |             </div>
135 |
136 |             <div className="flex items-center justify-between border-b border-border pb-2">
137 |               <div className="flex items-center space-x-2">
138 |                 <Logo />
139 |                 <div>
140 |                   <div className="flex items-center space-x-2">
141 |                     <h3 className="text-lg leading-none">{name}</h3>
142 |                     {installed && (
143 |                       <div className="bg-green-600 text-[9px] dark:bg-green-300 rounded-full size-1" />
144 |                     )}
145 |                   </div>
146 |
147 |                   <span className="text-xs text-[#878787]">
148 |                     {category} • Published by Midday
149 |                   </span>
150 |                 </div>
151 |               </div>
152 |
153 |               <div>
154 |                 {installed ? (
155 |                   <Button
156 |                     variant="outline"
157 |                     className="w-full"
158 |                     onClick={handleDisconnect}
159 |                   >
160 |                     {disconnectApp.status === "executing"
161 |                       ? "Disconnecting..."
162 |                       : "Disconnect"}
163 |                   </Button>
164 |                 ) : (
165 |                   <Button
[TRUNCATED]
```

apps/dashboard/src/components/apple-sign-in.tsx
```
1 | "use client";
2 |
3 | import { createClient } from "@midday/supabase/client";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
7 | import { Loader2 } from "lucide-react";
8 | import { useState } from "react";
9 |
10 | export function AppleSignIn() {
11 |   const [isLoading, setLoading] = useState(false);
12 |   const supabase = createClient();
13 |
14 |   const handleSignIn = async () => {
15 |     setLoading(true);
16 |
17 |     if (isDesktopApp()) {
18 |       const redirectTo = new URL("/api/auth/callback", window.location.origin);
19 |
20 |       redirectTo.searchParams.append("provider", "apple");
21 |       redirectTo.searchParams.append("client", "desktop");
22 |
23 |       await supabase.auth.signInWithOAuth({
24 |         provider: "apple",
25 |         options: {
26 |           redirectTo: redirectTo.toString(),
27 |           queryParams: {
28 |             client: "desktop",
29 |           },
30 |         },
31 |       });
32 |     } else {
33 |       await supabase.auth.signInWithOAuth({
34 |         provider: "apple",
35 |         options: {
36 |           redirectTo: `${window.location.origin}/api/auth/callback?provider=apple`,
37 |         },
38 |       });
39 |     }
40 |   };
41 |
42 |   return (
43 |     <Button
44 |       onClick={handleSignIn}
45 |       className="active:scale-[0.98] bg-primary px-6 py-4 text-secondary font-medium flex space-x-2 h-[40px] w-full"
46 |     >
47 |       {isLoading ? (
48 |         <Loader2 className="h-4 w-4 animate-spin" />
49 |       ) : (
50 |         <>
51 |           <Icons.Apple />
52 |           <span>Continue with Apple</span>
53 |         </>
54 |       )}
55 |     </Button>
56 |   );
57 | }
```

apps/dashboard/src/components/apps-header.tsx
```
1 | import { AppsTabs } from "./apps-tabs";
2 | import { SearchField } from "./search-field";
3 |
4 | export function AppsHeader() {
5 |   return (
6 |     <div className="flex space-x-4">
7 |       <AppsTabs />
8 |       <SearchField placeholder="Search apps" shallow />
9 |     </div>
10 |   );
11 | }
```

apps/dashboard/src/components/apps-tabs.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { useQueryState } from "nuqs";
5 |
6 | const tabs = [
7 |   {
8 |     name: "All",
9 |     value: "all",
10 |   },
11 |   {
12 |     name: "Installed",
13 |     value: "installed",
14 |   },
15 | ];
16 |
17 | export function AppsTabs() {
18 |   const [currentTab, setTab] = useQueryState("tab", {
19 |     shallow: false,
20 |     defaultValue: "all",
21 |   });
22 |
23 |   return (
24 |     <div className="flex">
25 |       {tabs.map((tab) => (
26 |         <button
27 |           onClick={() => setTab(tab.value)}
28 |           key={tab.value}
29 |           type="button"
30 |           className={cn(
31 |             "text-sm transition-colors px-4",
32 |             "dark:bg-[#1D1D1D] dark:text-[#878787]",
33 |             "bg-white text-gray-600",
34 |             currentTab === tab.value &&
35 |               "text-primary dark:bg-[#2C2C2C] bg-gray-100",
36 |           )}
37 |         >
38 |           {tab.name}
39 |         </button>
40 |       ))}
41 |     </div>
42 |   );
43 | }
```

apps/dashboard/src/components/apps.server.tsx
```
1 | import { createClient } from "@midday/supabase/server";
2 | import { Apps } from "./apps";
3 |
4 | export async function AppsServer({ user }) {
5 |   const supabase = createClient();
6 |
7 |   const { data } = await supabase
8 |     .from("apps")
9 |     .select("app_id, settings")
10 |     .eq("team_id", user.team_id);
11 |
12 |   return (
13 |     <Apps
14 |       installedApps={data?.map((app) => app.app_id) ?? []}
15 |       user={user}
16 |       settings={data}
17 |     />
18 |   );
19 | }
```

apps/dashboard/src/components/apps.skeleton.tsx
```
1 | import { Card } from "@midday/ui/card";
2 | import { Skeleton } from "@midday/ui/skeleton";
3 |
4 | export function AppsSkeleton() {
5 |   return (
6 |     <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-auto mt-8">
7 |       {Array.from({ length: 8 }).map((_, index) => (
8 |         <Card key={index.toString()} className="w-full flex flex-col">
9 |           <div className="p-6">
10 |             <Skeleton className="h-10 w-10 rounded-full" />
11 |
12 |             <div className="mt-6">
13 |               <Skeleton className="h-5 w-[40%]" />
14 |             </div>
15 |             <div className="space-y-2 py-4 pb-0">
16 |               <Skeleton className="h-4 w-[80%]" />
17 |               <Skeleton className="h-4 w-[70%]" />
18 |               <Skeleton className="h-4 w-[160px]" />
19 |             </div>
20 |             <div className="flex items-center justify-between space-x-2 mt-4">
21 |               <Skeleton className="h-10 w-full" />
22 |               <Skeleton className="h-10 w-full" />
23 |             </div>
24 |           </div>
25 |         </Card>
26 |       ))}
27 |     </div>
28 |   );
29 | }
```

apps/dashboard/src/components/apps.tsx
```
1 | "use client";
2 |
3 | import { apps } from "@midday/app-store";
4 | import { Button } from "@midday/ui/button";
5 | import { useRouter, useSearchParams } from "next/navigation";
6 | import { App } from "./app";
7 |
8 | export type User = {
9 |   id: string;
10 |   team_id: string;
11 | };
12 |
13 | export function Apps({
14 |   user,
15 |   installedApps,
16 |   settings,
17 | }: { user: User; installedApps: string[]; settings: Record<string, any>[] }) {
18 |   const searchParams = useSearchParams();
19 |   const isInstalledPage = searchParams.get("tab") === "installed";
20 |   const search = searchParams.get("q");
21 |   const router = useRouter();
22 |
23 |   const filteredApps = apps
24 |     .filter((app) => !isInstalledPage || installedApps.includes(app.id))
25 |     .filter(
26 |       (app) => !search || app.name.toLowerCase().includes(search.toLowerCase()),
27 |     );
28 |
29 |   return (
30 |     <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-auto mt-8">
31 |       {filteredApps.map((app) => (
32 |         <App
33 |           key={app.id}
34 |           installed={installedApps?.includes(app.id)}
35 |           {...app}
36 |           userSettings={
37 |             settings.find((setting) => setting.app_id === app.id)?.settings ??
38 |             []
39 |           }
40 |           onInitialize={() => app.onInitialize(user)}
41 |         />
42 |       ))}
43 |
44 |       {!search && !filteredApps.length && (
45 |         <div className="col-span-full flex flex-col items-center justify-center h-[calc(100vh-400px)]">
46 |           <h3 className="text-lg font-semibold text-[#1D1D1D] dark:text-[#F2F1EF]">
47 |             No apps installed
48 |           </h3>
49 |           <p className="mt-2 text-sm text-[#878787] text-center max-w-md">
50 |             You haven't installed any apps yet. Go to the 'All Apps' tab to
51 |             browse available apps.
52 |           </p>
53 |         </div>
54 |       )}
55 |
56 |       {search && !filteredApps.length && (
57 |         <div className="col-span-full flex flex-col items-center justify-center h-[calc(100vh-400px)]">
58 |           <h3 className="text-lg font-semibold text-[#1D1D1D] dark:text-[#F2F1EF]">
59 |             No apps found
60 |           </h3>
61 |           <p className="mt-2 text-sm text-[#878787] text-center max-w-md">
62 |             No apps found for your search, let us know if you want to see a
63 |             specific app in the app store.
64 |           </p>
65 |
66 |           <Button
67 |             onClick={() => router.push("/apps")}
68 |             className="mt-4"
69 |             variant="outline"
70 |           >
71 |             Clear search
72 |           </Button>
73 |         </div>
74 |       )}
75 |     </div>
76 |   );
77 | }
```

apps/dashboard/src/components/assign-user.tsx
```
1 | import { useUserContext } from "@/store/user/hook";
2 | import { createClient } from "@midday/supabase/client";
3 | import { getTeamMembersQuery } from "@midday/supabase/queries";
4 | import {
5 |   Select,
6 |   SelectContent,
7 |   SelectItem,
8 |   SelectTrigger,
9 |   SelectValue,
10 | } from "@midday/ui/select";
11 | import { Skeleton } from "@midday/ui/skeleton";
12 | import { useEffect, useState } from "react";
13 | import { AssignedUser } from "./assigned-user";
14 |
15 | type User = {
16 |   id: string;
17 |   avatar_url?: string | null;
18 |   full_name: string | null;
19 | };
20 |
21 | type Props = {
22 |   selectedId?: string;
23 |   isLoading: boolean;
24 |   onSelect: (user?: User) => void;
25 | };
26 |
27 | export function AssignUser({ selectedId, isLoading, onSelect }: Props) {
28 |   const [value, setValue] = useState<string>();
29 |   const supabase = createClient();
30 |   const [users, setUsers] = useState<User[]>([]);
31 |   const { team_id: teamId } = useUserContext((state) => state.data);
32 |
33 |   useEffect(() => {
34 |     setValue(selectedId);
35 |   }, [selectedId]);
36 |
37 |   useEffect(() => {
38 |     async function getUsers() {
39 |       const { data: membersData } = await getTeamMembersQuery(supabase, teamId);
40 |
41 |       setUsers(membersData?.map(({ user }) => user));
42 |     }
43 |
44 |     getUsers();
45 |   }, [supabase]);
46 |
47 |   return (
48 |     <div className="relative">
49 |       {isLoading ? (
50 |         <div className="h-[36px] border">
51 |           <Skeleton className="h-[14px] w-[60%] absolute left-3 top-[39px]" />
52 |         </div>
53 |       ) : (
54 |         <Select
55 |           value={value}
56 |           onValueChange={(id) => onSelect(users.find((user) => user.id === id))}
57 |         >
58 |           <SelectTrigger
59 |             id="assign"
60 |             className="line-clamp-1 truncate"
61 |             onKeyDown={(evt) => evt.preventDefault()}
62 |           >
63 |             <SelectValue placeholder="Select" />
64 |           </SelectTrigger>
65 |
66 |           <SelectContent className="overflow-y-auto max-h-[200px]">
67 |             {users?.map((user) => {
68 |               return (
69 |                 <SelectItem key={user?.id} value={user?.id}>
70 |                   <AssignedUser
71 |                     fullName={user?.full_name}
72 |                     avatarUrl={user?.avatar_url}
73 |                   />
74 |                 </SelectItem>
75 |               );
76 |             })}
77 |           </SelectContent>
78 |         </Select>
79 |       )}
80 |     </div>
81 |   );
82 | }
```

apps/dashboard/src/components/assigned-user.tsx
```
1 | import { Avatar } from "@midday/ui/avatar";
2 | import Image from "next/image";
3 |
4 | type Props = {
5 |   avatarUrl?: string | null;
6 |   fullName?: string | null;
7 | };
8 |
9 | export function AssignedUser({ avatarUrl, fullName }: Props) {
10 |   return (
11 |     <div className="flex space-x-2 items-center">
12 |       {avatarUrl && (
13 |         <Avatar className="h-5 w-5">
14 |           <Image src={avatarUrl} alt={fullName ?? ""} width={20} height={20} />
15 |         </Avatar>
16 |       )}
17 |       <span className="truncate">{fullName?.split(" ").at(0)}</span>
18 |     </div>
19 |   );
20 | }
```

apps/dashboard/src/components/assistant-history.tsx
```
1 | "use client";
2 |
3 | import { assistantSettingsAction } from "@/actions/ai/assistant-settings-action";
4 | import type { AI } from "@/actions/ai/chat";
5 | import { clearHistoryAction } from "@/actions/ai/clear-history-action";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   Card,
9 |   CardContent,
10 |   CardDescription,
11 |   CardHeader,
12 |   CardTitle,
13 | } from "@midday/ui/card";
14 | import { Switch } from "@midday/ui/switch";
15 | import { useToast } from "@midday/ui/use-toast";
16 | import { useUIState } from "ai/rsc";
17 | import { useAction, useOptimisticAction } from "next-safe-action/hooks";
18 |
19 | type Props = {
20 |   enabled: boolean;
21 | };
22 |
23 | export function AssistantHistory({ enabled }: Props) {
24 |   const { toast } = useToast();
25 |   const [_, setMessages] = useUIState<typeof AI>();
26 |
27 |   const { execute, status, optimisticState } = useOptimisticAction(
28 |     assistantSettingsAction,
29 |     {
30 |       currentState: enabled,
31 |       updateFn: (_, { enabled }) => Boolean(enabled),
32 |     },
33 |   );
34 |
35 |   const clearHistory = useAction(clearHistoryAction, {
36 |     onSuccess: () => {
37 |       toast({
38 |         duration: 4000,
39 |         title: "History cleared successfully.",
40 |         variant: "success",
41 |       });
42 |     },
43 |   });
44 |
45 |   return (
46 |     <Card>
47 |       <CardHeader>
48 |         <CardTitle>History</CardTitle>
49 |         <CardDescription>
50 |           By default, we save your history for up to 30 days. You can disable
51 |           and clear your history at any time.
52 |         </CardDescription>
53 |       </CardHeader>
54 |
55 |       <CardContent className="space-y-8">
56 |         <div className="flex justify-between items-center border-border border-b-[1px] pb-6">
57 |           <span className="font-medium text-sm">Enabled</span>
58 |           <Switch
59 |             checked={optimisticState}
60 |             disabled={status === "executing"}
61 |             onCheckedChange={(enabled: boolean) => {
62 |               execute({ enabled });
63 |             }}
64 |           />
65 |         </div>
66 |         <div className="flex justify-between items-center mb-4">
67 |           <span className="font-medium text-sm">Clear history</span>
68 |           <Button
69 |             variant="outline"
70 |             onClick={() => {
71 |               clearHistory.execute(undefined);
72 |               setMessages([]);
73 |             }}
74 |             disabled={clearHistory.status === "executing"}
75 |           >
76 |             Clear
77 |           </Button>
78 |         </div>
79 |       </CardContent>
80 |     </Card>
81 |   );
82 | }
```

apps/dashboard/src/components/attachment-item.tsx
```
1 | import { formatSize } from "@/utils/format";
2 | import { Button } from "@midday/ui/button";
3 | import {
4 |   HoverCard,
5 |   HoverCardContent,
6 |   HoverCardTrigger,
7 | } from "@midday/ui/hover-card";
8 | import { Skeleton } from "@midday/ui/skeleton";
9 | import { isSupportedFilePreview } from "@midday/utils";
10 | import { X } from "lucide-react";
11 | import { FilePreview } from "./file-preview";
12 |
13 | type Props = {
14 |   file: any;
15 |   onDelete: () => void;
16 | };
17 |
18 | export function AttachmentItem({ file, onDelete }: Props) {
19 |   const filePreviewSupported = isSupportedFilePreview(file.type);
20 |
21 |   return (
22 |     <div className="flex items-center justify-between">
23 |       <div className="flex space-x-4 items-center">
24 |         <HoverCard openDelay={200}>
25 |           <HoverCardTrigger>
26 |             <div className="border w-[40px] h-[40px] overflow-hidden cursor-pointer">
27 |               {file.isUploading ? (
28 |                 <Skeleton className="w-full h-full" />
29 |               ) : (
30 |                 <FilePreview
31 |                   src={`/api/proxy?filePath=vault/${file?.path?.join("/")}`}
32 |                   name={file.name}
33 |                   type={file.type}
34 |                   preview
35 |                   width={45}
36 |                   height={100}
37 |                   // Wait for the sheet to open before loading the file
38 |                   delay={100}
39 |                 />
40 |               )}
41 |             </div>
42 |           </HoverCardTrigger>
43 |           {filePreviewSupported && (
44 |             <HoverCardContent
45 |               className="w-[273px] h-[358px] p-0 overflow-hidden"
46 |               side="left"
47 |               sideOffset={55}
48 |             >
49 |               <FilePreview
50 |                 src={`/api/proxy?filePath=vault/${file?.path?.join("/")}`}
51 |                 downloadUrl={`/api/download/file?path=${file?.path
52 |                   ?.slice(1)
53 |                   .join("/")}&filename=${file.name}`}
54 |                 name={file.name}
55 |                 type={file.type}
56 |                 width={280}
57 |                 height={365}
58 |               />
59 |             </HoverCardContent>
60 |           )}
61 |         </HoverCard>
62 |
63 |         <div className="flex flex-col space-y-0.5 w-80">
64 |           <span className="truncate">{file.name}</span>
65 |           <span className="text-xs text-[#606060]">
66 |             {file.size && formatSize(file.size)}
67 |           </span>
68 |         </div>
69 |       </div>
70 |
71 |       <Button
72 |         variant="ghost"
73 |         size="icon"
74 |         className="w-auto hover:bg-transparent flex"
75 |         onClick={onDelete}
76 |       >
77 |         <X size={14} />
78 |       </Button>
79 |     </div>
80 |   );
81 | }
```

apps/dashboard/src/components/attachments.tsx
```
1 | "use client";
2 |
3 | import { deleteAttachmentAction } from "@/actions/delete-attachment-action";
4 | import { useUpload } from "@/hooks/use-upload";
5 | import { useUserContext } from "@/store/user/hook";
6 | import { cn } from "@midday/ui/cn";
7 | import { useToast } from "@midday/ui/use-toast";
8 | import { stripSpecialCharacters } from "@midday/utils";
9 | import { useEffect, useState } from "react";
10 | import { useDropzone } from "react-dropzone";
11 | import { AttachmentItem } from "./attachment-item";
12 | import { SelectAttachment } from "./select-attachment";
13 |
14 | type Attachment = {
15 |   id?: string;
16 |   type: string;
17 |   name: string;
18 |   size: number;
19 | };
20 |
21 | type ReturnedAttachment = {
22 |   path: string[];
23 |   name: string;
24 |   size: number;
25 |   type: string;
26 | };
27 |
28 | type Props = {
29 |   prefix: string;
30 |   data?: Attachment[];
31 |   onUpload: (files: ReturnedAttachment[]) => void;
32 | };
33 |
34 | export function Attachments({ prefix, data, onUpload }: Props) {
35 |   const { toast } = useToast();
36 |   const [files, setFiles] = useState<Attachment[]>([]);
37 |   const { uploadFile } = useUpload();
38 |
39 |   const { team_id: teamId } = useUserContext((state) => state.data);
40 |
41 |   const handleOnDelete = async (id: string) => {
42 |     setFiles((files) => files.filter((file) => file?.id !== id));
43 |     await deleteAttachmentAction(id);
44 |   };
45 |
46 |   const onDrop = async (acceptedFiles: Array<Attachment>) => {
47 |     setFiles((prev) => [
48 |       ...prev,
49 |       ...acceptedFiles.map((a) => ({
50 |         name: stripSpecialCharacters(a.name),
51 |         size: a.size,
52 |         type: a.type,
53 |         isUploading: true,
54 |       })),
55 |     ]);
56 |
57 |     const uploadedFiles = await Promise.all(
58 |       acceptedFiles.map(async (acceptedFile) => {
59 |         const filename = stripSpecialCharacters(acceptedFile.name);
60 |
61 |         const { path } = await uploadFile({
62 |           bucket: "vault",
63 |           path: [teamId, "transactions", prefix, filename],
64 |           file: acceptedFile,
65 |         });
66 |
67 |         return {
68 |           path,
69 |           name: filename,
70 |           size: acceptedFile.size,
71 |           type: acceptedFile.type,
72 |         };
73 |       }),
74 |     );
75 |
76 |     onUpload(uploadedFiles);
77 |   };
78 |
79 |   const handleOnSelectFile = (file) => {
80 |     const filename = stripSpecialCharacters(file.name);
81 |
82 |     const item = {
83 |       name: filename,
84 |       size: file.data.size,
85 |       type: file.data.content_type,
86 |       path: file.data.file_path,
87 |     };
88 |
89 |     setFiles((prev) => [item, ...prev]);
90 |     onUpload([item]);
91 |   };
92 |
93 |   useEffect(() => {
94 |     if (data) {
95 |       setFiles(data);
96 |     }
97 |   }, [data]);
98 |
99 |   const { getRootProps, getInputProps, isDragActive } = useDropzone({
100 |     onDrop,
101 |     onDropRejected: ([reject]) => {
102 |       if (reject?.errors.find(({ code }) => code === "file-too-large")) {
103 |         toast({
104 |           duration: 2500,
105 |           variant: "error",
106 |           title: "File size to large.",
107 |         });
108 |       }
109 |
110 |       if (reject?.errors.find(({ code }) => code === "file-invalid-type")) {
111 |         toast({
112 |           duration: 2500,
113 |           variant: "error",
114 |           title: "File type not supported.",
115 |         });
116 |       }
117 |     },
118 |     maxSize: 3000000, // 3MB
119 |     accept: {
120 |       "image/png": [".png"],
121 |       "image/jpeg": [".jpg", ".jpeg"],
122 |       "application/pdf": [".pdf"],
123 |     },
124 |   });
125 |
126 |   return (
127 |     <div>
128 |       <SelectAttachment
129 |         placeholder="Search attachment"
130 |         onSelect={handleOnSelectFile}
131 |       />
132 |       <div
133 |         className={cn(
134 |           "mt-4 w-full h-[120px] border-dotted border-2 border-border text-center flex flex-col justify-center space-y-1 transition-colors text-[#606060]",
135 |           isDragActive && "bg-secondary text-primary",
136 |         )}
137 |         {...getRootProps()}
138 |       >
139 |         <input {...getInputProps()} />
140 |         {isDragActive ? (
141 |           <div>
142 |             <p className="text-xs">Drop your files upload</p>
143 |           </div>
144 |         ) : (
145 |           <div>
146 |             <p className="text-xs">
147 |               Drop your files here, or{" "}
148 |               <span className="underline underline-offset-1">
149 |                 click to browse.
150 |               </span>
151 |             </p>
152 |             <p className="text-xs text-dark-gray">3MB file limit.</p>
153 |           </div>
154 |         )}
155 |       </div>
156 |
157 |       <ul className="mt-4 space-y-4">
158 |         {files.map((file, idx) => (
159 |           <AttachmentItem
160 |             key={`${file.name}-${idx}`}
161 |             id={file.name}
162 |             file={file}
163 |             onDelete={() => handleOnDelete(file?.id)}
164 |           />
165 |         ))}
166 |       </ul>
167 |     </div>
168 |   );
169 | }
```

apps/dashboard/src/components/avatar-upload.tsx
```
1 | "use client";
2 |
3 | import { updateUserAction } from "@/actions/update-user-action";
4 | import { useUpload } from "@/hooks/use-upload";
5 | import { Avatar, AvatarFallback, AvatarImage } from "@midday/ui/avatar";
6 | import { Icons } from "@midday/ui/icons";
7 | import { stripSpecialCharacters } from "@midday/utils";
8 | import { Loader2 } from "lucide-react";
9 | import { useAction } from "next-safe-action/hooks";
10 | import { useRef, useState } from "react";
11 | import { forwardRef } from "react";
12 |
13 | type Props = {
14 |   userId: string;
15 |   avatarUrl?: string;
16 |   fullName?: string;
17 |   onUpload?: (url: string) => void;
18 |   size?: number;
19 | };
20 |
21 | export const AvatarUpload = forwardRef<HTMLInputElement, Props>(
22 |   (
23 |     { userId, avatarUrl: initialAvatarUrl, fullName, size = 65, onUpload },
24 |     ref,
25 |   ) => {
26 |     const action = useAction(updateUserAction);
27 |     const [avatar, setAvatar] = useState(initialAvatarUrl);
28 |     const inputRef = useRef<HTMLInputElement>(null);
29 |
30 |     const { isLoading, uploadFile } = useUpload();
31 |
32 |     const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
33 |       const { files } = evt.target;
34 |       const selectedFile = files as FileList;
35 |
36 |       const filename = stripSpecialCharacters(selectedFile[0]?.name ?? "");
37 |
38 |       const { url } = await uploadFile({
39 |         bucket: "avatars",
40 |         path: [userId, filename],
41 |         file: selectedFile[0] as File,
42 |       });
43 |
44 |       if (url) {
45 |         action.execute({ avatar_url: url });
46 |         setAvatar(url);
47 |         onUpload?.(url);
48 |       }
49 |     };
50 |
51 |     const fileInputRef = ref || inputRef;
52 |
53 |     return (
54 |       <Avatar
55 |         className="rounded-full flex items-center justify-center bg-accent cursor-pointer border border-border"
56 |         style={{ width: size, height: size }}
57 |         onClick={() => {
58 |           if ("current" in fileInputRef && fileInputRef.current) {
59 |             fileInputRef.current.click();
60 |           }
61 |         }}
62 |       >
63 |         {isLoading ? (
64 |           <Loader2 className="size-4 animate-spin" />
65 |         ) : (
66 |           <>
67 |             <AvatarImage src={avatar} />
68 |             <AvatarFallback>
69 |               <Icons.AccountCircle className="size-5" />
70 |             </AvatarFallback>
71 |           </>
72 |         )}
73 |         <input
74 |           ref={fileInputRef}
75 |           type="file"
76 |           style={{ display: "none" }}
77 |           multiple={false}
78 |           onChange={handleUpload}
79 |         />
80 |       </Avatar>
81 |     );
82 |   },
83 | );
84 |
85 | AvatarUpload.displayName = "AvatarUpload";
```

apps/dashboard/src/components/bank-account-list.tsx
```
1 | import { getTeamBankAccounts } from "@midday/supabase/cached-queries";
2 | import { Skeleton } from "@midday/ui/skeleton";
3 | import { BankConnections } from "./bank-connections";
4 | import { ManualAccounts } from "./manual-accounts";
5 |
6 | export function BankAccountListSkeleton() {
7 |   return (
8 |     <div className="px-6 pb-6 space-y-6 divide-y">
9 |       <div className="flex justify-between items-center">
10 |         <div className="ml-[30px] divide-y">
11 |           <div className="flex justify-between items-center mb-4 pt-4">
12 |             <div className="flex items-center">
13 |               <Skeleton className="flex h-9 w-9 items-center justify-center space-y-0 rounded-full" />
14 |               <div className="ml-4 flex flex-col">
15 |                 <p className="text-sm font-medium leading-none mb-1">
16 |                   <Skeleton className="h-3 w-[200px] rounded-none" />
17 |                 </p>
18 |                 <span className="text-xs font-medium text-[#606060]">
19 |                   <Skeleton className="h-2.5 w-[100px] mt-1 rounded-none" />
20 |                 </span>
21 |               </div>
22 |             </div>
23 |           </div>
24 |           <div className="flex justify-between items-center mb-4 pt-4">
25 |             <div className="flex items-center">
26 |               <Skeleton className="flex h-9 w-9 items-center justify-center space-y-0 rounded-full" />
27 |               <div className="ml-4 flex flex-col">
28 |                 <p className="text-sm font-medium leading-none mb-1">
29 |                   <Skeleton className="h-3 w-[200px] rounded-none" />
30 |                 </p>
31 |                 <span className="text-xs font-medium text-[#606060]">
32 |                   <Skeleton className="h-2.5 w-[100px] mt-1 rounded-none" />
33 |                 </span>
34 |               </div>
35 |             </div>
36 |           </div>
37 |         </div>
38 |       </div>
39 |     </div>
40 |   );
41 | }
42 |
43 | export async function BankAccountList() {
44 |   const { data } = await getTeamBankAccounts();
45 |
46 |   const manualAccounts = data.filter((account) => account.manual);
47 |
48 |   const bankMap = {};
49 |
50 |   for (const item of data) {
51 |     const bankId = item.bank?.id;
52 |
53 |     if (!bankId) {
54 |       continue;
55 |     }
56 |
57 |     if (!bankMap[bankId]) {
58 |       // If the bank is not in the map, add it
59 |       bankMap[bankId] = {
60 |         ...item.bank,
61 |         accounts: [],
62 |       };
63 |     }
64 |
65 |     // Add the account to the bank's accounts array
66 |     bankMap[bankId].accounts.push(item);
67 |   }
68 |
69 |   // Convert the map to an array
70 |   const result = Object.values(bankMap);
71 |
72 |   function sortAccountsByEnabled(accounts) {
73 |     return accounts.sort((a, b) => b.enabled - a.enabled);
74 |   }
75 |
76 |   // Sort the accounts within each bank in the result array
77 |   for (const bank of result) {
78 |     if (Array.isArray(bank.accounts)) {
79 |       bank.accounts = sortAccountsByEnabled(bank.accounts);
80 |     }
81 |   }
82 |
83 |   return (
84 |     <>
85 |       <BankConnections data={result} />
86 |       <ManualAccounts data={manualAccounts} />
87 |     </>
88 |   );
89 | }
```

apps/dashboard/src/components/bank-account.tsx
```
1 | "use client";
2 |
3 | import { deleteBankAccountAction } from "@/actions/delete-bank-account-action";
4 | import { updateBankAccountAction } from "@/actions/update-bank-account-action";
5 | import { useI18n } from "@/locales/client";
6 | import { getInitials } from "@/utils/format";
7 | import {
8 |   AlertDialog,
9 |   AlertDialogAction,
10 |   AlertDialogCancel,
11 |   AlertDialogContent,
12 |   AlertDialogDescription,
13 |   AlertDialogFooter,
14 |   AlertDialogHeader,
15 |   AlertDialogTitle,
16 |   AlertDialogTrigger,
17 | } from "@midday/ui/alert-dialog";
18 | import { Avatar, AvatarFallback } from "@midday/ui/avatar";
19 | import { cn } from "@midday/ui/cn";
20 | import {
21 |   DropdownMenu,
22 |   DropdownMenuContent,
23 |   DropdownMenuItem,
24 |   DropdownMenuSeparator,
25 |   DropdownMenuTrigger,
26 | } from "@midday/ui/dropdown-menu";
27 | import { Icons } from "@midday/ui/icons";
28 | import { Input } from "@midday/ui/input";
29 | import { Label } from "@midday/ui/label";
30 | import { Switch } from "@midday/ui/switch";
31 | import {
32 |   Tooltip,
33 |   TooltipContent,
34 |   TooltipProvider,
35 |   TooltipTrigger,
36 | } from "@midday/ui/tooltip";
37 | import { MoreHorizontal } from "lucide-react";
38 | import { Loader2 } from "lucide-react";
39 | import { useAction } from "next-safe-action/hooks";
40 | import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
41 | import { useState } from "react";
42 | import { FormatAmount } from "./format-amount";
43 | import { EditBankAccountModal } from "./modals/edit-bank-account-modal";
44 |
45 | type Props = {
46 |   id: string;
47 |   name: string;
48 |   balance?: number;
49 |   currency: string;
50 |   enabled: boolean;
51 |   manual: boolean;
52 |   type?: string;
53 |   hasError?: boolean;
54 | };
55 |
56 | export function BankAccount({
57 |   id,
58 |   name,
59 |   currency,
60 |   balance,
61 |   enabled,
62 |   manual,
63 |   type,
64 |   hasError,
65 | }: Props) {
66 |   const [value, setValue] = useState("");
67 |   const [_, setParams] = useQueryStates({
68 |     step: parseAsString,
69 |     accountId: parseAsString,
70 |     hide: parseAsBoolean,
71 |     type: parseAsString,
72 |   });
73 |
74 |   const [isOpen, setOpen] = useState(false);
75 |   const t = useI18n();
76 |
77 |   const updateAccount = useAction(updateBankAccountAction);
78 |   const deleteAccount = useAction(deleteBankAccountAction);
79 |
80 |   return (
81 |     <div
82 |       className={cn(
83 |         "flex justify-between items-center mb-4 pt-4",
84 |         !enabled && "opacity-60",
85 |       )}
86 |     >
87 |       <div className="flex items-center space-x-4 w-full mr-8">
88 |         <Avatar className="size-[34px]">
89 |           <AvatarFallback className="text-[11px]">
90 |             {getInitials(name)}
91 |           </AvatarFallback>
92 |         </Avatar>
93 |
94 |         <div className="flex items-center justify-between w-full">
95 |           <div className="flex flex-col">
96 |             <p className="font-medium leading-none mb-1 text-sm">{name}</p>
97 |             {!hasError && (
98 |               <span className="text-xs text-[#878787] font-normal">
99 |                 {type && t(`account_type.${type}`)}
100 |               </span>
101 |             )}
102 |             {hasError && (
103 |               <TooltipProvider delayDuration={70}>
104 |                 <Tooltip>
105 |                   <TooltipTrigger>
106 |                     <div className="flex items-center space-x-1">
107 |                       <Icons.Error size={14} className="text-[#FFD02B]" />
108 |                       <span className="text-xs text-[#FFD02B] font-normal">
109 |                         Connection issue
110 |                       </span>
111 |                     </div>
112 |                   </TooltipTrigger>
113 |                   <TooltipContent
114 |                     className="px-3 py-1.5 text-xs max-w-[400px]"
115 |                     sideOffset={20}
116 |                     side="left"
117 |                   >
118 |                     There is a problem with this account, please reconnect the
119 |                     bank connection.
120 |                   </TooltipContent>
121 |                 </Tooltip>
122 |               </TooltipProvider>
123 |             )}
124 |           </div>
125 |
126 |           {balance && balance > 0 ? (
127 |             <span className="text-[#878787] text-sm">
128 |               <FormatAmount amount={balance} currency={currency} />
129 |             </span>
130 |           ) : null}
131 |         </div>
132 |       </div>
133 |
134 |       <div className="flex items-center space-x-4">
135 |         <AlertDialog>
136 |           <DropdownMenu>
137 |             <DropdownMenuTrigger asChild>
138 |               <MoreHorizontal size={20} />
139 |             </DropdownMenuTrigger>
140 |             <DropdownMenuContent className="w-48">
141 |               <DropdownMenuItem onClick={() => setOpen(true)}>
142 |                 Edit
143 |               </DropdownMenuItem>
144 |               <DropdownMenuSeparator />
145 |               <DropdownMenuItem
146 |                 onClick={() => {
147 |                   setParams({
148 |                     step: "import",
149 |                     accountId: id,
150 |                     type,
151 |                     hide: true,
152 |                   });
153 |                 }}
154 |               >
155 |                 Import
156 |               </DropdownMenuItem>
157 |               <DropdownMenuSeparator />
158 |               <DropdownMenuItem>
159 |                 <AlertDialogTrigger className="w-full text-left">
160 |                   Remove
161 |                 </AlertDialogTrigger>
162 |               </DropdownMenuItem>
163 |             </DropdownMenuContent>
164 |           </DropdownMenu>
165 |
166 |           <AlertDialogContent>
167 |             <AlertDialogHeader>
168 |               <AlertDialogTitle>Delete Account</AlertDialogTitle>
169 |               <AlertDialogDescription>
[TRUNCATED]
```

apps/dashboard/src/components/bank-connect-button.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import { Loader2 } from "lucide-react";
3 | import { useState } from "react";
4 |
5 | type Props = {
6 |   onClick: () => void;
7 | };
8 |
9 | export function BankConnectButton({ onClick }: Props) {
10 |   const [isLoading, setLoading] = useState(false);
11 |
12 |   const handleOnClick = () => {
13 |     setLoading(true);
14 |     onClick();
15 |
16 |     setTimeout(() => {
17 |       setLoading(false);
18 |     }, 3000);
19 |   };
20 |
21 |   return (
22 |     <Button
23 |       variant="outline"
24 |       data-event="Bank Selected"
25 |       data-icon="🏦"
26 |       data-channel="bank"
27 |       disabled={isLoading}
28 |       onClick={handleOnClick}
29 |     >
30 |       {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
31 |     </Button>
32 |   );
33 | }
```

apps/dashboard/src/components/bank-connections.tsx
```
1 | "use client";
2 |
3 | import { manualSyncTransactionsAction } from "@/actions/transactions/manual-sync-transactions-action";
4 | import { reconnectConnectionAction } from "@/actions/transactions/reconnect-connection-action";
5 | import { useSyncStatus } from "@/hooks/use-sync-status";
6 | import { connectionStatus } from "@/utils/connection-status";
7 | import {
8 |   Accordion,
9 |   AccordionContent,
10 |   AccordionItem,
11 |   AccordionTrigger,
12 | } from "@midday/ui/accordion";
13 | import { Icons } from "@midday/ui/icons";
14 | import {
15 |   Tooltip,
16 |   TooltipContent,
17 |   TooltipProvider,
18 |   TooltipTrigger,
19 | } from "@midday/ui/tooltip";
20 | import { useToast } from "@midday/ui/use-toast";
21 | import { differenceInDays, formatDistanceToNow } from "date-fns";
22 | import { useAction } from "next-safe-action/hooks";
23 | import { useRouter } from "next/navigation";
24 | import { parseAsString, useQueryStates } from "nuqs";
25 | import { useEffect, useState } from "react";
26 | import { BankAccount } from "./bank-account";
27 | import { BankLogo } from "./bank-logo";
28 | import { ReconnectProvider } from "./reconnect-provider";
29 | import { SyncTransactions } from "./sync-transactions";
30 |
31 | interface BankConnectionProps {
32 |   connection: {
33 |     id: string;
34 |     name: string;
35 |     logo_url: string;
36 |     provider: string;
37 |     expires_at?: string;
38 |     enrollment_id: string | null;
39 |     institution_id: string;
40 |     last_accessed?: string;
41 |     access_token: string | null;
42 |     error?: string;
43 |     status: "connected" | "disconnected" | "unknown";
44 |     accounts: Array<{
45 |       id: string;
46 |       name: string;
47 |       enabled: boolean;
48 |       manual: boolean;
49 |       currency: string;
50 |       balance?: number;
51 |       type: string;
52 |       error_retries?: number;
53 |     }>;
54 |   };
55 | }
56 |
57 | function ConnectionState({
58 |   connection,
59 |   isSyncing,
60 | }: { connection: BankConnectionProps["connection"]; isSyncing: boolean }) {
61 |   const { show, expired } = connectionStatus(connection);
62 |
63 |   if (isSyncing) {
64 |     return (
65 |       <div className="text-xs font-normal flex items-center space-x-1">
66 |         <span>Syncing...</span>
67 |       </div>
68 |     );
69 |   }
70 |
71 |   if (connection.status === "disconnected") {
72 |     return (
73 |       <>
74 |         <div className="text-xs font-normal flex items-center space-x-1 text-[#c33839]">
75 |           <Icons.AlertCircle />
76 |           <span>Connection issue</span>
77 |         </div>
78 |
79 |         <TooltipContent
80 |           className="px-3 py-1.5 text-xs max-w-[430px]"
81 |           sideOffset={20}
82 |           side="left"
83 |         >
84 |           Please reconnect to restore the connection to a good state.
85 |         </TooltipContent>
86 |       </>
87 |     );
88 |   }
89 |
90 |   if (show) {
91 |     return (
92 |       <>
93 |         <div className="text-xs font-normal flex items-center space-x-1 text-[#FFD02B]">
94 |           <Icons.AlertCircle />
95 |           <span>Connection expires soon</span>
96 |         </div>
97 |
98 |         {connection.expires_at && (
99 |           <TooltipContent
100 |             className="px-3 py-1.5 text-xs max-w-[430px]"
101 |             sideOffset={20}
102 |             side="left"
103 |           >
104 |             We only have access to your bank for another{" "}
105 |             {differenceInDays(new Date(connection.expires_at), new Date())}{" "}
106 |             days. Please update the connection to keep everything in sync.
107 |           </TooltipContent>
108 |         )}
109 |       </>
110 |     );
111 |   }
112 |
113 |   if (expired) {
114 |     return (
115 |       <div className="text-xs font-normal flex items-center space-x-1 text-[#c33839]">
116 |         <Icons.Error />
117 |         <span>Connection expired</span>
118 |       </div>
119 |     );
120 |   }
121 |
122 |   if (connection.last_accessed) {
123 |     return (
124 |       <div className="text-xs font-normal flex items-center space-x-1">
125 |         <span className="text-xs font-normal">{`Updated ${formatDistanceToNow(
126 |           new Date(connection.last_accessed),
127 |         )} ago`}</span>
128 |       </div>
129 |     );
130 |   }
131 |
132 |   return <div className="text-xs font-normal">Never accessed</div>;
133 | }
134 |
135 | export function BankConnection({ connection }: BankConnectionProps) {
136 |   const [runId, setRunId] = useState<string | undefined>();
137 |   const [accessToken, setAccessToken] = useState<string | undefined>();
138 |   const [isSyncing, setSyncing] = useState(false);
139 |   const { toast, dismiss } = useToast();
140 |   const router = useRouter();
141 |
142 |   const { show } = connectionStatus(connection);
143 |   const { status, setStatus } = useSyncStatus({ runId, accessToken });
144 |
145 |   const [params] = useQueryStates({
146 |     step: parseAsString,
147 |     id: parseAsString,
148 |   });
149 |
150 |   const manualSyncTransactions = useAction(manualSyncTransactionsAction, {
151 |     onExecute: () => setSyncing(true),
152 |     onSuccess: ({ data }) => {
153 |       if (data) {
154 |         setRunId(data.id);
155 |         setAccessToken(data.publicAccessToken);
156 |       }
157 |     },
158 |     onError: () => {
159 |       setSyncing(false);
160 |       setRunId(undefined);
[TRUNCATED]
```

apps/dashboard/src/components/bank-logo.tsx
```
1 | import { Avatar, AvatarImage } from "@midday/ui/avatar";
2 | import Image from "next/image";
3 |
4 | type Props = {
5 |   src: string | null;
6 |   alt: string;
7 |   size?: number;
8 | };
9 |
10 | export function BankLogo({ src, alt, size = 34 }: Props) {
11 |   return (
12 |     <Avatar style={{ width: size, height: size }}>
13 |       {src && (
14 |         <Image
15 |           src={src}
16 |           alt={alt}
17 |           className="text-transparent"
18 |           width={size}
19 |           height={size}
20 |           quality={100}
21 |         />
22 |       )}
23 |       <Image
24 |         src="https://cdn-engine.midday.ai/default.jpg"
25 |         alt={alt}
26 |         className="absolute -z-10"
27 |         width={size}
28 |         height={size}
29 |       />
30 |     </Avatar>
31 |   );
32 | }
```

apps/dashboard/src/components/breadcrumbs.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 | import {
5 |   Breadcrumb,
6 |   BreadcrumbItem,
7 |   BreadcrumbLink,
8 |   BreadcrumbList,
9 |   BreadcrumbPage,
10 |   BreadcrumbSeparator,
11 | } from "@midday/ui/breadcrumb";
12 | import { cn } from "@midday/ui/cn";
13 | import Link from "next/link";
14 | import { translatedFolderName } from "./tables/vault/data-table-row";
15 |
16 | type Props = {
17 |   folders?: string[];
18 |   hide?: boolean;
19 | };
20 |
21 | export function Breadcrumbs({ folders = [], hide }: Props) {
22 |   const t = useI18n();
23 |
24 |   const allFolders = ["all", ...folders];
25 |
26 |   const links = allFolders?.map((folder, index) => {
27 |     const isLast = folders.length === index;
28 |     const parts = folders.slice(0, index);
29 |     const href =
30 |       folder === "all" ? "/vault" : `/${["vault", ...parts].join("/")}`;
31 |
32 |     if (isLast) {
33 |       return (
34 |         <BreadcrumbItem key={folder}>
35 |           <BreadcrumbPage>{translatedFolderName(t, folder)}</BreadcrumbPage>
36 |         </BreadcrumbItem>
37 |       );
38 |     }
39 |
40 |     return (
41 |       <div key={folder} className="flex items-center gap-2">
42 |         <BreadcrumbItem>
43 |           <BreadcrumbLink asChild>
44 |             <Link href={href}>{translatedFolderName(t, folder)}</Link>
45 |           </BreadcrumbLink>
46 |         </BreadcrumbItem>
47 |         <BreadcrumbSeparator />
48 |       </div>
49 |     );
50 |   });
51 |
52 |   return (
53 |     <Breadcrumb className={cn("animate-fade-in", hide && "opacity-0")}>
54 |       <BreadcrumbList>{links}</BreadcrumbList>
55 |     </Breadcrumb>
56 |   );
57 | }
```

apps/dashboard/src/components/bulk-actions.tsx
```
1 | "use client";
2 |
3 | import { bulkUpdateTransactionsAction } from "@/actions/bulk-update-transactions-action";
4 | import { useTransactionsStore } from "@/store/transactions";
5 | import { Button } from "@midday/ui/button";
6 | import {
7 |   DropdownMenu,
8 |   DropdownMenuCheckboxItem,
9 |   DropdownMenuContent,
10 |   DropdownMenuGroup,
11 |   DropdownMenuPortal,
12 |   DropdownMenuSub,
13 |   DropdownMenuSubContent,
14 |   DropdownMenuSubTrigger,
15 |   DropdownMenuTrigger,
16 | } from "@midday/ui/dropdown-menu";
17 | import { Icons } from "@midday/ui/icons";
18 | import { useToast } from "@midday/ui/use-toast";
19 | import { useAction } from "next-safe-action/hooks";
20 | import { SelectCategory } from "./select-category";
21 | import { SelectUser } from "./select-user";
22 |
23 | type Props = {
24 |   ids: string[];
25 |   tags: { id: string; name: string }[];
26 | };
27 |
28 | export function BulkActions({ ids, tags }: Props) {
29 |   const { toast } = useToast();
30 |
31 |   const { setRowSelection } = useTransactionsStore();
32 |
33 |   const bulkUpdateTransactions = useAction(bulkUpdateTransactionsAction, {
34 |     onExecute: ({ input }) => {
35 |       if (input.type === "status") {
36 |         setRowSelection({});
37 |       }
38 |     },
39 |     onSuccess: ({ data }) => {
40 |       setRowSelection({});
41 |       toast({
42 |         title: `Updated ${data?.length} transactions.`,
43 |         variant: "success",
44 |         duration: 3500,
45 |       });
46 |     },
47 |     onError: () => {
48 |       toast({
49 |         duration: 3500,
50 |         variant: "error",
51 |         title: "Something went wrong please try again.",
52 |       });
53 |     },
54 |   });
55 |
56 |   return (
57 |     <DropdownMenu>
58 |       <DropdownMenuTrigger asChild>
59 |         <Button variant="outline" className="space-x-2">
60 |           <span>Actions</span>
61 |           <Icons.ChevronDown size={16} />
62 |         </Button>
63 |       </DropdownMenuTrigger>
64 |       <DropdownMenuContent align="end" className="w-[180px]" sideOffset={8}>
65 |         <DropdownMenuGroup>
66 |           <DropdownMenuSub>
67 |             <DropdownMenuSubTrigger>
68 |               <Icons.Category className="mr-2 h-4 w-4" />
69 |               <span>Categories</span>
70 |             </DropdownMenuSubTrigger>
71 |             <DropdownMenuPortal>
72 |               <DropdownMenuSubContent
73 |                 sideOffset={14}
74 |                 className="p-0 w-[250px] h-[270px]"
75 |               >
76 |                 <SelectCategory
77 |                   onChange={(selected) => {
78 |                     bulkUpdateTransactions.execute({
79 |                       type: "category",
80 |                       data: ids.map((transaction) => ({
81 |                         id: transaction,
82 |                         category_slug: selected.slug,
83 |                       })),
84 |                     });
85 |                   }}
86 |                   headless
87 |                 />
88 |               </DropdownMenuSubContent>
89 |             </DropdownMenuPortal>
90 |           </DropdownMenuSub>
91 |         </DropdownMenuGroup>
92 |
93 |         <DropdownMenuGroup>
94 |           <DropdownMenuSub>
95 |             <DropdownMenuSubTrigger>
96 |               <Icons.Status className="mr-2 h-4 w-4" />
97 |               <span>Tags</span>
98 |             </DropdownMenuSubTrigger>
99 |             <DropdownMenuPortal>
100 |               <DropdownMenuSubContent
101 |                 sideOffset={14}
102 |                 alignOffset={-4}
103 |                 className="py-2 max-h-[200px] overflow-y-auto max-w-[220px]"
104 |               >
105 |                 {tags?.length > 0 ? (
106 |                   tags?.map((tag) => (
107 |                     <DropdownMenuCheckboxItem
108 |                       key={tag.id}
109 |                       checked={ids.includes(tag.id)}
110 |                       onCheckedChange={() => {
111 |                         bulkUpdateTransactions.execute({
112 |                           type: "tags",
113 |                           data: ids.map((transaction) => ({
114 |                             id: transaction,
115 |                             tag_id: tag.id,
116 |                           })),
117 |                         });
118 |                       }}
119 |                     >
120 |                       {tag.name}
121 |                     </DropdownMenuCheckboxItem>
122 |                   ))
123 |                 ) : (
124 |                   <p className="text-sm text-[#878787] px-2">No tags found</p>
125 |                 )}
126 |               </DropdownMenuSubContent>
127 |             </DropdownMenuPortal>
128 |           </DropdownMenuSub>
129 |         </DropdownMenuGroup>
130 |
131 |         <DropdownMenuGroup>
132 |           <DropdownMenuSub>
133 |             <DropdownMenuSubTrigger>
134 |               <Icons.Visibility className="mr-2 h-4 w-4" />
135 |               <span>Exclude</span>
136 |             </DropdownMenuSubTrigger>
137 |             <DropdownMenuPortal>
138 |               <DropdownMenuSubContent sideOffset={14}>
139 |                 <DropdownMenuCheckboxItem
140 |                   onCheckedChange={() => {
141 |                     bulkUpdateTransactions.execute({
142 |                       type: "status",
143 |                       data: ids.map((transaction) => ({
144 |                         id: transaction,
145 |                         internal: true,
146 |                       })),
147 |                     });
148 |                   }}
149 |                 >
150 |                   Yes
151 |                 </DropdownMenuCheckboxItem>
152 |                 <DropdownMenuCheckboxItem
153 |                   onCheckedChange={() => {
154 |                     bulkUpdateTransactions.execute({
155 |                       type: "status",
156 |                       data: ids.map((transaction) => ({
157 |                         id: transaction,
158 |                         internal: false,
159 |                       })),
160 |                     });
161 |                   }}
162 |                 >
163 |                   No
164 |                 </DropdownMenuCheckboxItem>
165 |               </DropdownMenuSubContent>
166 |             </DropdownMenuPortal>
167 |           </DropdownMenuSub>
168 |         </DropdownMenuGroup>
169 |
170 |         <DropdownMenuGroup>
171 |           <DropdownMenuSub>
172 |             <DropdownMenuSubTrigger>
173 |               <Icons.Files className="mr-2 h-4 w-4" />
174 |               <span>Archive</span>
175 |             </DropdownMenuSubTrigger>
176 |             <DropdownMenuPortal>
177 |               <DropdownMenuSubContent sideOffset={14}>
178 |                 <DropdownMenuCheckboxItem
179 |                   onCheckedChange={() => {
180 |                     bulkUpdateTransactions.execute({
181 |                       type: "status",
182 |                       data: ids.map((transaction) => ({
183 |                         id: transaction,
184 |                         status: "archived",
185 |                       })),
186 |                     });
187 |                   }}
188 |                 >
189 |                   Yes
190 |                 </DropdownMenuCheckboxItem>
191 |                 <DropdownMenuCheckboxItem
192 |                   onCheckedChange={() => {
193 |                     bulkUpdateTransactions.execute({
[TRUNCATED]
```

apps/dashboard/src/components/category.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 |
5 | type CategoryIconProps = {
6 |   color?: string;
7 |   size?: number;
8 |   className?: string;
9 | };
10 |
11 | export function CategoryColor({
12 |   color,
13 |   className,
14 |   size = 12,
15 | }: CategoryIconProps) {
16 |   return (
17 |     <div
18 |       className={className}
19 |       style={{
20 |         backgroundColor: color,
21 |         width: size,
22 |         height: size,
23 |       }}
24 |     />
25 |   );
26 | }
27 |
28 | type Props = {
29 |   name: string;
30 |   className?: string;
31 |   color?: string;
32 | };
33 |
34 | export function Category({ name, color, className }: Props) {
35 |   return (
36 |     <div className={cn("flex space-x-2 items-center", className)}>
37 |       <CategoryColor color={color} />
38 |       {name && <span>{name}</span>}
39 |     </div>
40 |   );
41 | }
```

apps/dashboard/src/components/change-email.tsx
```
1 | "use client";
2 |
3 | import { type UpdateUserFormValues, updateUserSchema } from "@/actions/schema";
4 | import { updateUserAction } from "@/actions/update-user-action";
5 | import { zodResolver } from "@hookform/resolvers/zod";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   Card,
9 |   CardContent,
10 |   CardDescription,
11 |   CardFooter,
12 |   CardHeader,
13 |   CardTitle,
14 | } from "@midday/ui/card";
15 | import {
16 |   Form,
17 |   FormControl,
18 |   FormField,
19 |   FormItem,
20 |   FormMessage,
21 | } from "@midday/ui/form";
22 | import { Input } from "@midday/ui/input";
23 | import { Loader2 } from "lucide-react";
24 | import { useAction } from "next-safe-action/hooks";
25 | import { useForm } from "react-hook-form";
26 |
27 | type Props = {
28 |   email: string;
29 | };
30 |
31 | export function ChangeEmail({ email }: Props) {
32 |   const action = useAction(updateUserAction);
33 |
34 |   const form = useForm<UpdateUserFormValues>({
35 |     resolver: zodResolver(updateUserSchema),
36 |     defaultValues: {
37 |       email,
38 |     },
39 |   });
40 |
41 |   const onSubmit = form.handleSubmit((data) => {
42 |     action.execute({
43 |       email: data?.email,
44 |       revalidatePath: "/account",
45 |     });
46 |   });
47 |
48 |   return (
49 |     <Form {...form}>
50 |       <form onSubmit={onSubmit}>
51 |         <Card>
52 |           <CardHeader>
53 |             <CardTitle>Email</CardTitle>
54 |             <CardDescription>Change your email address.</CardDescription>
55 |           </CardHeader>
56 |
57 |           <CardContent>
58 |             <FormField
59 |               control={form.control}
60 |               name="email"
61 |               render={({ field }) => (
62 |                 <FormItem>
63 |                   <FormControl>
64 |                     <Input
65 |                       {...field}
66 |                       className="max-w-[300px]"
67 |                       autoComplete="off"
68 |                       autoCapitalize="none"
69 |                       autoCorrect="off"
70 |                       spellCheck="false"
71 |                       type="email"
72 |                     />
73 |                   </FormControl>
74 |                   <FormMessage />
75 |                 </FormItem>
76 |               )}
77 |             />
78 |           </CardContent>
79 |
80 |           <CardFooter className="flex justify-between">
81 |             <div>
82 |               This is your primary email address for notifications and more.
83 |             </div>
84 |             <Button
85 |               type="submit"
86 |               disabled={
87 |                 action.status === "executing" || !form.formState.isDirty
88 |               }
89 |             >
90 |               {action.status === "executing" ? (
91 |                 <Loader2 className="h-4 w-4 animate-spin" />
92 |               ) : (
93 |                 "Save"
94 |               )}
95 |             </Button>
96 |           </CardFooter>
97 |         </Card>
98 |       </form>
99 |     </Form>
100 |   );
101 | }
```

apps/dashboard/src/components/change-language.tsx
```
1 | "use client";
2 |
3 | import { updateUserAction } from "@/actions/update-user-action";
4 | import {
5 |   languages,
6 |   useChangeLocale,
7 |   useCurrentLocale,
8 |   useI18n,
9 | } from "@/locales/client";
10 | import {
11 |   Card,
12 |   CardContent,
13 |   CardDescription,
14 |   CardHeader,
15 |   CardTitle,
16 | } from "@midday/ui/card";
17 | import {
18 |   Select,
19 |   SelectContent,
20 |   SelectGroup,
21 |   SelectItem,
22 |   SelectTrigger,
23 |   SelectValue,
24 | } from "@midday/ui/select";
25 | import { useAction } from "next-safe-action/hooks";
26 |
27 | export function ChangeLanguage() {
28 |   const action = useAction(updateUserAction);
29 |   const changeLocale = useChangeLocale();
30 |   const locale = useCurrentLocale();
31 |   const t = useI18n();
32 |
33 |   const handleOnChange = async (locale: string) => {
34 |     await action.execute({ locale });
35 |     changeLocale(locale);
36 |   };
37 |
38 |   return (
39 |     <Card>
40 |       <CardHeader>
41 |         <CardTitle>{t("language.title")}</CardTitle>
42 |         <CardDescription>{t("language.description")}</CardDescription>
43 |       </CardHeader>
44 |
45 |       <CardContent>
46 |         <Select defaultValue={locale} onValueChange={handleOnChange}>
47 |           <SelectTrigger className="w-[180px]">
48 |             <SelectValue placeholder={t("language.placeholder")} />
49 |           </SelectTrigger>
50 |           <SelectContent>
51 |             <SelectGroup>
52 |               {languages.map((language) => (
53 |                 <SelectItem value={language} key={language}>
54 |                   {t(`languages.${language}`)}
55 |                 </SelectItem>
56 |               ))}
57 |             </SelectGroup>
58 |           </SelectContent>
59 |         </Select>
60 |       </CardContent>
61 |     </Card>
62 |   );
63 | }
```

apps/dashboard/src/components/change-theme.tsx
```
1 | import { ThemeSwitch } from "@/components/theme-switch";
2 | import {
3 |   Card,
4 |   CardContent,
5 |   CardDescription,
6 |   CardHeader,
7 |   CardTitle,
8 | } from "@midday/ui/card";
9 |
10 | export function ChangeTheme() {
11 |   return (
12 |     <Card>
13 |       <CardHeader>
14 |         <CardTitle>Appearance</CardTitle>
15 |         <CardDescription>
16 |           Customize how Midday looks on your device.
17 |         </CardDescription>
18 |       </CardHeader>
19 |
20 |       <CardContent>
21 |         <div className="w-[240px]">
22 |           <ThemeSwitch />
23 |         </div>
24 |       </CardContent>
25 |     </Card>
26 |   );
27 | }
```

apps/dashboard/src/components/change-timezone.tsx
```
1 | "use client";
2 |
3 | import { updateUserAction } from "@/actions/update-user-action";
4 | import { useI18n } from "@/locales/client";
5 | import {
6 |   Card,
7 |   CardContent,
8 |   CardDescription,
9 |   CardHeader,
10 |   CardTitle,
11 | } from "@midday/ui/card";
12 | import { ComboboxDropdown } from "@midday/ui/combobox-dropdown";
13 | import { useOptimisticAction } from "next-safe-action/hooks";
14 |
15 | type Props = {
16 |   timezone: string;
17 |   timezones: { tzCode: string; name: string }[];
18 | };
19 |
20 | export function ChangeTimezone({ timezone, timezones }: Props) {
21 |   const t = useI18n();
22 |
23 |   const { execute, optimisticState } = useOptimisticAction(updateUserAction, {
24 |     currentState: { timezone },
25 |     updateFn: (state, newTimezone) => {
26 |       return {
27 |         timezone: newTimezone.timezone ?? state.timezone,
28 |       };
29 |     },
30 |   });
31 |
32 |   const timezoneItems = timezones.map((tz, id) => ({
33 |     id: id.toString(),
34 |     label: tz.name,
35 |     value: tz.tzCode,
36 |   }));
37 |
38 |   return (
39 |     <Card className="flex justify-between items-center">
40 |       <CardHeader>
41 |         <CardTitle>{t("timezone.title")}</CardTitle>
42 |         <CardDescription>{t("timezone.description")}</CardDescription>
43 |       </CardHeader>
44 |
45 |       <CardContent>
46 |         <div className="w-[250px]">
47 |           <ComboboxDropdown
48 |             placeholder={t("timezone.placeholder")}
49 |             selectedItem={timezoneItems.find(
50 |               (item) => item.value === optimisticState.timezone,
51 |             )}
52 |             searchPlaceholder={t("timezone.searchPlaceholder")}
53 |             items={timezoneItems}
54 |             className="text-xs py-1"
55 |             onSelect={(item) => {
56 |               execute({ timezone: item.value });
57 |             }}
58 |           />
59 |         </div>
60 |       </CardContent>
61 |     </Card>
62 |   );
63 | }
```

apps/dashboard/src/components/color-picker.tsx
```
1 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
2 | import { HexColorPicker } from "react-colorful";
3 |
4 | type Props = {
5 |   value: string;
6 |   onSelect: (value: string) => void;
7 | };
8 |
9 | export function ColorPicker({ value, onSelect }: Props) {
10 |   return (
11 |     <Popover>
12 |       <PopoverTrigger asChild>
13 |         <button
14 |           type="button"
15 |           className="size-3 transition-colors rounded-[2px] absolute top-3 left-2"
16 |           style={{
17 |             backgroundColor: value,
18 |           }}
19 |         />
20 |       </PopoverTrigger>
21 |       <PopoverContent className="p-0 w-auto" sideOffset={14}>
22 |         <HexColorPicker
23 |           className="color-picker"
24 |           color={value}
25 |           onChange={(c) => {
26 |             onSelect(c);
27 |           }}
28 |         />
29 |       </PopoverContent>
30 |     </Popover>
31 |   );
32 | }
```

apps/dashboard/src/components/column-visibility.tsx
```
1 | import { useTransactionsStore } from "@/store/transactions";
2 | import { Button } from "@midday/ui/button";
3 | import { Checkbox } from "@midday/ui/checkbox";
4 | import { Icons } from "@midday/ui/icons";
5 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
6 |
7 | export function ColumnVisibility({ disabled }: { disabled?: boolean }) {
8 |   const { columns } = useTransactionsStore();
9 |
10 |   return (
11 |     <Popover>
12 |       <PopoverTrigger asChild>
13 |         <Button variant="outline" size="icon" disabled={disabled}>
14 |           <Icons.Tune size={18} />
15 |         </Button>
16 |       </PopoverTrigger>
17 |
18 |       <PopoverContent className="w-[200px] p-0" align="end" sideOffset={8}>
19 |         <div className="flex flex-col p-4 space-y-2 max-h-[352px] overflow-auto">
20 |           {columns
21 |             .filter(
22 |               (column) =>
23 |                 column.columnDef.enableHiding !== false &&
24 |                 column.id !== "status",
25 |             )
26 |             .map((column) => {
27 |               return (
28 |                 <div key={column.id} className="flex items-center space-x-2">
29 |                   <Checkbox
30 |                     id={column.id}
31 |                     checked={column.getIsVisible()}
32 |                     onCheckedChange={(checked) =>
33 |                       column.toggleVisibility(checked)
34 |                     }
35 |                   />
36 |                   <label
37 |                     htmlFor={column.id}
38 |                     className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
39 |                   >
40 |                     {column.columnDef.header}
41 |                   </label>
42 |                 </div>
43 |               );
44 |             })}
45 |         </div>
46 |       </PopoverContent>
47 |     </Popover>
48 |   );
49 | }
```

apps/dashboard/src/components/connect-bank-provider.tsx
```
1 | import { updateInstitutionUsageAction } from "@/actions/institutions/update-institution-usage";
2 | import { useConnectParams } from "@/hooks/use-connect-params";
3 | import { useAction } from "next-safe-action/hooks";
4 | import { BankConnectButton } from "./bank-connect-button";
5 | import { GoCardLessConnect } from "./gocardless-connect";
6 | import { TellerConnect } from "./teller-connect";
7 |
8 | type Props = {
9 |   id: string;
10 |   provider: string;
11 |   availableHistory: number;
12 |   openPlaid: () => void;
13 | };
14 |
15 | export function ConnectBankProvider({
16 |   id,
17 |   provider,
18 |   openPlaid,
19 |   availableHistory,
20 | }: Props) {
21 |   const { setParams } = useConnectParams();
22 |   const updateInstitutionUsage = useAction(updateInstitutionUsageAction);
23 |
24 |   const updateUsage = () => {
25 |     updateInstitutionUsage.execute({ institutionId: id });
26 |   };
27 |
28 |   switch (provider) {
29 |     case "teller":
30 |       return (
31 |         <TellerConnect
32 |           id={id}
33 |           onSelect={() => {
34 |             // NOTE: Wait for Teller sdk to be configured
35 |             setTimeout(() => {
36 |               setParams({ step: null });
37 |             }, 950);
38 |
39 |             updateUsage();
40 |           }}
41 |         />
42 |       );
43 |     case "gocardless": {
44 |       return (
45 |         <GoCardLessConnect
46 |           id={id}
47 |           availableHistory={availableHistory}
48 |           onSelect={() => {
49 |             updateUsage();
50 |           }}
51 |         />
52 |       );
53 |     }
54 |     case "plaid":
55 |       return (
56 |         <BankConnectButton
57 |           onClick={() => {
58 |             updateUsage();
59 |             openPlaid();
60 |           }}
61 |         />
62 |       );
63 |     default:
64 |       return null;
65 |   }
66 | }
```

apps/dashboard/src/components/connected-accounts.tsx
```
1 | import { AddAccountButton } from "@/components/add-account-button";
2 | import {
3 |   BankAccountList,
4 |   BankAccountListSkeleton,
5 | } from "@/components/bank-account-list";
6 | import {
7 |   Card,
8 |   CardDescription,
9 |   CardFooter,
10 |   CardHeader,
11 |   CardTitle,
12 | } from "@midday/ui/card";
13 | import { Suspense } from "react";
14 |
15 | export function ConnectedAccounts() {
16 |   return (
17 |     <Card>
18 |       <CardHeader>
19 |         <CardTitle>Accounts</CardTitle>
20 |         <CardDescription>
21 |           Manage bank accounts, update or connect new ones.
22 |         </CardDescription>
23 |       </CardHeader>
24 |
25 |       <Suspense fallback={<BankAccountListSkeleton />}>
26 |         <BankAccountList />
27 |       </Suspense>
28 |
29 |       <CardFooter className="flex justify-between">
30 |         <div />
31 |
32 |         <AddAccountButton />
33 |       </CardFooter>
34 |     </Card>
35 |   );
36 | }
```

apps/dashboard/src/components/connection-status.tsx
```
1 | import { getConnectionsStatus } from "@/utils/connection-status";
2 | import { getBankConnectionsByTeamId } from "@midday/supabase/cached-queries";
3 | import { Button } from "@midday/ui/button";
4 | import { cn } from "@midday/ui/cn";
5 | import { Icons } from "@midday/ui/icons";
6 | import {
7 |   Tooltip,
8 |   TooltipContent,
9 |   TooltipProvider,
10 |   TooltipTrigger,
11 | } from "@midday/ui/tooltip";
12 | import Link from "next/link";
13 |
14 | export async function ConnectionStatus() {
15 |   const bankConnections = await getBankConnectionsByTeamId();
16 |
17 |   if (!bankConnections?.data?.length) {
18 |     return null;
19 |   }
20 |
21 |   const connectionIssue = bankConnections?.data?.some(
22 |     (bank) => bank.status === "disconnected",
23 |   );
24 |
25 |   if (connectionIssue) {
26 |     return (
27 |       <TooltipProvider delayDuration={70}>
28 |         <Tooltip>
29 |           <TooltipTrigger asChild>
30 |             <Link href="/settings/accounts" prefetch>
31 |               <Button
32 |                 variant="outline"
33 |                 size="icon"
34 |                 className="rounded-full w-8 h-8 items-center hidden md:flex"
35 |               >
36 |                 <Icons.Error size={16} className="text-[#FF3638]" />
37 |               </Button>
38 |             </Link>
39 |           </TooltipTrigger>
40 |
41 |           <TooltipContent
42 |             className="px-3 py-1.5 text-xs max-w-[230px]"
43 |             sideOffset={10}
44 |           >
45 |             There is a connection issue with one of your banks.
46 |           </TooltipContent>
47 |         </Tooltip>
48 |       </TooltipProvider>
49 |     );
50 |   }
51 |
52 |   // NOTE: No connections with expire_at (Only GoCardLess)
53 |   if (bankConnections?.data?.find((bank) => bank.expires_at === null)) {
54 |     return null;
55 |   }
56 |
57 |   const { warning, error, show } = getConnectionsStatus(bankConnections.data);
58 |
59 |   if (!show) {
60 |     return null;
61 |   }
62 |
63 |   return (
64 |     <TooltipProvider delayDuration={70}>
65 |       <Tooltip>
66 |         <TooltipTrigger asChild>
67 |           <Link href="/settings/accounts" prefetch>
68 |             <Button
69 |               variant="outline"
70 |               size="icon"
71 |               className="rounded-full w-8 h-8 items-center hidden md:flex"
72 |             >
73 |               <Icons.Error
74 |                 size={16}
75 |                 className={cn(
76 |                   error && "text-[#FF3638]",
77 |                   warning && "text-[#FFD02B]",
78 |                 )}
79 |               />
80 |             </Button>
81 |           </Link>
82 |         </TooltipTrigger>
83 |
84 |         <TooltipContent
85 |           className="px-3 py-1.5 text-xs max-w-[230px]"
86 |           sideOffset={10}
87 |         >
88 |           The connection is expiring soon, update your connection.
89 |         </TooltipContent>
90 |       </Tooltip>
91 |     </TooltipProvider>
92 |   );
93 | }
```

apps/dashboard/src/components/consent-banner.tsx
```
1 | "use client";
2 |
3 | import { trackingConsentAction } from "@/actions/tracking-consent-action";
4 | import { Button } from "@midday/ui/button";
5 | import { cn } from "@midday/ui/cn";
6 | import { useAction } from "next-safe-action/hooks";
7 | import { useState } from "react";
8 |
9 | export function ConsentBanner() {
10 |   const [isOpen, setOpen] = useState(true);
11 |   const trackingAction = useAction(trackingConsentAction, {
12 |     onExecute: () => setOpen(false),
13 |   });
14 |
15 |   if (!isOpen) {
16 |     return null;
17 |   }
18 |
19 |   return (
20 |     <div
21 |       className={cn(
22 |         "fixed z-50 bottom-2 md:bottom-4 left-2 md:left-4 flex flex-col space-y-4 w-[calc(100vw-16px)] max-w-[420px] border border-border p-4 transition-all bg-background",
23 |         isOpen &&
24 |           "animate-in sm:slide-in-from-bottom-full slide-in-from-bottom-full",
25 |       )}
26 |     >
27 |       <div className="text-sm">
28 |         This site uses tracking technologies. You may opt in or opt out of the
29 |         use of these technologies.
30 |       </div>
31 |       <div className="flex justify-end space-x-2">
32 |         <Button
33 |           className="rounded-full h-8"
34 |           onClick={() => trackingAction.execute(false)}
35 |         >
36 |           Deny
37 |         </Button>
38 |         <Button
39 |           className="rounded-full h-8"
40 |           onClick={() => trackingAction.execute(true)}
41 |         >
42 |           Accept
43 |         </Button>
44 |       </div>
45 |     </div>
46 |   );
47 | }
```

apps/dashboard/src/components/copy-input.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { Icons } from "@midday/ui/icons";
5 | import { motion } from "framer-motion";
6 | import { useState } from "react";
7 |
8 | type Props = {
9 |   value: string;
10 |   className?: string;
11 | };
12 |
13 | export function CopyInput({ value, className }: Props) {
14 |   const [isCopied, setCopied] = useState(false);
15 |
16 |   const handleClipboard = async () => {
17 |     try {
18 |       setCopied(true);
19 |
20 |       await navigator.clipboard.writeText(value);
21 |
22 |       setTimeout(() => {
23 |         setCopied(false);
24 |       }, 2000);
25 |     } catch {}
26 |   };
27 |
28 |   return (
29 |     <button
30 |       type="button"
31 |       onClick={handleClipboard}
32 |       className={cn(
33 |         "flex items-center relative w-full border py-2 px-4 cursor-pointer",
34 |         className,
35 |       )}
36 |     >
37 |       <div className="pr-8 text-[#878787] text-sm truncate">{value}</div>
38 |
39 |       <motion.div
40 |         className="absolute right-4 top-2.5"
41 |         initial={{ opacity: 1, scale: 1 }}
42 |         animate={{ opacity: isCopied ? 0 : 1, scale: isCopied ? 0 : 1 }}
43 |       >
44 |         <Icons.Copy />
45 |       </motion.div>
46 |
47 |       <motion.div
48 |         className="absolute right-4 top-2.5"
49 |         initial={{ opacity: 0, scale: 0 }}
50 |         animate={{ opacity: isCopied ? 1 : 0, scale: isCopied ? 1 : 0 }}
51 |       >
52 |         <Icons.Check />
53 |       </motion.div>
54 |     </button>
55 |   );
56 | }
```

apps/dashboard/src/components/country-selector.tsx
```
1 | import countries from "@midday/location/country-flags";
2 | import { Button } from "@midday/ui/button";
3 | import { cn } from "@midday/ui/cn";
4 | import {
5 |   Command,
6 |   CommandEmpty,
7 |   CommandGroup,
8 |   CommandInput,
9 |   CommandItem,
10 | } from "@midday/ui/command";
11 | import {
12 |   Popover,
13 |   PopoverContentWithoutPortal,
14 |   PopoverTrigger,
15 | } from "@midday/ui/popover";
16 | import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
17 | import * as React from "react";
18 | import { useEffect } from "react";
19 |
20 | type Props = {
21 |   defaultValue: string;
22 |   onSelect: (countryCode: string, countryName: string) => void;
23 | };
24 |
25 | export function CountrySelector({ defaultValue, onSelect }: Props) {
26 |   const [open, setOpen] = React.useState(false);
27 |   const [value, setValue] = React.useState(defaultValue);
28 |
29 |   useEffect(() => {
30 |     if (value !== defaultValue) {
31 |       setValue(defaultValue);
32 |     }
33 |   }, [defaultValue, value]);
34 |
35 |   const selected = Object.values(countries).find(
36 |     (country) => country.code === value || country.name === value,
37 |   );
38 |
39 |   return (
40 |     <Popover open={open} onOpenChange={setOpen}>
41 |       <PopoverTrigger asChild>
42 |         <Button
43 |           variant="outline"
44 |           aria-expanded={open}
45 |           className="w-full justify-between font-normal truncate bg-accent"
46 |         >
47 |           {value ? selected?.name : "Select country"}
48 |           <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
49 |         </Button>
50 |       </PopoverTrigger>
51 |       <PopoverContentWithoutPortal className="w-[225px] p-0">
52 |         <Command>
53 |           <CommandInput placeholder="Search country..." className="h-9 px-2" />
54 |           <CommandEmpty>No country found.</CommandEmpty>
55 |           <CommandGroup className="overflow-y-auto max-h-[230px] pt-2">
56 |             {Object.values(countries).map((country) => (
57 |               <CommandItem
58 |                 key={country.code}
59 |                 value={country.name}
60 |                 onSelect={() => {
61 |                   setValue(country.code);
62 |                   onSelect?.(country.code, country.name);
63 |                   setOpen(false);
64 |                 }}
65 |               >
66 |                 {country.name}
67 |                 <CheckIcon
68 |                   className={cn(
69 |                     "ml-auto h-4 w-4",
70 |                     value === country.code ? "opacity-100" : "opacity-0",
71 |                   )}
72 |                 />
73 |               </CommandItem>
74 |             ))}
75 |           </CommandGroup>
76 |         </Command>
77 |       </PopoverContentWithoutPortal>
78 |     </Popover>
79 |   );
80 | }
```

apps/dashboard/src/components/customer-header.tsx
```
1 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
2 | import { InvoiceStatus } from "./invoice-status";
3 |
4 | type Props = {
5 |   name: string;
6 |   website: string;
7 |   status: "overdue" | "paid" | "unpaid" | "draft" | "canceled";
8 | };
9 |
10 | export default function CustomerHeader({ name, website, status }: Props) {
11 |   return (
12 |     <div className="flex justify-between items-center mb-4">
13 |       <div className="flex items-center space-x-2">
14 |         {name && (
15 |           <Avatar className="size-5 object-contain border border-border">
16 |             {website && (
17 |               <AvatarImageNext
18 |                 src={`https://img.logo.dev/${website}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=60`}
19 |                 alt={`${name} logo`}
20 |                 width={20}
21 |                 height={20}
22 |                 quality={100}
23 |               />
24 |             )}
25 |             <AvatarFallback className="text-[9px] font-medium">
26 |               {name?.[0]}
27 |             </AvatarFallback>
28 |           </Avatar>
29 |         )}
30 |         <span className="truncate text-sm">{name}</span>
31 |       </div>
32 |
33 |       <InvoiceStatus status={status} />
34 |     </div>
35 |   );
36 | }
```

apps/dashboard/src/components/customers-header.tsx
```
1 | import { OpenCustomerSheet } from "./open-customer-sheet";
2 | import { SearchField } from "./search-field";
3 |
4 | export async function CustomersHeader() {
5 |   return (
6 |     <div className="flex items-center justify-between">
7 |       <SearchField placeholder="Search customers" />
8 |
9 |       <div className="hidden sm:block">
10 |         <OpenCustomerSheet />
11 |       </div>
12 |     </div>
13 |   );
14 | }
```

apps/dashboard/src/components/date-format-settings.tsx
```
1 | "use client";
2 |
3 | import { updateUserAction } from "@/actions/update-user-action";
4 | import {
5 |   Card,
6 |   CardContent,
7 |   CardDescription,
8 |   CardHeader,
9 |   CardTitle,
10 | } from "@midday/ui/card";
11 | import {
12 |   Select,
13 |   SelectContent,
14 |   SelectItem,
15 |   SelectTrigger,
16 |   SelectValue,
17 | } from "@midday/ui/select";
18 | import { useAction } from "next-safe-action/hooks";
19 |
20 | type Props = {
21 |   dateFormat: string;
22 | };
23 |
24 | export function DateFormatSettings({ dateFormat }: Props) {
25 |   const action = useAction(updateUserAction);
26 |
27 |   return (
28 |     <Card className="flex justify-between items-center">
29 |       <CardHeader>
30 |         <CardTitle>Date Display Format</CardTitle>
31 |         <CardDescription>
32 |           Select the format used to display dates throughout the app.
33 |         </CardDescription>
34 |       </CardHeader>
35 |
36 |       <CardContent>
37 |         <Select
38 |           defaultValue={dateFormat}
39 |           onValueChange={(value) => {
40 |             action.execute({
41 |               date_format: value as "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd",
42 |             });
43 |           }}
44 |         >
45 |           <SelectTrigger className="w-[180px]">
46 |             <SelectValue placeholder="Date format" />
47 |           </SelectTrigger>
48 |           <SelectContent>
49 |             <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
50 |             <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
51 |             <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
52 |           </SelectContent>
53 |         </Select>
54 |       </CardContent>
55 |     </Card>
56 |   );
57 | }
```

apps/dashboard/src/components/default-settings.server.tsx
```
1 | import { getTimezone } from "@midday/location";
2 | import { getLocale } from "@midday/location";
3 | import { getDateFormat } from "@midday/location";
4 | import { getUser } from "@midday/supabase/cached-queries";
5 | import { createClient } from "@midday/supabase/server";
6 |
7 | export async function DefaultSettings() {
8 |   const supabase = createClient();
9 |
10 |   const locale = getLocale();
11 |   const timezone = getTimezone();
12 |   const dateFormat = getDateFormat();
13 |
14 |   try {
15 |     const user = await getUser();
16 |
17 |     const { id, date_format } = user?.data ?? {};
18 |
19 |     // Set default date format if not set
20 |     if (!date_format && id) {
21 |       await supabase
22 |         .from("users")
23 |         .update({
24 |           date_format: dateFormat,
25 |           timezone,
26 |           locale,
27 |         })
28 |         .eq("id", id);
29 |     }
30 |   } catch (error) {
31 |     console.error(error);
32 |   }
33 |
34 |   return null;
35 | }
```

apps/dashboard/src/components/delete-account.tsx
```
1 | "use client";
2 |
3 | import { deleteUserAction } from "@/actions/delete-user-action";
4 | import {
5 |   AlertDialog,
6 |   AlertDialogAction,
7 |   AlertDialogCancel,
8 |   AlertDialogContent,
9 |   AlertDialogDescription,
10 |   AlertDialogFooter,
11 |   AlertDialogHeader,
12 |   AlertDialogTitle,
13 |   AlertDialogTrigger,
14 | } from "@midday/ui/alert-dialog";
15 | import { Button } from "@midday/ui/button";
16 | import {
17 |   Card,
18 |   CardDescription,
19 |   CardFooter,
20 |   CardHeader,
21 |   CardTitle,
22 | } from "@midday/ui/card";
23 | import { Input } from "@midday/ui/input";
24 | import { Label } from "@midday/ui/label";
25 | import { Loader2 } from "lucide-react";
26 | import { useState, useTransition } from "react";
27 |
28 | export function DeleteAccount() {
29 |   const [isPending, startTransition] = useTransition();
30 |   const [value, setValue] = useState("");
31 |
32 |   return (
33 |     <Card className="border-destructive">
34 |       <CardHeader>
35 |         <CardTitle>Delete account</CardTitle>
36 |         <CardDescription>
37 |           Permanently remove your Personal Account and all of its contents from
38 |           the Midday platform. This action is not reversible, so please continue
39 |           with caution.
40 |         </CardDescription>
41 |       </CardHeader>
42 |       <CardFooter className="flex justify-between">
43 |         <div />
44 |
45 |         <AlertDialog>
46 |           <AlertDialogTrigger asChild>
47 |             <Button
48 |               variant="destructive"
49 |               className="hover:bg-destructive text-muted"
50 |             >
51 |               Delete
52 |             </Button>
53 |           </AlertDialogTrigger>
54 |           <AlertDialogContent>
55 |             <AlertDialogHeader>
56 |               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
57 |               <AlertDialogDescription>
58 |                 This action cannot be undone. This will permanently delete your
59 |                 account and remove your data from our servers.
60 |               </AlertDialogDescription>
61 |             </AlertDialogHeader>
62 |
63 |             <div className="flex flex-col gap-2 mt-2">
64 |               <Label htmlFor="confirm-delete">
65 |                 Type <span className="font-medium">DELETE</span> to confirm.
66 |               </Label>
67 |               <Input
68 |                 id="confirm-delete"
69 |                 value={value}
70 |                 onChange={(e) => setValue(e.target.value)}
71 |               />
72 |             </div>
73 |
74 |             <AlertDialogFooter>
75 |               <AlertDialogCancel>Cancel</AlertDialogCancel>
76 |               <AlertDialogAction
77 |                 onClick={() => startTransition(() => deleteUserAction())}
78 |                 disabled={value !== "DELETE"}
79 |               >
80 |                 {isPending ? (
81 |                   <Loader2 className="h-4 w-4 animate-spin" />
82 |                 ) : (
83 |                   "Continue"
84 |                 )}
85 |               </AlertDialogAction>
86 |             </AlertDialogFooter>
87 |           </AlertDialogContent>
88 |         </AlertDialog>
89 |       </CardFooter>
90 |     </Card>
91 |   );
92 | }
```

apps/dashboard/src/components/delete-team.tsx
```
1 | "use client";
2 |
3 | import { deleteTeamAction } from "@/actions/delete-team-action";
4 | import {
5 |   AlertDialog,
6 |   AlertDialogAction,
7 |   AlertDialogCancel,
8 |   AlertDialogContent,
9 |   AlertDialogDescription,
10 |   AlertDialogFooter,
11 |   AlertDialogHeader,
12 |   AlertDialogTitle,
13 |   AlertDialogTrigger,
14 | } from "@midday/ui/alert-dialog";
15 | import { Button } from "@midday/ui/button";
16 | import {
17 |   Card,
18 |   CardDescription,
19 |   CardFooter,
20 |   CardHeader,
21 |   CardTitle,
22 | } from "@midday/ui/card";
23 | import { Input } from "@midday/ui/input";
24 | import { Label } from "@midday/ui/label";
25 | import { Loader2 } from "lucide-react";
26 | import { useAction } from "next-safe-action/hooks";
27 | import { useRouter } from "next/navigation";
28 | import { useState } from "react";
29 |
30 | interface DeleteTeamProps {
31 |   teamId: string;
32 | }
33 |
34 | export function DeleteTeam({ teamId }: DeleteTeamProps) {
35 |   const [value, setValue] = useState("");
36 |
37 |   const router = useRouter();
38 |   const deleteTeam = useAction(deleteTeamAction, {
39 |     onSuccess: () => router.push("/teams"),
40 |   });
41 |
42 |   return (
43 |     <Card className="border-destructive">
44 |       <CardHeader>
45 |         <CardTitle>Delete team</CardTitle>
46 |         <CardDescription>
47 |           Permanently remove your Team and all of its contents from the Midday
48 |           platform. This action is not reversible — please continue with
49 |           caution.
50 |         </CardDescription>
51 |       </CardHeader>
52 |       <CardFooter className="flex justify-between">
53 |         <div />
54 |
55 |         <AlertDialog>
56 |           <AlertDialogTrigger asChild>
57 |             <Button
58 |               variant="destructive"
59 |               className="hover:bg-destructive text-muted"
60 |             >
61 |               Delete
62 |             </Button>
63 |           </AlertDialogTrigger>
64 |           <AlertDialogContent>
65 |             <AlertDialogHeader>
66 |               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
67 |               <AlertDialogDescription>
68 |                 This action cannot be undone. This will permanently delete your
69 |                 team and remove your data from our servers.
70 |               </AlertDialogDescription>
71 |             </AlertDialogHeader>
72 |
73 |             <div className="flex flex-col gap-2 mt-2">
74 |               <Label htmlFor="confirm-delete">
75 |                 Type <span className="font-medium">DELETE</span> to confirm.
76 |               </Label>
77 |               <Input
78 |                 id="confirm-delete"
79 |                 value={value}
80 |                 onChange={(e) => setValue(e.target.value)}
81 |               />
82 |             </div>
83 |
84 |             <AlertDialogFooter>
85 |               <AlertDialogCancel>Cancel</AlertDialogCancel>
86 |               <AlertDialogAction
87 |                 onClick={() => deleteTeam.execute({ teamId })}
88 |                 disabled={value !== "DELETE"}
89 |               >
90 |                 {deleteTeam.status === "executing" ? (
91 |                   <Loader2 className="h-4 w-4 animate-spin" />
92 |                 ) : (
93 |                   "Confirm"
94 |                 )}
95 |               </AlertDialogAction>
96 |             </AlertDialogFooter>
97 |           </AlertDialogContent>
98 |         </AlertDialog>
99 |       </CardFooter>
100 |     </Card>
101 |   );
102 | }
```

apps/dashboard/src/components/desktop-command-menu-sign-in.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { Icons } from "@midday/ui/icons";
5 |
6 | export function DesktopCommandMenuSignIn() {
7 |   return (
8 |     <div className="flex h-full flex-col">
9 |       <Icons.Logo className="absolute top-8 left-8" />
10 |
11 |       <div className="flex items-center w-full justify-center h-full">
12 |         <a href="midday://">
13 |           <Button variant="outline">Login to Midday</Button>
14 |         </a>
15 |       </div>
16 |     </div>
17 |   );
18 | }
```

apps/dashboard/src/components/desktop-sign-in-verify-code.tsx
```
1 | "use client";
2 |
3 | import Image from "next/image";
4 | import appIcon from "public/appicon.png";
5 | import { useEffect, useRef } from "react";
6 |
7 | interface DesktopSignInVerifyCodeProps {
8 |   code: string;
9 | }
10 |
11 | export function DesktopSignInVerifyCode({
12 |   code,
13 | }: DesktopSignInVerifyCodeProps) {
14 |   const hasRunned = useRef(false);
15 |
16 |   useEffect(() => {
17 |     if (code && !hasRunned.current) {
18 |       window.location.replace(`midday://api/auth/callback?code=${code}`);
19 |       hasRunned.current = true;
20 |     }
21 |   }, [code]);
22 |
23 |   return (
24 |     <div>
25 |       <div className="h-screen flex flex-col items-center justify-center text-center text-sm text-[#606060]">
26 |         <Image
27 |           src={appIcon}
28 |           width={80}
29 |           height={80}
30 |           alt="Midday"
31 |           quality={100}
32 |           className="mb-10"
33 |         />
34 |         <p>Signing in...</p>
35 |         <p className="mb-4">
36 |           If Midday dosen't open in a few seconds,{" "}
37 |           <a
38 |             className="underline"
39 |             href={`midday://api/auth/callback?code=${code}`}
40 |           >
41 |             click here
42 |           </a>
43 |           .
44 |         </p>
45 |         <p>You may close this browser tab when done</p>
46 |       </div>
47 |     </div>
48 |   );
49 | }
```

apps/dashboard/src/components/desktop-traffic-light.tsx
```
1 | import { DesktopUpdate } from "@/desktop/components/desktop-update";
2 |
3 | export function DesktopTrafficLight() {
4 |   return (
5 |     <div className="fixed top-[9px] left-[9px] flex space-x-[8px] invisible todesktop:visible z-10">
6 |       <div className="w-[11px] h-[11px] bg-border rounded-full" />
7 |       <div className="w-[11px] h-[11px] bg-border rounded-full" />
8 |       <div className="w-[11px] h-[11px] bg-border rounded-full" />
9 |       <DesktopUpdate />
10 |     </div>
11 |   );
12 | }
```

apps/dashboard/src/components/display-name.tsx
```
1 | "use client";
2 |
3 | import { type UpdateUserFormValues, updateUserSchema } from "@/actions/schema";
4 | import { updateUserAction } from "@/actions/update-user-action";
5 | import { zodResolver } from "@hookform/resolvers/zod";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   Card,
9 |   CardContent,
10 |   CardDescription,
11 |   CardFooter,
12 |   CardHeader,
13 |   CardTitle,
14 | } from "@midday/ui/card";
15 | import {
16 |   Form,
17 |   FormControl,
18 |   FormField,
19 |   FormItem,
20 |   FormMessage,
21 | } from "@midday/ui/form";
22 | import { Input } from "@midday/ui/input";
23 | import { Loader2 } from "lucide-react";
24 | import { useAction } from "next-safe-action/hooks";
25 | import { useForm } from "react-hook-form";
26 |
27 | type Props = {
28 |   fullName: string;
29 | };
30 |
31 | export function DisplayName({ fullName }: Props) {
32 |   const action = useAction(updateUserAction);
33 |   const form = useForm<UpdateUserFormValues>({
34 |     resolver: zodResolver(updateUserSchema),
35 |     defaultValues: {
36 |       full_name: fullName,
37 |     },
38 |   });
39 |
40 |   const onSubmit = form.handleSubmit((data) => {
41 |     action.execute({
42 |       full_name: data?.full_name,
43 |     });
44 |   });
45 |
46 |   return (
47 |     <Form {...form}>
48 |       <form onSubmit={onSubmit}>
49 |         <Card>
50 |           <CardHeader>
51 |             <CardTitle>Display Name</CardTitle>
52 |             <CardDescription>
53 |               Please enter your full name, or a display name you are comfortable
54 |               with.
55 |             </CardDescription>
56 |           </CardHeader>
57 |
58 |           <CardContent>
59 |             <FormField
60 |               control={form.control}
61 |               name="full_name"
62 |               render={({ field }) => (
63 |                 <FormItem>
64 |                   <FormControl>
65 |                     <Input
66 |                       {...field}
67 |                       className="max-w-[300px]"
68 |                       autoComplete="off"
69 |                       autoCapitalize="none"
70 |                       autoCorrect="off"
71 |                       spellCheck="false"
72 |                       maxLength={32}
73 |                     />
74 |                   </FormControl>
75 |                   <FormMessage />
76 |                 </FormItem>
77 |               )}
78 |             />
79 |           </CardContent>
80 |
81 |           <CardFooter className="flex justify-between">
82 |             <div>Please use 32 characters at maximum.</div>
83 |             <Button type="submit" disabled={action.status === "executing"}>
84 |               {action.status === "executing" ? (
85 |                 <Loader2 className="h-4 w-4 animate-spin" />
86 |               ) : (
87 |                 "Save"
88 |               )}
89 |             </Button>
90 |           </CardFooter>
91 |         </Card>
92 |       </form>
93 |     </Form>
94 |   );
95 | }
```

apps/dashboard/src/components/enroll-mfa.tsx
```
1 | import { createClient } from "@midday/supabase/client";
2 | import { Button } from "@midday/ui/button";
3 | import {
4 |   Collapsible,
5 |   CollapsibleContent,
6 |   CollapsibleTrigger,
7 | } from "@midday/ui/collapsible";
8 | import { InputOTP, InputOTPGroup, InputOTPSlot } from "@midday/ui/input-otp";
9 | import { CaretSortIcon } from "@radix-ui/react-icons";
10 | import Image from "next/image";
11 | import { useRouter } from "next/navigation";
12 | import { useEffect, useState } from "react";
13 | import { CopyInput } from "./copy-input";
14 |
15 | export function EnrollMFA() {
16 |   const supabase = createClient();
17 |   const router = useRouter();
18 |   const [isValidating, setValidating] = useState(false);
19 |   const [factorId, setFactorId] = useState("");
20 |   const [qr, setQR] = useState("");
21 |   const [secret, setSecret] = useState();
22 |   const [error, setError] = useState(false);
23 |   const [isOpen, setIsOpen] = useState(false);
24 |
25 |   const onComplete = async (code: string) => {
26 |     setError(false);
27 |
28 |     if (!isValidating) {
29 |       setValidating(true);
30 |
31 |       const challenge = await supabase.auth.mfa.challenge({ factorId });
32 |
33 |       const verify = await supabase.auth.mfa.verify({
34 |         factorId,
35 |         challengeId: challenge.data.id,
36 |         code,
37 |       });
38 |
39 |       if (verify.data) {
40 |         router.replace("/");
41 |       }
42 |     }
43 |   };
44 |
45 |   useEffect(() => {
46 |     async function enroll() {
47 |       const { data, error } = await supabase.auth.mfa.enroll({
48 |         factorType: "totp",
49 |         issuer: "app.midday.ai",
50 |       });
51 |
52 |       if (error) {
53 |         throw error;
54 |       }
55 |
56 |       setFactorId(data.id);
57 |
58 |       setQR(data.totp.qr_code);
59 |       setSecret(data.totp.secret);
60 |     }
61 |
62 |     enroll();
63 |   }, []);
64 |
65 |   const handleOnCancel = () => {
66 |     supabase.auth.mfa.unenroll({
67 |       factorId,
68 |     });
69 |
70 |     router.push("/");
71 |   };
72 |
73 |   return (
74 |     <>
75 |       <div className="flex items-center justify-center">
76 |         <div className="w-[220px] h-[220px] bg-white rounded-md">
77 |           {qr && (
78 |             <Image src={qr} alt="qr" width={220} height={220} quality={100} />
79 |           )}
80 |         </div>
81 |       </div>
82 |       <div className="my-8">
83 |         <p className="font-medium pb-1 text-2xl text-[#606060]">
84 |           Use an authenticator app to scan the following QR code, and provide
85 |           the code to complete the setup.
86 |         </p>
87 |       </div>
88 |
89 |       <Collapsible
90 |         open={isOpen}
91 |         onOpenChange={setIsOpen}
92 |         className="w-full mb-4"
93 |       >
94 |         <CollapsibleTrigger className="p-0 text-sm w-full">
95 |           <div className="flex items-center justify-between">
96 |             <span className="font-medium">Use setup key</span>
97 |             <CaretSortIcon className="h-4 w-4" />
98 |           </div>
99 |         </CollapsibleTrigger>
100 |         <CollapsibleContent>
101 |           {secret && <CopyInput value={secret} className="w-full" />}
102 |         </CollapsibleContent>
103 |       </Collapsible>
104 |
105 |       <div className="flex w-full">
106 |         <InputOTP
107 |           className={error ? "invalid" : ""}
108 |           maxLength={6}
109 |           autoFocus
110 |           onComplete={onComplete}
111 |           disabled={isValidating}
112 |           render={({ slots }) => (
113 |             <InputOTPGroup>
114 |               {slots.map((slot, index) => (
115 |                 <InputOTPSlot key={index.toString()} {...slot} />
116 |               ))}
117 |             </InputOTPGroup>
118 |           )}
119 |         />
120 |       </div>
121 |
122 |       <div className="flex border-t-[1px] pt-4 mt-6 justify-center mb-6">
123 |         <Button
124 |           onClick={handleOnCancel}
125 |           variant="ghost"
126 |           className="text-medium text-sm hover:bg-transparent"
127 |         >
128 |           Cancel
129 |         </Button>
130 |       </div>
131 |     </>
132 |   );
133 | }
```

apps/dashboard/src/components/error-fallback.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { useRouter } from "next/navigation";
5 |
6 | export function ErrorFallback() {
7 |   const router = useRouter();
8 |
9 |   return (
10 |     <div className="flex flex-col items-center justify-center h-full space-y-4">
11 |       <div>
12 |         <h2 className="text-md">Something went wrong</h2>
13 |       </div>
14 |       <Button onClick={() => router.refresh()} variant="outline">
15 |         Try again
16 |       </Button>
17 |     </div>
18 |   );
19 | }
```

apps/dashboard/src/components/experimental.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 |
3 | type Props = {
4 |   className?: string;
5 | };
6 |
7 | export function Experimental({ className }: Props) {
8 |   return (
9 |     <span
10 |       className={cn(
11 |         "flex items-center py-[3px] px-3 rounded-full border border-primary text-[10px] h-full font-normal",
12 |         className
13 |       )}
14 |     >
15 |       Experimental
16 |     </span>
17 |   );
18 | }
```

apps/dashboard/src/components/export-status.tsx
```
1 | "use client";
2 |
3 | import { shareFileAction } from "@/actions/share-file-action";
4 | import { useExportStatus } from "@/hooks/use-export-status";
5 | import { useExportStore } from "@/store/export";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   DropdownMenu,
9 |   DropdownMenuContent,
10 |   DropdownMenuItem,
11 |   DropdownMenuTrigger,
12 | } from "@midday/ui/dropdown-menu";
13 | import { Icons } from "@midday/ui/icons";
14 | import { useToast } from "@midday/ui/use-toast";
15 | import ms from "ms";
16 | import { useAction } from "next-safe-action/hooks";
17 | import { useEffect, useState } from "react";
18 |
19 | const options = [
20 |   {
21 |     label: "Expire in 1 week",
22 |     expireIn: ms("7d"),
23 |   },
24 |   {
25 |     label: "Expire in 1 month",
26 |     expireIn: ms("30d"),
27 |   },
28 |   {
29 |     label: "Expire in 1 year",
30 |     expireIn: ms("1y"),
31 |   },
32 | ];
33 |
34 | export function ExportStatus() {
35 |   const { toast, dismiss, update } = useToast();
36 |   const [toastId, setToastId] = useState(null);
37 |   const { exportData, setExportData } = useExportStore();
38 |   const { status, progress, result } = useExportStatus(exportData);
39 |
40 |   const shareFile = useAction(shareFileAction, {
41 |     onError: () => {
42 |       toast({
43 |         duration: 2500,
44 |         variant: "error",
45 |         title: "Something went wrong please try again.",
46 |       });
47 |     },
48 |     onSuccess: async ({ data }) => {
49 |       await navigator.clipboard.writeText(data ?? "");
50 |
51 |       toast({
52 |         duration: 2500,
53 |         title: "Copied URL to clipboard.",
54 |         variant: "success",
55 |       });
56 |     },
57 |   });
58 |
59 |   const handleOnDownload = () => {
60 |     dismiss(toastId);
61 |   };
62 |
63 |   const handleOnShare = ({ expireIn, filename }) => {
64 |     shareFile.execute({ expireIn, filepath: `exports/${filename}` });
65 |     dismiss(toastId);
66 |   };
67 |
68 |   useEffect(() => {
69 |     if (status === "FAILED") {
70 |       toast({
71 |         duration: 2500,
72 |         variant: "error",
73 |         title: "Something went wrong please try again.",
74 |       });
75 |
76 |       setToastId(null);
77 |       setExportData(undefined);
78 |     }
79 |   }, [status]);
80 |
81 |   useEffect(() => {
82 |     if (exportData && !toastId) {
83 |       const { id } = toast({
84 |         title: "Exporting transactions.",
85 |         variant: "progress",
86 |         description: "Please do not close browser until completed",
87 |         duration: Number.POSITIVE_INFINITY,
88 |         progress: 0,
89 |       });
90 |
91 |       setToastId(id);
92 |     } else {
93 |       update(toastId, {
94 |         progress,
95 |       });
96 |     }
97 |
98 |     if (status === "COMPLETED" && result) {
99 |       update(toastId, {
100 |         title: "Export completed",
101 |         description: `Your export is ready based on ${result.totalItems} transactions. It's stored in your Vault.`,
102 |         variant: "success",
103 |         footer: (
104 |           <div className="mt-4 flex space-x-4">
105 |             <DropdownMenu>
106 |               <DropdownMenuTrigger asChild>
107 |                 <Button
108 |                   size="sm"
109 |                   variant="secondary"
110 |                   className="border space-x-2"
111 |                 >
112 |                   <span>Share URL</span>
113 |                   <Icons.ChevronDown />
114 |                 </Button>
115 |               </DropdownMenuTrigger>
116 |               <DropdownMenuContent className="z-[100]">
117 |                 {options.map((option, idx) => (
118 |                   <DropdownMenuItem
119 |                     key={idx.toString()}
120 |                     onClick={() =>
121 |                       handleOnShare({
122 |                         expireIn: option.expireIn,
123 |                         filename: result.fileName,
124 |                       })
125 |                     }
126 |                   >
127 |                     {option.label}
128 |                   </DropdownMenuItem>
129 |                 ))}
130 |               </DropdownMenuContent>
131 |             </DropdownMenu>
132 |
133 |             <a
134 |               href={`/api/download/file?path=exports/${result.fileName}&filename=${result.fileName}`}
135 |               download
136 |             >
137 |               <Button size="sm" onClick={handleOnDownload}>
138 |                 Download
139 |               </Button>
140 |             </a>
141 |           </div>
142 |         ),
143 |       });
144 |
145 |       setToastId(null);
146 |       setExportData(undefined);
147 |     }
148 |   }, [toastId, progress, status]);
149 |
150 |   return null;
151 | }
```

apps/dashboard/src/components/feedback-form.tsx
```
1 | "use client";
2 |
3 | import { sendFeebackAction } from "@/actions/send-feedback-action";
4 | import { Button } from "@midday/ui/button";
5 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
6 | import { Textarea } from "@midday/ui/textarea";
7 | import { Loader2 } from "lucide-react";
8 | import { useAction } from "next-safe-action/hooks";
9 | import { useState } from "react";
10 |
11 | export function FeedbackForm() {
12 |   const [value, setValue] = useState("");
13 |
14 |   const action = useAction(sendFeebackAction, {
15 |     onSuccess: () => {
16 |       setValue("");
17 |     },
18 |   });
19 |
20 |   return (
21 |     <Popover>
22 |       <PopoverTrigger asChild className="hidden md:block">
23 |         <Button
24 |           variant="outline"
25 |           className="rounded-full font-normal h-[32px] p-0 px-3 text-xs text-[#878787]"
26 |         >
27 |           Beta feedback
28 |         </Button>
29 |       </PopoverTrigger>
30 |       <PopoverContent
31 |         className="w-[320px] h-[200px]"
32 |         sideOffset={10}
33 |         align="end"
34 |       >
35 |         {action.status === "hasSucceeded" ? (
36 |           <div className="flex items-center justify-center flex-col space-y-1 mt-10 text-center">
37 |             <p className="font-medium text-sm">Thank you for your feedback!</p>
38 |             <p className="text-sm text-[#4C4C4C]">
39 |               We will be back with you as soon as possible
40 |             </p>
41 |           </div>
42 |         ) : (
43 |           <form className="space-y-4">
44 |             <Textarea
45 |               name="feedback"
46 |               value={value}
47 |               required
48 |               autoFocus
49 |               placeholder="Ideas to improve this page or issues you are experiencing."
50 |               className="resize-none h-[120px]"
51 |               onChange={(evt) => setValue(evt.target.value)}
52 |             />
53 |
54 |             <div className="mt-1 flex items-center justify-end">
55 |               <Button
56 |                 type="button"
57 |                 onClick={() => action.execute({ feedback: value })}
58 |                 disabled={value.length === 0 || action.status === "executing"}
59 |               >
60 |                 {action.status === "executing" ? (
61 |                   <Loader2 className="h-4 w-4 animate-spin" />
62 |                 ) : (
63 |                   "Send"
64 |                 )}
65 |               </Button>
66 |             </div>
67 |           </form>
68 |         )}
69 |       </PopoverContent>
70 |     </Popover>
71 |   );
72 | }
```

apps/dashboard/src/components/file-icon.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { Icons } from "@midday/ui/icons";
3 |
4 | type FileIconProps = {
5 |   mimetype: string;
6 |   name: string;
7 |   isFolder: boolean;
8 |   size?: number;
9 |   className?: string;
10 | };
11 |
12 | export function FileIcon({
13 |   mimetype,
14 |   name,
15 |   isFolder,
16 |   size = 16,
17 |   className,
18 | }: FileIconProps) {
19 |   if (name === "exports") {
20 |     return (
21 |       <Icons.DriveFileMove
22 |         size={size}
23 |         className={cn("text-[#878787]", className)}
24 |       />
25 |     );
26 |   }
27 |
28 |   if (name === "inbox") {
29 |     return (
30 |       <Icons.FolderSpecial
31 |         size={size}
32 |         className={cn("text-[#878787]", className)}
33 |       />
34 |     );
35 |   }
36 |
37 |   if (name === "imports") {
38 |     return (
39 |       <Icons.FolderImports
40 |         size={size}
41 |         className={cn("text-[#878787]", className)}
42 |       />
43 |     );
44 |   }
45 |
46 |   if (name === "invoices") {
47 |     return (
48 |       <Icons.SnippetFolder
49 |         size={size}
50 |         className={cn("text-[#878787]", className)}
51 |       />
52 |     );
53 |   }
54 |
55 |   if (name === "transactions") {
56 |     return (
57 |       <Icons.FolderTransactions
58 |         size={size}
59 |         className={cn("text-[#878787]", className)}
60 |       />
61 |     );
62 |   }
63 |
64 |   if (mimetype?.startsWith("image")) {
65 |     return (
66 |       <Icons.BrokenImage
67 |         size={size}
68 |         className={cn("text-[#878787]", className)}
69 |       />
70 |     );
71 |   }
72 |
73 |   if (isFolder) {
74 |     return (
75 |       <Icons.Folder size={size} className={cn("text-[#878787]", className)} />
76 |     );
77 |   }
78 |
79 |   switch (mimetype) {
80 |     case "application/pdf":
81 |       return (
82 |         <Icons.Pdf size={size} className={cn("text-[#878787]", className)} />
83 |       );
84 |     case "application/zip":
85 |       return (
86 |         <Icons.FolderZip
87 |           size={size}
88 |           className={cn("text-[#878787]", className)}
89 |         />
90 |       );
91 |     default:
92 |       return (
93 |         <Icons.Description
94 |           size={size}
95 |           className={cn("text-[#878787]", className)}
96 |         />
97 |       );
98 |   }
99 | }
```

apps/dashboard/src/components/file-preview.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { cn } from "@midday/ui/cn";
5 | import {
6 |   Dialog,
7 |   DialogContentFrameless,
8 |   DialogTrigger,
9 | } from "@midday/ui/dialog";
10 | import { Icons } from "@midday/ui/icons";
11 | import { Skeleton } from "@midday/ui/skeleton";
12 | import { FileType } from "@midday/utils";
13 | import { AnimatePresence, motion } from "framer-motion";
14 | import dynamic from "next/dynamic";
15 | import { useState } from "react";
16 | import React from "react";
17 |
18 | const Iframe = dynamic(() => import("./iframe").then((mod) => mod.Iframe), {
19 |   ssr: false,
20 | });
21 |
22 | type Props = {
23 |   type: FileType;
24 |   name: string;
25 |   className?: string;
26 |   preview?: boolean;
27 |   src: string;
28 |   downloadUrl?: string;
29 |   width: number;
30 |   height: number;
31 |   disableFullscreen?: boolean;
32 |   onLoaded?: () => void;
33 |   download?: boolean;
34 |   isFullscreen?: boolean;
35 |   delay?: number;
36 | };
37 |
38 | const RenderComponent = ({
39 |   type,
40 |   src,
41 |   className,
42 |   width,
43 |   height,
44 |   preview,
45 |   onLoaded,
46 |   setError,
47 |   delay,
48 | }: {
49 |   type: FileType;
50 |   src: string;
51 |   className?: string;
52 |   width: number;
53 |   height: number;
54 |   preview?: boolean;
55 |   onLoaded: (loaded: boolean) => void;
56 |   setError: (error: boolean) => void;
57 |   delay?: number;
58 | }) => {
59 |   const handleOnLoaded = () => {
60 |     onLoaded(true);
61 |   };
62 |
63 |   if (type?.startsWith("image")) {
64 |     return (
65 |       <div className={cn("flex items-center justify-center", className)}>
66 |         <img
67 |           src={src}
68 |           className="object-contain"
69 |           alt="Preview"
70 |           onError={() => setError(true)}
71 |           onLoad={handleOnLoaded}
72 |         />
73 |       </div>
74 |     );
75 |   }
76 |
77 |   if (type === FileType.Pdf) {
78 |     return (
79 |       <Iframe
80 |         src={src}
81 |         key={src}
82 |         width={width}
83 |         height={height}
84 |         onLoaded={handleOnLoaded}
85 |         setError={setError}
86 |         preview={preview}
87 |         delay={delay}
88 |       />
89 |     );
90 |   }
91 |
92 |   return null;
93 | };
94 |
95 | const DownloadButton = ({ url }: { url: string }) => (
96 |   <a href={url} download>
97 |     <Button
98 |       variant="secondary"
99 |       className="w-[32px] h-[32px] bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black border"
100 |       size="icon"
101 |     >
102 |       <Icons.FileDownload />
103 |     </Button>
104 |   </a>
105 | );
106 |
107 | const RenderButtons = ({
108 |   preview,
109 |   isLoaded,
110 |   disableFullscreen,
111 |   downloadUrl,
112 | }: {
113 |   preview: boolean;
114 |   isLoaded: boolean;
115 |   disableFullscreen: boolean;
116 |   downloadUrl?: string;
117 | }) => {
118 |   if (preview || !isLoaded) return null;
119 |
120 |   return (
121 |     <div className="absolute bottom-4 left-2 flex space-x-2 z-10">
122 |       {!disableFullscreen && (
123 |         <motion.div
124 |           initial={{ y: 50, opacity: 0 }}
125 |           animate={{ y: 0, opacity: 1 }}
126 |           exit={{ y: -50, opacity: 0 }}
127 |         >
128 |           <DialogTrigger asChild>
129 |             <Button
130 |               variant="secondary"
131 |               className="w-[32px] h-[32px] bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black border"
132 |               size="icon"
133 |             >
134 |               <Icons.OpenInFull />
135 |             </Button>
136 |           </DialogTrigger>
137 |         </motion.div>
138 |       )}
139 |
140 |       {downloadUrl && (
141 |         <motion.div
142 |           initial={{ y: 50, opacity: 0 }}
143 |           animate={{ y: 0, opacity: 1 }}
144 |           exit={{ y: -50, opacity: 0 }}
145 |           transition={{ delay: 0.04 }}
146 |         >
147 |           <DownloadButton url={downloadUrl} />
148 |         </motion.div>
149 |       )}
150 |     </div>
151 |   );
152 | };
153 |
154 | export function FilePreview({
155 |   src,
156 |   className,
157 |   name,
158 |   type,
159 |   preview,
160 |   downloadUrl,
161 |   width,
162 |   height,
163 |   disableFullscreen,
164 |   download = true,
165 |   isFullscreen,
166 |   delay,
167 |   onLoaded,
168 | }: Props) {
169 |   const [isLoaded, setLoaded] = useState(false);
170 |   const [error, setError] = useState(false);
171 |
172 |   function handleLoaded() {
173 |     setLoaded(true);
174 |     onLoaded?.();
175 |   }
176 |
177 |   return (
178 |     <Dialog>
179 |       <div
180 |         className={cn(className, "relative h-full overflow-hidden")}
181 |         style={preview ? { width: width - 2, height: height - 5 } : undefined}
182 |       >
183 |         {!isLoaded && !error && (
184 |           <div className="w-full h-full flex items-center justify-center pointer-events-none">
185 |             <Skeleton
186 |               style={{ width, height }}
[TRUNCATED]
```

apps/dashboard/src/components/filter-list.tsx
```
1 | import { formatAccountName } from "@/utils/format";
2 | import { Button } from "@midday/ui/button";
3 | import { Icons } from "@midday/ui/icons";
4 | import { Skeleton } from "@midday/ui/skeleton";
5 | import { format } from "date-fns";
6 | import { motion } from "framer-motion";
7 | import { formatDateRange } from "little-date";
8 |
9 | const listVariant = {
10 |   hidden: { y: 10, opacity: 0 },
11 |   show: {
12 |     y: 0,
13 |     opacity: 1,
14 |     transition: {
15 |       duration: 0.05,
16 |       staggerChildren: 0.06,
17 |     },
18 |   },
19 | };
20 |
21 | const itemVariant = {
22 |   hidden: { y: 10, opacity: 0 },
23 |   show: { y: 0, opacity: 1 },
24 | };
25 |
26 | type Props = {
27 |   filters: { [key: string]: string | number | boolean | string[] | number[] };
28 |   loading: boolean;
29 |   onRemove: (key: string) => void;
30 |   categories?: { id: string; name: string; slug: string }[];
31 |   accounts?: { id: string; name: string; currency: string }[];
32 |   members?: { id: string; name: string }[];
33 |   customers?: { id: string; name: string }[];
34 |   statusFilters: { id: string; name: string }[];
35 |   attachmentsFilters: { id: string; name: string }[];
36 |   recurringFilters: { id: string; name: string }[];
37 |   tags?: { id: string; name: string; slug?: string }[];
38 |   amountRange?: [number, number];
39 | };
40 |
41 | export function FilterList({
42 |   filters,
43 |   loading,
44 |   onRemove,
45 |   categories,
46 |   accounts,
47 |   members,
48 |   customers,
49 |   tags,
50 |   statusFilters,
51 |   attachmentsFilters,
52 |   recurringFilters,
53 |   amountRange,
54 | }: Props) {
55 |   const renderFilter = ({ key, value }) => {
56 |     switch (key) {
57 |       case "start": {
58 |         if (key === "start" && value && filters.end) {
59 |           return formatDateRange(new Date(value), new Date(filters.end), {
60 |             includeTime: false,
61 |           });
62 |         }
63 |
64 |         return (
65 |           key === "start" && value && format(new Date(value), "MMM d, yyyy")
66 |         );
67 |       }
68 |
69 |       case "amount_range": {
70 |         return `${amountRange?.[0]} - ${amountRange?.[1]}`;
71 |       }
72 |
73 |       case "attachments": {
74 |         return attachmentsFilters?.find((filter) => filter.id === value)?.name;
75 |       }
76 |
77 |       case "recurring": {
78 |         return value
79 |           ?.map(
80 |             (slug) =>
81 |               recurringFilters?.find((filter) => filter.id === slug)?.name,
82 |           )
83 |           .join(", ");
84 |       }
85 |
86 |       case "statuses": {
87 |         return value
88 |           .map(
89 |             (status) =>
90 |               statusFilters.find((filter) => filter.id === status)?.name,
91 |           )
92 |           .join(", ");
93 |       }
94 |
95 |       case "categories": {
96 |         return value
97 |           .map(
98 |             (slug) =>
99 |               categories?.find((category) => category.slug === slug)?.name,
100 |           )
101 |           .join(", ");
102 |       }
103 |
104 |       case "tags": {
105 |         return value
106 |           .map(
107 |             (id) =>
108 |               tags?.find((tag) => tag?.id === id || tag?.slug === id)?.name,
109 |           )
110 |           .join(", ");
111 |       }
112 |
113 |       case "accounts": {
114 |         return value
115 |           .map((id) => {
116 |             const account = accounts?.find((account) => account.id === id);
117 |             return formatAccountName({
118 |               name: account?.name,
119 |               currency: account?.currency,
120 |             });
121 |           })
122 |           .join(", ");
123 |       }
124 |
125 |       case "customers": {
126 |         return value
127 |           .map((id) => customers?.find((customer) => customer.id === id)?.name)
128 |           .join(", ");
129 |       }
130 |
131 |       case "assignees":
132 |       case "owners": {
133 |         return value
134 |           .map((id) => {
135 |             const member = members?.find((member) => member.id === id);
136 |             return member?.name;
137 |           })
138 |           .join(", ");
139 |       }
140 |
141 |       case "q":
142 |         return value;
143 |
144 |       default:
145 |         return null;
146 |     }
147 |   };
148 |
149 |   const handleOnRemove = (key: string) => {
150 |     if (key === "start" || key === "end") {
151 |       onRemove({ start: null, end: null });
152 |       return;
153 |     }
154 |
155 |     onRemove({ [key]: null });
156 |   };
157 |
158 |   return (
159 |     <motion.ul
160 |       variants={listVariant}
161 |       initial="hidden"
162 |       animate="show"
163 |       className="flex space-x-2"
164 |     >
165 |       {loading && (
166 |         <div className="flex space-x-2">
167 |           <motion.li key="1" variants={itemVariant}>
168 |             <Skeleton className="rounded-full h-8 w-[100px]" />
169 |           </motion.li>
170 |           <motion.li key="2" variants={itemVariant}>
171 |             <Skeleton className="rounded-full h-8 w-[100px]" />
172 |           </motion.li>
173 |         </div>
174 |       )}
175 |
176 |       {!loading &&
177 |         Object.entries(filters)
[TRUNCATED]
```

apps/dashboard/src/components/format-amount.tsx
```
1 | "use client";
2 |
3 | import { useUserContext } from "@/store/user/hook";
4 | import { formatAmount } from "@/utils/format";
5 |
6 | type Props = {
7 |   amount: number;
8 |   currency: string;
9 |   maximumFractionDigits?: number;
10 |   minimumFractionDigits?: number;
11 |   locale?: string;
12 | };
13 |
14 | export function FormatAmount({
15 |   amount,
16 |   currency,
17 |   maximumFractionDigits,
18 |   minimumFractionDigits,
19 |   locale,
20 | }: Props) {
21 |   const { data } = useUserContext((state) => state);
22 |
23 |   return formatAmount({
24 |     locale: locale || data?.locale,
25 |     amount: amount,
26 |     currency: currency,
27 |     maximumFractionDigits,
28 |     minimumFractionDigits,
29 |   });
30 | }
```

apps/dashboard/src/components/github-sign-in.tsx
```
1 | "use client";
2 |
3 | import { createClient } from "@midday/supabase/client";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
7 | import { Loader2 } from "lucide-react";
8 | import { useSearchParams } from "next/navigation";
9 | import { useState } from "react";
10 |
11 | export function GithubSignIn() {
12 |   const [isLoading, setLoading] = useState(false);
13 |   const supabase = createClient();
14 |   const searchParams = useSearchParams();
15 |   const returnTo = searchParams.get("return_to");
16 |
17 |   const handleSignIn = async () => {
18 |     setLoading(true);
19 |
20 |     if (isDesktopApp()) {
21 |       const redirectTo = new URL("/api/auth/callback", window.location.origin);
22 |
23 |       redirectTo.searchParams.append("provider", "github");
24 |       redirectTo.searchParams.append("client", "desktop");
25 |
26 |       await supabase.auth.signInWithOAuth({
27 |         provider: "github",
28 |         options: {
29 |           redirectTo: redirectTo.toString(),
30 |           queryParams: {
31 |             client: "desktop",
32 |           },
33 |         },
34 |       });
35 |     } else {
36 |       const redirectTo = new URL("/api/auth/callback", window.location.origin);
37 |
38 |       if (returnTo) {
39 |         redirectTo.searchParams.append("return_to", returnTo);
40 |       }
41 |
42 |       redirectTo.searchParams.append("provider", "github");
43 |
44 |       await supabase.auth.signInWithOAuth({
45 |         provider: "github",
46 |         options: {
47 |           redirectTo: redirectTo.toString(),
48 |         },
49 |       });
50 |     }
51 |   };
52 |
53 |   return (
54 |     <Button
55 |       onClick={handleSignIn}
56 |       className="active:scale-[0.98] bg-primary px-6 py-4 text-secondary font-medium flex space-x-2 h-[40px] w-full"
57 |     >
58 |       {isLoading ? (
59 |         <Loader2 className="h-4 w-4 animate-spin" />
60 |       ) : (
61 |         <>
62 |           <Icons.Github />
63 |           <span>Continue with Github</span>
64 |         </>
65 |       )}
66 |     </Button>
67 |   );
68 | }
```

apps/dashboard/src/components/gocardless-connect.tsx
```
1 | import { createGoCardLessLinkAction } from "@/actions/institutions/create-gocardless-link";
2 | import { useToast } from "@midday/ui/use-toast";
3 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
4 | import { useAction } from "next-safe-action/hooks";
5 | import { BankConnectButton } from "./bank-connect-button";
6 |
7 | type Props = {
8 |   id: string;
9 |   availableHistory: number;
10 |   onSelect: () => void;
11 | };
12 |
13 | export function GoCardLessConnect({ onSelect, id, availableHistory }: Props) {
14 |   const { toast } = useToast();
15 |
16 |   const createGoCardLessLink = useAction(createGoCardLessLinkAction, {
17 |     onError: () => {
18 |       toast({
19 |         duration: 3500,
20 |         variant: "error",
21 |         title: "Something went wrong please try again.",
22 |       });
23 |     },
24 |   });
25 |
26 |   const handleOnSelect = () => {
27 |     onSelect();
28 |
29 |     createGoCardLessLink.execute({
30 |       institutionId: id,
31 |       availableHistory: availableHistory,
32 |       redirectBase: isDesktopApp() ? "midday://" : window.location.origin,
33 |     });
34 |   };
35 |
36 |   return <BankConnectButton onClick={handleOnSelect} />;
37 | }
```

apps/dashboard/src/components/google-sign-in.tsx
```
1 | "use client";
2 |
3 | import { createClient } from "@midday/supabase/client";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
7 | import { Loader2 } from "lucide-react";
8 | import { useSearchParams } from "next/navigation";
9 | import { useState } from "react";
10 |
11 | export function GoogleSignIn() {
12 |   const [isLoading, setLoading] = useState(false);
13 |   const supabase = createClient();
14 |   const searchParams = useSearchParams();
15 |   const returnTo = searchParams.get("return_to");
16 |
17 |   const handleSignIn = async () => {
18 |     setLoading(true);
19 |
20 |     if (isDesktopApp()) {
21 |       const redirectTo = new URL("/api/auth/callback", window.location.origin);
22 |
23 |       redirectTo.searchParams.append("provider", "google");
24 |       redirectTo.searchParams.append("client", "desktop");
25 |
26 |       await supabase.auth.signInWithOAuth({
27 |         provider: "google",
28 |         options: {
29 |           redirectTo: redirectTo.toString(),
30 |           queryParams: {
31 |             client: "desktop",
32 |           },
33 |         },
34 |       });
35 |     } else {
36 |       const redirectTo = new URL("/api/auth/callback", window.location.origin);
37 |
38 |       if (returnTo) {
39 |         redirectTo.searchParams.append("return_to", returnTo);
40 |       }
41 |
42 |       redirectTo.searchParams.append("provider", "google");
43 |
44 |       await supabase.auth.signInWithOAuth({
45 |         provider: "google",
46 |         options: {
47 |           redirectTo: redirectTo.toString(),
48 |         },
49 |       });
50 |     }
51 |   };
52 |
53 |   return (
54 |     <Button
55 |       onClick={handleSignIn}
56 |       className="active:scale-[0.98] bg-primary px-6 py-4 text-secondary font-medium flex space-x-2 h-[40px] w-full"
57 |     >
58 |       {isLoading ? (
59 |         <Loader2 className="h-4 w-4 animate-spin" />
60 |       ) : (
61 |         <>
62 |           <Icons.Google />
63 |           <span>Continue with Google</span>
64 |         </>
65 |       )}
66 |     </Button>
67 |   );
68 | }
```

apps/dashboard/src/components/header.tsx
```
1 | import { AssistantButton } from "@/components/assistant/button";
2 | import { DesktopAssistantButton } from "@/components/assistant/button-desktop";
3 | import { ConnectionStatus } from "@/components/connection-status";
4 | import { NotificationCenter } from "@/components/notification-center";
5 | import { UserMenu } from "@/components/user-menu";
6 | import { BrowserNavigation } from "@/desktop/components/browser-navigation";
7 | import { Skeleton } from "@midday/ui/skeleton";
8 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
9 | import { Suspense } from "react";
10 | import { DesktopTrafficLight } from "./desktop-traffic-light";
11 | import { FeedbackForm } from "./feedback-form";
12 | import { MobileMenu } from "./mobile-menu";
13 |
14 | export function Header() {
15 |   return (
16 |     <header className="-ml-4 -mr-4 md:m-0 z-10 px-4 md:px-0 md:border-b-[1px] flex justify-between pt-4 pb-2 md:pb-4 items-center todesktop:sticky todesktop:top-0 todesktop:bg-background todesktop:border-none sticky md:static top-0 backdrop-filter backdrop-blur-xl md:backdrop-filter md:backdrop-blur-none dark:bg-[#121212] bg-[#fff] bg-opacity-70 ">
17 |       <MobileMenu />
18 |
19 |       {isDesktopApp() && <DesktopTrafficLight />}
20 |       {isDesktopApp() && <BrowserNavigation />}
21 |
22 |       <AssistantButton />
23 |
24 |       <div className="flex space-x-2 ml-auto">
25 |         {isDesktopApp() && <DesktopAssistantButton />}
26 |
27 |         <FeedbackForm />
28 |
29 |         <Suspense>
30 |           <ConnectionStatus />
31 |         </Suspense>
32 |
33 |         <NotificationCenter />
34 |
35 |         <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
36 |           <UserMenu />
37 |         </Suspense>
38 |       </div>
39 |     </header>
40 |   );
41 | }
```

apps/dashboard/src/components/hot-keys.tsx
```
1 | "use client";
2 |
3 | import { signOutAction } from "@/actions/sign-out-action";
4 | import { useRouter } from "next/navigation";
5 | import { useHotkeys } from "react-hotkeys-hook";
6 |
7 | export function HotKeys() {
8 |   const router = useRouter();
9 |
10 |   const handleSignOut = async () => {
11 |     signOutAction();
12 |     router.refresh();
13 |   };
14 |
15 |   useHotkeys("ctrl+m", (evt) => {
16 |     evt.preventDefault();
17 |     router.push("/settings/members");
18 |   });
19 |
20 |   useHotkeys("meta+m", (evt) => {
21 |     evt.preventDefault();
22 |     router.push("/settings/members");
23 |   });
24 |
25 |   useHotkeys("ctrl+e", (evt) => {
26 |     evt.preventDefault();
27 |     router.push("/account/teams");
28 |   });
29 |
30 |   useHotkeys("ctrl+a", (evt) => {
31 |     evt.preventDefault();
32 |     router.push("/apps");
33 |   });
34 |
35 |   useHotkeys("ctrl+meta+p", (evt) => {
36 |     evt.preventDefault();
37 |     router.push("/account");
38 |   });
39 |
40 |   useHotkeys("shift+meta+p", (evt) => {
41 |     evt.preventDefault();
42 |     router.push("/account");
43 |   });
44 |
45 |   useHotkeys("ctrl+meta+q", (evt) => {
46 |     evt.preventDefault();
47 |     handleSignOut();
48 |   });
49 |
50 |   useHotkeys("shift+meta+q", (evt) => {
51 |     evt.preventDefault();
52 |     handleSignOut();
53 |   });
54 |
55 |   return null;
56 | }
```

apps/dashboard/src/components/iframe.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { Skeleton } from "@midday/ui/skeleton";
3 | import { useEffect, useRef, useState } from "react";
4 |
5 | export function Iframe({
6 |   src,
7 |   width,
8 |   height,
9 |   onLoaded,
10 |   setError,
11 |   preview,
12 |   delay = 0,
13 | }: {
14 |   src: string;
15 |   width: number;
16 |   height: number;
17 |   preview: boolean;
18 |   delay?: number;
19 |   onLoaded: (loaded: boolean) => void;
20 |   setError: (error: boolean) => void;
21 | }) {
22 |   const [isLoading, setIsLoading] = useState(true);
23 |   const iframeRef = useRef<HTMLIFrameElement>(null);
24 |   const iframe = iframeRef.current;
25 |
26 |   useEffect(() => {
27 |     if (!iframe) return;
28 |
29 |     const observer = new IntersectionObserver(
30 |       ([entry]) => {
31 |         if (entry?.isIntersecting) {
32 |           iframe.src = iframe.dataset.src as string;
33 |           observer.unobserve(iframe);
34 |         }
35 |       },
36 |       {
37 |         threshold: 0,
38 |       },
39 |     );
40 |
41 |     observer.observe(iframe);
42 |
43 |     return () => {
44 |       observer.disconnect();
45 |     };
46 |   }, [iframe]);
47 |
48 |   useEffect(() => {
49 |     setTimeout(() => {
50 |       onLoaded(true);
51 |     }, delay);
52 |   }, [src]);
53 |
54 |   return (
55 |     <div className="overflow-hidden w-full h-full">
56 |       <iframe
57 |         ref={iframeRef}
58 |         title="Preview"
59 |         data-src={`${src}#toolbar=0&scrollbar=0`}
60 |         width={width}
61 |         height={height}
62 |         allowFullScreen={false}
63 |         loading="lazy"
64 |         className={cn(
65 |           "h-full w-full transition-opacity duration-100",
66 |           isLoading && "opacity-0",
67 |         )}
68 |         style={{
69 |           marginLeft: preview ? 0 : -8,
70 |           marginTop: preview ? 0 : -8,
71 |           width: preview ? width : "calc(100% + 16px)",
72 |           height: preview ? height : "calc(100% + 16px)",
73 |           overflow: "hidden",
74 |         }}
75 |         onLoad={() => {
76 |           setTimeout(() => {
77 |             setIsLoading(false);
78 |           }, 200);
79 |         }}
80 |         onError={() => setError(true)}
81 |       />
82 |
83 |       <Skeleton
84 |         className={cn("w-full h-full absolute", !isLoading && "hidden")}
85 |       />
86 |     </div>
87 |   );
88 | }
```

apps/dashboard/src/components/inbox-details-skeleton.tsx
```
1 | "use client";
2 |
3 | import { Separator } from "@midday/ui/separator";
4 | import { Skeleton } from "@midday/ui/skeleton";
5 |
6 | export function InboxDetailsSkeleton() {
7 |   return (
8 |     <div className="h-[calc(100vh-120px)] overflow-hidden flex-col border w-[1160px] hidden md:flex">
9 |       <div className="flex items-center py-2 h-[52px]">
10 |         <div className="flex items-center gap-2" />
11 |       </div>
12 |
13 |       <Separator />
14 |       <div className="flex flex-1 flex-col">
15 |         <div className="flex items-start p-4">
16 |           <div className="flex items-start gap-4 text-sm">
17 |             <Skeleton className="h-[40px] w-[40px] rounded-full" />
18 |             <div className="grid gap-1 space-y-1">
19 |               <Skeleton className="h-3 w-[100px]" />
20 |               <Skeleton className="h-2 w-[120px]" />
21 |             </div>
22 |           </div>
23 |           <div className="grid gap-1 ml-auto text-right">
24 |             <Skeleton className="h-2 w-[100px] ml-auto" />
25 |             <Skeleton className="h-2 w-[50px] ml-auto" />
26 |           </div>
27 |         </div>
28 |
29 |         <Separator />
30 |       </div>
31 |     </div>
32 |   );
33 | }
```

apps/dashboard/src/components/inbox-details.tsx
```
1 | import { useUserContext } from "@/store/user/hook";
2 | import { formatDate } from "@/utils/format";
3 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
4 | import { Button } from "@midday/ui/button";
5 | import { cn } from "@midday/ui/cn";
6 | import {
7 |   DropdownMenuContent,
8 |   DropdownMenuItem,
9 | } from "@midday/ui/dropdown-menu";
10 | import { DropdownMenu, DropdownMenuTrigger } from "@midday/ui/dropdown-menu";
11 | import { Icons } from "@midday/ui/icons";
12 | import { Separator } from "@midday/ui/separator";
13 | import { Skeleton } from "@midday/ui/skeleton";
14 | import { Tooltip, TooltipContent, TooltipTrigger } from "@midday/ui/tooltip";
15 | import { useToast } from "@midday/ui/use-toast";
16 | import { format } from "date-fns";
17 | import { MoreVertical, Trash2 } from "lucide-react";
18 | import { useEffect, useState } from "react";
19 | import { FilePreview } from "./file-preview";
20 | import { FormatAmount } from "./format-amount";
21 | import { EditInboxModal } from "./modals/edit-inbox-modal";
22 | import { SelectTransaction } from "./select-transaction";
23 |
24 | type InboxItem = {
25 |   id: string;
26 |   status?: string;
27 |   file_path?: string[];
28 |   file_name?: string;
29 |   website?: string;
30 |   display_name?: string;
31 |   amount?: number;
32 |   currency?: string;
33 |   date?: string;
34 |   forwarded_to?: string;
35 |   content_type?: string;
36 |   description?: string;
37 |   transaction?: any;
38 |   locale?: string;
39 | };
40 |
41 | type Props = {
42 |   item: InboxItem;
43 |   onDelete: () => void;
44 |   onSelectTransaction: () => void;
45 |   teamId: string;
46 |   isEmpty?: boolean;
47 |   currencies: string[];
48 | };
49 |
50 | export function InboxDetails({
51 |   item,
52 |   onDelete,
53 |   onSelectTransaction,
54 |   teamId,
55 |   isEmpty,
56 |   currencies,
57 | }: Props) {
58 |   const { toast } = useToast();
59 |   const [isOpen, setOpen] = useState(false);
60 |   const [showFallback, setShowFallback] = useState(false);
61 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
62 |
63 |   const isProcessing = item?.status === "processing" || item?.status === "new";
64 |
65 |   useEffect(() => {
66 |     setShowFallback(false);
67 |   }, [item]);
68 |
69 |   const handleCopyLink = async () => {
70 |     try {
71 |       await navigator.clipboard.writeText(
72 |         `${window.location.origin}/inbox?id=${item.id}`,
73 |       );
74 |
75 |       toast({
76 |         duration: 4000,
77 |         title: "Copied link to clipboard.",
78 |         variant: "success",
79 |       });
80 |     } catch {}
81 |   };
82 |
83 |   if (isEmpty) {
84 |     return <div className="hidden md:block w-[1160px]" />;
85 |   }
86 |
87 |   const fallback = showFallback || (!item?.website && item?.display_name);
88 |
89 |   return (
90 |     <div className="h-[calc(100vh-120px)] overflow-hidden flex-col border w-[1160px] hidden md:flex">
91 |       <div className="flex items-center p-2">
92 |         <div className="flex items-center gap-2">
93 |           <Tooltip>
94 |             <TooltipTrigger asChild>
95 |               <Button
96 |                 variant="ghost"
97 |                 size="icon"
98 |                 disabled={!item}
99 |                 onClick={onDelete}
100 |               >
101 |                 <Trash2 className="h-4 w-4" />
102 |               </Button>
103 |             </TooltipTrigger>
104 |             <TooltipContent className="px-3 py-1.5 text-xs">
105 |               Delete
106 |             </TooltipContent>
107 |           </Tooltip>
108 |         </div>
109 |
110 |         <div className="ml-auto">
111 |           <DropdownMenu>
112 |             <DropdownMenuTrigger asChild>
113 |               <Button variant="ghost" size="icon" disabled={!item}>
114 |                 <MoreVertical className="h-4 w-4" />
115 |                 <span className="sr-only">More</span>
116 |               </Button>
117 |             </DropdownMenuTrigger>
118 |             <DropdownMenuContent align="end">
119 |               <DropdownMenuItem onClick={() => setOpen(true)}>
120 |                 Edit
121 |               </DropdownMenuItem>
122 |               <DropdownMenuItem>
123 |                 <a
124 |                   href={`/api/download/file?path=${item?.file_path
125 |                     ?.slice(1)
126 |                     .join("/")}&filename=${item?.file_name}`}
127 |                   download
128 |                 >
129 |                   Download
130 |                 </a>
131 |               </DropdownMenuItem>
132 |               <DropdownMenuItem onClick={handleCopyLink}>
133 |                 Copy Link
134 |               </DropdownMenuItem>
135 |             </DropdownMenuContent>
136 |           </DropdownMenu>
137 |         </div>
138 |       </div>
139 |       <Separator />
140 |
141 |       {item?.id ? (
142 |         <div className="flex flex-1 flex-col">
143 |           <div className="flex items-start p-4">
144 |             <div className="flex items-start gap-4 text-sm relative">
145 |               {isProcessing ? (
146 |                 <Skeleton className="h-[40px] w-[40px] rounded-full" />
147 |               ) : (
148 |                 <Avatar>
149 |                   {item.website && (
150 |                     <AvatarImageNext
151 |                       alt={item.website}
152 |                       width={40}
153 |                       height={40}
154 |                       className={cn(
155 |                         "rounded-full overflow-hidden",
156 |                         showFallback && "hidden",
157 |                       )}
[TRUNCATED]
```

apps/dashboard/src/components/inbox-empty.tsx
```
1 | import { getInboxEmail } from "@midday/inbox";
2 | import { Icons } from "@midday/ui/icons";
3 | import { CopyInput } from "./copy-input";
4 |
5 | type Props = {
6 |   inboxId: string;
7 | };
8 |
9 | export function InboxEmpty({ inboxId }: Props) {
10 |   return (
11 |     <div className="h-[calc(100vh-150px)] flex items-center justify-center">
12 |       <div className="flex flex-col items-center max-w-[380px] w-full">
13 |         <Icons.InboxEmpty className="mb-4 w-[35px] h-[35px]" />
14 |         <div className="text-center mb-6 space-y-2">
15 |           <h2 className="font-medium text-lg">Magic Inbox</h2>
16 |           <p className="text-[#606060] text-sm">
17 |             Use the email to send receipts to Midday. We will extract and
18 |             reconcile them against your transactions. Additionally, you can also
19 |             upload receipts by simply dragging and dropping them here.
20 |             <br />
21 |           </p>
22 |         </div>
23 |
24 |         <CopyInput value={getInboxEmail(inboxId)} />
25 |       </div>
26 |     </div>
27 |   );
28 | }
```

apps/dashboard/src/components/inbox-header.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import { TabsList, TabsTrigger } from "@midday/ui/tabs";
3 | import { parseAsString, useQueryStates } from "nuqs";
4 | import { startTransition } from "react";
5 | import { InboxOrdering } from "./inbox-ordering";
6 | import { InboxSearch } from "./inbox-search";
7 | import { InboxSettingsModal } from "./modals/inbox-settings-modal";
8 |
9 | type Props = {
10 |   forwardEmail: string;
11 |   inboxId: string;
12 |   inboxForwarding: boolean;
13 |   handleOnPaginate?: (direction: "down" | "up") => void;
14 |   onChange?: (value: string | null) => void;
15 |   ascending: boolean;
16 | };
17 |
18 | export function InboxHeader({
19 |   forwardEmail,
20 |   inboxForwarding,
21 |   inboxId,
22 |   handleOnPaginate,
23 |   onChange,
24 |   ascending,
25 | }: Props) {
26 |   const [params, setParams] = useQueryStates(
27 |     {
28 |       id: parseAsString,
29 |       q: parseAsString.withDefault(""),
30 |     },
31 |     {
32 |       startTransition,
33 |     },
34 |   );
35 |
36 |   return (
37 |     <div className="flex justify-center items-center space-x-4 mb-4">
38 |       <TabsList>
39 |         <TabsTrigger value="todo">Todo</TabsTrigger>
40 |         <TabsTrigger value="done">Done</TabsTrigger>
41 |       </TabsList>
42 |
43 |       <InboxSearch
44 |         onClear={() => setParams({ id: null, q: null })}
45 |         onArrowDown={() => handleOnPaginate?.("down")}
46 |         value={params.q}
47 |         onChange={(value) => {
48 |           setParams({ id: null, q: value });
49 |           onChange?.(value);
50 |         }}
51 |       />
52 |
53 |       <div className="flex space-x-2">
54 |         <InboxOrdering ascending={ascending} />
55 |         <InboxSettingsModal
56 |           forwardEmail={forwardEmail}
57 |           inboxId={inboxId}
58 |           inboxForwarding={inboxForwarding}
59 |         />
60 |
61 |         <Button
62 |           variant="outline"
63 |           onClick={() => document.getElementById("upload-files")?.click()}
64 |         >
65 |           Upload
66 |         </Button>
67 |       </div>
68 |     </div>
69 |   );
70 | }
```

apps/dashboard/src/components/inbox-item.tsx
```
1 | import { useUserContext } from "@/store/user/hook";
2 | import { formatDate } from "@/utils/format";
3 | import { cn } from "@midday/ui/cn";
4 | import { Skeleton } from "@midday/ui/skeleton";
5 | import { useQueryState } from "nuqs";
6 | import { FormatAmount } from "./format-amount";
7 | import { InboxStatus } from "./inbox-status";
8 |
9 | export function InboxItem({ item }) {
10 |   const [selectedId, setSelectedId] = useQueryState("inboxId");
11 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
12 |
13 |   const isSelected = selectedId === item.id;
14 |   const isProcessing = item.status === "processing" || item.status === "new";
15 |
16 |   return (
17 |     <button
18 |       type="button"
19 |       onClick={() => {
20 |         setSelectedId(item.id);
21 |       }}
22 |       key={item.id}
23 |       className={cn(
24 |         "flex flex-col w-full items-start gap-2 border p-4 text-left text-sm",
25 |         isSelected && "bg-accent border-[#DCDAD2] dark:border-[#2C2C2C]",
26 |       )}
27 |     >
28 |       <div className="flex w-full flex-col gap-1">
29 |         <div className="flex items-center mb-1">
30 |           <div className="flex items-center gap-2">
31 |             <div className="flex items-center space-x-2 select-text">
32 |               <div className="font-semibold">
33 |                 {isProcessing ? (
34 |                   <Skeleton className="h-3 w-[120px] rounded-sm mb-1" />
35 |                 ) : (
36 |                   item.display_name
37 |                 )}
38 |               </div>
39 |             </div>
40 |           </div>
41 |           <div
42 |             className={cn(
43 |               "ml-auto text-xs select-text",
44 |               isSelected ? "text-foreground" : "text-muted-foreground",
45 |             )}
46 |           >
47 |             {isProcessing && <Skeleton className="h-3 w-[50px] rounded-sm" />}
48 |             {!isProcessing && item?.date && formatDate(item.date, dateFormat)}
49 |           </div>
50 |         </div>
51 |
52 |         <div className="flex">
53 |           <div className="text-xs font-medium select-text">
54 |             {isProcessing && <Skeleton className="h-3 w-[50px] rounded-sm" />}
55 |             {!isProcessing && item?.currency && item?.amount && (
56 |               <FormatAmount amount={item.amount} currency={item.currency} />
57 |             )}
58 |           </div>
59 |
60 |           <div className="ml-auto">
61 |             <InboxStatus item={item} />
62 |           </div>
63 |         </div>
64 |       </div>
65 |     </button>
66 |   );
67 | }
```

apps/dashboard/src/components/inbox-list-skeleton.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { Skeleton } from "@midday/ui/skeleton";
3 |
4 | type InboxSkeletonProps = {
5 |   numberOfItems: number;
6 |   className?: string;
7 | };
8 |
9 | export function InboxListSkeleton({
10 |   numberOfItems,
11 |   className,
12 | }: InboxSkeletonProps) {
13 |   return (
14 |     <div className={cn("flex flex-col gap-4", className)}>
15 |       {[...Array(numberOfItems)].map((_, index) => (
16 |         <div
17 |           className="flex flex-col items-start gap-2 border p-4 text-left text-sm transition-all h-[82px]"
18 |           key={index.toString()}
19 |         >
20 |           <div className="flex w-full flex-col gap-1">
21 |             <div className="flex items-center mb-4">
22 |               <div className="flex items-center gap-2">
23 |                 <div className="font-semibold">
24 |                   <Skeleton className="h-3 w-[140px]" />
25 |                 </div>
26 |               </div>
27 |               <div className="ml-auto text-xs text-muted-foreground">
28 |                 <Skeleton className="h-3 w-[40px]" />
29 |               </div>
30 |             </div>
31 |             <div className="flex">
32 |               <div className="text-xs font-medium">
33 |                 <Skeleton className="h-2 w-[110px]" />
34 |               </div>
35 |               <div className="ml-auto text-xs font-medium">
36 |                 <Skeleton className="h-2 w-[60px]" />
37 |               </div>
38 