import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }));

// `http.ts` lee `API_URL` al importarse y lanza si falta, así que la variable
// tiene que existir antes del import: `vi.hoisted` corre antes que ellos.
vi.hoisted(() => {
  process.env.API_URL = 'https://api.ejemplo.invalido/api';
});

import { api } from './http';

/**
 * MxH-0133, punto 4. La cadena vacía **no es un filtro**: es la ausencia de
 * filtro. Viajaba igual que un valor, y la API rechazaba la petición entera:
 *
 *     GET /public/products?municipalityId=
 *     400  {"message":["municipalityId must be a UUID"]}
 *
 * `@IsOptional()` de class-validator deja pasar `undefined` y `null`, pero no
 * `''`, que sí llega a validarse. Comprobado contra staging antes de tocar
 * nada: con el parámetro vacío, 400; sin él, 200.
 */
describe('api · los parámetros que se mandan', () => {
  const llamadas: string[] = [];

  beforeEach(() => {
    llamadas.length = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string | URL) => {
        llamadas.push(String(url));
        return Promise.resolve(
          new Response(JSON.stringify({ data: [] }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }),
        );
      }),
    );
  });

  const urlPedida = () => new URL(llamadas[0]);

  it('un filtro vacío no viaja', async () => {
    await api('/public/products', { params: { municipalityId: '' } });

    expect(urlPedida().searchParams.has('municipalityId')).toBe(false);
  });

  it('uno con valor sí viaja', async () => {
    await api('/public/products', { params: { municipalityId: 'mun-1' } });

    expect(urlPedida().searchParams.get('municipalityId')).toBe('mun-1');
  });

  it('`undefined` tampoco viaja, como antes', async () => {
    await api('/public/products', { params: { municipalityId: undefined } });

    expect(urlPedida().searchParams.has('municipalityId')).toBe(false);
  });

  /**
   * El cero es un valor, no un hueco: `?page=0` significa algo distinto de no
   * mandar `page`. Si el descarte se escribiera con una comprobación de
   * veracidad —`if (v)`— se perdería, y es el error fácil al arreglar esto.
   */
  it('el cero sí viaja: es un valor, no un hueco', async () => {
    await api('/public/products', { params: { page: 0, offset: 0 } });

    expect(urlPedida().searchParams.get('page')).toBe('0');
    expect(urlPedida().searchParams.get('offset')).toBe('0');
  });

  it('`false` también viaja', async () => {
    await api('/public/products', { params: { includeOutOfStock: false } });

    expect(urlPedida().searchParams.get('includeOutOfStock')).toBe('false');
  });

  it('los que valen se mandan aunque otro esté vacío', async () => {
    await api('/public/products', {
      params: { municipalityId: '', q: 'gas', page: 2 },
    });

    const params = urlPedida().searchParams;
    expect(params.has('municipalityId')).toBe(false);
    expect(params.get('q')).toBe('gas');
    expect(params.get('page')).toBe('2');
  });
});
