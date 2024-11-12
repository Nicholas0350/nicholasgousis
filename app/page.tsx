'use client'

import { useState } from 'react'
import { Header } from '@/components/sections/header'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { BenefitsSection } from '@/components/sections/benefits-section'
import { FAQSection } from '@/components/sections/faq-section'
import { CTASection } from '@/components/sections/cta-section'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import StripePaymentForm from '@/components/stripe-payment-form'
import { Footer } from '@/components/sections/footer'
import { Button } from "@/components/ui/button"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE!)

export default function Page() {
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header onPaymentClick={() => setShowPaymentForm(true)} />
      <main className="flex-1">
        <HeroSection onPaymentClick={() => setShowPaymentForm(true)} />
        <FeaturesSection />
        <BenefitsSection />
        <FAQSection />
        <CTASection onPaymentClick={() => setShowPaymentForm(true)} />
      </main>
      <Footer />

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <Elements stripe={stripePromise}>
              <StripePaymentForm />
            </Elements>
            <Button variant="ghost" className="mt-4" onClick={() => setShowPaymentForm(false)}>
              Κλείσιμο
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}