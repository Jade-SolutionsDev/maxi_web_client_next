import type { MetadataRoute } from 'next';
import { SITE_URL, absoluteUrl } from '@/shared/seo/site-url';

const PRIVATE_PATHS = [
  '/api/',
  '/checkout',
  '/pedidos',
  '/direcciones',
  '/login',
  '/register',
  '/reset-password',
  '/bienvenida',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
