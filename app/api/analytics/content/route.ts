import { NextResponse } from 'next/server'

// Mock data for now - replace with actual analytics data
const mockAnalytics = {
  distribution: [
    { type: 'AFS Licenses', count: 145 },
    { type: 'Credit Licenses', count: 92 },
    { type: 'Financial Advisers', count: 78 },
    { type: 'Representatives', count: 215 },
  ],
  licenseStatus: [
    { name: 'Active', value: 450 },
    { name: 'Pending', value: 125 },
    { name: 'Expired', value: 75 },
    { name: 'Suspended', value: 25 }
  ],
  registrationTrends: [
    { month: 'Jan', AFS: 165, CRED: 145 },
    { month: 'Feb', AFS: 175, CRED: 155 },
    { month: 'Mar', AFS: 185, CRED: 165 },
    { month: 'Apr', AFS: 195, CRED: 175 },
    { month: 'May', AFS: 205, CRED: 185 }
  ],
  metrics: {
    totalLicensees: 2547,
    activeApplications: 183,
    complianceRate: 94.2,
    monthlyGrowth: 12,
    weeklyGrowth: 5,
    quarterlyGrowth: 2.1
  }
}

export async function GET() {
  return NextResponse.json(mockAnalytics)
}