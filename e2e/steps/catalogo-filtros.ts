import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import {
  API,
  invalidarCatalogo,
  municipioConCobertura,
  productoSembrado,
  registrarProducto,
  sembrarProducto,
  sql,
} from '../helpers';

const { Given, When, Then } = createBdd();

Given(
  'que existe un producto {string} de US${int} con {int} unidades',
  async ({}, nombre: string, precio: number, unidades: number) => {
    sembrarConExistencias(nombre, precio, 0, unidades);
  },
);

Given(
  'que existe un producto {string} de US${int} con {int} unidades y un {int}% de rebaja',
  async (
    {},
    nombre: string,
    precio: number,
    unidades: number,
    rebaja: number,
  ) => {
    sembrarConExistencias(nombre, precio, rebaja, unidades);
  },
);

Given(
  'que existen {int} productos con existencias',
  async ({}, cuantos: number) => {
    for (let i = 1; i <= cuantos; i++) {
      sembrarConExistencias(`Fila ${String(i).padStart(2, '0')}`, 100, 0, 5);
    }
    await invalidarCatalogo();
  },
);

function sembrarConExistencias(
  nombre: string,
  precio: number,
  rebaja: number,
  unidades: number,
  grupo = '',
) {
  const sembrado = registrarProducto(
    nombre,
    sembrarProducto(nombre, rebaja, precio, grupo),
  );
  const almacen = sql(
    'SELECT id FROM stock_locations WHERE is_active ORDER BY created_at LIMIT 1',
  );
  sql(
    `INSERT INTO inventory (location_id, product_id, quantity) VALUES ('${almacen}', '${sembrado.id}', ${unidades})`,
  );
  return sembrado;
}

Given(
  'que existe un producto {string} de US${int} con {int} unidades en el departamento {string}',
  async (
    {},
    nombre: string,
    precio: number,
    unidades: number,
    grupo: string,
  ) => {
    sembrarConExistencias(nombre, precio, 0, unidades, grupo);
  },
);

When(
  'filtra por el departamento de {string}',
  async ({ page }, nombre: string) => {
    const producto = productoSembrado(nombre);
    await page
      .getByRole('checkbox', { name: producto.departamentoNombre })
      .first()
      .click();
    await expect(page).toHaveURL(/department=/, { timeout: 15_000 });
  },
);

/**
 * El tope de precio se arrastra, no se teclea: cada pulsacion mueve un paso de
 * 10 sobre un maximo de 1000 —cincuenta pulsaciones y cincuenta navegaciones
 * para llegar a la mitad—, mientras que un arrastre es un gesto y una sola
 * escritura en la URL, que es cuando el filtro se aplica.
 */
When('baja el precio máximo a la mitad', async ({ page }) => {
  const tope = page.getByRole('slider').last();
  const marco = await tope.boundingBox();
  const barra = await page.getByRole('group').first().boundingBox();
  if (!marco || !barra) throw new Error('No se encontro la barra de precio');

  await page.mouse.move(marco.x + marco.width / 2, marco.y + marco.height / 2);
  await page.mouse.down();
  await page.mouse.move(barra.x + barra.width / 2, marco.y + marco.height / 2, {
    steps: 10,
  });
  await page.mouse.up();

  await expect(page).toHaveURL(/maxPrice=5\d0/, { timeout: 15_000 });
});

When('ordena por {string}', async ({ page }, criterio: string) => {
  await page.getByRole('combobox', { name: /ordenar productos/i }).click();
  const opcion = page
    .locator('[role=option]:visible')
    .filter({ hasText: criterio });
  await opcion.first().click();
  await expect(page).toHaveURL(/sortBy=/, { timeout: 15_000 });
});

When('filtra por productos en oferta', async ({ page }) => {
  await page.getByRole('checkbox', { name: /productos en oferta/i }).click();
  await expect(page).toHaveURL(/onSale=true/, { timeout: 15_000 });
});

When('pasa a la segunda página', async ({ page }) => {
  await enlaceAPagina2(page).click();
  await expect(page).toHaveURL(/page=2/, { timeout: 15_000 });
});

Then(
  'el primer producto de la lista es {string}',
  async ({ page }, nombre: string) => {
    const primero = tarjetas(page).first();
    await expect(primero).toBeVisible({ timeout: 15_000 });
    await expect(primero).toContainText(nombre);
  },
);

Then(
  'la lista muestra {int} producto(s)',
  async ({ page }, cuantos: number) => {
    await expect
      .poll(() => tarjetas(page).count(), { timeout: 15_000 })
      .toBe(cuantos);
  },
);

Then('hay una segunda página', async ({ page }) => {
  await expect(enlaceAPagina2(page)).toBeVisible({ timeout: 15_000 });
});

/** Por su destino, que no depende de como se llame el enlace. */
const enlaceAPagina2 = (page: import('@playwright/test').Page) =>
  page.locator('main a[href*="page=2"]').first();

const tarjetas = (page: import('@playwright/test').Page) =>
  page.getByRole('listitem').filter({ has: page.locator('article') });
