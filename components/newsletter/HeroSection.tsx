"use client"
import { Badge } from "@/components/ui/badge"
import NewsletterSignup from './newsletterForm';

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="outline" className="rounded-full">
              Trusted by 1,000+ AFSL & ACL Holders
            </Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Master ASIC Compliance & Grow Your Financial Services Business
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Weekly expert insights on ASIC regulations, risk management, and growth strategies for AFSL & ACL holders. Stay compliant, mitigate risks, and boost your bottom line.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </section>
  )
}