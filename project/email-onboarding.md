# Email Setup with Resend and React Email

## 1. Domain Setup
1. Add domain `nicholasgousis.com` in Resend dashboard
2. Verify domain ownership through DNS records
3. Wait for domain verification status to become "Verified"

## 2. Environment Configuration
1. Add Resend API key to `.env.local`:
```env
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=newsletter@nicholasgousis.com
```

## 3. Email Template Setup
1. Create `emails` directory in project root
2. Create `broadcast-template.tsx` with React Email components:
```tsx
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Heading,
} from "@react-email/components";

interface BroadcastTemplateProps {
  previewText?: string;
}

const BroadcastTemplate = ({ previewText = "Latest Financial Services Updates" }: BroadcastTemplateProps) => {
  return (
    <Html>
      <Head>
        <title>Nicholas Gousis | Financial Services</title>
        <meta name="description" content={previewText} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        // ... template content
      </Body>
    </Html>
  );
};
```

## 4. API Route Setup
1. Create `app/api/newsletter/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import BroadcastTemplate from '@/emails/broadcast-template';

const resend = new Resend(process.env.RESEND_API_KEY);
const DOMAIN = 'https://nicholasgousis.com';

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: `Nicholas Gousis <${process.env.RESEND_FROM_EMAIL}>`,
      replyTo: process.env.RESEND_FROM_EMAIL,
      to: 'nicholas0350@gmail.com',
      subject: 'Test Broadcast Email',
      react: BroadcastTemplate({ previewText: 'Test Broadcast Preview' }),
      headers: {
        'List-Unsubscribe': `<${DOMAIN}/unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Entity-Ref-ID': new Date().getTime().toString()
      }
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send test email', details: error },
      { status: 500 }
    );
  }
}
```


## 5. Testing
1. Start development server:
```bash
npm run dev
# Note: Server might run on different ports (3000, 3001, 3002) if ports are in use
```

2. Test email sending via API endpoint:
```bash
# Basic test
curl http://localhost:3002/api/newsletter

# Verbose test to see full response
curl -v http://localhost:3002/api/newsletter
```

3. Expected API Responses:
```json
// Success Response
{
  "success": true,
  "data": {
    "data": {
      "id": "54deedac-3161-4c9f-959f-aa751c3fbec5"
    },
    "error": null
  }
}

// Error Response (if domain not verified)
{
  "success": true,
  "data": {
    "data": null,
    "error": {
      "statusCode": 403,
      "message": "The gmail.com domain is not verified. Please add and verify your domain",
      "name": "validation_error"
    }
  }
}
```

4. Troubleshooting Steps:
   - If getting 404: Verify the API route file is in correct location
   - If getting 500: Check server logs for detailed error message
   - If domain error: Ensure domain is verified in Resend dashboard
   - If sender error: Verify RESEND_FROM_EMAIL matches verified domain

5. Email Verification:
   - Check recipient inbox (nicholas0350@gmail.com)
   - Verify sender appears as "Nicholas Gousis <newsletter@nicholasgousis.com>"
   - Check email headers for proper List-Unsubscribe configuration
   - Verify email content matches template design

## 6. Implementing Fortnightly Email Cadence

### Content Management
1. Create content types in `types/newsletter.ts`:
```typescript
export interface NewsletterContent {
  id: string;
  subject: string;
  previewText: string;
  content: {
    intro: string;
    mainPoints: {
      title: string;
      description: string;
    }[];
    conclusion: string;
  };
  publishDate: Date;
  status: 'draft' | 'scheduled' | 'sent';
}
```

2. Set up content storage in `lib/newsletter-content.ts`:
```typescript
import { sql } from '@vercel/postgres';
import { NewsletterContent } from '@/types/newsletter';

export async function saveNewsletter(content: NewsletterContent) {
  return await sql`
    INSERT INTO newsletter_content (
      subject, preview_text, content, publish_date, status
    ) VALUES (
      ${content.subject},
      ${content.previewText},
      ${JSON.stringify(content.content)},
      ${content.publishDate},
      ${content.status}
    )
  `;
}

