import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { financialAdvisers } from './financial-advisers'
import { financialServicesRepresentatives } from './financial-services'

export const financialAdviserAfsReps = pgTable('financial_adviser_afs_reps', {
  id: integer('id').primaryKey(),
  financialAdviserId: integer('financial_adviser_id'),
  afsRepNum: text('AFS_REP_NUM'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const financialAdviserAfsRepsRelations = relations(financialAdviserAfsReps, ({ one }) => ({
  adviser: one(financialAdvisers, {
    fields: [financialAdviserAfsReps.financialAdviserId],
    references: [financialAdvisers.id],
  }),
  representative: one(financialServicesRepresentatives, {
    fields: [financialAdviserAfsReps.afsRepNum],
    references: [financialServicesRepresentatives.afsRepNum],
  })
}))