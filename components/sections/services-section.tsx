import { BarChart, Cpu, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ServicesSection() {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-tgv-dark-bg">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-tgv-dark-text">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-tgv-dark-darker border-tgv-dark-border">
            <CardHeader>
              <BarChart className="mx-auto mb-4 text-tgv-primary" size={48} />
              <CardTitle className="text-tgv-dark-text">AI-Enhanced Financial Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-tgv-secondary">
                Harness the power of AI to make data-driven financial decisions with unprecedented accuracy and speed.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-tgv-dark-darker border-tgv-dark-border">
            <CardHeader>
              <Cpu className="mx-auto mb-4 text-tgv-primary" size={48} />
              <CardTitle className="text-tgv-dark-text">MVP Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-tgv-secondary">
                Rapidly develop and deploy Minimum Viable Products for your financial technology ideas.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-tgv-dark-darker border-tgv-dark-border">
            <CardHeader>
              <GraduationCap className="mx-auto mb-4 text-tgv-primary" size={48} />
              <CardTitle className="text-tgv-dark-text">Expert Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-tgv-secondary">
                Learn the secrets of floor trading and how to apply them in the age of AI-driven finance.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}