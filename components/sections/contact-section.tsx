import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.2]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/50" />
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Transform Your Financial Future?</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300">
          Contact us today to learn how Nicholas Gousis can help you leverage AI for unprecedented financial success.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
        >
          <a href="mailto:contact@nicholasgousis.com">
            Contact Now <ArrowRight className="ml-2" />
          </a>
        </Button>
      </div>
    </section>
  )
}