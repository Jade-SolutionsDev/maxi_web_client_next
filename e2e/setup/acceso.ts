import { type BrowserContext, expect, type Page } from '@playwright/test';
import { municipioConCobertura } from '../helpers';

/**
 * El acceso, en un solo sitio: lo usa el proyecto `acceso` al empezar y el
 * escenario que cierra sesion, que tiene que devolver la sesion que gasta.
 *
 * El usuario debe existir en la instancia de Clerk de la tienda **y** como
 * cliente en la base. Se puede cambiar con E2E_EMAIL / E2E_PASSWORD.
 */
export const ARCHIVO_SESION = 'e2e/.auth/cliente.json';
export const CORREO = process.env.E2E_EMAIL ?? 'qa.direcciones@maxihabana.com';
const CLAVE = process.env.E2E_PASSWORD ?? 'MaxiDirecciones2026';

export async function iniciarSesion(page: Page, context: BrowserContext) {
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

  await context.storageState({ path: ARCHIVO_SESION });
}
