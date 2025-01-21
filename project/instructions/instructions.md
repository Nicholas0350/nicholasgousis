# Project Overview

**Goal:**
- Build a newsletter and notification service paid monthly ASIC regulated AFSL & ACL licenced user list of the latest changes in AFSL licensees.

**Key Objectives:**
- Users are tiered based on their subscription level.
- Tier 1: $77/month paid monthly
- Tier 2: $337/month paid monthly
- Users are validated via existing tables in Supabase and linkedin auth:
  - financial adviser
  - financial services re4presentative
  - credit licensee
  - credit representative
  - financial adviser
  - afsl licensee
- Tier 2 users get immediate notification and email thier license conditions and requirements of changes to changes in the tables as they are updated.
  - Notification changes are derived from the CRON jobs that run daily tracking changes in data.gov and asic.gov websites AFSL, ACL & licensees. endpoints and being updated in Supabase database
- The newsletter is sent out to subscribers on the 1st of each month.
- AFSL, ACL & licensees. endpoints and being updated in Supabase database
- The newsletter is sent out to subscribers on the 1st of each month.


**Target Platforms:** Web
**Dependencies:**
**Frontend:**
- Next.js
- TailwindCSS
- Shadcn UI
- Resend
- React Email
- SWR
- React Query
- React Hook Form

**OS Services:**
**Networking:**
**Database:**
- Supabase (postgres) already installed
- Supabase Auth (auth.users)
  - Do not use auth-helpers-nextjs they are deprecated
- Drizzle

**Backend Services:**
- Stripe
- Resend
- Supabase
---

# Features

1. **Tier 1: $77/month paid monthly**
   - Users
   - immediate notification via email

2. **Tier 2: $337/month paid monthly**
   - Users
   -
   - immediate notification via email
   - incoming changes to license conditions and requirements of changes to changes in the tables as they are updated.
   - Notification changes are derived from the CRON jobs that run daily tracking changes in data.gov and asic.gov websites AFSL, ACL & licensees. endpoints and being updated in Supabase database
   - check license conditions and requirements of changes to changes in the tables as they are updated.
   - drafts and aritcle on the changes and how it could affect their business.
   - make article available to me and my team to review and approve.
   - once approved, send out newsletter on the 1st of each month.
   -

---

# Requirements For Each Feature

### 1.
**Functional:**

-
-

**Non-Functional:**
-

**Error Handling:**
-

### 2.
**Functional:**
-
-
-
  -
  -
  -
  -
-
-

**Non-Functional:**
-
-

**Error Handling:**
- If API call fails, show alert: “Analysis failed. Please retry.”

### 3. Edit & Confirm Subscription
**Functional:**
- Users can adjust:
  - Subscription level
  - Email address
  - Payment method
  - Cancel subscription
  - Change subscription level
- After edits, tapping “Save”:


**Error Handling:**
- Validation: If user enters invalid numeric input (non-numeric), show inline error.
- If save fails (API error), show an alert and allow retry or cancel.



**Non-Functional:**
-
-

**Error Handling:**
-

-

# Data Models

### Local Data Schema

**Entity:**
- `id: UUID`
- `date: Date` (or store as string `YYYY-MM-DD`)
- `email: string`
- `subscription_level: string`
- `payment_method: string`
- `canceled: boolean`
- `created_at: Date`
- `updated_at: Date`


**Entity (Nested in Meal):**
-
-
-
-

---

# API Contract

### LLM API Integration

**Endpoint:**
`POST https://api.openai.com/v1/chat/completions`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <OPENAI_API_KEY>`

**Request Body Example:**
```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/png;base64,<base64-encoded-image>"
          }
        },
        {
          "role": "assistant",
          "content": [
            {
              "type": "text",
              "text": ""
            }
          ]
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": ""
        }
      ]
    }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "food_calories_analysis",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "The title of the food item."
          },
          "image_description": {
            "type": "string",
            "description": "A description of what the image shows and the reasoning."
          },
          "ingredients": {
            "type": "array",
            "description": "List of ingredients contained in the food.",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Title of the ingredient."
                },
                "calories_per_gram": {
                  "type": "number",
                  "description": "Calories per gram for this ingredient."
                },
                "total_grams": {
                  "type": "number",
                  "description": "Total grams of this ingredient."
                },
                "total_calories": {
                  "type": "number",
                  "description": "Total calories contributed by this ingredient."
                }
              },
              "required": [
                "title",
                "calories_per_gram",
                "total_grams",
                "total_calories"
              ],
              "additionalProperties": false
            }
          },
          "total_calories": {
            "type": "number",
            "description": "Total calories of the entire food item."
          },
          "health_score": {
            "type": "number",
            "description": "A score representing the healthiness of the food item."
          }
        },
        "required": [
          "title",
          "image_description",
          "ingredients",
          "total_calories",
          "health_score"
        ],
        "additionalProperties": false
      }
    }
  },
  "temperature": 1,
  "max_completion_tokens": 2048,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}
```

**Example LLM Response:**
```json
{
  "title": "French Toast with Fresh Fruits and Cream",
  "image_description": "The image shows a plate of French toast topped with fresh fruits like strawberries, blueberries, and bananas. It's dusted with powdered sugar and garnished with granola or nuts. There is a small jug of syrup on the side, likely maple syrup.",
  "ingredients": [
    {
      "title": "French Toast",
      "calories_per_gram": 2.5,
      "total_grams": 150,
      "total_calories": 375
    },
    {
      "title": "Strawberries",
      "calories_per_gram": 0.32,
      "total_grams": 50,
      "total_calories": 16
    }...
    {
      "title": "Blueberries",
      "calories_per_gram": 0.57,
      "total_grams": 30,
      "total_calories": 17
    }
  ],
  "total_calories": 734,
  "health_score": 6
}
```

### Save Endpoint (If using remote backend)
**Endpoint:** `POST /api/xxx`
**Request Body:**
```json
{
  "date":"2024-12-19",
  "meal_name":"Pancakes with blueberries & syrup",
  "ingredients":[
    {
      "ingredient_name":"pancakes",
      "calories":595
    },
    ...
  ],
  "total_calories":615
}
```

**Response:**
```json
{
  "id":"<uuid>",
  "date":"2024-12-19",
  "meal_name":"Pancakes with blueberries & syrup",
  "ingredients":[...],
  "total_calories":615,
  "created_at":"2024-12-19T08:30:00Z"
}
```

### Get by Date (If using remote backend)
**Endpoint:** `GET /api/xxx?date=YYYY-MM-DD`
**Response:**
```json
{
  "date":"2024-12-19",
  "meals":[
    {...meal_object_1...},
    {...meal_object_2...}
  ]
}
```
