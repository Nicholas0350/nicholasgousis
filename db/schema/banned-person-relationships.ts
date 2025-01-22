import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { bannedAndDisqualifiedPersons } from './banned-persons'
import { afsLicensees } from './afs-licensees'
import { financialAdvisers } from './financial-advisers'
import { financialServicesRepresentatives } from './financial-services'
import { creditLicensees } from './credit-licensees'
import { creditRepresentatives } from './credit-representatives'

export const bannedPersonRelationships = pgTable('banned_person_relationships', {
  id: uuid('ID').defaultRandom().primaryKey(),
  bannedPersonId: uuid('BANNED_PERSON_ID').notNull(),
  entityType: text('ENTITY_TYPE').notNull(),
  entityId: text('ENTITY_ID').notNull(),
  relationshipStartDate: timestamp('RELATIONSHIP_START_DATE', { withTimezone: true }).notNull(),
  relationshipEndDate: timestamp('RELATIONSHIP_END_DATE', { withTimezone: true }),
  createdAt: timestamp('CREATED_AT', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('UPDATED_AT', { withTimezone: true }).defaultNow()
})

export const bannedPersonRelationshipsRelations = relations(bannedPersonRelationships, ({ one }) => ({
  bannedPerson: one(bannedAndDisqualifiedPersons, {
    fields: [bannedPersonRelationships.bannedPersonId],
    references: [bannedAndDisqualifiedPersons.id]
  }),
  afsLicensee: one(afsLicensees, {
    fields: [bannedPersonRelationships.entityId],
    references: [afsLicensees.afsLicNum]
  }),
  financialAdviser: one(financialAdvisers, {
    fields: [bannedPersonRelationships.entityId],
    references: [financialAdvisers.advNumber]
  }),
  afsRepresentative: one(financialServicesRepresentatives, {
    fields: [bannedPersonRelationships.entityId],
    references: [financialServicesRepresentatives.afsRepNum]
  }),
  creditLicensee: one(creditLicensees, {
    fields: [bannedPersonRelationships.entityId],
    references: [creditLicensees.credLicNum]
  }),
  creditRepresentative: one(creditRepresentatives, {
    fields: [bannedPersonRelationships.entityId],
    references: [creditRepresentatives.credRepNum]
  })
}))