import { pgTable, text, date, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { afsLicensees } from './afs-licensees';

export const financialServicesRepresentatives = pgTable('financial_services_representatives', {
  id: integer('id').primaryKey(),
  registerName: text('REGISTER_NAME'),
  afsRepNum: text('AFS_REP_NUM'),
  afsLicNum: text('AFS_LIC_NUM'),
  afsRepName: text('AFS_REP_NAME'),
  afsRepAbn: text('AFS_REP_ABN'),
  afsRepAcn: text('AFS_REP_ACN'),
  afsRepOtherR: text('AFS_REP_OTHER_R'),
  afsRepStartDt: date('AFS_REP_START_DT'),
  afsRepStatus: text('AFS_REP_STATUS'),
  afsRepEndDt: date('AFS_REP_END_DT'),
  afsRepAddLoc: text('AFS_REP_ADD_LOC'),
  afsRepAddState: text('AFS_REP_ADD_STATE'),
  afsRepAddPco: text('AFS_REP_ADD_PCO'),
  afsRepAddCou: text('AFS_REP_ADD_COU'),
  afsRepCrossE: text('AFS_REP_CROSS_E'),
  afsRepMayApp: text('AFS_REP_MAY_APP'),
  afsRepAppointe: text('AFS_REP_APPOINTE'),
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