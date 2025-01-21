import { pgTable, text, date, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { creditLicensees } from './credit-licensees'

export const creditRepresentatives = pgTable('credit_representatives', {
  id: integer('id').primaryKey(),
  registerName: text('REGISTER_NAME'),
  credRepNum: text('CRED_REP_NUM'),
  credLicNum: text('CRED_LIC_NUM'),
  credRepName: text('CRED_REP_NAME'),
  credRepAbnAcn: text('CRED_REP_ABN_ACN'),
  credRepStartDt: date('CRED_REP_START_DT'),
  credRepEndDt: date('CRED_REP_END_DT'),
  credRepLocality: text('CRED_REP_LOCALITY'),
  credRepState: text('CRED_REP_STATE'),
  credRepPcode: text('CRED_REP_PCODE'),
  credRepEdrs: text('CRED_REP_EDRS'),
  credRepAuthor: text('CRED_REP_AUTHOR'),
  credRepCross: text('CRED_REP_CROSS'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const creditRepresentativesRelations = relations(creditRepresentatives, ({ one }) => ({
  licensee: one(creditLicensees, {
    fields: [creditRepresentatives.credLicNum],
    references: [creditLicensees.credLicNum],
  }),
}))