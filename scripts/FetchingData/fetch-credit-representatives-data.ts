import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'
import { BatchConfig } from './types'

const CREDIT_REP_DATASET_URL = 'https://data.gov.au/dataset/credit-representative-register'

const batchConfig: BatchConfig = {
  batchSize: 100,
  concurrency: 3,
  retryAttempts: 3,
  timeoutMs: 30000
}

interface CreditRepResponse {
  REGISTER_NAME: string
  CRED_REP_NUM: string
  CRED_REP_NAME: string
  CRED_LIC_NUM: string
  CRED_REP_ABN_ACN: string
  CRED_REP_START_DT: string
  CRED_REP_END_DT: string
  CRED_REP_LOCALITY: string
  CRED_REP_STATE: string
  CRED_REP_PCODE: string
  CRED_REP_EDRS: string
  CRED_REP_AUTHORISATIONS: string
  CRED_REP_CROSS_ENDORSE: string
}

const validEDRS = ['FOS', 'COSL', 'FOS:COSL', 'CIO', 'AFCA']
const validAuthorisations = [
  'Different to Appointing Rep',
  'Different to Registrant',
  'Same as Appointing Rep',
  'Same as Registrant'
]

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function fetchCreditRepData() {
  try {
    console.log('Starting Credit Representatives data fetch...')

    // Fetch data from data.gov.au
    const response = await fetch(CREDIT_REP_DATASET_URL)
    if (!response.ok) throw new Error('Failed to fetch Credit Representatives data')

    const data = (await response.json()) as CreditRepResponse[]

    // Process in batches
    for (let i = 0; i < data.length; i += batchConfig.batchSize) {
      const batch = data.slice(i, i + batchConfig.batchSize)

      // Transform and validate batch
      const transformedBatch = batch
        .filter(record => {
          // Validate EDRS and Authorisations
          const validEdrs = !record.CRED_REP_EDRS || validEDRS.includes(record.CRED_REP_EDRS)
          const validAuth = !record.CRED_REP_AUTHORISATIONS || validAuthorisations.includes(record.CRED_REP_AUTHORISATIONS)
          return validEdrs && validAuth
        })
        .map((record: CreditRepResponse) => ({
          REGISTER_NAME: record.REGISTER_NAME,
          CRED_REP_NUM: Number(record.CRED_REP_NUM),
          CRED_LIC_NUM: record.CRED_LIC_NUM,
          CRED_REP_NAME: record.CRED_REP_NAME,
          CRED_REP_ABN_ACN: record.CRED_REP_ABN_ACN ? Number(record.CRED_REP_ABN_ACN) : null,
          CRED_REP_START_DT: record.CRED_REP_START_DT,
          CRED_REP_END_DT: record.CRED_REP_END_DT || null,
          CRED_REP_LOCALITY: record.CRED_REP_LOCALITY,
          CRED_REP_STATE: record.CRED_REP_STATE,
          CRED_REP_PCODE: record.CRED_REP_PCODE ? Number(record.CRED_REP_PCODE) : null,
          CRED_REP_EDRS: record.CRED_REP_EDRS,
          CRED_REP_AUTHORISATIONS: record.CRED_REP_AUTHORISATIONS,
          CRED_REP_CROSS_ENDORSE: record.CRED_REP_CROSS_ENDORSE
        }))

      if (transformedBatch.length < batch.length) {
        console.warn(`Filtered out ${batch.length - transformedBatch.length} invalid records`)
      }

      // Upsert to database
      const { error } = await supabase
        .from('credit_representatives')
        .upsert(transformedBatch, {
          onConflict: 'CRED_REP_NUM',
          ignoreDuplicates: false
        })

      if (error) throw error

      console.log(`Processed batch ${i / batchConfig.batchSize + 1}`)
    }

    console.log('Credit Representatives data fetch completed successfully')
    return { success: true }

  } catch (error) {
    console.error('Error fetching Credit Representatives data:', error)
    return { success: false, error }
  }
}