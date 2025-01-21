import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: integer('id').primaryKey(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('email_verified').default(false),
  name: text('name'),
  image: text('image'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})