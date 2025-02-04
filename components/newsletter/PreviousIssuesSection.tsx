'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Search, Globe, Save, Bell } from 'lucide-react'
import { ArticleModal } from '@/components/ArticleModal'
// import NewsletterSignup from './newsletterForm';
import { articles } from '@/data/newsletter/articles'
import { spaceGrotesk } from '@/lib/fonts'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@radix-ui/react-icons'

interface TilesProps {
  className?: string
  rows?: number
  cols?: number
  tileClassName?: string
  tileSize?: 'sm' | 'md' | 'lg'
}

const tileSizes = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9 md:w-12 md:h-12',
  lg: 'w-12 h-12 md:w-16 md:h-16',
}

function Tiles({ className, rows = 100, cols = 10, tileClassName, tileSize = 'md' }: TilesProps) {
  const rowsArray = new Array(rows).fill(1)
  const colsArray = new Array(cols).fill(1)

  return (
    <div className={cn('relative z-0 flex w-full h-full justify-center', className)}>
      {rowsArray.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className={cn(
            tileSizes[tileSize],
            'border-l dark:border-neutral-900 border-neutral-200 relative',
            tileClassName
          )}
        >
          {colsArray.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `var(--tile)`,
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col-${j}`}
              className={cn(
                tileSizes[tileSize],
                'border-r border-t dark:border-neutral-900 border-neutral-200 relative',
                tileClassName
              )}
            />
          ))}
        </motion.div>
      ))}
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  className?: string
}

const FeatureCard = ({ icon: Icon, title, description, className }: FeatureCardProps) => (
  <Card className={cn('border-none shadow-none bg-white dark:bg-transparent', className)}>
    <CardContent className="p-6">
      <div className="mb-4">
        <Icon className="h-12 w-12 text-neutral-600 dark:text-neutral-400" />
      </div>
      <h3 className={cn(spaceGrotesk.className, 'text-xl font-semibold mb-2')}>{title}</h3>
      <p className="text-neutral-500 dark:text-neutral-400">{description}</p>
    </CardContent>
  </Card>
)

const features = [
  {
    icon: Search,
    title: 'Full text search',
    description: 'Search through all your files in one place.',
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Supports 100+ languages and counting.',
  },
  {
    icon: Save,
    title: 'Save your files',
    description: 'We automatically save your files as you type.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Get notified when someone shares a file or mentions you in a comment.',
  },
]

export function PreviousIssuesSection() {
  const [selectedArticle, setSelectedArticle] = useState<{
    number: number
    title: string
    date: string
  } | null>(null)

  return (
    <>

      <section className="pt-12 w-full flex items-center justify-center py-12 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <Tiles className="absolute inset-0 opacity-30 dark:opacity-20" rows={50} cols={50} tileSize="sm" />
        </div>
        <div className="container relative px-4 md:px-6">
          <h2
            className={`${spaceGrotesk.className} text-6xl font-extrabold mb-16 text-center mx-auto max-w-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400`}
          >
            PREVIOUS ISSUES OF ASIC COMPLIANCE INSIDER
          </h2>
          <div className="grid w-full auto-rows-[22rem] grid-cols-3 gap-4">
            {articles.map((article, index) => (
              <Card
                key={article.number}
                className={cn(
                  index === 0 ? 'md:col-span-2' : '',
                  index === 1 ? 'md:col-span-1' : '',
                  index === 2 ? 'md:col-span-1' : '',
                  index === 3 ? 'md:col-span-2' : '',
                  'col-span-3'
                )}
              >
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <div className="space-y-6">
                    <h3 className={`${spaceGrotesk.className} text-2xl font-bold`}>{article.title}</h3>
                    <p className="text-neutral-400">{`Issue #${article.number} - ${article.date}`}</p>
                  </div>
                  <div className="mt-8">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="pointer-events-auto"
                      onClick={() => setSelectedArticle(article)}
                    >
                      Read Article
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <ArticleModal isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} article={selectedArticle} />
    </>
  )
}
