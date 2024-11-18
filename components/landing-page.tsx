'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, BarChart, Cpu, GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingPageComponent() {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Portfolio items data
  const portfolioItems = [
    { title: "IgnytLabs", description: "MVP development agency website", image: "/placeholder.svg?height=200&width=300" },
    { title: "Think.ai", description: "AI-powered study assistant", image: "/placeholder.svg?height=200&width=300" },
    { title: "QuizMaster", description: "AI-generated quiz platform", image: "/placeholder.svg?height=200&width=300" },
    { title: "FinTech Dashboard", description: "Financial analytics platform", image: "/placeholder.svg?height=200&width=300" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <a href="#" className="text-2xl font-bold">Nicholas Gousis</a>
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#services" className="hover:text-blue-400 transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-blue-400 transition-colors">Portfolio</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <ChevronDown className={`transform transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </nav>
        {isMenuOpen && (
          <div className="mt-4 flex flex-col space-y-2 md:hidden">
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#services" className="hover:text-blue-400 transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-blue-400 transition-colors">Portfolio</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section - Main Value Proposition */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your AI-Enhanced Financial Solutions
          </motion.h1>
          <motion.h2
            className="text-2xl md:text-3xl mb-8 text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Fast. Compliant. Innovative.
          </motion.h2>
          <motion.p
            className="text-xl mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Leverage floor trading secrets and cutting-edge AI to revolutionize your financial strategies.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button asChild size="lg">
              <a href="#contact">
                Get Started <ArrowRight className="ml-2" />
              </a>
            </Button>
          </motion.div>
        </section>

        {/* About Section - Personal Background & Expertise */}
        <section id="about" className="bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Nicholas Gousis</h2>
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <img src="/placeholder.svg?height=400&width=400" alt="Nicholas Gousis" className="rounded-full mx-auto" width={300} height={300} />
              </div>
              <div className="md:w-1/2">
                <p className="text-lg mb-6">
                  Nicholas Gousis, an ex-floor trader, brings decades of financial expertise to the digital age. Combining his deep understanding of market dynamics with cutting-edge AI technology, Nicholas helps businesses and individuals navigate the complex world of finance with unprecedented accuracy and speed.
                </p>
                <p className="text-lg">
                  With a passion for innovation and a commitment to compliance, Nicholas Gousis is revolutionizing the financial industry, one AI application at a time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - Core Offerings */}
        <section id="services" className="py-20">
          <div className="container mx-auto px-4">
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

        {/* Portfolio Section - Project Showcase */}
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

        {/* Contact CTA Section */}
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
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Nicholas Gousis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}