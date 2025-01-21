'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { useQuery } from '@tanstack/react-query'
import { columns } from './columns'
import ContentAnalytics from './components/content-analytics'
import LicenseeImpact from './components/licensee-impact'
import ArticleDrafts from './components/article-drafts'

export default function AdminDashboardPage() {
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

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
