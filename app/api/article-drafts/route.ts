import { NextResponse } from 'next/server'

// Mock data for now - replace with actual database query
const mockArticleDrafts = [
  {
    id: '1',
    title: 'Impact Analysis: New Financial Regulations',
    licensee: 'ABC Financial Services',
    status: 'draft',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Market Trends Q1 2024',
    licensee: 'XYZ Investments',
    status: 'review',
    createdAt: '2024-01-19'
  },
]

export async function GET() {
  return NextResponse.json(mockArticleDrafts)
}