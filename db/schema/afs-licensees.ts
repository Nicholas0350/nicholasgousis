import { pgTable, text, date, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { financialServicesRepresentatives } from './financial-services'

export const afsLicensees = pgTable('afs_licensees', {
  id: integer('id').primaryKey(),
  registerName: text('REGISTER_NAME'),
  afsLicNum: text('AFS_LIC_NUM'),
  afsLicName: text('AFS_LIC_NAME'),
  afsLicAbn: text('AFS_LIC_ABN'),
  afsLicAcn: text('AFS_LIC_ACN'),
  afsLicStartDt: date('AFS_LIC_START_DT'),
  afsLicEndDt: date('AFS_LIC_END_DT'),
  afsLicStatus: text('AFS_LIC_STATUS'),
  afsLicAddLoc: text('AFS_LIC_ADD_LOC'),
  afsLicAddState: text('AFS_LIC_ADD_STATE'),
  afsLicAddPco: text('AFS_LIC_ADD_PCO'),
  afsLicAddCou: text('AFS_LIC_ADD_COU'),
  afsLicPrinBus: text('AFS_LIC_PRIN_BUS'),
  afsLicServName: text('AFS_LIC_SERV_NAME'),
  afsLicRemunTyp: text('AFS_LIC_REMUN_TYP'),
  afsLicExtDisRes: text('AFS_LIC_EXT_DIS_RES'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const afsLicenseesRelations = relations(afsLicensees, ({ many }) => ({
  representatives: many(financialServicesRepresentatives)
}))