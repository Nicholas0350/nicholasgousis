# Rate Limiting Configuration

## Changing ratelimits

Ratelimits are set in [`src/middleware/rateLimit.ts`](/src/middleware/rateLimit.ts)

To edit them, simply change the `getTierLimit` function in the ratelimit middleware.

```ts
export const getTierLimit = async (user: User) => {
    if (!user?.subscriptionId) {
        return { limit: 100, window: 60 * 60 }; // Free tier
    }
    return { limit: 1000, window: 60 * 60 }; // Paid tier
};
```

All the `window` values are in seconds.

We are using D1 with custom logic to ratelimit the requests. The schema can be found in [`src/db/schema.ts`](/src/db/schema.ts)