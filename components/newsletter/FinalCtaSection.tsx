"use client"
import NewsletterSignup from './newsletterForm';

export function FinalCtaSection() {
  return (
    <section className="w-full border-t bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Stay Compliant, Grow Confidently
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Join 1,000+ AFSL & ACL professionals who rely on our weekly insights.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </section>
  )
}