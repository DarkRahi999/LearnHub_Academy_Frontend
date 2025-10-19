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
      // Allow Cloudinary images
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
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
  // turbopack: {
  //   root: _src,
  // },
};

export default nextConfig;