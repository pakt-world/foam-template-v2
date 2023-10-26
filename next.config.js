/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.STORAGE_URL,
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
