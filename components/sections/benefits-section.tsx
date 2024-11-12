import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export function BenefitsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Το #1 εργαλείο AI για Product Managers
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Αυτοματοποιημένη δημιουργία PRD</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Έξυπνες προτάσεις χαρακτηριστικών</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Ανάλυση ανταγωνισμού με AI</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Συνεργασία ομάδας σε πραγματικό χρόνο</span>
              </li>
            </ul>
          </div>
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="ChatPRD Interface"
                width={500}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}