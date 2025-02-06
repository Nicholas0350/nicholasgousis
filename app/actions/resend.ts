'use server'

import { Resend } from 'resend';
// Temporarily disabled for production
/*
import { BroadcastTemplate } from '@/emails/broadcast-template';
import type { Email } from '@/emails';
*/

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Use mail subdomain that's already configured in DNS
const FROM_EMAIL = process.env.NODE_ENV === 'development'
  ? 'onboarding@resend.dev'
  : 'noreply@mail.nicholasgousis.com'; // Using verified mail subdomain

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    const TO_EMAIL = process.env.NODE_ENV === 'development'
      ? 'delivered@resend.dev'
      : email;

    console.log('Attempting to send newsletter email:', {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      apiKey: process.env.RESEND_API_KEY ? 'Set' : 'Not Set'
    });

    const result = await resend.emails.send({
      from: `ASIC Financial Services <${FROM_EMAIL}>`,
      replyTo: FROM_EMAIL,
      to: TO_EMAIL,
      subject: 'Confirm Your ASIC Financial Services Newsletter Subscription',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Newsletter Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
              <h1 style="color: #333; margin-bottom: 20px;">Confirm Your Subscription</h1>
              <p>Thank you for subscribing to the ASIC Regulated Financial Services newsletter.</p>
              <div style="margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/newsletter/confirm?email=${encodeURIComponent(TO_EMAIL)}"
                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  Confirm Subscription
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">If you didn&apos;t request this subscription, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">
                You&apos;re receiving this email because you signed up for the ASIC Financial Services newsletter.
                <br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(TO_EMAIL)}" style="color: #666;">Unsubscribe</a>
              </p>
            </div>
          </body>
        </html>
      `,
      headers: {
        'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(TO_EMAIL)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    });

    console.log('Email send result:', result);

    return { success: 'Please check your email to confirm your subscription.' };
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
    // const TO_EMAIL = process.env.NODE_ENV === 'development'
    //   ? 'delivered@resend.dev'
    //   : email;

    // Temporarily disabled for production
    /*
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
    */
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { error: 'Failed to send verification email' };
  }
}

// Temporarily disabled for production
/*
export async function sendEmail(email: Email) {
  try {
    const data = await resend.emails.send({
      from: email.from,
      to: email.to,
      subject: email.subject,
      react: BroadcastTemplate({ previewText: email.previewText })
    });
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
*/

// Temporary placeholder function
/*
interface EmailData {
  from: string;
  to: string;
  subject: string;
  previewText?: string;
}
*/

export async function sendEmail() {
  return { success: true };
}

// Temporarily disabled for production
/*
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
*/
