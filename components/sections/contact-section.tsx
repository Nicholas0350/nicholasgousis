import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Transform Your Financial Future?</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto">
          Contact us today to learn how Nicholas Gousis can help you leverage AI for unprecedented financial success.
        </p>
        <Button asChild size="lg">
          <a href="mailto:contact@nicholasgousis.com">
            Contact Now <ArrowRight className="ml-2" />
          </a>
        </Button>
      </div>
    </section>
  )
}