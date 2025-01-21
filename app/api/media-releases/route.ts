import { NextResponse } from 'next/server'

// Mock data for now - replace with actual database query
const mockMediaReleases = [
  {
    id: '1',
    title: 'New Financial Product Launch',
    source: 'Financial Times',
    publishedAt: '2024-01-20',
    status: 'published'
  },
  {
    id: '2',
    title: 'Market Analysis Report Q4 2023',
    source: 'Bloomberg',
    publishedAt: '2024-01-18',
    status: 'pending'
  },
]

export async function GET() {
  return NextResponse.json(mockMediaReleases)
}