'use client'

import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ContentAnalytics() {
  const { data: analytics } = useQuery({
    queryKey: ['contentAnalytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/content')
      return res.json()
    }
  })

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Content Performance</h2>
      <div className="grid gap-6">
        <div className="h-[400px]">
          <h3 className="text-lg font-medium mb-4">Content Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.distribution || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}