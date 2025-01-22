import { fetchAFSLData } from './fetch-afsl-licensee-data'
import { fetchCreditLicenseesData } from './fetch-credit-licensees-data'
import { fetchCreditRepData } from './fetch-credit-representatives-data'
import { fetchFinancialAdvisersData } from './fetch-financial-advisers-data'
import { fetchBannedPersonsData } from './fetch-banned-persons-data'

interface FetchResult {
  success: boolean
  error?: unknown
}

export async function fetchAllData(): Promise<FetchResult> {
  try {
    console.log('Starting full data fetch...')

    // Fetch all data in parallel
    const results = await Promise.all([
      fetchAFSLData(),
      fetchCreditLicenseesData(),
      fetchCreditRepData(),
      fetchFinancialAdvisersData(),
      fetchBannedPersonsData()
    ])

    // Check if any fetches failed
    const failedFetches = results.filter(result => !result.success)
    if (failedFetches.length > 0) {
      console.error('Some data fetches failed:', failedFetches)
      return { success: false, error: failedFetches }
    }

    console.log('All data fetched successfully')
    return { success: true }

  } catch (error) {
    console.error('Error in fetchAllData:', error)
    return { success: false, error }
  }
}

// Run if called directly
if (require.main === module) {
  fetchAllData()
    .then(result => {
      if (!result.success) {
        process.exit(1)
      }
      process.exit(0)
    })
    .catch(error => {
      console.error('Unhandled error:', error)
      process.exit(1)
    })
}