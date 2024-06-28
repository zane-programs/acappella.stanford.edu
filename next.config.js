/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["stanfordacappella.com", "*.stanfordacappella.com"],
    },
  },
};

module.exports = nextConfig;
