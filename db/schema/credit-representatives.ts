import { pgTable, varchar, numeric, date, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { creditLicensees } from './credit-licensees'
import { sql } from 'drizzle-orm'

export const creditRepresentatives = pgTable('credit_representatives', {
  id: uuid('id').default(sql`gen_random_uuid()`).notNull(),
  registerName: varchar('REGISTER_NAME', { length: 255 }).notNull(),
  credRepNum: numeric('CRED_REP_NUM', { precision: 9, scale: 0 }).notNull(),
  credLicNum: varchar('CRED_LIC_NUM', { length: 50 }).notNull(),
  credRepName: varchar('CRED_REP_NAME', { length: 255 }).notNull(),
  credRepAbnAcn: numeric('CRED_REP_ABN_ACN', { precision: 11, scale: 0 }),
  credRepStartDt: date('CRED_REP_START_DT').notNull(),
  credRepEndDt: date('CRED_REP_END_DT'),
  credRepLocality: varchar('CRED_REP_LOCALITY', { length: 255 }),
  credRepState: varchar('CRED_REP_STATE', { length: 3 }),
  credRepPcode: numeric('CRED_REP_PCODE', { precision: 4, scale: 0 }),
  credRepEdrs: varchar('CRED_REP_EDRS', { length: 10 })
    .check(sql`"CRED_REP_EDRS" = ANY (ARRAY['FOS', 'COSL', 'FOS:COSL', 'CIO', 'AFCA'])`),
  credRepAuthorisations: varchar('CRED_REP_AUTHORISATIONS', { length: 255 })
    .check(sql`"CRED_REP_AUTHORISATIONS" = ANY (ARRAY['Different to Appointing Rep', 'Different to Registrant', 'Same as Appointing Rep', 'Same as Registrant'])`),
  credRepCrossEndorse: varchar('CRED_REP_CROSS_ENDORSE', { length: 255 }),
  createdAt: timestamp('CREATED_AT', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('UPDATED_AT', { withTimezone: true }).defaultNow()
})

export const creditRepresentativesRelations = relations(creditRepresentatives, ({ one }) => ({
  licensee: one(creditLicensees, {
    fields: [creditRepresentatives.credLicNum],
    references: [creditLicensees.credLicNum],
  }),
}))