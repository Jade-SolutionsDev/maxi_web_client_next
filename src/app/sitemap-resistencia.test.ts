import { beforeEach, describe, expect, it, vi } from 'vitest';

const getProducts = vi.fn(async () => ({
  items: [],
  total: 0,
  page: 1,
  limit: 100,
  totalPages: 0,
}));
const getCmsPages = vi.fn(async () => [{ slug: 'politica-de-cookies' }]);
const getDepartments = vi.fn(async () => [{ slug: 'alimentos' }]);

vi.mock('@/feature/product/service/product.service', () => ({
  getProducts: () => getProducts(),
}));
vi.mock('@/shared/cms/service/cms.service', () => ({
  getCmsPages: () => getCmsPages(),
  hasFaqContent: async () => true,
}));
vi.mock('@/shared/taxonomy/service/taxonomy.service', () => ({
  getDepartments: () => getDepartments(),
}));

const rutas = async () => {
  const { default: sitemap } = await import('./sitemap');
  return (await sitemap()).map((e) => e.url);
};

describe('el sitemap aguanta que una de sus fuentes falle', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getCmsPages.mockResolvedValue([{ slug: 'politica-de-cookies' }]);
    getDepartments.mockResolvedValue([{ slug: 'alimentos' }]);
  });

  it('si el CMS no contesta, sigue habiendo sitemap', async () => {
    getCmsPages.mockRejectedValueOnce(new Error('el CMS no contesta'));

    const urls = await rutas();

    expect(urls.some((u) => u.endsWith('/catalog'))).toBe(true);
    expect(urls.some((u) => u.includes('/paginas/'))).toBe(false);
  });

  it('un bloque que falla queda anotado, no en silencio', async () => {
    const consola = vi.spyOn(console, 'error').mockImplementation(() => {});
    getDepartments.mockRejectedValueOnce(new Error('la API no contesta'));

    await rutas();

    expect(consola).toHaveBeenCalledWith(
      expect.stringContaining('[sitemap] sin entradas de departamentos'),
    );
  });
});
