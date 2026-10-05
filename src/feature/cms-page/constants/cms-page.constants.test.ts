import { describe, expect, it } from 'vitest';
import { cmsPageHref, hasDedicatedRoute } from './cms-page.constants';

describe('cmsPageHref', () => {
  it('links info pages under /paginas', () => {
    expect(cmsPageHref('terminos-y-condiciones')).toBe(
      '/paginas/terminos-y-condiciones',
    );
  });

  it('links the texts that have their own page to that page', () => {
    expect(cmsPageHref('sobre-nosotros')).toBe('/sobre-nosotros');
    expect(cmsPageHref('contacto')).toBe('/contacto');
  });
});

describe('hasDedicatedRoute', () => {
  it('tells apart the texts shown on their own page', () => {
    expect(hasDedicatedRoute('contacto')).toBe(true);
    expect(hasDedicatedRoute('politica-de-privacidad')).toBe(false);
  });
});
