'use server';

import { revalidatePath } from 'next/cache';
import {
  readMunicipalityId,
  writeMunicipalityId,
} from '../cookie/location.cookie';
import { findSelection, hasChangedProvince } from '../lib/location-catalog';
import { SelectedMunicipalitySchema } from '../schema/location.schema';
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
