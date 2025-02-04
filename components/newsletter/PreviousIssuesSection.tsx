'use client'
import { useState } from 'react'
import { ArticleModal } from '@/components/ArticleModal'
// import NewsletterSignup from './newsletterForm';
import { articles } from '@/data/newsletter/articles'
import { spaceGrotesk } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Newspaper } from 'lucide-react'



export function PreviousIssuesSection() {
  const [selectedArticle, setSelectedArticle] = useState<{
    number: number
    title: string
    preview: string
    date: string
  } | null>(null)

  return (
    <section className="w-full py-24 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className={cn(spaceGrotesk.className, "text-8xl font-bold tracking-tight mb-4 text-gray-900 dark:text-gray-100")}>
            PREVIOUS ISSUES OF ASIC COMPLIANCE INSIDER
          </h2>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950" />
          <BentoGrid>
            {articles.map((article, index) => (
              <BentoCard
                key={article.number}
                name={article.title}
                description={`Issue #${article.number} - ${article.date}\n\n${article.preview}`}
                className={cn(
                  index === 0 ? "md:col-span-2 md:row-span-2" : "",
                  "col-span-1 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
                Icon={Newspaper}
                onClick={() => setSelectedArticle(article)}
                cta="Read Article"
                background={null}
              />
            ))}
          </BentoGrid>
        </div>
      </div>

      <ArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
    </section>
  )
}
