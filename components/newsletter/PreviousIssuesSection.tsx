"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ChevronRight } from 'lucide-react'
import { ArticleModal } from "@/components/ArticleModal"
// import NewsletterSignup from './newsletterForm';
import { articles } from "@/data/newsletter/articles"
import { spaceGrotesk } from "@/lib/fonts"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {MorphingDialog, MorphingDialogTrigger, MorphingDialogContainer, MorphingDialogContent} from "@/components/ui/morphing-dialog"

interface TilesProps {
  className?: string
  rows?: number
  cols?: number
  tileClassName?: string
  tileSize?: "sm" | "md" | "lg"
}

const tileSizes = {
  sm: "w-8 h-8",
  md: "w-9 h-9 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-16 md:h-16",
}

function Tiles({
  className,
  rows = 100,
  cols = 10,
  tileClassName,
  tileSize = "md",
}: TilesProps) {
  const rowsArray = new Array(rows).fill(1)
  const colsArray = new Array(cols).fill(1)

  return (
    <div
      className={cn(
        "relative z-0 flex w-full h-full justify-center",
        className
      )}
    >
      {rowsArray.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className={cn(
            tileSizes[tileSize],
            "border-l dark:border-neutral-900 border-neutral-200 relative",
            tileClassName
          )}
        >
          {colsArray.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `var(--tile)`,
                transition: { duration: 0 }
              }}
              animate={{
                transition: { duration: 2 }
              }}
              key={`col-${j}`}
              className={cn(
                tileSizes[tileSize],
                "border-r border-t dark:border-neutral-900 border-neutral-200 relative",
                tileClassName
              )}
            />
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export function PreviousIssuesSection() {
  const [selectedArticle, setSelectedArticle] = useState<{
    number: number;
    title: string;
    date: string;
  } | null>(null);

  return (
    <>
      <section className="pt-12 w-full flex items-center justify-center py-12 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <Tiles
            className="absolute inset-0 opacity-30 dark:opacity-20"
            rows={50}
            cols={50}
            tileSize="sm"
          />
        </div>
        <div className="container relative px-4 md:px-6">
          <h2 className={`${spaceGrotesk.className} text-6xl font-extrabold mb-16 text-center mx-auto max-w-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400`}>
            PREVIOUS ISSUES OF ASIC COMPLIANCE INSIDER
          </h2>
          <MorphingDialog>
            <MorphingDialogTrigger>
              <div>Click to open</div>
            </MorphingDialogTrigger>
            <MorphingDialogContainer>
              <MorphingDialogContent>
                <div>Dialog content here</div>
              </MorphingDialogContent>
            </MorphingDialogContainer>
          </MorphingDialog>
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
                    {/* <NewsletterSignup /> */}
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