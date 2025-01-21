'use client'

import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'

interface ArticleDraft {
  id: string
  title: string
  licensee: string
  status: 'draft' | 'review' | 'approved'
  createdAt: string
}

const columns = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'licensee',
    header: 'Licensee',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button variant="outline" size="sm">
          Preview
        </Button>
      </div>
    ),
  },
]

export function ArticleDrafts() {
  const { data: drafts } = useQuery({
    queryKey: ['articleDrafts'],
    queryFn: async () => {
      const res = await fetch('/api/article-drafts')
      return res.json()
    }
  })

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Article Drafts</h2>
        <Button>Generate New Draft</Button>
      </div>
      <DataTable
        columns={columns}
        data={drafts || []}
      />
    </Card>
  )
}