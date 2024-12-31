"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { spaceGrotesk } from "@/lib/fonts"

export function RecentInsightsSection() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className={`${spaceGrotesk.className} text-2xl font-bold tracking-tighter text-center mb-8 md:text-3xl/tight`}>
          Recent Insights for AFSL & ACL Holders
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Badge>AFSL Focus</Badge>
                <h3 className={`${spaceGrotesk.className} font-bold`}>Navigating ASIC&apos;s New Financial Product Design & Distribution Obligations</h3>
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
                <h3 className={`${spaceGrotesk.className} font-bold`}>Mastering ASIC&apos;s Credit License Obligations</h3>
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
                <h3 className={`${spaceGrotesk.className} font-bold`}>Building a Bulletproof Compliance Management System</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Practical tips to develop and implement a robust CMS that satisfies ASIC requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}