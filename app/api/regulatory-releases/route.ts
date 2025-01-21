import { NextResponse } from 'next/server'

// Mock data for now - replace with actual database query
const mockRegulatoryReleases = [
  {
    id: '1',
    title: 'Updated Compliance Guidelines',
    type: 'Regulation',
    releaseDate: '2024-01-15',
    impact: 'high'
  },
  {
    id: '2',
    title: 'New Licensing Requirements',
    type: 'Policy',
    releaseDate: '2024-01-10',
    impact: 'medium'
  },
]

export async function GET() {
  return NextResponse.json(mockRegulatoryReleases)
}