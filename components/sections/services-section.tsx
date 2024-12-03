import { BarChart, Cpu, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ServicesSection() {
  return (
    <section id="services" className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.2]">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/50" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader>
              <BarChart className="mx-auto mb-4 text-gray-400" size={48} />
              <CardTitle className="text-white">AI-Enhanced Financial Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">Harness the power of AI to make data-driven financial decisions with unprecedented accuracy and speed.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader>
              <Cpu className="mx-auto mb-4 text-gray-400" size={48} />
              <CardTitle className="text-white">MVP Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">Rapidly develop and deploy Minimum Viable Products for your financial technology ideas.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader>
              <GraduationCap className="mx-auto mb-4 text-gray-400" size={48} />
              <CardTitle className="text-white">Expert Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">Learn the secrets of floor trading and how to apply them in the age of AI-driven finance.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}