export async function getScheduledNewsletter() {
  const result = await sql`
    SELECT * FROM newsletter_content
    WHERE status = 'scheduled'
    AND publish_date <= NOW()
    ORDER BY publish_date ASC
    LIMIT 1
  `;
  return result.rows[0] as NewsletterContent;
}
```

3. Enhance `BroadcastTemplate` to use content in `emails/broadcast-template.tsx`:
```typescript
interface BroadcastTemplateProps {
  content: NewsletterContent;
}

const BroadcastTemplate = ({ content }: BroadcastTemplateProps) => {
  return (
    <Html>
      <Head>
        <title>Nicholas Gousis | Financial Services</title>
        <meta name="description" content={content.previewText} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>{content.previewText}</Preview>
      <Body style={main}>
        <Container>
          <Section>
            <Text>{content.content.intro}</Text>

            {content.content.mainPoints.map((point, index) => (
              <Section key={index}>
                <Heading>{point.title}</Heading>
                <Text>{point.description}</Text>
              </Section>
            ))}

            <Text>{content.content.conclusion}</Text>

            <Hr />
            <Text style={footer}>
              You're receiving this because you subscribed to updates.{' '}
              <Link href="{{unsubscribeUrl}}">Unsubscribe</Link>
            </Text>
          </Container>
        </Section>
      </Body>
    </Html>
  );
};
```

4. Update cron job to use content in `app/api/cron/newsletter/route.ts`:
```typescript
import { getScheduledNewsletter } from '@/lib/newsletter-content';
// ... existing imports ...

export async function GET() {
  try {
    const content = await getScheduledNewsletter();
    if (!content) {
      return NextResponse.json({ message: 'No scheduled content found' });
    }

    const subscribers = await getSubscribers();

    const emailPromises = subscribers.map(subscriber =>
      resend.emails.send({
        from: `Nicholas Gousis <${process.env.RESEND_FROM_EMAIL}>`,
        replyTo: process.env.RESEND_FROM_EMAIL,
        to: subscriber.email,
        subject: content.subject,
        react: BroadcastTemplate({ content }),
        headers: {
          'List-Unsubscribe': `<${DOMAIN}/unsubscribe?email=${subscriber.email}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'X-Entity-Ref-ID': `${new Date().getTime()}-${subscriber.id}`
        }
      })
    );

    await Promise.all(emailPromises);

    // Update content status to sent
    await sql`
      UPDATE newsletter_content
      SET status = 'sent'
      WHERE id = ${content.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send newsletters', details: error },
      { status: 500 }
    );
  }
}
```

5. Add content management schema:
```sql
CREATE TABLE newsletter_content (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  preview_text VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  publish_date TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at
CREATE TRIGGER update_newsletter_content_timestamp
  BEFORE UPDATE ON newsletter_content
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
```

### Content Creation Workflow
1. Draft content using admin interface or directly in database:
```typescript
// Example content creation
const newContent: NewsletterContent = {
  subject: "Your Fortnightly Financial Insights",
  previewText: "Market updates and investment strategies for January",
  content: {
    intro: "Here's your curated financial insights for the fortnight...",
    mainPoints: [
      {
        title: "Market Trends",
        description: "Analysis of current market conditions..."
      },
      {
        title: "Investment Strategy",
        description: "Key considerations for your portfolio..."
      }
    ],
    conclusion: "Stay tuned for more updates in two weeks..."
  },
  publishDate: new Date('2024-01-30T09:00:00Z'),
  status: 'scheduled'
};

await saveNewsletter(newContent);
```

2. Content Review Process:
- Draft content in 'draft' status
- Review and edit as needed
- Set status to 'scheduled' when ready
- Cron job picks up and sends at next scheduled time

### Testing Content
1. Preview email template:
```bash
# Test with specific content ID
curl http://localhost:3002/api/newsletter/preview/[contentId]
```

2. Send test email:
```bash
# Send test to specific email
curl -X POST http://localhost:3002/api/newsletter/test \
  -H "Content-Type: application/json" \
  -d '{"contentId": 1, "email": "test@example.com"}'
```

## Notes
- Always use verified domain for sending emails
- React Email components provide responsive email templates
- Unsubscribe headers included for email compliance
- Error handling implemented for failed email attempts

## Useful Links
- [Resend Dashboard](https://resend.com)
- [React Email Documentation](https://react.email)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)