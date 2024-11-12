import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Add debug logging
console.log('Stripe Key Available:', !!process.env.STRIPE_SECRET);

// Initialize Stripe with secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2024-10-28.acacia', // Using version required by @types/stripe
});

export async function POST(req: Request) {
  try {
    // Extract amount from request body
    const { amount } = await req.json();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., 12900 = $129.00)
      currency: 'usd', // Using USD as currency
      // Add automatic payment methods
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret to the client
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    // Handle unknown errors
    console.error('Unknown error:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}