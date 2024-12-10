import { Button } from "@/components/ui/button"

export function CTASection({ onPaymentClick }: { onPaymentClick: () => void }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-tradingview-dark-bg relative overflow-hidden">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.1]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-tradingview-dark-darker/80 via-transparent to-tradingview-dark-darker/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-tradingview-dark-darker/80 via-transparent to-tradingview-dark-darker/80" />
      </div>

      <div className="container px-4 md:px-6 text-center relative z-10">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4 text-tradingview-dark-text">
          Έτοιμοι να γίνετε καλύτεροι Product Manager;
        </h2>
        <p className="mx-auto max-w-[600px] text-tradingview-secondary mb-8">
          Ξεκινήστε τώρα και δείτε πώς το ChatPRD μπορεί να μεταμορφώσει τον τρόπο που δουλεύετε.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            className="bg-tradingview-primary hover:bg-tradingview-hover text-white border-none transition-colors"
            size="lg"
            onClick={onPaymentClick}
          >
            Εγγραφείτε Τώρα - $129/μήνα
          </Button>
          <Button
            variant="outline"
            className="border-tradingview-dark-border text-tradingview-dark-text hover:bg-tradingview-dark-darker/50 hover:border-tradingview-primary/50"
            size="lg"
          >
            Ζητήστε μια Επίδειξη
          </Button>
        </div>
      </div>
    </section>
  )
}