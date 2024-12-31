"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ChevronRight } from 'lucide-react'
import { ArticleModal } from "@/components/ArticleModal"
import NewsletterSignup from './newsletterForm';
import { articles } from "@/data/newsletter/articles"
import { spaceGrotesk } from "@/lib/fonts"

export function PreviousIssuesSection() {
  const [selectedArticle, setSelectedArticle] = useState<{
    number: number;
    title: string;
    date: string;
  } | null>(null);

  return (
    <>
      <section className="min-h-screen w-full flex items-center justify-center py-12 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        </div>
        <div className="container relative px-4 md:px-6">
          <h2 className={`${spaceGrotesk.className} text-6xl font-extrabold mb-16 text-center mx-auto max-w-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400`}>
            PREVIOUS ISSUES OF ASIC COMPLIANCE INSIDER
          </h2>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {articles.map((article) => (
                  <button
                    key={article.number}
                    onClick={() => setSelectedArticle(article)}
                    className="w-full text-left group flex items-center justify-between py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <div className="flex items-start gap-6">
                      <span className={`${spaceGrotesk.className} text-lg font-bold text-gray-400`}>#{article.number}</span>
                      <div className="space-y-2">
                        <h3 className={`${spaceGrotesk.className} text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400`}>
                          {article.title}
                        </h3>
                        <p className="text-base text-gray-500 font-medium">{article.date}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 lg:border-l lg:pl-10 border-gray-200 dark:border-gray-800">
              <Card className="h-full border-2">
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <div className="space-y-6">
                    <h3 className={`${spaceGrotesk.className} text-2xl font-bold`}>Subscribe to the Newsletter</h3>
                    <ul className="space-y-4">
                      {[
                        "Weekly ASIC regulatory updates",
                        "Compliance strategies",
                        "Risk management frameworks",
                        "Expert analysis"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-lg font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <NewsletterSignup />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <ArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
    </>
  )
}