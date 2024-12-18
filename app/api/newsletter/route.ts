import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Email } from '@/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: 'newsletter@nicholasgousis.com',
      to: 'your-test-email@nicholasgousis.com',
      subject: 'Test Email',
      react: Email({ url: 'http://localhost:3000/verify?test=true' }),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}