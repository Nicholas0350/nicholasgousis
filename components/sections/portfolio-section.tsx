'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import portfolioTabs from "@/data/portfolio-tabs"
import Image from "next/image"
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})

export function PortfolioSection() {
  const [active, setActive] = useState(portfolioTabs[0])

  return (
    <section id="portfolio" className="relative w-full py-12 flex items-center justify-center overflow-hidden bg-tgv-dark">
      <div className="flex flex-col  px-14 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className={cn(
            "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-tgv-primary",
            spaceGrotesk.className
          )}>
            Portfolio
          </h2>
          <p className={cn(
            "mx-auto max-w-[700px] text-tgv-light/80 text-lg",
            spaceGrotesk.className
          )}>
            Explore my latest projects and experiments
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-row items-center justify-center [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full mb-12 mt-8">
          {portfolioTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActive(tab)}
              className={cn(
                "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                "hover:text-tgv-primary hover:scale-110",
                active.value === tab.value ? "text-tgv-primary scale-110" : "text-tgv-light/60",
                spaceGrotesk.className
              )}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {active.value === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-tgv-dark-lighter rounded-lg"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.title}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {active.content.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-tgv-dark-darker border-tgv-dark-border hover:border-tgv-primary/50 hover:shadow-lg hover:shadow-tgv-primary/20"
                  >
                    <CardHeader className="p-0">
                      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tgv-dark-darker to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <h3 className={cn(
                        "text-xl font-semibold text-tgv-primary mb-2 group-hover:text-tgv-primary/80 transition-colors duration-300",
                        spaceGrotesk.className
                      )}>
                        {item.title}
                      </h3>
                      <p className={cn(
                        "text-tgv-light/80 group-hover:text-tgv-light transition-colors duration-300",
                        spaceGrotesk.className
                      )}>
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}