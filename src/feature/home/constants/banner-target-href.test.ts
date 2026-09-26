import { describe, expect, it } from 'vitest';
import { bannerTargetHref } from './banner-target-href';

const PRODUCT_ID = '33333333-3333-4333-8333-333333333333';

describe('bannerTargetHref', () => {
  it('keeps banners without a destination as plain images', () => {
    expect(bannerTargetHref(null)).toBeNull();
  });

  it('builds the existing product detail route', () => {
    expect(
      bannerTargetHref({
        type: 'product',
        id: PRODUCT_ID,
        slug: 'arroz-selecto',
      }),
    ).toBe(`/catalog/arroz-selecto-${PRODUCT_ID}`);
  });

  it('builds the existing category filter route', () => {
    expect(
      bannerTargetHref({
        type: 'category',
        id: '55555555-5555-4555-8555-555555555555',
        slug: 'arroces',
      }),
    ).toBe('/catalog?category=arroces');
  });

  it('builds the existing department filter route', () => {
    expect(
      bannerTargetHref({
        type: 'department',
        id: '22222222-2222-4222-8222-222222222222',
        slug: 'alimentos',
      }),
    ).toBe('/catalog?department=alimentos');
  });
});
