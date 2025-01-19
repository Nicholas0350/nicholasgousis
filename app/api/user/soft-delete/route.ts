import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { softDeleteUser } from '@/lib/supabase-admin';

if (!process.env.STRIPE_SECRET) {
  throw new Error('STRIPE_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400 }
      );
    }

    // Soft delete user in Supabase
    const { data: userData } = await softDeleteUser(userId);

    // Cancel Stripe subscription if exists
    if (userData?.user_metadata?.stripe_customer_id) {
      try {
        // Get all subscriptions for customer
        const subscriptions = await stripe.subscriptions.list({
          customer: userData.user_metadata.stripe_customer_id,
          limit: 1,
          status: 'active',
        });

        // Cancel the active subscription
        if (subscriptions.data.length > 0) {
          await stripe.subscriptions.update(subscriptions.data[0].id, {
            cancel_at_period_end: true,
            metadata: {
              cancelled_reason: 'user_soft_deleted',
              cancelled_at: new Date().toISOString()
            }
          });
        }
      } catch (stripeError) {
        console.error('Error cancelling Stripe subscription:', stripeError);
        // Don't throw here - we still want to complete the soft delete
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Account successfully deactivated'
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in soft delete:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to deactivate account',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}