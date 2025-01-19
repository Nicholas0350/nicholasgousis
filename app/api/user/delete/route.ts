import { NextResponse } from 'next/server';
import { deleteUser } from '@/lib/supabase-admin';

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400 }
      );
    }

    await deleteUser(userId);

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in delete user route:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to delete user',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}