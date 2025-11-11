import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.newsdata.io',
      },
      {
        protocol: 'https',
        hostname: '**.newsapi.org',
      },
    ],
  },
};

export default nextConfig;
