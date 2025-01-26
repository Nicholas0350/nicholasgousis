# API Routes and Middleware

## Rate Limiting Middleware

The API uses rate limiting based on subscription tiers:

```typescript
// src/middleware/rateLimit.ts
import type { Context, MiddlewareHandler, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../auth";
import { rateLimit, user } from "../db/schema";
import { and, eq, gt } from "drizzle-orm";
import type { User, Session } from "../db/schema";

export interface RateLimitConfig {
  limit: number;
  window: number;
}

export const getTierLimit = async (user: User) => {
  if (!user?.subscriptionId) {
    return { limit: 100, window: 60 * 60 }; // Free tier
  }
  return { limit: 1000, window: 60 * 60 }; // Paid tier
};

export const ratelimiter = async (c: Context<{
  Bindings: Env,
  Variables: {
    user: User,
    session: Session
  }
}>, next: Next) => {
  const rateLimiter = createRateLimiter(
    async (user) => await getTierLimit(user)
  );
  return rateLimiter(c, next);
}
```

## API Routes

Main API routes with authentication and rate limiting:

```typescript
// src/api.ts
import { Hono } from "hono";
import { ratelimiter } from "./middleware/rateLimit";
import type { User, Session } from "./db/schema";

export const apiRouter = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
    session: Session;
  };
}>()
.use(ratelimiter)
.get("/", (c) => {
    const user = c.get("user")
    if (!user?.subscriptionId) {
        return c.json({
            error: "Unauthorized, please buy a subscription"
        }, 401)
    }
    return c.json({
        message: "Hello World"
    })
})
```

## Payment Webhook Handler

Handles Lemonsqueezy subscription webhooks:

```typescript
// src/payment/lemonsqueezy.ts
export const paymentRouter = new Hono<{
  Bindings: Env,
  Variables: {
    user: User,
    session: Session
  }
}>()

const SUPPORTED_EVENTS = [
    'subscription_created',
    'subscription_updated',
    'subscription_cancelled',
    'subscription_expired'
]

paymentRouter.post("/webhook", async (c) => {
    if (c.req.method !== "POST") {
        return c.json({ error: "Method not allowed" }, 405)
    }

    const secret = c.env.SECRET
    const signature = c.req.header("x-signature")

    if (!signature || !secret) {
        return c.json({ error: "Unauthorized" }, 401)
    }

    const body = await c.req.text()
    const isValid = await verifySignature(secret, signature, body)

    if (!isValid) {
        return c.json({ error: "Unauthorized" }, 401)
    }

    const payload = JSON.parse(body) as DiscriminatedWebhookPayload<{email: string}>
    const { event_name: eventName } = payload.meta

    if (!SUPPORTED_EVENTS.includes(eventName)) {
        return c.json({ error: "Event not supported" }, 400)
    }

    // Update user subscription status
    const isSubscriptionActive = ['subscription_created', 'subscription_updated'].includes(eventName)
    await updateUserSubscription(
        c.env,
        users[0].id,
        isSubscriptionActive ? payload.data.id : null
    )

    return c.json({ message: "Webhook received" }, 200)
})
```