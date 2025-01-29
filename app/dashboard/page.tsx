'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'
// import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkSubscriber() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          console.error('Not authenticated:', error)
          router.push('/newsletter')
          return
        }

        // Check if user has active subscription in metadata
        const subscriptionStatus = user.user_metadata?.subscription_status
        if (typeof subscriptionStatus !== 'string' || subscriptionStatus !== 'active') {
          console.error('Not a subscriber')
          router.push('/newsletter')
          return
        }

        setUser(user)
      } catch (error) {
        console.error('Error checking subscriber:', error)
        router.push('/newsletter')
      } finally {
        setLoading(false)
      }
    }

    checkSubscriber()
  }, [router, supabase.auth])

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/user/soft-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deactivate account')
      }

      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate account')
    } finally {
      setIsDeleting(false)
    }
  }

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
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
        </div>

        {/* Subscriber Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Status:</span> {user.user_metadata.subscription_status}</p>
            <p><span className="font-medium">Tier:</span> {user.user_metadata.subscription_tier}</p>
            <p><span className="font-medium">Customer ID:</span> {user.user_metadata.stripe_customer_id}</p>
            <p><span className="font-medium">Last Updated:</span> {new Date(user.user_metadata.updated_at || user.user_metadata.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? 'Deactivating...' : 'Deactivate Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will deactivate your account and cancel your subscription. You can always create a new account later with the same or different email.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Deactivate Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {error && (
              <p className="mt-4 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null // Return null if not a subscriber (will redirect)
}
