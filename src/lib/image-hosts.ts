/**
 * Los sitios de los que la tienda acepta imágenes, en un solo lugar.
 *
 * `next/image` **lanza una excepción al renderizar** cuando el `src` apunta a
 * un host que no está en `remotePatterns`, y eso tumba la página entera: no es
 * que falle esa tarjeta, es que el catálogo deja de cargar para todo el mundo.
 * `SafeImage` no puede rescatarlo con su `onError`, porque ese error ocurre
 * antes de que exista ningún elemento al que atender.
 *
 * Por eso la lista vive aquí y no dentro de `next.config.ts`: la necesitan los
 * dos lados —la configuración, para autorizar; y el componente, para saber de
 * antemano si una URL va a ser rechazada y caer al respaldo sin romper nada—.
 * Una lista en dos sitios acabaría divergiendo, y la divergencia se vería como
 * una página caída.
 */

export interface PatronDeImagen {
  protocol?: 'http' | 'https';
  hostname: string;
  port?: string;
  /** Prefijo de ruta terminado en `/**`, tal como lo escribe Next. */
  pathname?: string;
}

/** Sitios fijos, los que no dependen del entorno. */
export const PATRONES_FIJOS: PatronDeImagen[] = [
  {
    protocol: 'https',
    hostname: 'maxi-media-prod.s3.us-east-1.amazonaws.com',
    port: '',
    pathname: '/BANNER/**',
  },
  { hostname: 'res.cloudinary.com', pathname: '/**' },
  { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
  // Almacenamiento local que usa la API en desarrollo.
  { protocol: 'http', hostname: 'localhost', port: '9002', pathname: '/**' },
];

/** El almacenamiento de cada entorno, que llega por variable. */
export function patronDelMedio(
  mediaUrl: string | undefined,
): PatronDeImagen[] {
  if (!mediaUrl) return [];
  try {
    const url = new URL(mediaUrl);
    return [
      {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: `${url.pathname.replace(/\/$/, '')}/**`,
      },
    ];
  } catch {
    // Una variable mal escrita no debe impedir arrancar: se ignora y el resto
    // de sitios sigue funcionando.
    return [];
  }
}

export function patronesDeImagen(
  mediaUrl: string | undefined,
): PatronDeImagen[] {
  return [...patronDelMedio(mediaUrl), ...PATRONES_FIJOS];
}

const rutaEncaja = (patron: string | undefined, ruta: string): boolean => {
  if (!patron || patron === '/**') return true;
  // Next admite `**` al final; aquí basta con comparar el prefijo.
  const prefijo = patron.replace(/\/\*\*$/, '');
  return ruta === prefijo || ruta.startsWith(`${prefijo}/`);
};

/**
 * ¿Va a aceptar `next/image` esta dirección?
 *
 * Las rutas propias (`/algo.png`) y los datos incrustados se permiten siempre:
 * no pasan por `remotePatterns`. Lo que se comprueba es el host de una URL
 * absoluta, que es lo único capaz de tumbar el renderizado.
 */
export function imagenPermitida(
  src: string | undefined | null,
  mediaUrl: string | undefined = process.env.NEXT_PUBLIC_MEDIA_URL,
): boolean {
  if (!src) return false;
  if (src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:'))
    return true;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false; // ni URL absoluta ni ruta propia: no hay nada que servir
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

  return patronesDeImagen(mediaUrl).some((p) => {
    if (p.protocol && `${p.protocol}:` !== url.protocol) return false;
    if (p.hostname !== url.hostname) return false;
    // `port: ''` en Next significa «el puerto por defecto».
    if (p.port !== undefined && p.port !== '' && p.port !== url.port)
      return false;
    if ((p.port === '' || p.port === undefined) && url.port !== '') return false;
    return rutaEncaja(p.pathname, url.pathname);
  });
}
