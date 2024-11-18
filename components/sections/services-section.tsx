import { BarChart, Cpu, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ServicesSection() {
  return (
    <section id="services" className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <BarChart className="mx-auto mb-4 text-blue-400" size={48} />
              <CardTitle>AI-Enhanced Financial Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Harness the power of AI to make data-driven financial decisions with unprecedented accuracy and speed.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Cpu className="mx-auto mb-4 text-blue-400" size={48} />
              <CardTitle>MVP Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Rapidly develop and deploy Minimum Viable Products for your financial technology ideas.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <GraduationCap className="mx-auto mb-4 text-blue-400" size={48} />
              <CardTitle>Expert Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Learn the secrets of floor trading and how to apply them in the age of AI-driven finance.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}