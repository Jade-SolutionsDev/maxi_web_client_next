'use server';

import { writeMunicipalityId } from '../cookie/location.cookie';
import { findSelection } from '../lib/location-catalog';
import { SelectedMunicipalitySchema } from '../schema/location.schema';
import { getLocationCatalog } from '../service/location.service';

interface SaveLocationResult {
  error?: string;
}

export const saveLocation = async (
  input: unknown,
): Promise<SaveLocationResult> => {
  const parsed = SelectedMunicipalitySchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'Elegí un municipio' };
  }

  const catalog = await getLocationCatalog();
  const selection = findSelection(catalog, parsed.data.municipalityId);

  if (!selection) {
    return { error: 'Esa ubicación no está disponible' };
  }

  await writeMunicipalityId(selection.municipalityId);

  return {};
};
