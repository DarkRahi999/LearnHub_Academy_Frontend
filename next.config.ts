import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'assets.retinabd.org',
      },
      {
        protocol: 'https',
        hostname: 'shop.retinabd.org',
      },
      // Allow local images to be optimized
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;