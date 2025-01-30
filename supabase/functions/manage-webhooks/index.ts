import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface WebhookPayload {
  url: string
  description?: string
  secret: string
}

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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
        // List webhooks
        const { data: webhooks, error } = await supabaseClient
          .from('webhooks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        return new Response(
          JSON.stringify({ webhooks }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'POST': {
        // Create webhook
        const payload: WebhookPayload = await req.json()

        // Validate payload
        if (!payload.url || !payload.secret) {
          return new Response(
            JSON.stringify({ error: 'URL and secret are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Insert webhook
        const { data: webhook, error } = await supabaseClient
          .from('webhooks')
          .insert({
            user_id: user.id,
            url: payload.url,
            secret: payload.secret,
            description: payload.description
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ webhook }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        // Delete webhook
        const { webhookId } = await req.json()

        if (!webhookId) {
          return new Response(
            JSON.stringify({ error: 'Webhook ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error } = await supabaseClient
          .from('webhooks')
          .delete()
          .eq('id', webhookId)
          .eq('user_id', user.id)

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PATCH': {
        // Update webhook
        const { webhookId, ...updates } = await req.json()

        if (!webhookId) {
          return new Response(
            JSON.stringify({ error: 'Webhook ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data: webhook, error } = await supabaseClient
          .from('webhooks')
          .update(updates)
          .eq('id', webhookId)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ webhook }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})