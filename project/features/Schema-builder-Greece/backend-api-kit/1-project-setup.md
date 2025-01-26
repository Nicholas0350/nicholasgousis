# Project Setup and Configuration

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

## Configuration Files

### biome.json
```json
{
    "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
    "vcs": {
        "enabled": false,
        "clientKind": "git",
        "useIgnoreFile": false
    },
    "files": {
        "ignoreUnknown": false,
        "ignore": ["drizzle/", "node_modules/", ".wrangler/"]
    },
    "formatter": {
        "enabled": true,
        "indentStyle": "tab"
    },
    "organizeImports": {
        "enabled": true
    },
    "linter": {
        "enabled": true,
        "rules": {
            "recommended": true
        }
    },
    "javascript": {
        "formatter": {
            "quoteStyle": "double"
        }
    }
}
```

### package.json
```json
{
  "name": "backend-api-kit",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy --minify",
    "cf-typegen": "wrangler types --env-interface CloudflareBindings",
    "setup": "bun scripts/setup.ts",
    "lint": "biome lint --write ."
  },
  "dependencies": {
    "better-auth": "^1.1.14",
    "drizzle-orm": "^0.38.4",
    "hono": "^4.6.18"
  },
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "@clack/prompts": "^0.9.1",
    "@cloudflare/vitest-pool-workers": "0.6.4",
    "@cloudflare/workers-types": "^4.20250121.0",
    "@types/bun": "^1.2.0",
    "better-sqlite3": "^11.8.1",
    "child_process": "^1.0.2",
    "drizzle-kit": "^0.30.2",
    "vitest": "2.1.8",
    "wrangler": "^3.105.0",
    "bun": "^1.2.0",
    "dotenv": "^16.4.7"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "lib": ["ESNext"],
    "types": [
      "@cloudflare/workers-types/2023-07-01",
      "node",
      "@cloudflare/vitest-pool-workers"
    ],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```