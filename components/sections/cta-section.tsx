import { Button } from "@/components/ui/button"

export function CTASection({ onPaymentClick }: { onPaymentClick: () => void }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-600 text-white">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">
          Έτοιμοι να γίνετε καλύτεροι Product Manager;
        </h2>
        <p className="mx-auto max-w-[600px] text-purple-100 mb-8">
          Ξεκινήστε τώρα και δείτε πώς το ChatPRD μπορεί να μεταμορφώσει τον τρόπο που δουλεύετε.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            className="bg-white text-purple-600 hover:bg-gray-100"
            size="lg"
            onClick={onPaymentClick}
          >
            Εγγραφείτε Τώρα - $129/μήνα
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-purple-700" size="lg">
            Ζητήστε μια Επίδειξη
          </Button>
        </div>
      </div>
    </section>
  )
}