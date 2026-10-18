import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '@/feature/product/type/product.interface';

/**
 * El tope de la API, copiado a mano a propósito.
 *
 * `MAX_PAGE_LIMIT` vive en el repositorio de la API (`pagination-query.dto.ts`)
 * y no se puede importar desde aquí. Un doble que acepte cualquier `limit` no
 * mide nada: el defecto que esta prueba vigila era justo pedir más de lo que la
 * API admite, y el `catch` de `productEntries` lo convertía en silencio.
 */
const MAX_PAGE_LIMIT = 100;

const TOTAL_PRODUCTOS = 150;

const producto = (n: number): Product =>
  ({
    id: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
    slug: `producto-${n}`,
  }) as Product;

const TODOS = Array.from({ length: TOTAL_PRODUCTOS }, (_, i) => producto(i + 1));

/**
 * Se comporta como la API: si le piden una página mayor que su tope, **lanza**,
 * igual que el `400 limit must not be greater than 100` que devuelve de verdad.
 */
const getProducts = vi.fn(
  async ({ page = 1, limit }: { page?: number; limit?: number }) => {
    if (limit !== undefined && limit > MAX_PAGE_LIMIT) {
      throw new Error(`limit must not be greater than ${MAX_PAGE_LIMIT}`);
    }

    const tamano = limit ?? TOTAL_PRODUCTOS;
    const desde = (page - 1) * tamano;

    return {
      items: TODOS.slice(desde, desde + tamano),
      total: TOTAL_PRODUCTOS,
      page,
      limit: tamano,
      totalPages: Math.ceil(TOTAL_PRODUCTOS / tamano),
    };
  },
);

vi.mock('@/feature/product/service/product.service', () => ({
  getProducts: (filtros: { page?: number; limit?: number }) =>
    getProducts(filtros),
}));

vi.mock('@/shared/cms/service/cms.service', () => ({
  getCmsPages: async () => [{ slug: 'politica-de-cookies' }],
  hasFaqContent: async () => true,
}));

vi.mock('@/shared/taxonomy/service/taxonomy.service', () => ({
  getDepartments: async () => [{ slug: 'alimentos' }],
}));

describe('sitemap', () => {
  beforeEach(() => {
    getProducts.mockClear();
  });

  it('incluye una entrada por producto', async () => {
    const { default: sitemap } = await import('./sitemap');
    const urls = (await sitemap()).map((entrada) => entrada.url);

    const deProducto = urls.filter((url) => url.includes('/catalog/producto-'));

    expect(deProducto).toHaveLength(TOTAL_PRODUCTOS);
    expect(deProducto[0]).toContain('/catalog/producto-1-');
  });

  it('no pide páginas más grandes de lo que la API admite', async () => {
    const { default: sitemap } = await import('./sitemap');
    await sitemap();

    expect(getProducts).toHaveBeenCalled();
    for (const [filtros] of getProducts.mock.calls) {
      expect(filtros.limit).toBeLessThanOrEqual(MAX_PAGE_LIMIT);
    }
  });

  it('recorre todas las páginas, no solo la primera', async () => {
    const { default: sitemap } = await import('./sitemap');
    await sitemap();

    const paginasPedidas = getProducts.mock.calls.map(([f]) => f.page);

    expect(paginasPedidas).toContain(1);
    expect(paginasPedidas).toContain(2);
  });

  it('sigue dando un sitemap si la API falla, sin entradas de producto', async () => {
    getProducts.mockRejectedValueOnce(new Error('la API no contesta'));

    const { default: sitemap } = await import('./sitemap');
    const urls = (await sitemap()).map((entrada) => entrada.url);

    expect(urls.some((url) => url.endsWith('/catalog'))).toBe(true);
    expect(urls.some((url) => url.includes('/catalog/producto-'))).toBe(false);
  });
});
