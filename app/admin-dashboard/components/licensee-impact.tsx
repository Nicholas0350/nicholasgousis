'use client'

import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { useQuery } from '@tanstack/react-query'

interface LicenseeImpactData {
  id: string
  licensee: string
  articleCount: number
  impactScore: number
  lastUpdated: string
}

const columns = [
  {
    accessorKey: 'licensee',
    header: 'Licensee',
  },
  {
    accessorKey: 'articleCount',
    header: 'Articles',
  },
  {
    accessorKey: 'impactScore',
    header: 'Impact Score',
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Last Updated',
  },
]

export function LicenseeImpact() {
  const { data: licenseeData } = useQuery({
    queryKey: ['licenseeImpact'],
    queryFn: async () => {
      const res = await fetch('/api/licensee-impact')
      return res.json()
    }
  })

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Licensee Impact Analysis</h2>
      <DataTable
        columns={columns}
        data={licenseeData || []}
      />
    </Card>
  )
}