import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,

  allowedDevOrigins: ['192.168.10.190'],
  logging: {
    fetches: { fullUrl: true },
  },
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maxi-media-prod.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/BANNER/**',
      },
      {
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      // Local object storage used by the API in development.
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9002',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
