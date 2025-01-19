'use client'
import { useState } from 'react'
import { HeroSection } from '@/components/newsletter/HeroSection'
import { PreviousIssuesSection } from '@/components/newsletter/PreviousIssuesSection'
import { RecentInsightsSection } from '@/components/newsletter/RecentInsightsSection'
import { TestimonialsSection } from '@/components/newsletter/TestimonialsSection'
import { FinalCtaSection } from '@/components/newsletter/FinalCtaSection'
import { NewsletterFooter } from '@/components/newsletter/NewsletterFooter'

// Stripe price ID for $77/month subscription
const STRIPE_PRICE_ID = 'price_1QiEAtLgfIcM0wHdTaKPs7PK';

// Test mode card numbers
const TEST_CARDS = {
  success: '4242 4242 4242 4242',
  auth: '4000 0025 0000 3155',
  decline: '4000 0000 0000 9995'
};

export default function NewsletterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTestInfo, setShowTestInfo] = useState(false);

  const handleSubscribe = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          priceId: STRIPE_PRICE_ID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start subscription');
      }

      if (!data.url) {
        throw new Error('Invalid checkout URL received');
      }

      // Show test info if in test mode
      setShowTestInfo(data.isTestMode);
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
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {error}
        </div>
      )}
      {showTestInfo && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-md shadow-lg z-50">
          <p className="font-bold mb-2">Test Mode Cards:</p>
          <ul className="space-y-1 text-sm">
            <li>Success: {TEST_CARDS.success}</li>
            <li>Auth Required: {TEST_CARDS.auth}</li>
            <li>Decline: {TEST_CARDS.decline}</li>
          </ul>
        </div>
      )}
      <HeroSection onSubscribe={handleSubscribe} isLoading={isLoading} />
      <PreviousIssuesSection />
      <RecentInsightsSection />
      <TestimonialsSection />
      <FinalCtaSection />
      <NewsletterFooter />
    </main>
  )
}
