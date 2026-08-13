import 'server-only';

import { auth } from '@clerk/nextjs/server';

export { SessionRequiredError } from './error';

/**
 * Token de sesión de Clerk del request actual, o `null` cuando no hay nadie
 * logueado. Se resuelve en el servidor y nunca se entrega al cliente.
 */
export const getSessionToken = async (): Promise<string | null> => {
  const { userId, getToken } = await auth();

  if (!userId) return null;

  return await getToken();
};
