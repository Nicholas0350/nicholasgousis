'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Your AI-Enhanced Financial Solutions
      </motion.h1>
      <motion.h2
        className="text-2xl md:text-3xl mb-8 text-blue-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Fast. Compliant. Innovative.
      </motion.h2>
      <motion.p
        className="text-xl mb-12 max-w-2xl mx-auto"
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
        <Button asChild size="lg">
          <a href="#contact">
            Get Started <ArrowRight className="ml-2" />
          </a>
        </Button>
      </motion.div>
    </section>
  )
}