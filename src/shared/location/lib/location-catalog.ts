import type {
  LocationCatalog,
  LocationOption,
  SelectedLocation,
} from '../type/location.interface';

interface LocationOptions {
  provinces: LocationOption[];
  municipalitiesByProvince: Record<string, LocationOption[]>;
}

const toOption = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): LocationOption => ({ value: id, label: name });

export const toLocationOptions = (
  catalog: LocationCatalog,
): LocationOptions => ({
  provinces: catalog.provinces.map(toOption),
  municipalitiesByProvince: Object.fromEntries(
    catalog.provinces.map((province) => [
      province.id,
      (catalog.municipalitiesByProvince[province.id] ?? []).map(toOption),
    ]),
  ),
});

export const findSelection = (
  catalog: LocationCatalog,
  municipalityId: string,
): SelectedLocation | null => {
  if (!municipalityId) return null;

  for (const province of catalog.provinces) {
    const municipality = catalog.municipalitiesByProvince[province.id]?.find(
      (candidate) => candidate.id === municipalityId,
    );

    if (municipality) {
      return {
        provinceId: province.id,
        provinceName: province.name,
        municipalityId: municipality.id,
        municipalityName: municipality.name,
      };
    }
  }

  return null;
};
