import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Permite abrir el dev server desde otros dispositivos de la LAN
  // (ej. probar el layout mobile en el teléfono). Solo aplica en desarrollo.
  allowedDevOrigins: ['192.168.10.190'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maxi-media-prod.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/BANNER/**',
      },
    ],
  },
};

export default nextConfig;
