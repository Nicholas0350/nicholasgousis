import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const domains = await resend.domains.list();
    return NextResponse.json({ domains });
  } catch (err) {
    console.error('Domain verification error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to verify domain' }, { status: 500 });
  }
}