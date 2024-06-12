/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    HOST_API: process.env.HOST_API
  },
  serverRuntimeConfig: {
    HOST_API: process.env.HOST_API
  },
  publicRuntimeConfig: {
    HOST_API: process.env.HOST_API
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Setting up fallbacks for modules that are not compatible with the browser
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.fallback.fs = false; // Fallback to false for the 'fs' module
      config.resolve.fallback.child_process = false; // Fallback to false for the 'fs' module
    }

    return config;
  },
  reactStrictMode: false
};

module.exports = nextConfig;
