import { saveLocation } from '@/shared/location/action/location.action';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import {
  findSelection,
  toLocationOptions,
} from '@/shared/location/lib/location-catalog';
import { getLocationCatalog } from '@/shared/location/service/location.service';
import { LocationPicker } from './LocationPicker';

interface LocationGateProps {
  className?: string;
}

export const LocationGate = async ({ className }: LocationGateProps) => {
  const [municipalityId, catalog] = await Promise.all([
    readMunicipalityId(),
    getLocationCatalog(),
  ]);

  const selected = municipalityId
    ? findSelection(catalog, municipalityId)
    : null;

  const { provinces, municipalitiesByProvince } = toLocationOptions(catalog);

  return (
    <LocationPicker
      provinces={provinces}
      municipalitiesByProvince={municipalitiesByProvince}
      selected={selected}
      onSubmit={saveLocation}
      className={className}
    />
  );
};
