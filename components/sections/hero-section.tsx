'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-tgv-dark-darker">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.1]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-tgv-dark-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your AI-Enhanced MVP Financial Solutions
        </motion.h1>
        <motion.h2
          className="text-2xl md:text-3xl mb-8 text-tgv-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Fast. Compliant. Affordable
        </motion.h2>
        <motion.p
          className="text-xl mb-12 max-w-2xl mx-auto text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Leverage floor trading secrets and cutting-edge AI to revolutionize your financial strategies.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-tgv-primary hover:bg-tgv-hover text-white border-none transition-colors"
          >
            <a href="#contact">
              Get Started <ArrowRight className="ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}