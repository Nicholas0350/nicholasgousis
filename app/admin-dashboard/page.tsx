'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { WebhookManagement } from './components/webhook-management'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { useQuery } from '@tanstack/react-query'
import { columns } from './columns'
import ContentAnalytics from './components/content-analytics'
import LicenseeImpact from './components/licensee-impact'
import ArticleDrafts from './components/article-drafts'
import { User } from '@supabase/supabase-js'

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: mediaReleases, isLoading: mediaLoading } = useQuery({
    queryKey: ['mediaReleases'],
    queryFn: async () => {
      const res = await fetch('/api/media-releases')
      return res.json()
    },
  })

  const { data: regulatoryReleases, isLoading: regulatoryLoading } = useQuery({
    queryKey: ['regulatoryReleases'],
    queryFn: async () => {
      const res = await fetch('/api/regulatory-releases')
      return res.json()
    },
  })

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          console.error('Not authenticated:', error)
          window.location.href = '/login'
          return
        }

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (adminError || !adminData?.is_admin) {
          console.error('Not authorized:', adminError)
          window.location.href = '/dashboard'
          return
        }

        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [supabase.auth])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="webhooks">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="mt-6">
          <WebhookManagement />
        </TabsContent>

        <TabsContent value="users">
          {/* User management component will go here */}
        </TabsContent>

        <TabsContent value="settings">
          {/* Settings component will go here */}
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="licensees">Licensee Impact</TabsTrigger>
          <TabsTrigger value="drafts">Article Drafts</TabsTrigger>
        </TabsList>

        {/* New Entrants */}
        <TabsContent value="content">
          <div className="grid gap-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">New Entrants</h2>
              {!mediaLoading && <DataTable columns={columns.mediaReleases} data={mediaReleases || []} />}
            </Card>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Regulatory Releases</h2>
              {!regulatoryLoading && <DataTable columns={columns.regulatoryReleases} data={regulatoryReleases || []} />}
            </Card>
          </div>
        </TabsContent>

        {/* Regulatory Releases */}
        <TabsContent value="content">
          <div className="grid gap-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Media Releases</h2>
              {!mediaLoading && <DataTable columns={columns.mediaReleases} data={mediaReleases || []} />}
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Regulatory Releases</h2>
              {!regulatoryLoading && <DataTable columns={columns.regulatoryReleases} data={regulatoryReleases || []} />}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <ContentAnalytics />
        </TabsContent>

        {/* Media Releases */}
        <TabsContent value="licensees">
          <LicenseeImpact />
        </TabsContent>

        {/* Regulatory Releases */}
        <TabsContent value="drafts">
          <ArticleDrafts />
        </TabsContent>
      </Tabs>
    </div>
  )
}
