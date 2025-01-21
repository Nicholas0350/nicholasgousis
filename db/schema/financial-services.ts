import { pgTable, text, date, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { afsLicensees } from './afs-licensees';

export const financialServicesRepresentatives = pgTable('financial_services_representatives', {
  id: integer('ID').notNull(),
  registerName: text('REGISTER_NAME'),
  afsRepNum: text('AFS_REP_NUM').notNull(),
  afsLicNum: text('AFS_LIC_NUM'),
  afsRepName: text('AFS_REP_NAME'),
  afsRepAbn: text('AFS_REP_ABN'),
  afsRepAcn: text('AFS_REP_ACN'),
  afsRepOtherRole: text('AFS_REP_OTHER_ROLE'),
  afsRepStartDt: date('AFS_REP_START_DT'),
  afsRepStatus: text('AFS_REP_STATUS'),
  afsRepEndDt: date('AFS_REP_END_DT'),
  afsRepAddLocal: text('AFS_REP_ADD_LOCAL'),
  afsRepAddState: text('AFS_REP_ADD_STATE'),
  afsRepAddPco: text('AFS_REP_ADD_PCO'),
  afsRepAddCou: text('AFS_REP_ADD_COUNTRY'),
  afsRepCrossE: text('AFS_REP_CROSS_ENDORSE'),
  afsRepMayApp: text('AFS_REP_MAY_APPOINT'),
  afsRepAppointe: text('AFS_REP_APPOINTED_BY'),
  fin: text('FIN'),
  deal: text('DEAL'),
  apply: text('APPLY'),
  genfin: text('GENFIN'),
  issue: text('ISSUE'),
  arrangeApply: text('ARRANGE_APPLY'),
  arrangeIssue: text('ARRANGE_ISSUE'),
  arrangeUnderwr: text('ARRANGE_UNDERWR'),
  classes: text('CLASSES'),
  dealApply: text('DEAL_APPLY'),
  dealIssue: text('DEAL_ISSUE'),
  dealUnderwr: text('DEAL_UNDERWR'),
  idps: text('IDPS'),
  market: text('MARKET'),
  nonidps: text('NONIDPS'),
  scheme: text('SCHEME'),
  trustee: text('TRUSTEE'),
  wsale: text('WSALE'),
  arrange: text('ARRANGE'),
  underwr: text('UNDERWR'),
  afsRepSameAu: text('AFS_REP_SAME_AU'),
  afsRepRelated: text('AFS_REP_RELATED'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const financialServicesRepresentativesRelations = relations(financialServicesRepresentatives, ({ one }) => ({
  licensee: one(afsLicensees, {
    fields: [financialServicesRepresentatives.afsLicNum],
    references: [afsLicensees.afsLicNum],
  }),
}));