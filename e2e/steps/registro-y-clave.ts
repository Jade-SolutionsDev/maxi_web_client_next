import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import {
  borrarCuentaPorCorreo,
  CODIGO_DE_PRUEBA,
  correoDePrueba,
  crearCuenta,
  correoDePrueba as haz,
} from '../clerk';

const { Given, When, Then, Before, After } = createBdd();

/**
 * Clerk pone un captcha de Cloudflare en el registro. En una instancia de
 * desarrollo se salta con un token de prueba, que es justo para lo que Clerk
 * publica `@clerk/testing`.
 */
Before({ tags: '@captcha' }, async ({ page }) => {
  await setupClerkTestingToken({ page });
});

const CLAVE_VIEJA = 'MaxiTemporal2026';
const CLAVE_NUEVA = 'MaxiTemporal2027';

/** El correo que usa el escenario en curso; se borra al terminar. */
let correo = '';

Given('que ya existe una cuenta de prueba', async () => {
  correo = correoDePrueba(`qa.temp.${Date.now().toString().slice(-8)}`);
  await crearCuenta(correo, CLAVE_VIEJA);
});

When('rellena el registro con una cuenta nueva', async ({ page }) => {
  correo = haz(`qa.nuevo.${Date.now().toString().slice(-8)}`);
  await rellenarRegistro(page, correo, CLAVE_VIEJA, CLAVE_VIEJA);
});

When('rellena el registro con esa misma cuenta', async ({ page }) => {
  await rellenarRegistro(page, correo, CLAVE_VIEJA, CLAVE_VIEJA);
});

When('rellena el registro con dos contraseñas distintas', async ({ page }) => {
  await rellenarRegistro(
    page,
    haz(`qa.distinta.${Date.now().toString().slice(-8)}`),
    CLAVE_VIEJA,
    'OtraCosa2026',
  );
});

async function rellenarRegistro(
  page: import('@playwright/test').Page,
  email: string,
  clave: string,
  confirmacion: string,
) {
  const formulario = page
    .locator('form')
    .filter({ has: page.locator('input[name="confirmPassword"]') });

  await formulario.locator('input[name="name"]').fill('QA Temporal');
  await formulario.locator('input[name="email"]').fill(email);
  await formulario.locator('input[name="password"]').fill(clave);
  await formulario.locator('input[name="confirmPassword"]').fill(confirmacion);
  await formulario.getByRole('button', { name: /crear cuenta/i }).click();
}

When('pide el código para esa cuenta', async ({ page }) => {
  const formulario = page
    .locator('form')
    .filter({ has: page.locator('input[name="email"]') })
    .first();
  await formulario.locator('input[name="email"]').fill(correo);
  await formulario.getByRole('button', { name: /enviar código/i }).click();
  await expect(page.locator('input[name="code"]')).toBeVisible({
    timeout: 20_000,
  });
});

When('escribe el código y una contraseña nueva', async ({ page }) => {
  await page.locator('input[name="code"]').fill(CODIGO_DE_PRUEBA);
  await page.locator('input[name="password"]').fill(CLAVE_NUEVA);
  await page.locator('input[name="confirmPassword"]').fill(CLAVE_NUEVA);
  await page.getByRole('button', { name: /cambiar contraseña/i }).click();
});

Then('se le pide que revise su correo', async ({ page }) => {
  await expect(page.getByText(/revisa tu correo/i)).toBeVisible({
    timeout: 20_000,
  });
});

Then('entra a la tienda', async ({ page }) => {
  await expect(page).not.toHaveURL(/reset-password/, { timeout: 20_000 });
});

After(async () => {
  if (!correo) return;
  await borrarCuentaPorCorreo(correo).catch(() => {
    // Si nunca llego a crearse, no hay nada que borrar.
  });
  correo = '';
});
