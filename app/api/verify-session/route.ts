import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET) {
  throw new Error('STRIPE_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2024-11-20.acacia',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ error: 'Session ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Verifying session:', sessionId);

    // Add small delay to help prevent race conditions
    await delay(100);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Session details:', {
      status: session.payment_status,
      email: session.customer_email,
      customer: session.customer
    });

    if (session.payment_status === 'paid') {
      if (!session.customer_email) {
        throw new Error('No customer email found in session');
      }

      try {
        // First check if user exists
        const { data: existingUser } = await supabase
          .from('user')
          .select('created_at')
          .eq('email', session.customer_email)
          .single();

        const now = new Date().toISOString();

        // Use upsert with all required fields
        const { error: upsertError } = await supabase
          .from('user')
          .upsert(
            {
              email: session.customer_email,
              stripe_customer_id: session.customer,
              subscription_status: 'active',
              stripe_session_id: sessionId,
              created_at: existingUser?.created_at || now,
              updated_at: now
            },
            {
              onConflict: 'email',
              ignoreDuplicates: false
            }
          );

        if (upsertError) {
          console.error('Error upserting user:', upsertError);
          throw upsertError;
        }

        console.log('Successfully upserted user:', session.customer_email);

        return new NextResponse(
          JSON.stringify({
            success: true,
            customer_email: session.customer_email
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        throw dbError;
      }
    }

    return new NextResponse(
      JSON.stringify({
        error: 'Payment not completed',
        status: session.payment_status
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Full error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to verify session',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}