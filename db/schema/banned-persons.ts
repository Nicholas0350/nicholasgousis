import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import { bannedPersonRelationships } from './banned-person-relationships'

export const bannedAndDisqualifiedPersons = pgTable('banned_and_disqualified_persons', {
  id: uuid('ID').defaultRandom().primaryKey(),
  registerName: text('REGISTER_NAME').notNull(),
  bdPerName: text('BD_PER_NAME').notNull(),
  bdPerType: text('BD_PER_TYPE').notNull(),
  bdPerDocNum: text('BD_PER_DOC_NUM'),
  bdPerStartDt: timestamp('BD_PER_START_DT', { withTimezone: true }).notNull(),
  bdPerEndDt: timestamp('BD_PER_END_DT', { withTimezone: true }).notNull(),
  bdPerAddLocal: text('BD_PER_ADD_LOCAL').default('ADDRESS UNKNOWN'),
  bdPerAddState: text('BD_PER_ADD_STATE').default('ADDRESS UNKNOWN'),
  bdPerAddPcode: text('BD_PER_ADD_PCODE').default('ADDRESS UNKNOWN'),
  bdPerAddCountry: text('BD_PER_ADD_COUNTRY').default('AUSTRALIA'),
  bdPerComments: text('BD_PER_COMMENTS'),
  createdAt: timestamp('CREATED_AT', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('UPDATED_AT', { withTimezone: true }).defaultNow()
}, (table) => ({
  bdPerTypeCheck: sql`check ("BD_PER_TYPE" = ANY (ARRAY['AFS Banned & Disqualified', 'Banned Futures', 'Banned Securities', 'Credit Banned & Disqualified', 'Disq. Director', 'Disqualified SMSF']))`
}))

export const bannedAndDisqualifiedPersonsRelations = relations(bannedAndDisqualifiedPersons, ({ many }) => ({
  relationships: many(bannedPersonRelationships)
}))