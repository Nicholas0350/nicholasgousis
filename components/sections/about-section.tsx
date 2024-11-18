export function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="container mx-auto px-4 py-20">
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
  )
}