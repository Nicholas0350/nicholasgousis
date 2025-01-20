'use server'

import { Resend } from 'resend';
// Temporarily disabled for production
/*
import { BroadcastTemplate } from '@/emails/broadcast-template';
import type { Email } from '@/emails';
*/
import { NextResponse } from 'next/server';

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
interface EmailData {
  from: string;
  to: string;
  subject: string;
  previewText?: string;
}

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
