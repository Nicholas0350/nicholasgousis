import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core'

export const stripeWebhooks = pgTable('stripe_webhooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: text('session_id').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }).notNull()
})