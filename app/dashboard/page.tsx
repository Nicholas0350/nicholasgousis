'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/supabase'
import { Button } from "@/components/ui/button"
import { Bot, Shield } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBot, setIsBot] = useState(false)

  useEffect(() => {
    // Bot detection
    const detectBot = () => {
      const botPattern = /bot|crawler|spider|crawling/i
      return botPattern.test(navigator.userAgent)
    }
    setIsBot(detectBot())

    async function fetchUser() {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .single()

        if (error) throw error
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (isBot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Bot traffic is not allowed.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Home
          </Button>
        </div>

        {/* User Information */}
        {user && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Status:</span> {user.subscription_status}</p>
              <p><span className="font-medium">Subscription Until:</span> {new Date(user.subscription_end_date).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}