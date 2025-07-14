/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' - this disables API routes
  trailingSlash: false,  // Change to false for better API routing
  images: {
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai']
  }
}

module.exports = nextConfig