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
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error },
      { status: 500 }
    );
  }
}