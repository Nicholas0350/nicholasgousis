import { pgTable, text, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { financialAdvisers } from './financial-advisers'
import { financialServicesRepresentatives } from './financial-services'

export const financialAdviserAfsReps = pgTable('financial_adviser_afs_reps', {
  id: integer('id').notNull(),
  advNumber: text('ADV_NUMBER').notNull(),
  afsLicNum: text('AFS_LIC_NUM').notNull(),
  afsRepNum: text('AFS_REP_NUM').notNull()
})

export const financialAdviserAfsRepsRelations = relations(financialAdviserAfsReps, ({ one }) => ({
  adviser: one(financialAdvisers, {
    fields: [financialAdviserAfsReps.advNumber],
    references: [financialAdvisers.advNumber],
  }),
  representative: one(financialServicesRepresentatives, {
    fields: [financialAdviserAfsReps.afsRepNum],
    references: [financialServicesRepresentatives.afsRepNum],
  })
}))