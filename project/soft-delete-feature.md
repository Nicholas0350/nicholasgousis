# Soft Delete User Feature

## Overview
When users "delete" their account, we:
1. Maintain their historical data
2. Allow them to resubscribe as "new" users
3. Track their previous subscription history internally

## Database Schema Updates

### User Metadata in Supabase Auth
```typescript
interface UserMetadata {
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
```

## Implementation Steps

### 1. Soft Delete Process
```typescript
async function softDeleteUser(userId: string) {
  // 1. Update user metadata
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      subscription_status: 'soft_deleted',
      soft_deleted_at: new Date().toISOString(),
    }
  });

  // 2. Cancel Stripe subscription but maintain customer
  // 3. Archive user data but don't delete
  // 4. Mark email as inactive but maintain record
}
```

### 2. Resubscription Process
- When user signs up with previously used email:
  1. Check for existing soft-deleted account
  2. If found, create new subscription but link to history
  3. Show as new user in frontend
  4. Maintain internal connection to previous data

### 3. Admin View Requirements
- Show complete user history including:
  - Previous subscription periods
  - Total lifetime value
  - Number of resubscriptions
  - Soft delete dates
  - Current status

### 4. API Endpoints

```typescript
// Soft Delete
POST /api/user/soft-delete
Request: { userId: string }
Response: { success: boolean }

// Check Previous History
POST /api/user/check-history
Request: { email: string }
Response: {
  hasHistory: boolean;
  previousSubscriptions?: {
    dates: { start: string; end: string };
    tier: string;
  }[];
}

// Admin History View
GET /api/admin/user-history/:userId
Response: {
  user: {
    email: string;
    currentStatus: string;
    subscriptionHistory: Array<{
      period: { start: string; end: string };
      tier: string;
      status: string;
      amount: number;
    }>;
    totalValue: number;
    softDeleteCount: number;
  }
}
```

### 5. User Experience
1. User requests account deletion
2. Show message: "Your account will be deactivated. You can always create a new account later with the same or different email."
3. Don't mention data retention
4. When they resubscribe:
   - Treat as new user
   - Don't mention previous history
   - Create fresh subscription

### 6. Admin Experience
1. Can see full user history
2. Can track resubscription patterns
3. Can identify returning users
4. Can view lifetime value across subscriptions

### 7. Data Retention
- Keep all historical data indefinitely
- Maintain subscription history
- Keep Stripe customer records
- Archive but don't delete email records

### 8. Security Measures
- Encrypt sensitive historical data
- Maintain GDPR compliance by:
  - Having clear data retention policies
  - Providing data export capability
  - Allowing true deletion if legally required

### 9. Implementation Checklist
- [ ] Update Supabase user metadata schema
- [ ] Create soft delete API endpoint
- [ ] Modify subscription creation to check history
- [ ] Create admin view for user history
- [ ] Update Stripe customer handling
- [ ] Add user deletion flow UI
- [ ] Implement resubscription logic
- [ ] Add admin reporting features

### 10. Testing Requirements
- Verify soft delete process
- Test resubscription flow
- Validate history tracking
- Check admin view accuracy
- Test data retention
- Verify subscription linking