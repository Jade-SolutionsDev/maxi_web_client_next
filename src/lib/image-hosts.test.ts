import { describe, expect, it } from 'vitest';
import { imagenPermitida, patronesDeImagen } from './image-hosts';

const MEDIA = 'https://media.maxihabana.com/uploads/';

describe('imagenPermitida', () => {
  // El caso que tumbaba el catálogo: MxH-0086. Un producto con esta imagen y
  // la página entera dejaba de cargar para todos los visitantes.
  it('rechaza el host que provocó la caída', () => {
    expect(imagenPermitida('https://x/p.png', MEDIA)).toBe(false);
  });

  it('acepta los sitios de siempre', () => {
    expect(
      imagenPermitida('https://res.cloudinary.com/demo/image/a.webp', MEDIA),
    ).toBe(true);
    expect(imagenPermitida('https://placehold.co/600x400', MEDIA)).toBe(true);
  });

  it('acepta el almacenamiento del entorno y respeta su ruta', () => {
    expect(imagenPermitida(`${MEDIA}foto.webp`, MEDIA)).toBe(true);
    expect(
      imagenPermitida('https://media.maxihabana.com/otra/foto.webp', MEDIA),
    ).toBe(false);
  });

  it('respeta la carpeta del bucket de banners', () => {
    const base = 'https://maxi-media-prod.s3.us-east-1.amazonaws.com';
    expect(imagenPermitida(`${base}/BANNER/uno.webp`, MEDIA)).toBe(true);
    expect(imagenPermitida(`${base}/PRIVADO/uno.webp`, MEDIA)).toBe(false);
  });

  it('deja pasar rutas propias y datos incrustados', () => {
    expect(imagenPermitida('/fallback.jpeg', MEDIA)).toBe(true);
    expect(imagenPermitida('data:image/png;base64,iVBORw0KGgo=', MEDIA)).toBe(
      true,
    );
  });

  it('rechaza lo que no es una dirección servible', () => {
    expect(imagenPermitida('', MEDIA)).toBe(false);
    expect(imagenPermitida(null, MEDIA)).toBe(false);
    expect(imagenPermitida('no es una url', MEDIA)).toBe(false);
    expect(imagenPermitida('javascript:alert(1)', MEDIA)).toBe(false);
  });

  it('distingue el protocolo cuando el patrón lo fija', () => {
    expect(imagenPermitida('http://placehold.co/600x400', MEDIA)).toBe(false);
  });

  it('distingue el puerto', () => {
    expect(imagenPermitida('http://localhost:9002/foto.webp', MEDIA)).toBe(true);
    expect(imagenPermitida('http://localhost:3000/foto.webp', MEDIA)).toBe(
      false,
    );
  });

  it('sin almacenamiento configurado, los sitios fijos siguen valiendo', () => {
    expect(imagenPermitida('https://placehold.co/1x1', undefined)).toBe(true);
    expect(imagenPermitida(`${MEDIA}foto.webp`, undefined)).toBe(false);
  });

  it('una variable de entorno inservible no rompe el arranque', () => {
    expect(() => patronesDeImagen('no-es-una-url')).not.toThrow();
    expect(imagenPermitida('https://placehold.co/1x1', 'no-es-una-url')).toBe(
      true,
    );
  });
});

describe('patronesDeImagen', () => {
  it('pone el almacenamiento del entorno por delante de los fijos', () => {
    const patrones = patronesDeImagen(MEDIA);
    expect(patrones[0]).toMatchObject({
      hostname: 'media.maxihabana.com',
      pathname: '/uploads/**',
    });
    expect(patrones).toHaveLength(5);
  });
});
