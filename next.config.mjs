/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEWS_API_BASE_URL: process.env.NEWS_API_BASE_URL,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    GNEWS_API_KEY: process.env.GNEWS_API_KEY,
  },
}

export default nextConfig
