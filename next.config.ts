import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'api.vsmi.vn',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://api.vsmi.vn https://*.vsmi.vn http://localhost:3001 https://www.google-analytics.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://cdn.tiny.cloud; style-src 'self' 'unsafe-inline' https://cdn.tiny.cloud; img-src 'self' data: https: http://localhost:3001 https://cdn.tiny.cloud; font-src 'self' data: https://cdn.tiny.cloud;"
          }
        ]
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
