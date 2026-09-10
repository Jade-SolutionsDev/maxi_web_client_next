import { clerkSetup } from '@clerk/testing/playwright';
import { cargarEntornoDeLaTienda } from '../clerk';

/**
 * Clerk protege el registro con un captcha, que en una instancia de desarrollo
 * se puede saltar con un token de prueba. Esto lo deja listo; cada escenario
 * que lo necesite lo pide con `setupClerkTestingToken`.
 */
const INTENTOS = 3;
const ESPERA_MS = 2000;

export default async function globalSetup() {
  cargarEntornoDeLaTienda();

  /**
   * `clerkSetup()` sale a internet a pedir el token de prueba, y desde aqui esa
   * conexion se cae a ratos. Si falla, no arranca ni un escenario: la suite
   * entera se cae por un problema de red que no tiene nada que ver con la
   * tienda. Tres intentos con espera creciente.
   */
  let ultimoError: unknown;
  for (let intento = 1; intento <= INTENTOS; intento++) {
    try {
      await clerkSetup();
      return;
    } catch (err) {
      ultimoError = err;
      if (intento === INTENTOS) break;
      console.warn(
        `clerkSetup() fallo (intento ${intento}/${INTENTOS}), reintentando…`,
      );
      await new Promise((sigue) => setTimeout(sigue, ESPERA_MS * intento));
    }
  }

  throw new Error(
    `No se pudo preparar Clerk tras ${INTENTOS} intentos. ` +
      `Ultimo error: ${ultimoError instanceof Error ? ultimoError.message : String(ultimoError)}`,
  );
}
