import { relations } from 'drizzle-orm'
import { financialAdvisers } from './financial-advisers'
import { financialAdviserAfsReps } from './financial-adviser-afs-reps'

export const financialAdvisersRelations = relations(financialAdvisers, ({ many }) => ({
  afsReps: many(financialAdviserAfsReps)
}))