import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { financialServicesRepresentatives } from './financial-services'
import { creditRepresentatives } from './credit-representatives'

export const representativeRelationships = pgTable('representative_relationships', {
  id: integer('id').primaryKey(),
  afsRepNum: text('AFS_REP_NUM'),
  credRepNum: text('CRED_REP_NUM'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const representativeRelationshipsRelations = relations(representativeRelationships, ({ one }) => ({
  afsRep: one(financialServicesRepresentatives, {
    fields: [representativeRelationships.afsRepNum],
    references: [financialServicesRepresentatives.afsRepNum],
  }),
  credRep: one(creditRepresentatives, {
    fields: [representativeRelationships.credRepNum],
    references: [creditRepresentatives.credRepNum],
  })
}))