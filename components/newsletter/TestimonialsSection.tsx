import { spaceGrotesk } from "@/lib/fonts"

export function TestimonialsSection() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <h2 className={`${spaceGrotesk.className} text-2xl font-bold tracking-tighter text-center mb-8 md:text-3xl/tight`}>
          What Our Subscribers Say
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className={`${spaceGrotesk.className} inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600 dark:bg-blue-800 dark:text-blue-100`}>
              AFSL Testimonial
            </div>
            <blockquote className="text-lg font-medium leading-relaxed">
              &quot;This newsletter has been a game-changer for our AFSL business. The in-depth analysis and practical compliance strategies have helped us stay ahead.&quot;
            </blockquote>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              - Chief Compliance Officer, Major AFSL Holder
            </div>
          </div>
          <div className="space-y-4">
            <div className={`${spaceGrotesk.className} inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 dark:bg-green-800 dark:text-green-100`}>
              ACL Testimonial
            </div>
            <blockquote className="text-lg font-medium leading-relaxed">
              &quot;As an ACL holder, staying compliant with ASIC&apos;s requirements was challenging until we found this newsletter. Clear, actionable insights that work.&quot;
            </blockquote>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              - Managing Director, Leading ACL Company
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}