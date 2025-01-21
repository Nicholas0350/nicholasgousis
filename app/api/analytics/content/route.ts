import { NextResponse } from 'next/server'

// Mock data for now - replace with actual analytics data
const mockAnalytics = {
  distribution: [
    { type: 'Media Releases', count: 45 },
    { type: 'Regulatory Updates', count: 32 },
    { type: 'Market Analysis', count: 28 },
    { type: 'Industry News', count: 15 },
  ]
}

export async function GET() {
  return NextResponse.json(mockAnalytics)
}