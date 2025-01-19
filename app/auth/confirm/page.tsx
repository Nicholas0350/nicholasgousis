'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setError('No verification token found')
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to verify email')
        }

        setStatus('success')
        // Redirect to dashboard after 3 seconds
        setTimeout(() => router.push('/dashboard'), 3000)
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Failed to verify email')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {status === 'verifying' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Verifying your email</h1>
            <p>Please wait while we confirm your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-green-600">Email Verified!</h1>
            <p>Your email has been successfully verified.</p>
            <p className="mt-2">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h1>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}