import { pgTable, text, uuid, integer, timestamp } from 'drizzle-orm/pg-core'

export const functionLogs = pgTable('function_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  functionName: text('function_name').notNull(),
  status: text('status').notNull(),
  recordsProcessed: integer('records_processed'),
  errorMessage: text('error_message'),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
})