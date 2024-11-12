import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Update user subscription status in Supabase
        await supabase
          .from('users')
          .update({
            subscription_status: 'active',
            subscription_end_date: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days from now
            ).toISOString()
          })
          .eq('payment_id', paymentIntent.id);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        // Update user subscription status in Supabase
        await supabase
          .from('users')
          .update({
            subscription_status: 'cancelled',
            subscription_end_date: new Date().toISOString() // End subscription immediately
          })
          .eq('payment_id', subscription.id);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}