import { rm } from "node:fs/promises";
import { revocarSesion } from "../clerk";
import { ARCHIVO_SESION, idDeSesionGuardada } from "./sesion";

/**
 * Al terminar, la suite devuelve la sesion que abrio.
 *
 * Hasta el 18-oct-2026 no lo hacia: cada corrida iniciaba sesion y la dejaba
 * viva en Clerk, donde caducan a los siete dias. La cuenta de pruebas llego a
 * tener 37 sesiones activas, y cada una era una credencial valida copiada en
 * `e2e/.auth/cliente.json` y en las trazas de `test-results/`. Cerrar los
 * permisos de esos ficheros (D-058) acota quien los lee; revocar la sesion
 * hace que, los lea quien los lea, ya no sirvan.
 *
 * Se revoca **solo la sesion propia**, la que esta en el fichero: una sesion
 * abierta a mano con la misma cuenta no es asunto de la suite.
 *
 * Que falle no tumba la corrida —la tienda no tiene la culpa de que Clerk no
 * responda—, pero se dice: una sesion que no se pudo revocar sigue viva.
 */
export default async function globalTeardown() {
  let id: string | null;
  try {
    id = await idDeSesionGuardada();
  } catch (err) {
    console.warn(`No se pudo leer ${ARCHIVO_SESION}: ${mensaje(err)}`);
    return;
  }
  if (!id) return;

  try {
    await revocarSesion(id);
  } catch (err) {
    console.warn(
      `La sesion ${id} de la suite sigue viva en Clerk: ${mensaje(err)}`,
    );
    return;
  }

  // Revocada, el fichero ya no abre nada. Fuera igualmente: menos que custodiar.
  await rm(ARCHIVO_SESION, { force: true });
}

function mensaje(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
