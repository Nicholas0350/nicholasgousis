'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function verifySession() {
      try {
        const sessionId = searchParams.get('session_id')
        if (!sessionId) {
          setStatus('error')
          setMessage('No session ID found')
          return
        }

        // Verify the session with your API
        const response = await fetch('/api/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify session')
        }

        setStatus('success')

        // Redirect to dashboard after 3 seconds
        const timeout = setTimeout(() => {
          router.push('/dashboard')
        }, 3000)

        return () => clearTimeout(timeout)
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Failed to verify payment')
      }
    }

    void verifySession()
  }, [router, searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900">Επαλήθευση πληρωμής...</h1>
          <p className="text-gray-600">Παρακαλώ περιμένετε</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 p-8">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Σφάλμα!</h1>
          <p className="text-gray-600">{message || 'Κάτι πήγε στραβά'}</p>
          <button
            onClick={() => router.push('/newsletter')}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Επιστροφή
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">Πληρωμή Επιτυχής!</h1>
        <p className="text-gray-600">Σας ευχαριστούμε για την εγγραφή σας.</p>
        <p className="text-sm text-gray-500">Ανακατεύθυνση στον πίνακα ελέγχου...</p>
      </div>
    </div>
  )
}