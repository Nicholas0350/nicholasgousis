import { pgTable, text, date, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { creditRepresentatives } from './credit-representatives'

export const creditLicensees = pgTable('credit_licensees', {
  id: integer('id').primaryKey(),
  registerName: text('REGISTER_NAME'),
  credLicNum: text('CRED_LIC_NUM'),
  credLicName: text('CRED_LIC_NAME'),
  credLicStartDt: date('CRED_LIC_START_DT'),
  credLicEndDt: date('CRED_LIC_END_DT'),
  credLicStatus: text('CRED_LIC_STATUS'),
  credLicAbnAcn: text('CRED_LIC_ABN_ACN'),
  credLicAplNum: text('CRED_LIC_APL_NUM'),
  credLicLocality: text('CRED_LIC_LOCALITY'),
  credLicState: text('CRED_LIC_STATE'),
  credLicPcode: text('CRED_LIC_PCODE'),
  credLicLat: text('CRED_LIC_LAT'),
  credLicLng: text('CRED_LIC_LNG'),
  credLicEdrs: text('CRED_LIC_EDRS'),
  credLicBn: text('CRED_LIC_BN'),
  credLicAuthor: text('CRED_LIC_AUTHOR'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const creditLicenseesRelations = relations(creditLicensees, ({ many }) => ({
  representatives: many(creditRepresentatives)
}))