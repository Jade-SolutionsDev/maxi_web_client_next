import type { NextConfig } from 'next';

// CMS uploads (banners, staff photos) live on the object-storage host the API
// is configured with; the hardcoded S3 entry below only allows /BANNER/**.
// Set NEXT_PUBLIC_MEDIA_URL to that storage's public base URL per environment.
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
const mediaPattern = mediaUrl
  ? (() => {
      const url = new URL(mediaUrl);
      return [
        {
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
          hostname: url.hostname,
          ...(url.port ? { port: url.port } : {}),
          pathname: `${url.pathname.replace(/\/$/, '')}/**`,
        },
      ];
    })()
  : [];

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
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      ...mediaPattern,
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
