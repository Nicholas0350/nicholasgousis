import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { eq } from 'drizzle-orm';
// import { subscribers } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Remove from subscribers table
    // await db
    //   .delete(subscribers)
    //   .where(eq(subscribers.EMAIL, email));

    return NextResponse.json(
      { message: 'Successfully unsubscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}