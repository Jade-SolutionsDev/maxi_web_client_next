import { describe, expect, it } from 'vitest';
import type {
  CmsPageResponse,
  HomeNoticeResponse,
} from '../type/cms.interface';
import {
  toCmsPageLinks,
  toHomeNotices,
  toPublishedCmsPage,
} from './cms.adapter';

const page = (overrides: Partial<CmsPageResponse> = {}): CmsPageResponse => ({
  id: 'page-1',
  slug: 'terminos-y-condiciones',
  title: ' Términos y condiciones ',
  content: '# Términos\n\n- Uno',
  sortOrder: 0,
  isActive: true,
  updatedAt: '2026-09-30T10:00:00.000Z',
  ...overrides,
});

const notice = (
  overrides: Partial<HomeNoticeResponse> = {},
): HomeNoticeResponse => ({
  id: 'notice-1',
  title: ' Cerrado el lunes ',
  content: 'No hay entregas el **lunes**.',
  startsAt: null,
  endsAt: null,
  ...overrides,
});

describe('toPublishedCmsPage', () => {
  it('keeps a page that has something to say', () => {
    expect(toPublishedCmsPage(page())).toEqual({
      id: 'page-1',
      slug: 'terminos-y-condiciones',
      title: 'Términos y condiciones',
      content: '# Términos\n\n- Uno',
    });
  });

  it('treats a page with no text as missing, so it never renders empty', () => {
    expect(toPublishedCmsPage(page({ content: ' \n\t ' }))).toBeNull();
  });
});

describe('toCmsPageLinks', () => {
  it('drops the pages without text, so no link leads to an empty page', () => {
    expect(
      toCmsPageLinks([
        page(),
        page({ slug: 'politica-de-privacidad', content: '   ' }),
      ]),
    ).toEqual([
      { slug: 'terminos-y-condiciones', title: 'Términos y condiciones' },
    ]);
  });
});

describe('toHomeNotices', () => {
  it('keeps the notices with text, trimmed', () => {
    expect(
      toHomeNotices([notice(), notice({ id: 'notice-2', content: '  ' })]),
    ).toEqual([
      {
        id: 'notice-1',
        title: 'Cerrado el lunes',
        content: 'No hay entregas el **lunes**.',
      },
    ]);
  });
});
