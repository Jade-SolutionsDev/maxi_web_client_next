import { expect, test } from '@playwright/test';
import { API, TIENDA, invalidarCatalogo, municipioConCobertura, sql } from './helpers';

/**
 * El camino que de verdad importa: lo que existe en el catalogo tiene que verse
 * en la tienda, y lo que no debe verse no puede colarse.
 *
 * Siembra por SQL en vez de por la interfaz de administracion a proposito: aqui
 * se prueba que la tienda refleja el catalogo. Crear el catalogo desde el admin
 * es otra prueba, con su propio login.
 */

const SUFIJO = Date.now().toString().slice(-6);
const PRODUCTO = `Cola E2E ${SUFIJO}`;
const OCULTO = `Agotado E2E ${SUFIJO}`;

test.describe('el catalogo llega a la tienda', () => {
  test.beforeAll(async () => {
    const almacen = sql(
      "SELECT id FROM stock_locations WHERE is_active ORDER BY created_at LIMIT 1",
    );
    expect(almacen, 'hace falta un almacen activo con cobertura').toBeTruthy();

    const departamento = sql(`
      INSERT INTO categories (name, slug, parent_id, image_desktop_url, image_mobile_url)
      VALUES ('Bebidas E2E ${SUFIJO}', 'bebidas-e2e-${SUFIJO}', NULL, 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png')
      RETURNING id`);
    const categoria = sql(`
      INSERT INTO categories (name, slug, parent_id, image_desktop_url, image_mobile_url)
      VALUES ('Refrescos E2E ${SUFIJO}', 'refrescos-e2e-${SUFIJO}', '${departamento}', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png')
      RETURNING id`);

    // Uno con existencias: debe verse. Otro sin ellas: no debe.
    const visible = sql(`
      INSERT INTO products (category_id, sku, name, slug, measure_unit, base_price, discount, image_url)
      VALUES ('${categoria}', 'E2E-${SUFIJO}', '${PRODUCTO}', 'cola-e2e-${SUFIJO}', 'unidad', 100, 20, 'https://placehold.co/600x400.png')
      RETURNING id`);
    sql(`
      INSERT INTO products (category_id, sku, name, slug, measure_unit, base_price, discount, image_url)
      VALUES ('${categoria}', 'E2E-OUT-${SUFIJO}', '${OCULTO}', 'agotado-e2e-${SUFIJO}', 'unidad', 50, 0, 'https://placehold.co/600x400.png')`);
    sql(`INSERT INTO inventory (location_id, product_id, quantity) VALUES ('${almacen}', '${visible}', 25)`);

    await invalidarCatalogo();
  });

  test.afterAll(async () => {
    sql(`DELETE FROM inventory WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'E2E-%${SUFIJO}')`);
    sql(`DELETE FROM products WHERE sku LIKE '%${SUFIJO}'`);
    sql(`DELETE FROM categories WHERE slug LIKE '%e2e-${SUFIJO}'`);
    await invalidarCatalogo();
  });

  test('la tienda y la API responden', async ({ request }) => {
    expect((await request.get(`${API}/api/health`)).status()).toBe(200);
    expect((await request.get(`${TIENDA}/`)).status()).toBe(200);
  });

  test('la API ofrece el producto con existencias y esconde el agotado', async ({ request }) => {
    const res = await request.get(`${API}/api/public/products`);
    expect(res.status()).toBe(200);
    const nombres = (await res.json()).data.items.map((p: { name: string }) => p.name);

    expect(nombres).toContain(PRODUCTO);
    expect(nombres).not.toContain(OCULTO);
  });

  test('el precio rebajado que sirve la API es el calculado, no el base', async ({ request }) => {
    const res = await request.get(`${API}/api/public/products`);
    const item = (await res.json()).data.items.find(
      (p: { name: string }) => p.name === PRODUCTO,
    );

    expect(item.basePrice).toBe(100);
    expect(item.discount).toBe(20);
    expect(item.finalPrice).toBe(80);
  });

  test('el producto aparece en el catalogo de la tienda, y el agotado no', async ({ page, context }) => {
    // La tienda pide zona antes de mostrar nada: se la damos por cookie.
    await context.addCookies([
      {
        name: 'maxi_location',
        value: municipioConCobertura(),
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto(`${TIENDA}/catalog`);
    await expect(page.getByText(PRODUCTO)).toBeVisible();
    await expect(page.getByText(OCULTO)).toHaveCount(0);
  });

  test('desde el catalogo se llega a la ficha, con su precio rebajado', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'maxi_location',
        value: municipioConCobertura(),
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto(`${TIENDA}/catalog`);

    // Se navega pulsando, como haria una persona: asi la prueba no depende de
    // como se construya la URL de la ficha.
    await page.getByText(PRODUCTO).first().click();

    await expect(page.getByText(PRODUCTO).first()).toBeVisible();
    // 80 = 100 con el 20% de rebaja, calculado por el backend.
    await expect(page.getByText('80', { exact: false }).first()).toBeVisible();
  });
});
