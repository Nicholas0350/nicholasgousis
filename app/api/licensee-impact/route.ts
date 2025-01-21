import { NextResponse } from 'next/server'

// Mock data for now - replace with actual database query
const mockLicenseeData = [
  {
    id: '1',
    licensee: 'ABC Financial Services',
    articleCount: 12,
    impactScore: 85,
    lastUpdated: '2024-01-20'
  },
  {
    id: '2',
    licensee: 'XYZ Investments',
    articleCount: 8,
    impactScore: 72,
    lastUpdated: '2024-01-19'
  },
]

export async function GET() {
  return NextResponse.json(mockLicenseeData)
}