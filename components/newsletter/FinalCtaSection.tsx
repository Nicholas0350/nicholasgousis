"use client"
// import NewsletterSignup from './newsletterForm';

export function FinalCtaSection() {
  return (
    <section className="w-full min-h-screen border-t flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-3">
            <h2 className="font-spaceGrotesk text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Let&apos;s Stay Connected
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-600 font-normal md:text-lg/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed dark:text-gray-400">
              Get weekly insights and updates delivered straight to your inbox.
            </p>
          </div>
          <div className="w-full max-w-md">
            {/* <NewsletterSignup /> */}
          </div>
        </div>
      </div>
    </section>
  )
}