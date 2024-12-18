"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ChevronRight } from 'lucide-react'
import { ArticleModal } from "@/components/ArticleModal"
import NewsletterSignup from './newsletterForm';

const articles = [
  {
    number: 52,
    title: "ASIC's New Enforcement Strategy: What It Means for Your AFSL",
    date: "December 1, 2024"
  },
  {
    number: 51,
    title: "Mastering AFSL Compliance: A Complete Risk Management Framework",
    date: "November 24, 2024"
  },
  // Add more articles as needed...
]

export function PreviousIssuesSection() {
  const [selectedArticle, setSelectedArticle] = useState<{
    number: number;
    title: string;
    date: string;
  } | null>(null);

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 border-y border-gray-200 dark:border-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-5xl font-black mb-16 text-center mx-auto max-w-5xl whitespace-nowrap tracking-tighter">
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
                      <span className="text-lg font-bold text-gray-500">#{article.number}</span>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {article.title}
                        </h3>
                        <p className="text-base font-medium text-gray-500">{article.date}</p>
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
                    <h3 className="text-2xl font-bold">Subscribe to the Newsletter</h3>
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