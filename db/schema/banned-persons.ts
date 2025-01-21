import { pgTable, text, date, integer, timestamp } from 'drizzle-orm/pg-core'

export const bannedAndDisqualifiedPersons = pgTable('banned_and_disqualified_persons', {
  id: integer('id').primaryKey(),
  registerName: text('REGISTER_NAME'),
  bdPerName: text('BD_PER_NAME'),
  bdPerType: text('BD_PER_TYPE'),
  bdPerDocNum: text('BD_PER_DOC_NUM'),
  bdPerStartDt: date('BD_PER_START_DT'),
  bdPerEndDt: date('BD_PER_END_DT'),
  bdPerAddLocal: text('BD_PER_ADD_LOCAL'),
  bdPerAddState: text('BD_PER_ADD_STATE'),
  bdPerAddPcode: text('BD_PER_ADD_PCODE'),
  bdPerAddCou: text('BD_PER_ADD_COU'),
  bdPerComments: text('BD_PER_COMMENTS'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})