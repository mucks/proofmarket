import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Reown AppKit Next.js requirement
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  turbopack: {},
  // Enable Next.js experimental features for standalone output in Docker
  output: 'standalone',
};

export default nextConfig;
