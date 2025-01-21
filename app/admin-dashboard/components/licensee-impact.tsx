'use client'

import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

interface LicenseeImpactData {
  id: string
  licensee: string
  articleCount: number
  impactScore: number
  lastUpdated: string
}

const columns: ColumnDef<LicenseeImpactData>[] = [
  {
    accessorKey: 'licensee',
    header: 'Licensee',
  },
  {
    accessorKey: 'articleCount',
    header: 'Articles',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue('articleCount')}
      </Badge>
    ),
  },
  {
    accessorKey: 'impactScore',
    header: 'Impact Score',
    cell: ({ row }) => {
      const score = row.getValue('impactScore') as number
      return (
        <Badge variant={score > 80 ? "default" : score > 60 ? "secondary" : "outline"}>
          {score}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = new Date(row.getValue('lastUpdated'))
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
  },
]

export default function LicenseeImpact() {
  const { data: licenseeData, isLoading } = useQuery({
    queryKey: ['licenseeImpact'],
    queryFn: async () => {
      const res = await fetch('/api/licensee-impact')
      return res.json()
    }
  })

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Licensee Impact Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track impact scores and article distribution across licensees
          </p>
        </div>
      </div>
      {!isLoading && (
        <DataTable
          columns={columns}
          data={licenseeData || []}
        />
      )}
    </Card>
  )
}