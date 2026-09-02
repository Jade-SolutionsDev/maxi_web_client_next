const DEFAULT_SITE_URL = 'http://localhost:4000';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/$/, '');

export const absoluteUrl = (path: string): string => {
  if (!path) return SITE_URL;
  return path.startsWith('/') ? `${SITE_URL}${path}` : `${SITE_URL}/${path}`;
};
