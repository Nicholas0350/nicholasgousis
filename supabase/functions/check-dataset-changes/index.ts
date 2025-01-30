import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from check-dataset-changes!')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all datasets to check
    const { data: datasets, error: datasetsError } = await supabaseClient
      .from('dataset_metadata')
      .select('*')

    if (datasetsError) {
      throw datasetsError
    }

    const results = []

    // Check each dataset for changes
    for (const dataset of datasets) {
      try {
        // Check current metadata
        const response = await fetch(dataset.url, {
          method: 'HEAD',
          headers: {
            'If-None-Match': dataset.eTag,
            'If-Modified-Since': dataset.lastModified
          }
        })

        const newMetadata = {
          url: dataset.url,
          lastModified: response.headers.get('last-modified') || new Date().toUTCString(),
          eTag: response.headers.get('etag') || '',
          lastChecked: new Date(),
          datasetId: dataset.datasetId
        }

        // If dataset has changed
        if (response.status !== 304) {
          console.log(`Changes detected in ${dataset.datasetId}`)

          // Update metadata
          const { error: upsertError } = await supabaseClient
            .from('dataset_metadata')
            .upsert(newMetadata, { onConflict: 'datasetId' })

          if (upsertError) throw upsertError

          // Get Tier 2 subscribers
          const { data: subscribers, error: subError } = await supabaseClient
            .from('users')
            .select('id, email')
            .eq('subscription_tier', 2)
            .eq('subscription_status', 'active')

          if (subError) throw subError

          // Get webhooks for subscribers
          const { data: webhooks, error: webhookError } = await supabaseClient
            .from('webhooks')
            .select('*')
            .in('user_id', subscribers.map(s => s.id))

          if (webhookError) throw webhookError

          // Notify subscribers
          for (const webhook of webhooks) {
            try {
              const changeInfo = {
                datasetId: dataset.datasetId,
                changeDetectedAt: new Date().toISOString(),
                lastModified: newMetadata.lastModified
              }

              const signature = await crypto.subtle.sign(
                'HMAC',
                await crypto.subtle.importKey(
                  'raw',
                  new TextEncoder().encode(webhook.secret),
                  { name: 'HMAC', hash: 'SHA-256' },
                  false,
                  ['sign']
                ),
                new TextEncoder().encode(JSON.stringify(changeInfo))
              )

              await fetch(webhook.url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Webhook-Signature': Array.from(new Uint8Array(signature))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('')
                },
                body: JSON.stringify(changeInfo)
              })
            } catch (error) {
              console.error(`Error notifying webhook ${webhook.id}:`, error)
            }
          }

          results.push({
            datasetId: dataset.datasetId,
            status: 'changed',
            subscribers: webhooks.length
          })
        } else {
          results.push({
            datasetId: dataset.datasetId,
            status: 'unchanged'
          })
        }
      } catch (error) {
        console.error(`Error processing ${dataset.datasetId}:`, error)
        results.push({
          datasetId: dataset.datasetId,
          status: 'error',
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})