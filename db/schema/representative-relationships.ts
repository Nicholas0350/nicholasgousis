import { pgTable, text, integer, uuid, timestamp, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { financialServicesRepresentatives } from './financial-services'
import { creditRepresentatives } from './credit-representatives'

export const representativeRelationships = pgTable('representative_relationships', {
  id: uuid('id').defaultRandom().primaryKey(),
  repId: integer('REP_ID').notNull(),
  afsRepNum: varchar('AFS_REP_NUM', { length: 9 }).notNull(),
  afsLicNum: varchar('AFS_LIC_NUM', { length: 9 }).notNull(),
  adviserNumber: varchar('ADVISER_NUMBER', { length: 9 }),
  createdAt: timestamp('CREATED_AT', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('UPDATED_AT', { withTimezone: true }).defaultNow()
})

export const representativeRelationshipsRelations = relations(representativeRelationships, ({ one }) => ({
  afsRep: one(financialServicesRepresentatives, {
    fields: [representativeRelationships.afsRepNum],
    references: [financialServicesRepresentatives.afsRepNum],
  })
}))