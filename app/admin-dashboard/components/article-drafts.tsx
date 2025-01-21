'use client'

import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Edit, Eye } from 'lucide-react'

interface ArticleDraft {
  id: string
  title: string
  licensee: string
  status: 'draft' | 'review' | 'approved'
  createdAt: string
}

const columns: ColumnDef<ArticleDraft>[] = [
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
    cell: ({ row }) => {
      const status = row.getValue('status') as ArticleDraft['status']
      return (
        <Badge
          variant={
            status === 'approved'
              ? 'default'
              : status === 'review'
              ? 'secondary'
              : 'outline'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
      </div>
    ),
  },
]

export default function ArticleDrafts() {
  const { data: drafts, isLoading } = useQuery({
    queryKey: ['articleDrafts'],
    queryFn: async () => {
      const res = await fetch('/api/article-drafts')
      return res.json()
    }
  })

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Article Drafts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and review article drafts for licensees
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Generate New Draft
        </Button>
      </div>
      {!isLoading && (
        <DataTable
          columns={columns}
          data={drafts || []}
        />
      )}
    </Card>
  )
}