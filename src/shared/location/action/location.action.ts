'use server';

import { revalidatePath } from 'next/cache';
import {
  clearMunicipalityId,
  readMunicipalityId,
  writeMunicipalityId,
} from '../cookie/location.cookie';
import { findSelection, hasChangedProvince } from '../lib/location-catalog';
import { SelectedMunicipalitySchema } from '../schema/location.schema';
import { rememberMunicipality } from '../service/client-location.service';
import { getLocationCatalog } from '../service/location.service';
import type { SaveLocationResult } from '../type/location.interface';

const GENERIC_ERROR = 'No pudimos guardar tu ubicación. Inténtalo de nuevo.';

export const saveLocation = async (
  input: unknown,
): Promise<SaveLocationResult> => {
  const parsed = SelectedMunicipalitySchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'Elige un municipio' };
  }

  try {
    const catalog = await getLocationCatalog();
    const selection = findSelection(catalog, parsed.data.municipalityId);

    if (!selection) {
      return { error: 'Esa ubicación no está disponible' };
    }

    const previousMunicipalityId = await readMunicipalityId();

    await writeMunicipalityId(selection.municipalityId);

    // Y en la cuenta, si hay sesión, para no volver a preguntarla en otro
    // dispositivo. Va **después** de la cookie y no puede tumbar nada: si la
    // API falla o no hay sesión, la zona queda elegida igual en este navegador.
    //
    // El `try` propio no sobra aunque el servicio ya se trague lo suyo: lo que
    // se protege aquí es la consecuencia, no la causa. Un error que escapara
    // caería en el `catch` de abajo y el cliente leería «No pudimos guardar tu
    // ubicación» con la ubicación ya guardada.
    try {
      await rememberMunicipality(selection.municipalityId);
    } catch {}

    revalidatePath('/', 'layout');

    return {
      provinceChanged: hasChangedProvince(
        catalog,
        previousMunicipalityId,
        selection.municipalityId,
      ),
    };
  } catch {
    return { error: GENERIC_ERROR };
  }
};

export const forgetLocation = async (): Promise<void> => {
  try {
    await clearMunicipalityId();
    revalidatePath('/', 'layout');
  } catch {}
};
