import { describe, expect, it } from 'vitest';
import { buildCatalogSearchHref, CATALOG_PATH } from './catalog-search-href';

const noParams = () => new URLSearchParams();

describe('buildCatalogSearchHref', () => {
  it('sends a search from another route to a clean catalog', () => {
    expect(buildCatalogSearchHref('arroz', '/', noParams())).toBe(
      '/catalog?q=arroz',
    );
  });

  it('trims the query', () => {
    expect(buildCatalogSearchHref('  arroz  ', '/', noParams())).toBe(
      '/catalog?q=arroz',
    );
  });

  it('drops a blank query instead of writing an empty param', () => {
    expect(buildCatalogSearchHref('   ', '/', noParams())).toBe(CATALOG_PATH);
  });

  it('keeps the active catalog filters when searching from the catalog', () => {
    const current = new URLSearchParams({
      categoryId: 'cat-1',
      sortBy: 'price',
      sortOrder: 'asc',
    });

    const href = buildCatalogSearchHref('arroz', CATALOG_PATH, current);
    const params = new URL(href, 'http://localhost').searchParams;

    expect(params.get('q')).toBe('arroz');
    expect(params.get('categoryId')).toBe('cat-1');
    expect(params.get('sortBy')).toBe('price');
    expect(params.get('sortOrder')).toBe('asc');
  });

  it('clears only the search term on an empty submit from the catalog', () => {
    const current = new URLSearchParams({ q: 'arroz', categoryId: 'cat-1' });

    const href = buildCatalogSearchHref('', CATALOG_PATH, current);
    const params = new URL(href, 'http://localhost').searchParams;

    expect(params.has('q')).toBe(false);
    expect(params.get('categoryId')).toBe('cat-1');
  });

  it('discards the current filters when searching from another route', () => {
    const current = new URLSearchParams({ categoryId: 'cat-1' });

    expect(buildCatalogSearchHref('arroz', '/categorias', current)).toBe(
      '/catalog?q=arroz',
    );
  });
});
