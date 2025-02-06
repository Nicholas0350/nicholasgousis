"use client"
import { Badge } from "@/components/ui/badge"
import NewsletterSignup from '@/components/forms/newsletterForm';
import { motion } from 'framer-motion'

interface HeroSectionProps {
  onSubscribe: (email: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function HeroSection({ onSubscribe, isLoading, error }: HeroSectionProps) {
  return (
    <section className=" p-12 relative flex flex-col items-center justify-center bg-[#1a1a1a]">
      {/* Background with grid pattern and animated gradient overlay */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.18] [background-size:20px_20px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/90 via-transparent to-[#1a1a1a]/120" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-transparent to-[#1a1a1a]/120" />
        <div className="absolute inset-0 opacity-35 bg-gradient-to-r from-tgv-primary/10 via-transparent to-tgv-primary/10 animate-pulse" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <Badge variant="outline" className="rounded-full font-heading text-lg tracking-[-0.08em] text-white/80 border-white/20">
            Trusted by 1,000+ AFSL & ACL Holders
          </Badge>

          <motion.h1
            className="font-heading text-[4rem] md:text-[6rem] font-extrabold leading-[0.82] tracking-[-0.08em] text-[#7b93e8] max-w-[18ch] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Master ASIC Compliance & Grow Your Business
          </motion.h1>

          <motion.p
            className="font-heading text-[1.25rem] md:text-[1.75rem] font-medium leading-[1.2] tracking-[-0.08em] max-w-2xl mx-auto text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Weekly expert insights on ASIC regulations, risk management, and growth strategies. Stay compliant, mitigate risks, and boost your bottom line.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-sm mx-auto"
          >
            <NewsletterSignup onSubmit={onSubscribe} isLoading={isLoading} error={error} />
            <div className="flex pt-12 justify-center">
              <p className="text-white/50 text-lg">
                Checkout our sample below
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}