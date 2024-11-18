'use client'

import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ServicesSection } from '@/components/sections/services-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Nicholas Gousis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}