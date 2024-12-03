"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Shield, ChevronRight } from 'lucide-react'
import { ArticleModal } from "@/components/ArticleModal"


export default function NewsletterPage() {
  const [selectedArticle, setSelectedArticle] = useState<{
    number: number;
    title: string;
    date: string;
  } | null>(null);

  const articles = [
    {
      number: 52,
      title: "ASIC's New Enforcement Strategy: What It Means for Your AFSL",
      date: "December 1, 2024"
    },
    {
      number: 51,
      title: "Mastering AFSL Compliance: A Complete Risk Management Framework",
      date: "November 24, 2024"
    },
    {
      number: 50,
      title: "ACL Compliance Checklist: Essential Steps for Credit Licensees",
      date: "November 17, 2024"
    },
    {
      number: 49,
      title: "How Top AFSL Holders Maintain Perfect Compliance Records",
      date: "November 10, 2024"
    },
    {
      number: 48,
      title: "ASIC's Latest Regulatory Guide: Breaking Down the Changes",
      date: "November 3, 2024"
    },
    {
      number: 47,
      title: "Building a Compliance-First Culture in Your Financial Services Business",
      date: "October 27, 2024"
    },
    {
      number: 46,
      title: "Navigating ASIC Audits: A Comprehensive Preparation Guide",
      date: "October 20, 2024"
    },
    {
      number: 45,
      title: "The Future of Financial Services Compliance: AI and RegTech",
      date: "October 13, 2024"
    },
    {
      number: 44,
      title: "Essential Updates to Your AFSL Compliance Framework",
      date: "October 6, 2024"
    },
    {
      number: 43,
      title: "Maximizing Growth While Maintaining Strict ASIC Compliance",
      date: "September 29, 2024"
    }
  ];

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section with Email Signup */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="rounded-full">
                  Trusted by 1,000+ AFSL & ACL Holders
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Master ASIC Compliance & Grow Your Financial Services Business
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Weekly expert insights on ASIC regulations, risk management, and growth strategies for AFSL & ACL holders. Stay compliant, mitigate risks, and boost your bottom line.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">
                    Get Compliant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Join industry leaders staying ahead of ASIC&apos;s regulatory landscape.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Previous Issues Grid Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-8">Previous Issues of ASIC Compliance Insider</h2>
                <div className="space-y-4">
                  {articles.map((article) => (
                    <button
                      key={article.number}
                      onClick={() => setSelectedArticle(article)}
                      className="w-full text-left group flex items-center justify-between py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-sm font-medium text-gray-500">#{article.number}</span>
                        <div className="space-y-1">
                          <h3 className="font-medium leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-500">{article.date}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-1 mt-8">
                  <Button variant="outline" size="icon" className="h-8 w-8 active">
                    1
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    2
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    3
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    4
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    5
                  </Button>
                  <span className="mx-2">...</span>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    12
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Subscribe to the Newsletter</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Join 1,000+ AFSL & ACL professionals who rely on our weekly insights to navigate ASIC&apos;s complex regulatory landscape.
                      </p>
                      <ul className="space-y-2">
                        {[
                          "Weekly ASIC regulatory updates",
                          "Compliance strategies for AFSL & ACL holders",
                          "Risk management frameworks",
                          "Growth tactics for financial services",
                          "Expert analysis of enforcement actions"
                        ].map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 space-y-4">
                      <form className="space-y-2">
                        <Input
                          className="w-full"
                          placeholder="Enter your email"
                          type="email"
                        />
                        <Button className="w-full" type="submit">
                          Subscribe Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Get your first issue free. Unsubscribe at any time.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Insights Cards Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter text-center mb-8 md:text-3xl/tight">
              Recent Insights for AFSL & ACL Holders
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Badge>AFSL Focus</Badge>
                    <h3 className="font-bold">Navigating ASIC&apos;s New Financial Product Design & Distribution Obligations</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      A comprehensive guide to implementing and maintaining compliance with DDO requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Badge>ACL Spotlight</Badge>
                    <h3 className="font-bold">Mastering ASIC&apos;s Credit License Obligations: A Step-by-Step Approach</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Essential strategies for ACL holders to meet and exceed ASIC&apos;s expectations.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Badge>Risk Management</Badge>
                    <h3 className="font-bold">Building a Bulletproof Compliance Management System for AFSL & ACL Businesses</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Practical tips to develop and implement a robust CMS that satisfies ASIC requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600 dark:bg-blue-800 dark:text-blue-100">
                  AFSL Testimonial
                </div>
                <blockquote className="text-lg font-medium leading-relaxed">
                  &quot;This newsletter has been a game-changer for our AFSL business. The in-depth analysis of ASIC&apos;s regulatory changes and practical compliance strategies have helped us stay ahead of the curve and optimize our operations.&quot;
                </blockquote>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  - Chief Compliance Officer, Major AFSL Holder, Sydney
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 dark:bg-green-800 dark:text-green-100">
                  ACL Testimonial
                </div>
                <blockquote className="text-lg font-medium leading-relaxed">
                  &quot;As an ACL holder, staying compliant with ASIC&apos;s ever-changing landscape was a constant challenge. This newsletter provides clear, actionable insights that have streamlined our compliance processes and helped us grow confidently.&quot;
                </blockquote>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  - Managing Director, Leading ACL Company, Melbourne
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full border-t bg-gray-50 py-12 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Stay Compliant, Grow Confidently
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join 1,000+ AFSL & ACL professionals who rely on our weekly insights to navigate ASIC&apos;s complex regulatory landscape.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">
                    Subscribe Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get your first issue free. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-100 dark:bg-gray-800">
        <div className="container flex flex-col gap-4 px-4 py-6 md:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span className="font-semibold">ASIC Compliance Insider</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Empowering AFSL & ACL holders with expert insights and strategies for ASIC compliance and business growth.
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 text-sm">
              <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                Privacy Policy
              </Link>
              <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                Terms of Service
              </Link>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 ASIC Compliance Insider. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Article Modal */}
      <ArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
    </div>
  )
}
