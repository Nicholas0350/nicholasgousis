import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET) {
  throw new Error('STRIPE_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2024-11-20.acacia',
});

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

    try {
      console.log('Creating Stripe session for:', email, priceId);
      // Create Stripe checkout session
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
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter`,
        metadata: {
          email,
          tier: 'tier_1',
          price_id: priceId,
          version: '2', // To track which version of the checkout flow was used
        },
      });

      return new NextResponse(
        JSON.stringify({
          sessionId: session.id,
          url: session.url,
          isTestMode: process.env.NODE_ENV !== 'production'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      return new NextResponse(
        JSON.stringify({
          error: 'Failed to create checkout session',
          details: stripeError instanceof Error ? stripeError.message : String(stripeError)
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Invalid request',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}