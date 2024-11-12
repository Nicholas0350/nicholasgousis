import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, payment_id, subscription_status } = await req.json();

    console.log('Creating user with:', { email, payment_id, subscription_status });

    // Validate required fields
    if (!email || !payment_id || !subscription_status) {
      throw new Error('Missing required fields');
    }

    // Insert user into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          payment_id,
          subscription_status,
          created_at: new Date().toISOString(),
          subscription_end_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days from now
          ).toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      throw error;
    }

    console.log('User created successfully:', data);

    return NextResponse.json({ user: data });
  } catch (error: unknown) {
    console.error('Error creating user:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(
        {
          error: 'Database error',
          details: (error as { message?: string, code?: string }).message,
          code: (error as { code?: string }).code
        },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to create user',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}