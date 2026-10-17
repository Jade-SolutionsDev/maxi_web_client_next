import { chmod } from "node:fs/promises";
import { type BrowserContext, expect, type Page } from "@playwright/test";
import { municipioConCobertura } from "../helpers";

/**
 * El acceso, en un solo sitio: lo usa el proyecto `acceso` al empezar y el
 * escenario que cierra sesion, que tiene que devolver la sesion que gasta.
 *
 * El usuario debe existir en la instancia de Clerk de la tienda **y** como
 * cliente en la base. Se puede cambiar con E2E_EMAIL / E2E_PASSWORD.
 */
export const ARCHIVO_SESION = "e2e/.auth/cliente.json";

/**
 * El acceso **no lleva valores por omision**, y es a proposito.
 *
 * Hasta el 12-oct-2026 estos dos caian a un literal si faltaba la variable, y
 * ese literal era la contrasena de la cuenta de pruebas **en un repositorio
 * publico** (MxH-0169): como ni el cron del VPS ni el flujo de GitHub definian
 * las variables, el literal era el que se usaba siempre. La clave se roto y
 * ahora vive en dos sitios que no se leen: el secreto `E2E_PASSWORD` del
 * repositorio y `~/.config/maxi/e2e.env` con permisos cerrados.
 *
 * Falta a gritos y no en silencio. En GitHub Actions un secreto que no existe
 * **no llega como `undefined`, llega como cadena vacia**, asi que un `??` no
 * lo atraparia y el entorno acabaria intentando entrar con la clave vacia —
 * y el fallo diria «el acceso no funciona» en vez de «falta un secreto». De
 * ahi que se compruebe la cadena vacia y no solo la ausencia.
 */
function delEntorno(variable: "E2E_EMAIL" | "E2E_PASSWORD"): string {
  const valor = process.env[variable];
  if (!valor) {
    throw new Error(
      `Falta ${variable}. En el servidor viene de ~/.config/maxi/e2e.env; ` +
        `en GitHub Actions, del secreto del repositorio. No hay valor por ` +
        `omision a proposito: la contrasena no vuelve al codigo.`,
    );
  }
  return valor;
}

export const CORREO = delEntorno("E2E_EMAIL");
const CLAVE = delEntorno("E2E_PASSWORD");

export async function iniciarSesion(page: Page, context: BrowserContext) {
  /**
   * La zona va primero: sin ella la tienda abre el dialogo "¿Donde estas?"
   * encima de todo y tapa el boton de acceso. Ademas queda guardada en la
   * sesion, asi que los escenarios @sesion tampoco tienen que elegirla.
   */
  await context.addCookies([
    {
      name: "maxi_location",
      value: municipioConCobertura(),
      // Del entorno, no fijo: contra un dominio real 'localhost' no aplica y
      // reaparece el modal de ubicacion, que tapa media pagina.
      domain: new URL(process.env.E2E_BASE_URL ?? "http://localhost:3001")
        .hostname,
      path: "/",
    },
  ]);

  await page.goto("/login");

  // El formulario de acceso, no el buscador de la cabecera: se localiza por su
  // campo de contraseña.
  const campoClave = page.locator('input[name="password"]');
  await campoClave.waitFor({ state: "visible" });
  const formulario = page.locator("form").filter({ has: campoClave });

  await formulario.locator('input[name="email"]').fill(CORREO);
  await campoClave.fill(CLAVE);
  await formulario.getByRole("button", { name: /iniciar sesión/i }).click();

  // La sesion esta lista cuando deja de estar en /login.
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });

  await context.storageState({ path: ARCHIVO_SESION });
  await cerrarPermisos(ARCHIVO_SESION);
}

/**
 * El fichero de sesion lleva la cookie `__session` y el token de refresco de
 * Clerk, los dos vivos: con el, cualquier usuario de la maquina entra como la
 * cuenta de pruebas sin saber su clave.
 *
 * Playwright lo escribe con el umask de quien corra, que en el servidor deja
 * `rw-rw-r--`. El 9-oct-2026 se cerro a mano (MxH-0169, punto 2) y la corrida
 * de esa misma noche volvio a dejarlo legible para todos: un `chmod` no
 * sobrevive al fichero que lo sustituye. Por eso se cierra aqui, donde se
 * escribe, y no fuera.
 *
 * Que falle no debe tumbar la suite —en Windows `chmod` apenas hace nada—,
 * pero tiene que decirse: un aviso se lee, un fallo silencioso no.
 */
async function cerrarPermisos(archivo: string): Promise<void> {
  try {
    await chmod(archivo, 0o600);
  } catch (err) {
    console.warn(
      `No se pudieron cerrar los permisos de ${archivo}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}
