import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function HeroSection({ onPaymentClick }: { onPaymentClick: () => void }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Γίνετε{" "}
              <span className="text-purple-600 relative">
                10x καλύτερος
                <span className="absolute bottom-1 left-0 w-full h-3 bg-pink-200/50 -z-10" />
              </span>{" "}
              Product Manager
            </h1>
          </div>
          <div className="space-x-4">
            <Button className="bg-purple-600 hover:bg-purple-700" size="lg" onClick={onPaymentClick}>
              Δοκιμάστε το Τώρα - $129/μήνα
            </Button>
            <Button variant="outline" size="lg">
              Δείτε το σε δράση <Play className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}