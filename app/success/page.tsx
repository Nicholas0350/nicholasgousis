'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timeout = setTimeout(() => {
      router.push('/dashboard')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">Πληρωμή Επιτυχής!</h1>
        <p className="text-gray-600">Σας ευχαριστούμε για την εγγραφή σας στο ChatPRD.</p>
        <p className="text-sm text-gray-500">Ανακατεύθυνση στον πίνακα ελέγχου...</p>
      </div>
    </div>
  )
}