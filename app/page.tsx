'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="inline-block font-extrabold px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm mb-4">
              From Floor Trading to AI Innovation
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              From Floor Trading Millions to Losing It All. Now Using AI to Win.
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
              I learned flow trading in the trading pits, risk management through losses, and systematic thinking through necessity. Now I&apos;m combining those skills with AI to help others grow their online presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch My Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">My Journey from Trading Pits to AI</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journey.map((step) => (
              <Card key={step.title} className="bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Built from Real Experience</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Who This Is For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perfectFor.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Start Growing Today</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className="relative">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold mb-4">{plan.price}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-purple-600 text-white">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Don&apos;t Wait for Your Edge to Vanish</h2>
          <p className="mb-8 text-lg opacity-90">
            I lost millions waiting too long to adapt. Don&apos;t make the same mistake with your growth strategy.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            Start 14-Day Free Trial
          </Button>
          <p className="mt-4 text-sm opacity-80">*No credit card required. Cancel anytime.</p>
        </div>
      </section>
    </div>
  )
}

const journey = [
  {
    title: "The Trading Floor (2008-2012)",
    description: "Started as an interest rate options floor trader in Sydney. Found my edge in volatility trading, making millions in the pits through pure price action and market psychology."
  },
  {
    title: "The Fall (2012-2014)",
    description: "Lost everything when electronic trading took over. My edge vanished overnight. Had to rebuild from scratch, learning the hard lesson that any advantage can disappear."
  },
  {
    title: "The Comeback (2014-2018)",
    description: "Rebuilt through Australian property investments. Started a regulated trading education company, teaching others the real lessons from my failures and successes."
  },
  {
    title: "The Digital Challenge (2018-2021)",
    description: "Hit a growth ceiling with traditional marketing. Realized I needed to master digital growth or become irrelevant. Started learning to code at 35."
  },
  {
    title: "The AI Evolution (2021-Now)",
    description: "Combined my trading pattern recognition skills with AI. Now building tools to help others avoid the growth plateaus I faced."
  }
]

const features = [
  {
    title: "Pattern Recognition",
    description: "Using the same skills that made me millions in the pits - but now for spotting social media growth opportunities instead of market inefficiencies."
  },
  {
    title: "Risk Management",
    description: "Applied my trading risk principles to content strategy. Test small, scale winners, cut losers fast - just like in the markets."
  },
  {
    title: "Edge Finding",
    description: "Spent years finding edges in financial markets. Now I use AI to find content and timing edges for social growth."
  },
  {
    title: "Systematic Growth",
    description: "Built automated systems for trading. Now building them for content - because manual doesn't scale, in markets or marketing."
  }
]

const perfectFor = [
  "Traders who need to build their online presence",
  "Business owners who've hit a growth plateau",
  "Content creators tired of manual posting",
  "Anyone who values systematic, data-driven growth"
]

const pricingPlans = [
  {
    name: "Growth Plan",
    price: "$29/month",
    features: [
      "AI content optimization",
      "Growth pattern analysis",
      "Automated scheduling",
      "Basic performance tracking"
    ]
  },
  {
    name: "Scale Plan",
    price: "$79/month",
    features: [
      "Advanced pattern recognition",
      "Multi-account optimization",
      "Priority support",
      "Custom growth strategies"
    ]
  }
]