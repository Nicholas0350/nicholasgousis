'use client'

// import { FloatingNav } from '@/components/ui/floating-navbar'
// import { AboutSection } from '@/components/sections/about-section'
// import { ServicesSection } from '@/components/sections/services-section'
// import { PortfolioSection } from '@/components/sections/portfolio-section'
// import { ContactSection } from '@/components/sections/contact-section'
// import { FooterSection } from '@/components/sections/footer-section'
// import { navItems } from '@/data/nav-items'
import { HeroSection } from '@/components/sections/hero-section'
import { useEffect } from 'react'

export default function LandingPage() {
  useEffect(() => {
    ;(async function initCal() {
      const { getCalApi } = await import('@calcom/embed-react')
      const api = await getCalApi()

      try {
        const response = await fetch('/api/cal/config')
        const { config } = await response.json()

        if (api) {
          api('floatingButton', {
            calLink: 'nicholas-30min/intro',
            config: {
              ...config,
              hideEventTypeDetails: false,
              layout: 'month_view',
            },
          })
        }
      } catch (error) {
        console.error('Failed to load calendar config:', error)
      }
    })()
  }, [])

  return (
    <main>
      {/* <FloatingNav navItems={navItems} /> */}
      <HeroSection />
      {/* <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <ContactSection />
      <FooterSection /> */}
    </main>
  )
}
