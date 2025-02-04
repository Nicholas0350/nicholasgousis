'use client'

import { motion } from 'framer-motion'
import { StrategyCallButton } from '@/components/ui/strategy-call-button'

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-stone-50">
      {/* Background with grid pattern and animated gradient overlay */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-black/[0.18] [background-size:20px_20px]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-50/90 via-transparent to-stone-50/120" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50/90 via-transparent to-stone-50/120" />
        {/* Subtle animated glow effect */}
        <div className="absolute inset-0 opacity-35 bg-gradient-to-r from-tgv-primary/10 via-transparent to-tgv-primary/10 animate-pulse" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h1
          className="font-heading text-[5.5rem] md:text-[10rem] font-extrabold leading-[0.82] tracking-[-0.08em] mb-6 text-[#3b59ab] max-w-[15ch] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your AI-Enhanced MVP Financial Solutions
        </motion.h1>
        <motion.h2
          className="font-heading text-[2rem] md:text-[3.5rem] font-bold mb-8 leading-[0.82] tracking-[-0.08em] text-[#67686b] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Fast Compliant Affordable
        </motion.h2>
        <motion.p
          className="font-heading text-[1.25rem] md:text-[1.75rem] font-medium mb-12 leading-[1.2] tracking-[-0.08em] max-w-2xl mx-auto text-[#67686b]/90"
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
          className="flex justify-center"
        >
          {/* <StrategyCallButton onClick={() => window.location.href = '#contact'} /> */}
        </motion.div>
      </div>
    </section>
  )
}