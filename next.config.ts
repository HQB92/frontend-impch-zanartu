import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
    path: '/_next/image',
  },
  // Turbopack is the default bundler in Next.js 16
  // GraphQL files are now converted to .ts files for compatibility
};

export default nextConfig;
