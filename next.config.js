/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOST_API: process.env.HOST_API,
  },
  serverRuntimeConfig: {
    HOST_API: process.env.HOST_API,
  },
  publicRuntimeConfig: {
    HOST_API: process.env.HOST_API,
  },
};

module.exports = nextConfig;
