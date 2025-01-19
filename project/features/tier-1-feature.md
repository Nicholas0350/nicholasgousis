# Tier 1 Feature Implementation ($77/month)

## 1. Implementation Progress
- [x] Database Schema Validation
- [x] Stripe Integration
- [x] User Metadata Schema Update
- [x] Soft Delete API Implementation
- [x] User Interface Updates
- [ ] Subscription Creation Flow Refactor
  - [ ] Move user creation to webhook
  - [ ] Store only email in session metadata
  - [ ] Add proper error handling
  - [ ] Implement proper session verification
  - [ ] Add loading states
  - [ ] Improve error messages

### ✅ Database Schema Validation
- Verified Supabase User Table Schema matches local implementation
- All required fields present with correct types
- Schema supports subscription and payment tracking

1.	Idempotency Check:
	•	Prevent duplicate processing by logging session.id in a stripe_webhooks table.
	2.	Background Email Sending:
	•	Email sending is offloaded using an async IIFE to prevent blocking the response to Stripe.
	3.	Improved Logging:
	•	Added detailed logs to track user creation, updates, and webhook retries.
	4.	Error Handling:
	•	Ensures a response is always returned to Stripe, even if tasks fail.

## 2. Webhook Implementation
- [ ] Set up Stripe webhook endpoint
  - [ ] Handle checkout.session.completed
  - [ ] Handle customer.subscription.updated
  - [ ] Handle customer.subscription.deleted
  - [ ] Handle invoice.payment_failed
  - [ ] Add webhook signature verification
  - [ ] Add retry logic for failed operations
- [ ] 1. Background Processing
   - Email sending is offloaded to async IIFE
   - Prevents blocking webhook response to Stripe
   - Improves webhook reliability

### ✅ Stripe Integration
- Connected to correct Stripe account
- Product and price created for $77/month subscription
- Test mode configuration verified
- Webhook handler implemented with:
  - Proper timeout handling
  - Idempotency checks
  - Non-blocking email sending
  - Error logging and monitoring
  - Event type handling for all subscription states

### Subscription Flow
1. User enters email and clicks subscribe
2. Stripe Checkout session created with:
   - Email and tier stored in metadata
   - Success/cancel URLs configured
   - Price ID set for $77/month tier
3. On successful payment:
   - Webhook validates signature
   - Checks for duplicate processing
   - Creates/updates user in Supabase
   - Sends welcome email asynchronously
   - Updates subscription status
4. User receives email with:
   - Welcome message
   - Account setup instructions
   - Magic link for authentication

### Error Handling
- Webhook signature verification
- Duplicate webhook prevention
- Failed payment handling
- Email sending retries
- Proper error logging
- User-friendly error messages

### Monitoring
- Webhook processing times
- Email delivery rates
- Payment success rates
- User creation success
- Error rates and types

2. Error Handling
   - Improved error logging for user creation/updates
   - Non-blocking email sending with error capture
   - Always returns 200 to Stripe for successful receipt

## 3. User Management
- [ ] Customer Portal Integration
- [ ] Checks for existing users before creation
   - Updates user metadata for existing users
   - Creates new users with email confirmation
   - Sends welcome email with magic link
  - [ ] Create billing portal page
  - [ ] Add subscription management UI
  - [ ] Handle subscription updates
  - [ ] Add payment method management
  - [ ] Implement cancellation flow
  - [ ] Add upgrade/downgrade options

## 4. Email Notifications
- [ ] Welcome Email
  - [ ] Design template
  - [ ] Set up trigger on successful subscription
  - [ ] Include account setup instructions
- [ ] Subscription Status Emails
  - [ ] Payment success confirmation
  - [ ] Payment failure notification
  - [ ] Subscription cancellation
  - [ ] Renewal reminders

### 1. User Metadata Schema Update
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
# Stripe Configuration
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...


### stripe_webhooks Table
```sql
create table stripe_webhooks (
  id uuid default uuid_generate_v4() primary key,
  session_id text not null unique,
  processed_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);
```

### Stripe Webhook Events Table
| Event Type | Description | Action Required |
|------------|-------------|-----------------|
| `checkout.session.completed` | Payment successful and subscription created | - Create/update user<br>- Send welcome email<br>- Store stripe_customer_id |
| `customer.subscription.updated` | Subscription status changed | - Update subscription status<br>- Update subscription tier<br>- Send confirmation email |
| `customer.subscription.deleted` | Subscription cancelled | - Update user status<br>- Send cancellation email<br>- Archive user data |
| `invoice.payment_failed` | Failed payment attempt | - Update subscription status<br>- Send payment failure email<br>- Retry payment flow |
| `customer.deleted` | Customer deleted in Stripe | - Soft delete user<br>- Archive user data<br>- Send account closure email |

### Webhook Processing Flow
1. Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
2. Check idempotency using `stripe_webhooks` table
3. Process event based on type
4. Send appropriate notifications
5. Update user metadata
6. Log webhook completion

### 2. Soft Delete API Implementation
- Create `/api/user/soft-delete` endpoint
- Implement Stripe subscription cancellation
- Update user metadata with soft delete status
- Maintain historical data

### 3. User Interface Updates
- Add account deletion option to user settings
- Implement confirmation dialog
- Show appropriate success/error messages
- Handle resubscription flow

### 4. Admin View (Future Phase)
- Create admin dashboard for user history
- Implement subscription tracking
- Add reporting features

### Remaining Tasks

### 5. User Authentication
- Implement email/password authentication using Supabase Auth
- Store user credentials securely in the user table
- Implement password reset functionality
- Add session management

### 6. Subscription Setup
- Stripe subscription product id prod_RQYUyAj1oznbpS for $77/month tier
- Set up webhook endpoints for subscription events
- Implement subscription status tracking in user table

### 7. Email Notification System
- Complete Resend email templates for immediate notifications
- Configure notification triggers for:
  - New AFSL changes
  - ACL updates
  - Licensee status changes

### 8. Database Integration
```typescript
interface Tier1User {
  id: number;
  email: string;
  subscription_status: 'active' | 'cancelled' | 'past_due';
  subscription_end_date: Date;
  stripe_customer_id: string;
  stripe_session_id: string;
}
```

### 9. API Endpoints Required
```typescript
// User Management
POST /api/auth/register
POST /api/auth/login
POST /api/auth/reset-password
POST /api/subscription/create
POST /api/subscription/cancel
GET /api/subscription/status

// Notifications
POST /api/notifications/send
GET /api/notifications/history
```

### 10. Cron Jobs
- Daily check for AFSL/ACL changes
- Subscription status monitoring
- Email notification dispatch

### 11. Testing Requirements
- User authentication flow
- Subscription lifecycle
- Email notification delivery
- Database schema validation
- API endpoint functionality

### 12. Monitoring
- Subscription status
- Email delivery rates
- User authentication success rate
- API endpoint performance

### 13. Security Measures
- Encrypt sensitive user data
- Implement rate limiting
- Add audit logging for subscription changes
- Secure API endpoints with Supabase auth

1. [ ] Add retry mechanism for failed email sending
2. [ ] Implement webhook timeout handling
3. [ ] Add monitoring for webhook processing times
4. [ ] Set up alerts for failed webhooks
5. [ ] Add metrics collection for webhook success rates
