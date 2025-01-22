import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'
import { BatchConfig } from './types'

const CREDIT_LICENSEES_DATASET_URL = 'https://data.gov.au/dataset/asic-credit-dataset'

const batchConfig: BatchConfig = {
  batchSize: 100,
  concurrency: 3,
  retryAttempts: 3,
  timeoutMs: 30000
}

interface CreditLicenseeResponse {
  REGISTER_NAME: string
  CRED_LIC_NUM: string
  CRED_LIC_NAME: string
  CRED_LIC_START_DT: string
  CRED_LIC_END_DT: string
  CRED_LIC_STATUS: string
  CRED_LIC_ABN_ACN: string
  CRED_LIC_AFSL_NUM: string
  CRED_LIC_STATUS_HISTORY: string
  CRED_LIC_LOCALITY: string
  CRED_LIC_STATE: string
  CRED_LIC_PCODE: string
  CRED_LIC_LAT: string
  CRED_LIC_LNG: string
  CRED_LIC_EDRS: string
  CRED_LIC_BN: string
  CRED_LIC_AUTHORISATIONS: string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function fetchCreditLicenseesData() {
  try {
    console.log('Starting Credit Licensees data fetch...')

    // Fetch data from data.gov.au
    const response = await fetch(CREDIT_LICENSEES_DATASET_URL)
    if (!response.ok) throw new Error('Failed to fetch Credit Licensees data')

    const data = (await response.json()) as CreditLicenseeResponse[]

    // Process in batches
    for (let i = 0; i < data.length; i += batchConfig.batchSize) {
      const batch = data.slice(i, i + batchConfig.batchSize)

      // Transform batch
      const transformedBatch = batch.map((record: CreditLicenseeResponse) => ({
        REGISTER_NAME: record.REGISTER_NAME,
        CRED_LIC_NUM: record.CRED_LIC_NUM,
        CRED_LIC_NAME: record.CRED_LIC_NAME,
        CRED_LIC_START_DT: record.CRED_LIC_START_DT,
        CRED_LIC_END_DT: record.CRED_LIC_END_DT,
        CRED_LIC_STATUS: record.CRED_LIC_STATUS,
        CRED_LIC_ABN_ACN: record.CRED_LIC_ABN_ACN,
        CRED_LIC_AFSL_NUM: record.CRED_LIC_AFSL_NUM,
        CRED_LIC_STATUS_HISTORY: record.CRED_LIC_STATUS_HISTORY,
        CRED_LIC_LOCALITY: record.CRED_LIC_LOCALITY,
        CRED_LIC_STATE: record.CRED_LIC_STATE,
        CRED_LIC_PCODE: record.CRED_LIC_PCODE,
        CRED_LIC_LAT: record.CRED_LIC_LAT,
        CRED_LIC_LNG: record.CRED_LIC_LNG,
        CRED_LIC_EDRS: record.CRED_LIC_EDRS,
        CRED_LIC_BN: record.CRED_LIC_BN,
        CRED_LIC_AUTHORISATIONS: record.CRED_LIC_AUTHORISATIONS
      }))

      // Upsert to database
      const { error } = await supabase
        .from('credit_licensees')
        .upsert(transformedBatch, {
          onConflict: 'CRED_LIC_NUM',
          ignoreDuplicates: false
        })

      if (error) throw error

      console.log(`Processed batch ${i / batchConfig.batchSize + 1}`)
    }

    console.log('Credit Licensees data fetch completed successfully')
    return { success: true }

  } catch (error) {
    console.error('Error fetching Credit Licensees data:', error)
    return { success: false, error }
  }
}

// function normalizeABN(abn: string): string {
//   // Remove all non-numeric characters
//   return abn.replace(/[^0-9]/g, '')
// }