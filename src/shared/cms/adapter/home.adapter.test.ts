import { describe, expect, it } from 'vitest';
import { DEFAULT_HOME_CONTENT } from '../constants/home.constants';
import type { CmsHomeResponse } from '../type/cms.interface';
import { toHomeContent } from './home.adapter';

const asset = { src: '/banner.jpg', width: 1200, height: 400 };

const response = (
  overrides: Partial<CmsHomeResponse> = {},
): CmsHomeResponse => ({
  sections: [
    { key: 'services', isVisible: true },
    { key: 'hero', isVisible: true },
    { key: 'departments', isVisible: false },
  ],
  featuredProductIds: ['p2', 'p1'],
  featuredDepartmentIds: ['d1'],
  banners: [
    {
      id: 'banner-1',
      alt: ' Ofertas de la semana ',
      title: ' Todo para el hogar ',
      subtitle: '   ',
      desktop: asset,
      tablet: asset,
      mobile: asset,
      target: null,
    },
  ],
  ...overrides,
});

describe('toHomeContent', () => {
  it('keeps the visible sections in the order the editor chose', () => {
    expect(toHomeContent(response()).sections).toEqual(['services', 'hero']);
  });

  it('ignores sections this storefront does not know how to render', () => {
    const content = toHomeContent(
      response({
        sections: [
          { key: 'newsletter', isVisible: true },
          { key: 'categories', isVisible: true },
        ],
      }),
    );

    expect(content.sections).toEqual(['categories']);
  });

  it('falls back to the default order when no known section arrives', () => {
    const content = toHomeContent(response({ sections: [] }));

    expect(content.sections).toEqual(DEFAULT_HOME_CONTENT.sections);
  });

  it('passes the curated selections through in order', () => {
    const content = toHomeContent(response());

    expect(content.featuredProductIds).toEqual(['p2', 'p1']);
    expect(content.featuredDepartmentIds).toEqual(['d1']);
  });

  it('trims the banner text and drops the blank parts', () => {
    const [banner] = toHomeContent(response()).banners;

    expect(banner.alt).toBe('Ofertas de la semana');
    expect(banner.title).toBe('Todo para el hogar');
    expect(banner.subtitle).toBeUndefined();
  });
});
