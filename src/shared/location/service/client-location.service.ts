import 'server-only';

import { type ApiResponse, apiAuth } from '@/api/http';

/**
 * La zona que el cliente tiene guardada en su cuenta (MxH-0040).
 *
 * **Vive aparte de `location.service.ts` a propósito.** Aquel es catálogo
 * público y cachea con `'use cache'`; resolver el token de Clerk lee cabeceras,
 * y eso dentro de un ámbito cacheado es ilegal. Tenerlos en el mismo fichero
 * invita a que alguien llame a esto desde dentro de una caché.
 *
 * Las dos funciones **se tragan el error a propósito**: la cookie es la verdad
 * de este navegador y la cuenta solo rellena el hueco. Sin sesión, `apiAuth`
 * lanza `SessionRequiredError`, que aquí es el caso normal —la mayoría de
 * quien entra no ha iniciado sesión—, no una avería.
 */
export const getSavedMunicipalityId = async (): Promise<string | null> => {
  try {
    const { data } = await apiAuth<
      ApiResponse<{ municipalityId: string | null }>
    >('/storefront/location');

    return data.municipalityId ?? null;
  } catch {
    return null;
  }
};

/** Recuerda la zona en la cuenta, para no volver a preguntarla en otro móvil. */
export const rememberMunicipality = async (
  municipalityId: string,
): Promise<void> => {
  try {
    await apiAuth('/storefront/location', {
      method: 'PUT',
      body: { municipalityId },
    });
  } catch {}
};
