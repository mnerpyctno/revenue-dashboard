/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  env: {
    EDGE_CONFIG: process.env.EDGE_CONFIG,
  },
}

module.exports = nextConfig 