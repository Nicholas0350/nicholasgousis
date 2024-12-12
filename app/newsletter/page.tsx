"use client"
import { HeroSection } from "@/components/newsletter/HeroSection"
import { PreviousIssuesSection } from "@/components/newsletter/PreviousIssuesSection"
import { RecentInsightsSection } from "@/components/newsletter/RecentInsightsSection"
import { TestimonialsSection } from "@/components/newsletter/TestimonialsSection"
import { FinalCtaSection } from "@/components/newsletter/FinalCtaSection"
import { NewsletterFooter } from "@/components/newsletter/NewsletterFooter"

export default function NewsletterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <PreviousIssuesSection />
        <RecentInsightsSection />
        <TestimonialsSection />
        <FinalCtaSection />
      </main>
      <NewsletterFooter />
    </div>
  )
}
