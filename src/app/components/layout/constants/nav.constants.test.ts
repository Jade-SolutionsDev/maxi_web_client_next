import { describe, expect, it } from 'vitest';
import { navItems, sheetNavItems } from './nav.constants';

describe('navegación de la tienda', () => {
  it('incluye Preguntas frecuentes en la navegación principal y móvil', () => {
    const faqItem = navItems.find(
      ({ href }) => href === '/preguntas-frecuentes',
    );

    expect(faqItem).toMatchObject({ label: 'Preguntas frecuentes' });
    expect(sheetNavItems).toContainEqual(faqItem);
  });
});
