# Utilities and Type Definitions

## Encryption Utilities

Utilities for encrypting and decrypting API keys:

```typescript
// src/utils/cipher.ts
async function encrypt(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  // Hash the key to ensure it's exactly 16 bytes (128 bits)
  const keyHash = await crypto.subtle.digest("SHA-256", encoder.encode(key));
  const keyBytes = new Uint8Array(keyHash).slice(0, 16);

  const baseForIv = encoder.encode(data + key);
  const ivHash = await crypto.subtle.digest("SHA-256", baseForIv);
  const iv = new Uint8Array(ivHash).slice(0, 12);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 128 },
    false,
    ["encrypt", "decrypt"],
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv).buffer as ArrayBuffer },
    cryptoKey,
    encodedData,
  );

  const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
  const base64 = Buffer.from(combined).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function decrypt(encryptedData: string, key: string): Promise<string> {
  const base64 = encryptedData
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(
      encryptedData.length + ((4 - (encryptedData.length % 4)) % 4),
      "=",
    );

  const combined = Buffer.from(base64, "base64");
  const combinedArray = new Uint8Array(combined);

  const iv = combinedArray.slice(0, 12);
  const encrypted = combinedArray.slice(12);

  const keyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  const keyBytes = new Uint8Array(keyHash).slice(0, 16);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 128 },
    false,
    ["encrypt", "decrypt"],
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv).buffer as ArrayBuffer },
    cryptoKey,
    encrypted.buffer as ArrayBuffer,
  );

  return new TextDecoder().decode(decrypted);
}

export { encrypt, decrypt };
```

## API Key Generation

Functions for generating and decrypting API keys:

```typescript
// src/utils/key.ts
import { decrypt, encrypt } from "./cipher"

export const generateKey = async (userId: string, lastKeyGeneratedAt: string, secret: string) => {
    return await encrypt(`${userId}--${lastKeyGeneratedAt}`, secret)
}

export const decryptKey = async (key: string, secret: string) => {
    const decrypted = await decrypt(key, secret)
    return decrypted.split("--")
}
```

## Lemonsqueezy Types

Type definitions for Lemonsqueezy webhooks:

```typescript
// src/payment/types.ts
type SubscriptionEventNames =
    | 'subscription_created'
    | 'subscription_cancelled'
    | 'subscription_resumed'
    | 'subscription_updated'
    | 'subscription_expired'
    | 'subscription_paused'
    | 'subscription_unpaused'

export type WebhookPayload<CustomData = unknown> = {
    meta: {
        event_name: SubscriptionEventNames
        custom_data?: CustomData
    }
    data: Subscription
}

export type DiscriminatedWebhookPayload<CustomData = unknown> = {
    event_name: SubscriptionEventNames
    meta: {
        event_name: SubscriptionEventNames
        custom_data: CustomData
    }
    data: Subscription
}

export type Subscription = {
    type: 'subscriptions'
    id: string
    attributes: {
        store_id: number
        order_id: number
        customer_id: number
        user_name: string
        user_email: string
        status: SubscriptionStatus
        status_formatted: string
        renews_at: string
        ends_at: string | null
        created_at: string
        updated_at: string
        test_mode: boolean
    }
}

type SubscriptionStatus =
    | 'on_trial'
    | 'active'
    | 'paused'
    | 'past_due'
    | 'unpaid'
    | 'cancelled'
    | 'expired'
```