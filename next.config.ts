import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vibou-erp.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      }
    ],
  },
};

export default nextConfig;
