import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { Stripe } from 'stripe';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { WelcomeEmail } from '@/emails/welcome';
import crypto from 'crypto';

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

const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2024-11-20.acacia' });
const resend = new Resend(process.env.RESEND_API_KEY as string);
const fromEmail = process.env.RESEND_FROM_EMAIL as string;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    const err = error as Error;
    console.error('Error verifying webhook signature:', err.message);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    const customer_id = session.customer as string;

    if (!email) {
      console.error('No email found in session:', JSON.stringify(session, null, 2));
      return new Response('No email found in session', { status: 400 });
    }

    try {
      // Check if user already exists
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();

      if (listError) {
        console.error('Error listing users:', listError);
        return new Response('Error checking existing users', { status: 500 });
      }

      const existingUser = existingUsers.users.find(u => u.email === email);

      if (!existingUser) {
        console.log('Creating new user:', email);
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

        console.log('Successfully created user:', email);

        // Send welcome email
        try {
          await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: 'Welcome to Nicholas Gousis Financial Services!',
            react: WelcomeEmail({ email })
          });
          console.log('Successfully sent welcome email to:', email);
        } catch (emailError) {
          const err = emailError as Error;
          console.error('Error sending welcome email:', err.message);
          // Don't fail the webhook if email fails
        }
      } else {
        console.log('User already exists:', email);
      }

      return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (error) {
      const err = error as Error;
      console.error('Error processing webhook:', err.message);
      return new Response('Error processing webhook', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}