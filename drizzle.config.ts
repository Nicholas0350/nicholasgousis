import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export default {
  schema: './db/schema/*',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  driver: 'pglite',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config