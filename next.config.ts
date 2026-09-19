import type { NextConfig } from 'next';
import { patronesDeImagen } from './src/lib/image-hosts';

// Los sitios permitidos viven en `src/lib/image-hosts.ts` porque los necesitan
// dos lados: esta configuración, para autorizarlos, y `SafeImage`, para saber
// de antemano si una URL sería rechazada y caer al respaldo. Cuando la lista
// estaba solo aquí, una imagen de otro dominio tumbaba el catálogo entero
// (MxH-0086): next/image lanza al renderizar, antes de que nada pueda atajarlo.

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
    remotePatterns: patronesDeImagen(process.env.NEXT_PUBLIC_MEDIA_URL),
  },
};

export default nextConfig;
