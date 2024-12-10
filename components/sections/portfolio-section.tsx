'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Tab = {
  title: string
  value: string
  content: {
    title: string
    description: string
    image: string
  }[]
}

const portfolioTabs: Tab[] = [
  {
    title: "Web Apps",
    value: "web-apps",
    content: [
      {
        title: "IgnytLabs",
        description: "MVP development agency website",
        image: "/placeholder.svg?height=200&width=300"
      },
      {
        title: "Think.ai",
        description: "AI-powered study assistant",
        image: "/placeholder.svg?height=200&width=300"
      },
    ]
  },
  {
    title: "AI Projects",
    value: "ai-projects",
    content: [
      {
        title: "QuizMaster",
        description: "AI-generated quiz platform",
        image: "/placeholder.svg?height=200&width=300"
      },
      {
        title: "FinTech Dashboard",
        description: "Financial analytics platform",
        image: "/placeholder.svg?height=200&width=300"
      },
    ]
  }
]

export function PortfolioSection() {
  const [active, setActive] = useState<Tab>(portfolioTabs[0])
  const [tabs] = useState<Tab[]>(portfolioTabs)
  const [hovering, setHovering] = useState(false)

  return (
    <section id="portfolio" className="min-h-screen flex items-center justify-center bg-tradingview-dark-bg">
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-tradingview-dark-text">Portfolio</h2>
        <p className="text-xl mb-12 text-center max-w-2xl mx-auto text-tradingview-secondary">
          A glimpse into the websites and applications I have built. Each project showcases my commitment to fast, affordable, and innovative solutions.
        </p>

        {/* Tabs Navigation */}
        <div className="flex flex-row items-center justify-center [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActive(tab)}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className={cn(
                "relative px-4 py-2 rounded-full",
                "text-sm font-medium transition-colors",
                "text-tradingview-secondary hover:text-tradingview-primary"
              )}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {active.value === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className="absolute inset-0 bg-tradingview-dark-darker/50 rounded-full border border-tradingview-dark-border"
                />
              )}
              <span className="relative block">
                {tab.title}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            {tabs.map((tab, idx) => (
              <motion.div
                key={tab.value}
                layoutId={tab.value}
                style={{
                  scale: 1 - idx * 0.1,
                  top: hovering ? idx * -50 : 0,
                  zIndex: active.value === tab.value ? 1 : -idx,
                  opacity: active.value === tab.value ? 1 : 0,
                  pointerEvents: active.value === tab.value ? "auto" : "none",
                }}
                animate={{
                  scale: active.value === tab.value ? 1 : 0.9,
                  y: active.value === tab.value ? 0 : 40,
                }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="absolute w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tab.content.map((item, index) => (
                    <Card key={index} className="group hover:scale-105 transition-transform duration-200 bg-tradingview-dark-darker border-tradingview-dark-border hover:border-tradingview-primary/50">
                      <CardHeader>
                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-t-lg" />
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-tradingview-dark-text">{item.title}</CardTitle>
                        <CardDescription className="text-tradingview-secondary">{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}