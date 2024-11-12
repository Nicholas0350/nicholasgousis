'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.loops.so/js/form.js'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    const form = e.currentTarget
    const email = new FormData(form).get('email')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage('Thanks for subscribing!')
        form.reset()
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="loops-form space-y-4 p-6 bg-white rounded-lg shadow-md"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
          {message && (
            <p className={`text-sm text-center ${message.includes('wrong') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}