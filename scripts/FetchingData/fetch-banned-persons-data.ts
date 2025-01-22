import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'
import { BatchConfig } from './types'

const BANNED_PERSONS_DATASET_URL = 'https://data.gov.au/dataset/banned-and-disqualified-persons-register'

const batchConfig: BatchConfig = {
  batchSize: 100,
  concurrency: 3,
  retryAttempts: 3,
  timeoutMs: 30000
}

interface BannedPersonResponse {
  REGISTER_NAME: string
  BD_PER_NAME: string
  BD_PER_TYPE: string
  BD_PER_DOC_NUM: string | null
  BD_PER_START_DT: string
  BD_PER_END_DT: string
  BD_PER_ADD_LOCAL: string
  BD_PER_ADD_STATE: string
  BD_PER_ADD_PCODE: string
  BD_PER_ADD_COUNTRY: string
  BD_PER_COMMENTS: string | null
}

const validBanTypes = [
  'AFS Banned & Disqualified',
  'Banned Futures',
  'Banned Securities',
  'Credit Banned & Disqualified',
  'Disq. Director',
  'Disqualified SMSF'
]

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function fetchBannedPersonsData() {
  try {
    console.log('Starting Banned Persons data fetch...')

    // Fetch data from data.gov.au
    const response = await fetch(BANNED_PERSONS_DATASET_URL)
    if (!response.ok) throw new Error('Failed to fetch Banned Persons data')

    const data = (await response.json()) as BannedPersonResponse[]

    // Process in batches
    for (let i = 0; i < data.length; i += batchConfig.batchSize) {
      const batch = data.slice(i, i + batchConfig.batchSize)

      // Transform and validate batch
      const transformedBatch = batch
        .filter(record => validBanTypes.includes(record.BD_PER_TYPE))
        .map((record: BannedPersonResponse) => ({
          REGISTER_NAME: record.REGISTER_NAME,
          BD_PER_NAME: record.BD_PER_NAME,
          BD_PER_TYPE: record.BD_PER_TYPE,
          BD_PER_DOC_NUM: record.BD_PER_DOC_NUM,
          BD_PER_START_DT: record.BD_PER_START_DT,
          BD_PER_END_DT: record.BD_PER_END_DT,
          BD_PER_ADD_LOCAL: record.BD_PER_ADD_LOCAL || 'ADDRESS UNKNOWN',
          BD_PER_ADD_STATE: record.BD_PER_ADD_STATE || 'ADDRESS UNKNOWN',
          BD_PER_ADD_PCODE: record.BD_PER_ADD_PCODE || 'ADDRESS UNKNOWN',
          BD_PER_ADD_COUNTRY: record.BD_PER_ADD_COUNTRY || 'AUSTRALIA',
          BD_PER_COMMENTS: record.BD_PER_COMMENTS
        }))

      if (transformedBatch.length < batch.length) {
        console.warn(`Filtered out ${batch.length - transformedBatch.length} records with invalid ban types`)
      }

      // Upsert to database
      const { error } = await supabase
        .from('banned_and_disqualified_persons')
        .upsert(transformedBatch, {
          onConflict: 'BD_PER_DOC_NUM',
          ignoreDuplicates: false
        })

      if (error) throw error

      console.log(`Processed batch ${i / batchConfig.batchSize + 1}`)
    }

    console.log('Banned Persons data fetch completed successfully')
    return { success: true }

  } catch (error) {
    console.error('Error fetching Banned Persons data:', error)
    return { success: false, error }
  }
}