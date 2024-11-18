import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const portfolioItems = [
  { title: "IgnytLabs", description: "MVP development agency website", image: "/placeholder.svg?height=200&width=300" },
  { title: "Think.ai", description: "AI-powered study assistant", image: "/placeholder.svg?height=200&width=300" },
  { title: "QuizMaster", description: "AI-generated quiz platform", image: "/placeholder.svg?height=200&width=300" },
  { title: "FinTech Dashboard", description: "Financial analytics platform", image: "/placeholder.svg?height=200&width=300" },
]

export function PortfolioSection() {
  return (
    <section id="portfolio" className="bg-gray-800 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Portfolio</h2>
        <p className="text-xl mb-12 text-center max-w-2xl mx-auto">
          A glimpse into the websites and applications I have built. Each project showcases my commitment to fast, affordable, and innovative solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioItems.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-t-lg" />
              </CardHeader>
              <CardContent>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}