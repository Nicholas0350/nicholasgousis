'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/supabase'
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkSubscriber() {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('subscription_status', 'active')
          .single()

        if (error || !userData) {
          console.error('Not a subscriber:', error)
          router.push('/newsletter') // Redirect non-subscribers to newsletter page
          return
        }

        setUser(userData)
      } catch (error) {
        console.error('Error checking subscriber:', error)
        router.push('/newsletter')
      } finally {
        setLoading(false)
      }
    }

    checkSubscriber()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  // Only show dashboard content to verified subscribers
  return user ? (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold">Newsletter Dashboard</h1>
          </div>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Home
          </Button>
        </div>

        {/* Subscriber Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Status:</span> {user.subscription_status}</p>
            <p><span className="font-medium">Renewal Date:</span> {new Date(user.subscription_end_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null // Return null if not a subscriber (will redirect)
}
