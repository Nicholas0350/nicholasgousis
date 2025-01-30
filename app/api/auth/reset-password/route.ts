import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    console.log('Attempting password reset for:', email)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Use standard password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
    })

    if (error) {
      console.error('Reset password error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      )
    }

    // Send a notification email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Nicholas Gousis <newsletter@nicholasgousis.com>',
      to: [email],
      subject: 'Password Reset Instructions - Nicholas Gousis',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Password Reset Instructions</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
              <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-bottom: 24px;">Password Reset Instructions</h1>
              <p style="color: #4B5563; margin-bottom: 24px;">We've sent you a password reset link to your email. Please check your inbox and follow the instructions to reset your password.</p>
              <p style="color: #6B7280; font-size: 14px; margin-top: 32px;">
                If you didn't request this password reset, you can safely ignore this email.
                <br><br>
                Best regards,<br>
                Nicholas Gousis
              </p>
            </div>
          </body>
        </html>
      `,
      text: `Password Reset Instructions\n\nWe've sent you a password reset link to your email. Please check your inbox and follow the instructions to reset your password.\n\nIf you didn't request this password reset, you can safely ignore this email.\n\nBest regards,\nNicholas Gousis`,
      headers: {
        'List-Unsubscribe': `<mailto:unsubscribe@nicholasgousis.com>`,
        'Feedback-ID': 'password-reset:nicholasgousis'
      }
    })

    if (emailError) {
      console.error('Email sending error:', emailError)
      // Don't return error since Supabase already sent the reset email
      console.warn('Failed to send notification email via Resend')
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to process reset password request' },
      { status: 500 }
    )
  }
}