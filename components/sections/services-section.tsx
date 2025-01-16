import { BarChart, Cpu, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ServicesSection() {
  return (
    <section className="py-16 relative bg-tgv-dark-bg">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold mb-8 text-center text-tgv-dark-text tracking-tight">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-tgv-dark-darker border-tgv-dark-border">
            <CardHeader className="pb-3">
              <BarChart className="mb-2 text-tgv-primary" size={36} />
              <CardTitle className="font-space-grotesk text-xl font-semibold text-tgv-dark-text tracking-tight">
                AI-Enhanced Financial Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-tgv-secondary font-normal leading-relaxed">
                Harness the power of AI to make data-driven financial decisions with unprecedented accuracy and speed.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-tgv-dark-darker border-tgv-dark-border">
            <CardHeader className="pb-3">
              <Cpu className="mb-2 text-tgv-primary" size={36} />
              <CardTitle className="font-space-grotesk text-xl font-semibold text-tgv-dark-text tracking-tight">
                MVP Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-tgv-secondary font-normal leading-relaxed">
                Rapidly develop and deploy Minimum Viable Products for your financial technology ideas.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-tgv-dark-darker border-tgv-dark-border">
            <CardHeader className="pb-3">
              <GraduationCap className="mb-2 text-tgv-primary" size={36} />
              <CardTitle className="font-space-grotesk text-xl font-semibold text-tgv-dark-text tracking-tight">
                Expert Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-tgv-secondary font-normal leading-relaxed">
                Learn the secrets of floor trading and how to apply them in the age of AI-driven finance.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}