import { createClient, User } from '@supabase/supabase-js';

// User metadata types
export interface UserMetadata {
  stripe_customer_id: string;
  subscription_status: 'active' | 'cancelled' | 'soft_deleted' | 'pending';
  subscription_tier: 'tier_1' | 'tier_2';
  soft_deleted_at?: string;
  previous_subscriptions?: {
    start_date: string;
    end_date: string;
    tier: string;
    status: string;
  }[];
}

// Extend User type to include our metadata
export interface UserWithMetadata extends User {
  user_metadata: UserMetadata;
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

// Create a Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

// Helper function to update user metadata
export async function updateUserMetadata(userId: string, metadata: Partial<UserMetadata>) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    { user_metadata: metadata }
  );

  if (error) throw error;
  return data;
}

// Helper function to get user with metadata
export async function getUserWithMetadata(userId: string): Promise<UserWithMetadata> {
  const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) throw error;
  if (!user) throw new Error('User not found');

  return user as UserWithMetadata;
}

// Helper function to initialize user metadata
export async function initializeUserMetadata(userId: string, stripeCustomerId: string) {
  const metadata: UserMetadata = {
    stripe_customer_id: stripeCustomerId,
    subscription_status: 'pending',
    subscription_tier: 'tier_1',
    previous_subscriptions: []
  };

  return updateUserMetadata(userId, metadata);
}

// Helper function to soft delete user
export async function softDeleteUser(userId: string) {
  try {
    // Get current user data
    const user = await getUserWithMetadata(userId);
    if (!user) throw new Error('User not found');

    // Store current subscription as history
    const currentSubscription = {
      start_date: user.created_at,
      end_date: new Date().toISOString(),
      tier: user.user_metadata?.subscription_tier || 'tier_1',
      status: 'cancelled'
    };

    // Update user metadata
    const metadata: Partial<UserMetadata> = {
      subscription_status: 'soft_deleted',
      soft_deleted_at: new Date().toISOString(),
      previous_subscriptions: [
        ...(user.user_metadata?.previous_subscriptions || []),
        currentSubscription
      ]
    };

    // Update user in Supabase
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { user_metadata: metadata }
    );

    if (error) throw error;

    // If user has a Stripe customer ID, cancel their subscription
    if (user.user_metadata?.stripe_customer_id) {
      // Note: Implement Stripe subscription cancellation here
      // This will be handled by the API endpoint
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error soft deleting user:', error);
    throw error;
  }
}

export { supabaseAdmin };