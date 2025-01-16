'use server'

import { Resend } from 'resend';
import { Email } from '@/emails';
import { BroadcastTemplate } from '@/emails/broadcast-template';

const resend = new Resend(process.env.RESEND_API_KEY);

// For development/testing
const FROM_EMAIL = process.env.NODE_ENV === 'development'
  ? 'onboarding@resend.dev'
  : 'newsletter@nicholasgousis.com';

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    const TO_EMAIL = process.env.NODE_ENV === 'development'
      ? 'delivered@resend.dev'
      : email;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: 'Welcome to Our ASIC Regulated Financial Services Newsletter',
      html: `
        <h1>Welcome to Our Newsletter</h1>
        <p>Thank you for subscribing to our ASIC Regulated Financial Services newsletter. We'll keep you updated with the latest news and insights.</p>
      `
    });

    return { success: 'You have been subscribed to the newsletter!' };
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    return { error: 'Failed to subscribe. Please try again.' };
  }
}

export async function sendVerificationEmail(email: string, url: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    throw new Error('RESEND_API_KEY is not set');
  }

  try {
    const TO_EMAIL = process.env.NODE_ENV === 'development'
      ? 'delivered@resend.dev'
      : email;

    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: 'Verify your email',
      react: Email({ url, recipientEmail: TO_EMAIL }),
      headers: {
        'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL || 'https://nicholasgousis.com'}/unsubscribe?email=${TO_EMAIL}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    });

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { error: 'Failed to send verification email' };
  }
}

export async function sendEmail({
  to,
  subject,
  react
}: {
  to: string,
  subject: string,
  react: JSX.Element
}) {
  const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://nicholasgousis.com';

  return await resend.emails.send({
    from: 'Nicholas Gousis <newsletter@nicholasgousis.com>',
    to: [to],
    subject,
    react,
    headers: {
      'List-Unsubscribe': `<${domain}/unsubscribe?email=${to}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
    }
  });
}

export async function sendBroadcast({
  subject,
  content,
  audienceId
}: {
  subject: string;
  content: string;
  audienceId: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      subject,
      react: BroadcastTemplate({ content }),
      audienceId
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending broadcast:', error);
    return { error: 'Failed to send broadcast' };
  }
}
