import { pgTable, varchar } from 'drizzle-orm/pg-core'

export const financialAdvisers = pgTable('financial_advisers', {
  registerName: varchar('REGISTER_NAME', { length: 250 }).notNull(),
  advName: varchar('ADV_NAME', { length: 250 }).notNull(),
  advNumber: varchar('ADV_NUMBER', { length: 100 }).notNull(),
  advRole: varchar('ADV_ROLE', { length: 100 }).notNull(),
  advSubType: varchar('ADV_SUB_TYPE', { length: 100 }),
  advRoleStatus: varchar('ADV_ROLE_STATUS', { length: 100 }).notNull(),
  advAbn: varchar('ADV_ABN', { length: 30 }),
  advFirstProvidedAdvice: varchar('ADV_FIRST_PROVIDED_ADVICE', { length: 4 }),
  licenceName: varchar('LICENCE_NAME', { length: 250 }).notNull(),
  licenceNumber: varchar('LICENCE_NUMBER', { length: 100 }).notNull(),
  licenceAbn: varchar('LICENCE_ABN', { length: 30 }),
  licenceControlledBy: varchar('LICENCE_CONTROLLED_BY', { length: 4000 }),
  repAppointedBy: varchar('REP_APPOINTED_BY', { length: 250 }),
  repAppointedNum: varchar('REP_APPOINTED_NUM', { length: 100 }),
  repAppointedAbn: varchar('REP_APPOINTED_ABN', { length: 30 }),
  advStartDt: varchar('ADV_START_DT', { length: 10 }).notNull(),
  advEndDt: varchar('ADV_END_DT', { length: 10 }),
  advDaStartDt: varchar('ADV_DA_START_DT', { length: 10 }),
  advDaEndDt: varchar('ADV_DA_END_DT', { length: 10 }),
  advDaType: varchar('ADV_DA_TYPE', { length: 100 })
})