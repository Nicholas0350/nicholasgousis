// import { softDeleteUser } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Temporarily disabled for production
    // const { userId } = await request.json();
    // await softDeleteUser(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error soft-deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate account' },
      { status: 500 }
    );
  }
}