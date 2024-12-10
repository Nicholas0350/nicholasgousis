'use client'

import { FloatingNav } from '@/components/ui/floating-navbar'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ServicesSection } from '@/components/sections/services-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { ContactSection } from '@/components/sections/contact-section'
import { navItems } from '@/data/nav-items'
import { useEffect } from 'react';
// import dynamic from 'next/dynamic'

// // Dynamically import Cal component
// const CalComponent = dynamic(() => import("@calcom/embed-react"), {
//   ssr: false
// })

export default function LandingPage() {
  useEffect(() => {
    (async function initCal() {
      const { getCalApi } = await import("@calcom/embed-react");
      const api = await getCalApi();

      try {
        const response = await fetch('/api/cal/config');
        const { config } = await response.json();

        if (api) {
          api("floatingButton", {
            calLink: "nicholas-30min/intro",
            config: {
              ...config,
              hideEventTypeDetails: false,
              layout: 'month_view'
            }
          });
        }
      } catch (error) {
        console.error('Failed to load calendar config:', error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <FloatingNav navItems={navItems} />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <ContactSection />
        {/* <CalComponent calLink="nicholas-30min/intro" /> */}
      </main>
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Nicholas Gousis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}