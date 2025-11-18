import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer, webpack }) => {
    // Reown AppKit Next.js requirement
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Fix for MetaMask SDK React Native dependencies in web environment
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        '@react-native-async-storage/async-storage': false,
      };
      
      // Ignore the async-storage module entirely using webpack.IgnorePlugin
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@react-native-async-storage\/async-storage$/,
        })
      );
    }
    
    return config;
  },
  turbopack: {},
  // Enable Next.js experimental features for standalone output in Docker
  output: 'standalone',
};

export default nextConfig;
