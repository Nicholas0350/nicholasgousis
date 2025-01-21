'use client'

import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface LicenseStatus {
  name: string
  value: number
}

interface AnalyticsData {
  distribution: Array<{
    type: string
    count: number
  }>
  licenseStatus: LicenseStatus[]
  registrationTrends: Array<{
    month: string
    AFS: number
    CRED: number
  }>
  metrics: {
    totalLicensees: number
    activeApplications: number
    complianceRate: number
    monthlyGrowth: number
    weeklyGrowth: number
    quarterlyGrowth: number
  }
}

export default function ContentAnalytics() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ['contentAnalytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/content')
      return res.json()
    }
  })

  if (!analytics) return null

  return (
    <div className="grid gap-6">
      {/* License Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">License Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.licenseStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.licenseStatus.map((entry: LicenseStatus, index: number) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Registration Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Registration Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.registrationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="AFS" stroke="#8884d8" name="AFS Licenses" />
                <Line type="monotone" dataKey="CRED" stroke="#82ca9d" name="Credit Licenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Content Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">License Type Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Licensees</h3>
          <p className="text-3xl font-bold mt-2">{analytics.metrics.totalLicensees.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">+{analytics.metrics.monthlyGrowth}% from last month</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Active Applications</h3>
          <p className="text-3xl font-bold mt-2">{analytics.metrics.activeApplications}</p>
          <p className="text-sm text-muted-foreground">+{analytics.metrics.weeklyGrowth}% from last week</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Compliance Rate</h3>
          <p className="text-3xl font-bold mt-2">{analytics.metrics.complianceRate}%</p>
          <p className="text-sm text-muted-foreground">+{analytics.metrics.quarterlyGrowth}% from last quarter</p>
        </Card>
      </div>
    </div>
  )
}