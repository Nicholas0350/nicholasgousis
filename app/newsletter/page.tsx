'use client'
import { useState } from 'react'
import { HeroSection } from '@/components/newsletter/HeroSection'
import { PreviousIssuesSection } from '@/components/newsletter/PreviousIssuesSection'
import { RecentInsightsSection } from '@/components/newsletter/RecentInsightsSection'
import { TestimonialsSection } from '@/components/newsletter/TestimonialsSection'
import { FinalCtaSection } from '@/components/newsletter/FinalCtaSection'
import { NewsletterFooter } from '@/components/newsletter/NewsletterFooter'

export default function NewsletterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (email: string) => {
    setIsLoading(true);
    setError(null);

    if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID) {
      setError('Subscription service is not properly configured');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start subscription');
      }

      if (!data.url) {
        throw new Error('Invalid checkout URL received');
      }

      window.location.href = data.url;
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <HeroSection onSubscribe={handleSubscribe} isLoading={isLoading} error={error} />
      <PreviousIssuesSection />
      <RecentInsightsSection />
      <TestimonialsSection />
      <FinalCtaSection />
      <NewsletterFooter />
    </main>
  )
}
