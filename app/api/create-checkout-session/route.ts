import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET) {
  throw new Error('STRIPE_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2024-11-20.acacia',
});

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
        { status: 400 }
      );
    }

    try {
      // Check if user exists and has active subscription
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email, subscription_status')
        .eq('email', email)
        .single();

      if (existingProfile?.subscription_status === 'active') {
        return new NextResponse(
          JSON.stringify({
            error: 'Subscription already exists',
            redirect: '/login'
          }),
          { status: 400 }
        );
      }

      // Create or get Stripe customer
      let customer;
      const existingCustomers = await stripe.customers.list({ email });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email,
          metadata: {
            user_id: existingProfile?.id
          }
        });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        client_reference_id: existingProfile?.id,
        subscription_data: {
          metadata: {
            user_id: existingProfile?.id
          }
        },
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${existingProfile ? 'login' : 'dashboard'}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter`,
        metadata: {
          email,
          user_id: existingProfile?.id || '',
          tier: 'tier_1'
        },
      });

      // If profile doesn't exist, it will be created automatically by the trigger
      // when the user signs up through Supabase Auth

      return new NextResponse(
        JSON.stringify({
          sessionId: session.id,
          url: session.url
        }),
        { status: 200 }
      );

    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      return new NextResponse(
        JSON.stringify({
          error: 'Failed to create checkout session',
          details: stripeError instanceof Error ? stripeError.message : String(stripeError)
        }),
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Invalid request',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 400 }
    );
  }
}