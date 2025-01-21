import { pgTable, text, date, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { financialAdviserAfsReps } from './financial-adviser-afs-reps'

export const financialAdvisers = pgTable('financial_advisers', {
  id: integer('id').primaryKey(),
  asicNumber: text('ASIC_NUMBER'),
  name: text('NAME'),
  appointmentStartDate: date('APPOINTMENT_START_DATE'),
  appointmentEndDate: date('APPOINTMENT_END_DATE'),
  status: text('STATUS'),
  afslLicenseeName: text('AFSL_LICENSEE_NAME'),
  afslNumber: text('AFSL_NUMBER'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const financialAdvisersRelations = relations(financialAdvisers, ({ many }) => ({
  afsReps: many(financialAdviserAfsReps)
}))