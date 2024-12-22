'use client'
import { HeroSection } from '@/components/newsletter/HeroSection'
import { PreviousIssuesSection } from '@/components/newsletter/PreviousIssuesSection'
import { RecentInsightsSection } from '@/components/newsletter/RecentInsightsSection'
import { TestimonialsSection } from '@/components/newsletter/TestimonialsSection'
import { FinalCtaSection } from '@/components/newsletter/FinalCtaSection'
import { NewsletterFooter } from '@/components/newsletter/NewsletterFooter'

export default function NewsletterPage() {
  return (
    <main className="">
        <HeroSection />
        <PreviousIssuesSection />
        <RecentInsightsSection />
        <TestimonialsSection />
        <FinalCtaSection />
        <NewsletterFooter />
    </main>
  )
}
