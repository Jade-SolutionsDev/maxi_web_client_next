import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { sql } from '../helpers';
import { iniciarSesion } from '../setup/acceso';

const { When, Then, After } = createBdd();

const CORREO_CLIENTE = 'qa.direcciones@maxihabana.com';

/** El dialogo de dirección, localizado por el campo que solo el tiene. */
const formularioDireccion = (page: import('@playwright/test').Page) =>
  page
    .locator('[role=dialog]')
    .filter({ has: page.locator('input[name="street"]') });

When('abre sus direcciones', async ({ page }) => {
  await page.goto('/direcciones');
});

When('abre el formulario de nueva dirección', async ({ page }) => {
  await page
    .getByRole('button', { name: /añadir dirección/i })
    .first()
    .click();
  await expect(formularioDireccion(page)).toBeVisible({ timeout: 15_000 });
});

When(
  'escribe {string} en {string}',
  async ({ page }, valor: string, campo: string) => {
    await formularioDireccion(page)
      .getByLabel(campo, { exact: false })
      .fill(valor);
  },
);

When('pulsa guardar la dirección', async ({ page }) => {
  await formularioDireccion(page)
    .getByRole('button', { name: /guardar dirección/i })
    .click();
});

When('cierra la sesión', async ({ page }) => {
  await page.getByRole('button', { name: /men[úu] de usuario/i }).click();
  await page.getByRole('menuitem', { name: /cerrar sesión/i }).click();

  const confirmacion = page
    .locator('[role=dialog]')
    .filter({ hasText: /cerrar sesión/i });
  await confirmacion.getByRole('button', { name: /cerrar sesión/i }).click();
  await expect(page).toHaveURL(/localhost:3001\/$/, { timeout: 20_000 });
});

Then('se le avisa {string}', async ({ page }, mensaje: string) => {
  await expect(page.getByText(mensaje, { exact: false }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then('no se guarda ninguna dirección', async () => {
  const cuantas = sql(
    `SELECT count(*) FROM client_addresses WHERE client_id IN (SELECT id FROM clients WHERE email = '${CORREO_CLIENTE}') AND deleted_at IS NULL`,
  );
  expect(cuantas).toBe('0');
});

/**
 * Cerrar sesion la revoca en Clerk, y la revocada es justo la sesion que
 * comparten los demas escenarios @sesion. Este repone al terminar lo que
 * gasta, igual que los que limpian la base.
 */
After({ tags: '@cierra-sesion' }, async ({ page, context }) => {
  await iniciarSesion(page, context);
});
