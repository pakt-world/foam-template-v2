/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.STORAGE_URL || 'chainsite-storage.s3.us-east-1.amazonaws.com',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
