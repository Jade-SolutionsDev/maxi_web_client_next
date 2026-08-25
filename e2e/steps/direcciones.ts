import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { sql } from '../helpers';

const { Given, When, Then } = createBdd();

/** Tarjeta de una direccion, localizada por su nombre visible. */
const tarjeta = (page: import('@playwright/test').Page, nombre: string) =>
  page.locator('article').filter({ hasText: nombre });

Given('que el cliente no tiene ninguna dirección guardada', async () => {
  sql(
    "DELETE FROM client_addresses WHERE client_id IN (SELECT id FROM clients WHERE email = 'qa.direcciones@maxihabana.com')",
  );
});

When(
  'guarda una dirección llamada {string} en la calle {string}',
  async ({ page }, nombre: string, calle: string) => {
    await page
      .getByRole('button', { name: /añadir dirección/i })
      .first()
      .click();

    const dialogo = page
      .locator('[role=dialog]')
      .filter({ has: page.locator('input[name="street"]') });
    await dialogo.locator('input[name="label"]').fill(nombre);
    await dialogo.locator('input[name="street"]').fill(calle);

    // Provincia primero: al elegirla se habilita el municipio.
    await elegirOpcion(dialogo, 0);
    await elegirOpcion(dialogo, 1);

    await dialogo.getByRole('button', { name: /guardar dirección/i }).click();
    await expect(dialogo).toBeHidden({ timeout: 15_000 });
    await expect(tarjeta(page, nombre).first()).toBeVisible();
  },
);

/**
 * Los desplegables son de Base UI: el disparador es un `combobox` y las
 * opciones viven en un popup fuera del dialogo. En este formulario hay dos, en
 * orden: provincia y municipio.
 */
async function elegirOpcion(
  dialogo: import('@playwright/test').Locator,
  indiceCampo: number,
) {
  const disparador = dialogo.getByRole('combobox').nth(indiceCampo);
  await expect(disparador).toBeEnabled({ timeout: 10_000 });
  await disparador.click();

  /**
   * `:visible` no sobra: el popup del desplegable anterior sigue montado y sus
   * opciones tambien responden al selector, aunque nadie las vea.
   */
  const opciones = dialogo.page().locator('[role=option]:visible');
  await opciones.first().waitFor({ state: 'visible', timeout: 10_000 });
  const elegida = (await opciones.first().innerText()).trim();
  await opciones.first().click();

  // Se cierra al elegir: el disparador pasa a mostrar lo elegido.
  await expect(disparador).toContainText(elegida, { timeout: 10_000 });
}

When('marca {string} como predeterminada', async ({ page }, nombre: string) => {
  await tarjeta(page, nombre)
    .getByRole('button', { name: /predeterminada/i })
    .click();
  await expect(tarjeta(page, nombre).getByText(/^Predeterminada$/)).toBeVisible(
    { timeout: 15_000 },
  );
});

When(
  'pulsa borrar en la dirección {string}',
  async ({ page }, nombre: string) => {
    await tarjeta(page, nombre)
      .getByRole('button', { name: /borrar/i })
      .click();
  },
);

When('borra la dirección {string}', async ({ page }, nombre: string) => {
  await tarjeta(page, nombre)
    .getByRole('button', { name: /borrar/i })
    .click();
  const confirmacion = page
    .locator('[role=dialog]')
    .filter({ hasText: /borrar dirección/i });
  await confirmacion.getByRole('button', { name: /^borrar$/i }).click();
  await expect(tarjeta(page, nombre)).toHaveCount(0, { timeout: 15_000 });
});

Then(
  'se le dice que todavía no tiene direcciones guardadas',
  async ({ page }) => {
    await expect(
      page.getByText(/todavía no tienes direcciones guardadas/i),
    ).toBeVisible();
  },
);

Then('ve la dirección {string}', async ({ page }, nombre: string) => {
  await expect(tarjeta(page, nombre).first()).toBeVisible();
});

Then('no ve la dirección {string}', async ({ page }, nombre: string) => {
  await expect(tarjeta(page, nombre)).toHaveCount(0);
});

Then('ve la calle {string}', async ({ page }, calle: string) => {
  await expect(page.getByText(calle).first()).toBeVisible();
});

Then('ve su municipio y provincia', async ({ page }) => {
  // La API devuelve ambos resueltos: la tarjeta los imprime separados por coma.
  await expect(
    page.getByText(/,\s*(La Habana|Artemisa)/).first(),
  ).toBeVisible();
});

Then(
  'la dirección {string} está marcada como predeterminada',
  async ({ page }, nombre: string) => {
    await expect(
      tarjeta(page, nombre).getByText(/^Predeterminada$/),
    ).toBeVisible();
  },
);

Then(
  'la dirección {string} no está marcada como predeterminada',
  async ({ page }, nombre: string) => {
    await expect(
      tarjeta(page, nombre).getByText(/^Predeterminada$/),
    ).toHaveCount(0);
  },
);

Then('se le pide confirmación antes de borrar', async ({ page }) => {
  await expect(
    page.locator('[role=dialog]').filter({ hasText: /borrar dirección/i }),
  ).toBeVisible();
});
