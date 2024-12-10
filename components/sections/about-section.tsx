export function AboutSection() {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-tgv-dark-darker">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.1]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-tgv-dark-text">About Nicholas Gousis</h2>
          <div className="space-y-6">
            <p className="text-lg text-tgv-dark-text">
              Nicholas Gousis, an ex-floor trader, brings decades of financial expertise to the digital age. Combining his deep understanding of market dynamics with cutting-edge AI technology, Nicholas helps businesses and individuals navigate the complex world of finance with unprecedented accuracy and speed.
            </p>
            <p className="text-lg text-tgv-secondary">
              With a passion for innovation and a commitment to compliance, Nicholas Gousis is revolutionizing the financial industry, one AI application at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}