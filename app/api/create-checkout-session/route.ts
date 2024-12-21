import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET) {
  throw new Error('STRIPE_SECRET is not set in environment variables');
}

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2024-11-20.acacia',
});

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, priceId } = await req.json();

    if (!email || !priceId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Creating session with:', { email, priceId });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer_email: email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/newsletter`,
        metadata: {
          email,
        },
      });

      // Store user in Supabase
      console.log('Attempting to store user in Supabase:', { email });

      const { data, error: supabaseError } = await supabase
        .from('users')
        .upsert([
          {
            email,
            stripe_customer_id: session.customer,
            subscription_status: 'pending',
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (supabaseError) {
        console.error('Supabase error:', {
          error: supabaseError,
          details: supabaseError.details,
          message: supabaseError.message,
          hint: supabaseError.hint
        });
      } else {
        console.log('Successfully stored user in Supabase:', data);
      }

      return new NextResponse(
        JSON.stringify({
          sessionId: session.id,
          url: session.url
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      throw stripeError;
    }

  } catch (error) {
    console.error('Full error details:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}