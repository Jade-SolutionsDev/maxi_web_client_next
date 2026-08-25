import { expect, test as setup } from '@playwright/test';
import { municipioConCobertura } from '../helpers';

/**
 * Inicia sesion una vez y guarda la sesion en disco. Los escenarios marcados
 * con @sesion la reutilizan, en vez de repetir el acceso en cada uno.
 *
 * El usuario debe existir en la instancia de Clerk de la tienda **y** como
 * cliente en la base. Se puede cambiar con E2E_EMAIL / E2E_PASSWORD.
 */
const ARCHIVO_SESION = 'e2e/.auth/cliente.json';
const CORREO = process.env.E2E_EMAIL ?? 'qa.direcciones@maxihabana.com';
const CLAVE = process.env.E2E_PASSWORD ?? 'MaxiDirecciones2026';

setup('iniciar sesión como cliente', async ({ page, context }) => {
  /**
   * La zona va primero: sin ella la tienda abre el dialogo "¿Donde estas?"
   * encima de todo y tapa el boton de acceso. Ademas queda guardada en la
   * sesion, asi que los escenarios @sesion tampoco tienen que elegirla.
   */
  await context.addCookies([
    {
      name: 'maxi_location',
      value: municipioConCobertura(),
      domain: 'localhost',
      path: '/',
    },
  ]);

  await page.goto('/login');

  // El formulario de acceso, no el buscador de la cabecera: se localiza por su
  // campo de contraseña.
  const campoClave = page.locator('input[name="password"]');
  await campoClave.waitFor({ state: 'visible' });
  const formulario = page.locator('form').filter({ has: campoClave });

  await formulario.locator('input[name="email"]').fill(CORREO);
  await campoClave.fill(CLAVE);
  await formulario.getByRole('button', { name: /iniciar sesión/i }).click();

  // La sesion esta lista cuando deja de estar en /login.
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });

  await page.context().storageState({ path: ARCHIVO_SESION });
});
