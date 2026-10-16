import { describe, expect, it } from 'vitest';
import { buildProductDetailHref } from '@/feature/product/constants/product-detail-href';
import { esFichaImposible } from './ficha-imposible';

const UUID = '256f095c-9a08-4f7e-bc0e-57fffbbd54b9';

describe('esFichaImposible', () => {
  it('no se separa de la forma que construye los enlaces', () => {
    // El doble de esta prueba no es un objeto simulado: es la **función de
    // verdad** que arma los enlaces. Si alguien cambia la forma de la
    // dirección, esta prueba cae antes de que el middleware empiece a devolver
    // 404 a fichas que existen.
    const casos = [
      { id: UUID, slug: 'isogas-premium' },
      { id: UUID, slug: 'cerveza cristal con espacios' },
      { id: UUID, slug: '' },
      { id: UUID, slug: '   ' },
    ];

    for (const producto of casos) {
      expect(esFichaImposible(buildProductDetailHref(producto))).toBe(false);
    }
  });

  it('descarta lo que no puede ser una ficha', () => {
    expect(esFichaImposible('/catalog/slug-inventado')).toBe(true);
    expect(esFichaImposible('/catalog/isogas-premium')).toBe(true);
    expect(esFichaImposible(`/catalog/${UUID.slice(0, -1)}`)).toBe(true);
    expect(esFichaImposible('/catalog/100%')).toBe(true);
  });

  it('acepta el identificador escrito a mano, con y sin barra final', () => {
    expect(esFichaImposible(`/catalog/${UUID}`)).toBe(false);
    expect(esFichaImposible(`/catalog/${UUID}/`)).toBe(false);
    expect(esFichaImposible(`/catalog/${UUID.toUpperCase()}`)).toBe(false);
  });

  it('acepta el identificador con el slug codificado en la url', () => {
    expect(esFichaImposible(`/catalog/caf%C3%A9-molido-${UUID}`)).toBe(false);
  });

  it('no toca ninguna otra ruta', () => {
    for (const ruta of [
      '/catalog',
      '/catalog/',
      '/',
      '/paginas/politica-de-cookies',
      '/categorias',
      '/catalog/algo/mas-hondo',
      '/seguimiento/no-existe',
    ]) {
      expect(esFichaImposible(ruta)).toBe(false);
    }
  });
});
