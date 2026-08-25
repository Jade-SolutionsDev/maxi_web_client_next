'use server';

import { revalidatePath } from 'next/cache';
import { writeMunicipalityId } from '../cookie/location.cookie';
import { findSelection } from '../lib/location-catalog';
import { SelectedMunicipalitySchema } from '../schema/location.schema';
import { getLocationCatalog } from '../service/location.service';

interface SaveLocationResult {
  error?: string;
}

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

    await writeMunicipalityId(selection.municipalityId);

    revalidatePath('/', 'layout');

    return {};
  } catch {
    return { error: GENERIC_ERROR };
  }
};
