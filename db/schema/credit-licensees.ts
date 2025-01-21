import { pgTable, text, varchar, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { creditRepresentatives } from './credit-representatives'

export const creditLicensees = pgTable('credit_licensees', {
  registerName: text('REGISTER_NAME').notNull(),
  credLicNum: varchar('CRED_LIC_NUM', { length: 50 }).notNull(),
  credLicName: text('CRED_LIC_NAME').notNull(),
  credLicStartDt: text('CRED_LIC_START_DT'),
  credLicEndDt: text('CRED_LIC_END_DT'),
  credLicStatus: text('CRED_LIC_STATUS'),
  credLicAbnAcn: varchar('CRED_LIC_ABN_ACN', { length: 20 }),
  credLicAplNum: varchar('CRED_LIC_AFSL_NUM', { length: 20 }),
  credLicStatusHistory: text('CRED_LIC_STATUS_HISTORY'),
  credLicLocality: text('CRED_LIC_LOCALITY'),
  credLicState: varchar('CRED_LIC_STATE', { length: 10 }),
  credLicPcode: varchar('CRED_LIC_PCODE', { length: 10 }),
  credLicLat: text('CRED_LIC_LAT'),
  credLicLng: text('CRED_LIC_LNG'),
  credLicEdrs: text('CRED_LIC_EDRS'),
  credLicBn: text('CRED_LIC_BN'),
  credLicAuthorisations: text('CRED_LIC_AUTHORISATIONS'),
  createdAt: timestamp('CREATED_AT', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('UPDATED_AT', { withTimezone: true }).defaultNow()
})

export const creditLicenseesRelations = relations(creditLicensees, ({ many }) => ({
  representatives: many(creditRepresentatives)
}))