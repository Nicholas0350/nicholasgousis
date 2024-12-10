import Image from 'next/image'

export function AboutSection() {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-tgv-dark-darker via-tgv-dark-bg to-tgv-dark-darker border-b border-tgv-dark-border">
      {/* Background with grid pattern and animated gradient overlay */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.1]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
        {/* Subtle animated glow effect */}
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-tgv-primary/10 via-transparent to-tgv-primary/10 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto backdrop-blur-sm bg-tgv-dark-darker/30 p-8 rounded-2xl border border-tgv-dark-border/50">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Image Column */}
            <div className="md:w-1/3">
              <div className="relative w-64 h-64 md:w-full md:h-80 rounded-2xl overflow-hidden border-2 border-tgv-primary/20">
                <Image
                  src="/images/me.png" // Make sure to add your image to the public/images directory
                  alt="Nicholas Gousis"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 256px, 384px"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-tgv-dark-darker/50 to-transparent" />
              </div>
            </div>

            {/* Content Column */}
            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-tgv-dark-text">
                About Nicholas Gousis
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-tgv-dark-text">
                  Nicholas Gousis, an ex-floor trader, brings decades of financial expertise to the digital age. Combining his deep understanding of market dynamics with cutting-edge AI technology, Nicholas helps businesses and individuals navigate the complex world of finance with unprecedented accuracy and speed.
                </p>
                <p className="text-lg text-tgv-secondary">
                  With a passion for innovation and a commitment to compliance, Nicholas Gousis is revolutionizing the financial industry, one AI application at a time.
                </p>
                {/* Optional: Add credentials or certifications */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="px-4 py-2 bg-tgv-dark-darker rounded-full border border-tgv-dark-border">
                    <span className="text-sm text-tgv-primary">Ex-Floor Trader</span>
                  </div>
                  <div className="px-4 py-2 bg-tgv-dark-darker rounded-full border border-tgv-dark-border">
                    <span className="text-sm text-tgv-primary">AI Expert</span>
                  </div>
                  <div className="px-4 py-2 bg-tgv-dark-darker rounded-full border border-tgv-dark-border">
                    <span className="text-sm text-tgv-primary">Financial Advisor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}