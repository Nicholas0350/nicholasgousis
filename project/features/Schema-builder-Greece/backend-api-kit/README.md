# Backend API Kit

A scalable, monetizable backend API starter kit built with Hono + Cloudflare workers.

## Features

- API Keys
- Rate Limiting
- Authentication with [better-auth](https://www.better-auth.com/)
- Database with [Drizzle](https://drizzle.team) + [D1](https://developers.cloudflare.com/d1)
- Subscriptions with [Lemonsqueezy](https://lemonsqueezy.com)
- Integration tests with [Vitest](https://vitest.dev)

## Project Structure
```
├── LICENSE
├── README.md
├── biome.json
├── bun.lock
├── docs/
│   ├── drizzle.md
│   ├── lemonsqueezy.md
│   ├── ratelimits.md
│   └── tests.md
├── drizzle/
│   ├── 0000_crazy_zuras.sql
├── drizzle.config.ts
├── package.json
├── scripts/
│   └── setup.ts
├── src/
│   ├── api.ts
│   ├── auth.ts
│   ├── index.tsx
├── test/
│   └── index.spec.ts
├── tsconfig.json
├── vitest.config.mts
├── worker-configuration.d.ts
└── wrangler.jsonc
```