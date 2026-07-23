import 'server-only';

import { auth } from '@clerk/nextjs/server';

/**
 * El request necesita un cliente autenticado y no hay ninguno. Se lanza antes
 * de cualquier fetch, así que no es una falla del API: no lleva status HTTP.
 */
export class SessionRequiredError extends Error {
  constructor() {
    super('No authenticated session');
    this.name = 'SessionRequiredError';
  }
}

/**
 * Token de sesión de Clerk del request actual, o `null` cuando no hay nadie
 * logueado. Se resuelve en el servidor y nunca se entrega al cliente.
 */
export const getSessionToken = async (): Promise<string | null> => {
  const { userId, getToken } = await auth();

  if (!userId) return null;

  return await getToken();
};
