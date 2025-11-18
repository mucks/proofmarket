import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Reown AppKit Next.js requirement
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Fix for MetaMask SDK React Native dependencies in web environment
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        '@react-native-async-storage/async-storage': false,
      };
    }
    
    return config;
  },
  turbopack: {},
  // Enable Next.js experimental features for standalone output in Docker
  output: 'standalone',
};

export default nextConfig;
