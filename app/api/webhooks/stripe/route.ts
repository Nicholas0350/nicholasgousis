import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/welcome';

// Check required environment variables
if (!process.env.STRIPE_SECRET) {
  throw new Error('Missing STRIPE_SECRET');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET');
}

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY');
}

if (!process.env.RESEND_FROM_EMAIL) {
  throw new Error('Missing RESEND_FROM_EMAIL');
}

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature) {
      throw new Error('No signature found in request');
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Webhook signature verification failed' }),
      { status: 400 }
    );
  }

  try {
    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const userData = {
          email: session.customer_email!,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_status: subscription.status,
          subscription_tier: 'tier_1',
          subscription_end_date: new Date(subscription.current_period_end * 1000),
          updated_at: new Date()
        };

        // Check if user exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, email, subscription_status')
          .eq('email', userData.email)
          .single();

        if (existingProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update(userData)
            .eq('id', existingProfile.id);

          if (updateError) throw updateError;

          // Send welcome back email if resubscribing
          if (existingProfile.subscription_status !== 'active') {
            await resend.emails.send({
              from: fromEmail,
              to: userData.email,
              subject: 'Welcome Back to Nicholas Gousis Financial Services!',
              react: WelcomeEmail({ email: userData.email })
            });
          }
        } else {
          // Create new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              ...userData,
              created_at: new Date()
            });

          if (insertError) throw insertError;

          // Send welcome email
          await resend.emails.send({
            from: fromEmail,
            to: userData.email,
            subject: 'Welcome to Nicholas Gousis Financial Services!',
            react: WelcomeEmail({ email: userData.email })
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            subscription_end_date: new Date(subscription.current_period_end * 1000),
            updated_at: new Date()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) throw updateError;
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            subscription_end_date: new Date(),
            updated_at: new Date()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) throw updateError;
        break;
      }
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}