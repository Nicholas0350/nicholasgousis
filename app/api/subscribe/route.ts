import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Log environment variables (redact sensitive parts)
  console.log('Environment check:', {
    hasFormId: !!process.env.NEXT_PUBLIC_LOOPS_FORM_ID,
    hasApiKey: !!process.env.LOOPS_API_KEY,
    formIdPreview: process.env.NEXT_PUBLIC_LOOPS_FORM_ID?.substring(0, 4)
  })

  if (!process.env.LOOPS_API_KEY) {
    console.error('Missing LOOPS_API_KEY environment variable')
    return NextResponse.json(
      { error: 'Server configuration error (API Key missing)' },
      { status: 500 }
    )
  }

  if (!process.env.NEXT_PUBLIC_LOOPS_FORM_ID) {
    console.error('Missing LOOPS_FORM_ID environment variable')
    return NextResponse.json(
      { error: 'Server configuration error (Form ID missing)' },
      { status: 500 }
    )
  }

  try {
    const { email } = await req.json()
    console.log('Received email:', email)

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const requestBody = {
      email,
      formId: process.env.NEXT_PUBLIC_LOOPS_FORM_ID,
      source: 'website_form'
    }
    console.log('Sending request to Loops:', requestBody)

    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.text()
    console.log('Loops API Response Status:', response.status)
    console.log('Loops API Response Body:', data)

    if (!response.ok) {
      throw new Error(`Loops API error: ${response.status} - ${data}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Full subscription error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to subscribe',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}