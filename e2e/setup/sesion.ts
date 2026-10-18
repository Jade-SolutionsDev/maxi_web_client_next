import { readFile } from "node:fs/promises";

/**
 * El fichero donde el proyecto `acceso` deja la sesion del cliente de pruebas,
 * y lo unico que hace falta saber de el sin abrir un navegador: que sesion de
 * Clerk contiene.
 *
 * Vive aparte de `acceso.ts` a proposito: ese modulo exige `E2E_EMAIL` y
 * `E2E_PASSWORD` al cargarse, y el teardown no los necesita para revocar.
 */
export const ARCHIVO_SESION = "e2e/.auth/cliente.json";

/**
 * El id de la sesion de Clerk (`sess_…`) guardada en el fichero, o `null` si
 * el fichero no esta o no lleva la cookie.
 *
 * La cookie `__session` es un JWT y su claim `sid` es la sesion. No hace
 * falta verificar la firma: la leemos de nuestro propio fichero y solo la
 * usamos para decirle a Clerk cual revocar.
 */
export async function idDeSesionGuardada(
  ruta = ARCHIVO_SESION,
): Promise<string | null> {
  let contenido: string;
  try {
    contenido = await readFile(ruta, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }

  const estado = JSON.parse(contenido) as {
    cookies?: { name: string; value: string }[];
  };
  const cookie = estado.cookies?.find((c) => c.name === "__session");
  if (!cookie) return null;

  const [, cuerpo] = cookie.value.split(".");
  if (!cuerpo) return null;
  const claims = JSON.parse(
    Buffer.from(cuerpo, "base64url").toString("utf8"),
  ) as { sid?: unknown };
  return typeof claims.sid === "string" ? claims.sid : null;
}
