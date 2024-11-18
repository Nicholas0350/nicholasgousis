/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js': 'pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js'
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  }
}

module.exports = nextConfig