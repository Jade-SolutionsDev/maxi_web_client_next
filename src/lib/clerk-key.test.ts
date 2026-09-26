import { describe, expect, it } from 'vitest';
import { revisarClaveDeClerk } from './clerk-key';

const PRODUCCION = 'https://maxihabana.com';
const STAGING = 'https://staging.maxihabana.com';

describe('revisarClaveDeClerk', () => {
  it('rechaza que falte la clave', () => {
    expect(
      revisarClaveDeClerk({ clave: undefined, sitio: PRODUCCION }),
    ).toMatch(/Falta NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
  });

  it('rechaza una clave vacía o en blanco', () => {
    expect(revisarClaveDeClerk({ clave: '   ', sitio: PRODUCCION })).toMatch(
      /Falta NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/,
    );
  });

  it('rechaza algo que no es una clave de Clerk', () => {
    expect(
      revisarClaveDeClerk({ clave: 'sk_live_loquesea', sitio: PRODUCCION }),
    ).toMatch(/pk_test_ o pk_live_/);
  });

  it('rechaza la clave de pruebas en el build de producción', () => {
    expect(
      revisarClaveDeClerk({ clave: 'pk_test_loquesea', sitio: PRODUCCION }),
    ).toMatch(/clave de pruebas/);
  });

  it('acepta la clave de pruebas fuera de producción', () => {
    expect(
      revisarClaveDeClerk({ clave: 'pk_test_loquesea', sitio: STAGING }),
    ).toBeNull();
    expect(
      revisarClaveDeClerk({
        clave: 'pk_test_loquesea',
        sitio: 'http://localhost:3001',
      }),
    ).toBeNull();
  });

  it('acepta la clave real en producción', () => {
    expect(
      revisarClaveDeClerk({ clave: 'pk_live_loquesea', sitio: PRODUCCION }),
    ).toBeNull();
    expect(
      revisarClaveDeClerk({
        clave: 'pk_live_loquesea',
        sitio: 'https://www.maxihabana.com',
      }),
    ).toBeNull();
  });

  it('no se cae si NEXT_PUBLIC_SITE_URL falta o no es una URL', () => {
    expect(
      revisarClaveDeClerk({ clave: 'pk_test_loquesea', sitio: undefined }),
    ).toBeNull();
    expect(
      revisarClaveDeClerk({ clave: 'pk_test_loquesea', sitio: 'maxihabana' }),
    ).toBeNull();
  });
});
