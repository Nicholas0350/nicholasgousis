import { ColumnDef } from '@tanstack/react-table'

interface MediaRelease {
  id: string
  title: string
  source: string
  publishedAt: string
  status: 'pending' | 'processed' | 'published'
}

interface RegulatoryRelease {
  id: string
  title: string
  type: string
  releaseDate: string
  impact: 'high' | 'medium' | 'low'
}

export const columns = {
  mediaReleases: [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'source',
      header: 'Source',
    },
    {
      accessorKey: 'publishedAt',
      header: 'Published Date',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ] as ColumnDef<MediaRelease>[],

  regulatoryReleases: [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'releaseDate',
      header: 'Release Date',
    },
    {
      accessorKey: 'impact',
      header: 'Impact Level',
    },
  ] as ColumnDef<RegulatoryRelease>[],
}