import { Button } from "@/components/ui/button"

export function CTASection({ onPaymentClick }: { onPaymentClick: () => void }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-tgv-dark-bg relative overflow-hidden">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.1]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
      </div>

      <div className="container px-4 md:px-6 text-center relative z-10">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4 text-tgv-dark-text">
          Ready to Get Started?
        </h2>
        <p className="mx-auto max-w-[600px] text-tgv-secondary mb-8">
          Transform your financial strategies with AI-powered solutions.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            className="bg-tgv-primary hover:bg-tgv-hover text-white border-none transition-colors"
            size="lg"
            onClick={onPaymentClick}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="border-tgv-dark-border text-tgv-dark-text hover:bg-tgv-dark-darker/50 hover:border-tgv-primary/50"
            size="lg"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}