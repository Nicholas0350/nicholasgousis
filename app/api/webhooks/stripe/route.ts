import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { Stripe } from 'stripe';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { WelcomeEmail } from '@/emails/welcome';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2024-11-20.acacia' });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    const customer_id = session.customer as string;

    if (!email) {
      console.error('No email found in session:', session);
      return new Response('No email found in session', { status: 400 });
    }

    try {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === email);

      if (!existingUser) {
        // Create new user with random password and email confirmed
        const password = crypto.randomBytes(32).toString('hex');
        const { error: createUserError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            stripe_customer_id: customer_id,
            subscription_status: 'active',
            subscription_tier: 'tier_1',
            created_at: new Date().toISOString()
          }
        });

        if (createUserError) {
          console.error('Error creating user:', createUserError);
          return new Response('Error creating user', { status: 500 });
        }

        // Send welcome email
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || '',
            to: email,
            subject: 'Welcome to Nicholas Gousis Financial Services!',
            react: WelcomeEmail({ email })
          });
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't fail the webhook if email fails
        }
      }

      return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Error processing webhook', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}