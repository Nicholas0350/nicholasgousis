import { createClient } from '@supabase/supabase-js'

interface DatasetMetadata {
  url: string
  lastModified: string
  eTag: string
  lastChecked: Date
  datasetId: string
}

interface DatasetConfig {
  id: string
  url: string
  name: string
  description: string
}

const DATASETS: DatasetConfig[] = [
  {
    id: 'afsl',
    url: 'https://data.gov.au/data/api/3/action/datastore_search?resource_id=43e9e8df-6b77-4d8a-84cd-2ed3cafb506f',
    name: 'AFSL Licensees',
    description: 'Australian Financial Services Licensees'
  },
  {
    id: 'banned',
    url: 'https://data.gov.au/data/api/3/action/datastore_search?resource_id=c9c4c3f1-c5b5-4f3c-8c3c-3f3c3f3c3f3c',
    name: 'Banned Persons',
    description: 'Banned and Disqualified Persons Register'
  },
  {
    id: 'credit',
    url: 'https://data.gov.au/data/api/3/action/datastore_search?resource_id=1e7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c7c',
    name: 'Credit Representatives',
    description: 'Credit Representatives Register'
  }
]

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function checkDatasetChanges(): Promise<void> {
  console.log('Checking for dataset changes...')

  for (const dataset of DATASETS) {
    try {
      // Get stored metadata
      const { data: storedMetadata, error: fetchError } = await supabase
        .from('dataset_metadata')
        .select('*')
        .eq('datasetId', dataset.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Error fetching metadata for ${dataset.name}:`, fetchError)
        continue
      }

      // Check current metadata
      const response = await fetch(dataset.url, {
        method: 'HEAD',
        headers: storedMetadata ? {
          'If-None-Match': storedMetadata.eTag,
          'If-Modified-Since': storedMetadata.lastModified
        } : {}
      })

      const newMetadata: DatasetMetadata = {
        url: dataset.url,
        lastModified: response.headers.get('last-modified') || new Date().toUTCString(),
        eTag: response.headers.get('etag') || '',
        lastChecked: new Date(),
        datasetId: dataset.id
      }

      // If dataset has changed (or no stored metadata)
      if (!storedMetadata || response.status !== 304) {
        console.log(`Changes detected in ${dataset.name}`)

        // Update metadata
        const { error: upsertError } = await supabase
          .from('dataset_metadata')
          .upsert(newMetadata, { onConflict: 'datasetId' })

        if (upsertError) {
          console.error(`Error updating metadata for ${dataset.name}:`, upsertError)
          continue
        }

        // Trigger data fetch and notify subscribers
        await notifySubscribers(dataset.id, {
          datasetName: dataset.name,
          changeDetectedAt: new Date().toISOString(),
          description: dataset.description
        })
      } else {
        console.log(`No changes detected in ${dataset.name}`)
      }
    } catch (error) {
      console.error(`Error checking ${dataset.name}:`, error)
    }
  }
}

async function notifySubscribers(datasetId: string, changeInfo: any): Promise<void> {
  // Get Tier 2 subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('users')
    .select('id, email')
    .eq('subscription_tier', 2)
    .eq('subscription_status', 'active')

  if (subError) {
    console.error('Error fetching subscribers:', subError)
    return
  }

  // Trigger webhook notifications
  const { data: webhooks, error: webhookError } = await supabase
    .from('webhooks')
    .select('*')
    .eq('user_id', subscribers.map(s => s.id))

  if (webhookError) {
    console.error('Error fetching webhooks:', webhookError)
    return
  }

  // Fan out notifications
  for (const webhook of webhooks) {
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': generateSignature(webhook.secret, JSON.stringify(changeInfo))
        },
        body: JSON.stringify(changeInfo)
      })
    } catch (error) {
      console.error(`Error notifying webhook ${webhook.id}:`, error)
    }
  }
}

function generateSignature(secret: string, payload: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

// Run if called directly
if (require.main === module) {
  checkDatasetChanges()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Unhandled error:', error)
      process.exit(1)
    })
}