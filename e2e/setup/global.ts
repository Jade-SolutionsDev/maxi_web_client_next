import { clerkSetup } from '@clerk/testing/playwright';
import { cargarEntornoDeLaTienda } from '../clerk';

/**
 * Clerk protege el registro con un captcha, que en una instancia de desarrollo
 * se puede saltar con un token de prueba. Esto lo deja listo; cada escenario
 * que lo necesite lo pide con `setupClerkTestingToken`.
 */
export default async function globalSetup() {
  cargarEntornoDeLaTienda();
  await clerkSetup();
}
