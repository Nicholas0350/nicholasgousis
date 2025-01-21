import { pgTable, text, timestamp, bigint, uuid } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: bigint('id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  email: text('email'),
  password: text('password'),
  subscriptionStatus: text('subscription_status'),
  subscriptionEndDate: timestamp('subscription_end_date', { withTimezone: true }),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSessionId: text('stripe_session_id'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  authUserId: uuid('auth_user_id')
})