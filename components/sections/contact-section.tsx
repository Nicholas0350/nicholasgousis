import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-tgv-dark-darker">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.1]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-tgv-dark-text">Ready to Transform Your Financial Future?</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto text-tgv-secondary">
          Contact us today to learn how Nicholas Gousis can help you leverage AI for unprecedented financial success.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-tgv-primary hover:bg-tgv-hover text-white border-none transition-colors"
        >
          <a href="mailto:contact@nicholasgousis.com">
            Contact Now <ArrowRight className="ml-2" />
          </a>
        </Button>
      </div>
    </section>
  )
}