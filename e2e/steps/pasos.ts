import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { API, invalidarCatalogo, municipioConCobertura, sql } from '../helpers';

const { Given, When, Then, Before, After } = createBdd();

/**
 * Estado compartido entre los pasos de un escenario. Es seguro tenerlo en el
 * modulo porque la suite corre en serie (`workers: 1`): los escenarios no se
 * solapan.
 */
type Estado = {
  sufijo: string;
  productos: Map<string, { slug: string; nombreReal: string }>;
  respuestaApi?: { items: Array<Record<string, unknown>> };
  ultimoEstadoHttp?: number;
};

let estado: Estado;

Before(() => {
  estado = { sufijo: Date.now().toString().slice(-8), productos: new Map() };
});

After(() => {
  // Cada escenario se lleva lo que sembro.
  sql(`DELETE FROM inventory WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'E2E-${estado.sufijo}%')`);
  sql(`DELETE FROM products WHERE sku LIKE 'E2E-${estado.sufijo}%'`);
  sql(`DELETE FROM categories WHERE slug LIKE '%-e2e-${estado.sufijo}'`);
});

// ---------------------------------------------------------------- Antecedentes

Given('que el cliente ha elegido una zona con entrega', async ({ context }) => {
  await context.addCookies([
    {
      name: 'maxi_location',
      value: municipioConCobertura(),
      domain: 'localhost',
      path: '/',
    },
  ]);
});

Given('que el cliente no ha elegido zona', async ({ context }) => {
  await context.clearCookies();
});

Given(
  'que existe un producto {string} con {int} unidades y un {int}% de rebaja',
  async ({}, nombre: string, unidades: number, rebaja: number) => {
    const { id, slug, nombreReal } = sembrarProducto(nombre, rebaja);
    const almacen = sql(
      "SELECT id FROM stock_locations WHERE is_active ORDER BY created_at LIMIT 1",
    );
    sql(`INSERT INTO inventory (location_id, product_id, quantity) VALUES ('${almacen}', '${id}', ${unidades})`);
    estado.productos.set(nombre, { slug, nombreReal });
    await invalidarCatalogo();
  },
);

Given('que existe un producto {string} sin existencias', async ({}, nombre: string) => {
  const { slug, nombreReal } = sembrarProducto(nombre, 0);
  estado.productos.set(nombre, { slug, nombreReal });
  await invalidarCatalogo();
});

function sembrarProducto(nombre: string, rebaja: number) {
  const s = estado.sufijo;
  const base = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let categoria = sql(`SELECT id FROM categories WHERE slug = 'cat-e2e-${s}'`);
  if (!categoria) {
    const departamento = sql(`
      INSERT INTO categories (name, slug, parent_id, image_desktop_url, image_mobile_url)
      VALUES ('Dep E2E ${s}', 'dep-e2e-${s}', NULL, 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png')
      RETURNING id`);
    categoria = sql(`
      INSERT INTO categories (name, slug, parent_id, image_desktop_url, image_mobile_url)
      VALUES ('Cat E2E ${s}', 'cat-e2e-${s}', '${departamento}', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png')
      RETURNING id`);
  }
  const nombreReal = `${nombre} E2E ${s}`;
  const slug = `${base}-e2e-${s}`;
  const id = sql(`
    INSERT INTO products (category_id, sku, name, slug, measure_unit, base_price, discount, image_url)
    VALUES ('${categoria}', 'E2E-${s}-${base}', '${nombreReal}', '${slug}', 'unidad', 100, ${rebaja}, 'https://placehold.co/600x400.png')
    RETURNING id`);
  return { id, slug, nombreReal };
}

// ------------------------------------------------------------------- Acciones

When('el cliente abre el catálogo', async ({ page }) => {
  await page.goto('/catalog');
});

When('el cliente abre {string}', async ({ page }, ruta: string) => {
  const res = await page.goto(ruta);
  estado.ultimoEstadoHttp = res?.status();
});

When('pulsa sobre el producto {string}', async ({ page }, nombre: string) => {
  const producto = estado.productos.get(nombre);
  await page.getByText(producto!.nombreReal).first().click();
});

When('el cliente busca {string} en el catálogo', async ({ page }, termino: string) => {
  const producto = estado.productos.get(termino);
  const texto = producto ? producto.nombreReal : termino;
  await page.goto(`/catalog?q=${encodeURIComponent(texto)}`);
});

When('se consultan los productos públicos de la API', async ({ request }) => {
  const res = await request.get(`${API}/api/public/products`);
  expect(res.status()).toBe(200);
  estado.respuestaApi = (await res.json()).data;
});

// ---------------------------------------------------------- Comprobaciones

Then('ve el producto {string}', async ({ page }, nombre: string) => {
  const producto = estado.productos.get(nombre);
  await expect(page.getByText(producto!.nombreReal).first()).toBeVisible();
});

Then('no ve el producto {string}', async ({ page }, nombre: string) => {
  const producto = estado.productos.get(nombre);
  await expect(page.getByText(producto!.nombreReal)).toHaveCount(0);
});

Then('ve el precio {string}', async ({ page }, precio: string) => {
  await expect(page.getByText(precio, { exact: false }).first()).toBeVisible();
});

Then('la página sigue funcionando', async ({ page }) => {
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.getByText('Algo salió mal')).toHaveCount(0);
});

Then('la respuesta incluye {string}', async ({}, nombre: string) => {
  const producto = estado.productos.get(nombre);
  const nombres = estado.respuestaApi!.items.map((p) => p.name);
  expect(nombres).toContain(producto!.nombreReal);
});

Then('la respuesta no incluye {string}', async ({}, nombre: string) => {
  const producto = estado.productos.get(nombre);
  const nombres = estado.respuestaApi!.items.map((p) => p.name);
  expect(nombres).not.toContain(producto!.nombreReal);
});

Then(
  '{string} tiene precio base {int}, rebaja {int} y precio final {int}',
  async ({}, nombre: string, base: number, rebaja: number, final: number) => {
    const producto = estado.productos.get(nombre);
    const item = estado.respuestaApi!.items.find(
      (p) => p.name === producto!.nombreReal,
    );
    expect(item).toBeDefined();
    expect(item!.basePrice).toBe(base);
    expect(item!.discount).toBe(rebaja);
    expect(item!.finalPrice).toBe(final);
  },
);

Then('la página muestra el título {string}', async ({ page }, titulo: string) => {
  await expect(page.getByRole('heading', { name: titulo, level: 1 })).toBeVisible();
});

Then('acaba en la pantalla de acceso', async ({ page }) => {
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
});

Then('la respuesta es un 404', async ({ page }) => {
  expect(estado.ultimoEstadoHttp).toBe(404);
  await expect(page.getByText('404').first()).toBeVisible();
});

Then(
  'la portada muestra las secciones de destacados, ofertas y recientes',
  async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Productos destacados' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'En oferta' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Nuestros productos más recientes' }),
    ).toBeVisible();
  },
);

Then('se le pide que elija su zona', async ({ page }) => {
  await expect(page.getByText('¿Dónde estás?')).toBeVisible();
});

Then('no se le pide que elija su zona', async ({ page }) => {
  await expect(page.getByText('¿Dónde estás?')).toHaveCount(0);
});

Then('la cabecera muestra su zona', async ({ page }) => {
  await expect(page.getByText('Disponible en:')).toBeVisible();
});
