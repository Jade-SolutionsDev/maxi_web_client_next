import { saveLocation } from '@/shared/location/action/location.action';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import {
  findSelection,
  toLocationOptions,
} from '@/shared/location/lib/location-catalog';
import { getSavedMunicipalityId } from '@/shared/location/service/client-location.service';
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

  /**
   * Sin cookie, se **propone** la zona que el cliente guardó en su cuenta
   * (MxH-0040): el diálogo se abre con ella elegida y basta confirmar.
   *
   * Se propone, no se impone, y la diferencia importa: la cookie es lo que
   * filtra el catálogo, y un componente de servidor no puede escribirla —solo
   * una acción puede—. Dar por elegida la zona de la cuenta dejaría la
   * insignia diciendo «Habana Vieja» con el catálogo aún sin filtrar, que es
   * mentir en la cara del cliente.
   *
   * Pasa por `findSelection`, así que una zona que ya no está en el catálogo
   * —municipio dado de baja, cobertura retirada— no se propone: se pregunta.
   */
  const propuesta = selected
    ? null
    : findSelection(catalog, (await getSavedMunicipalityId()) ?? '');

  const { provinces, municipalitiesByProvince } = toLocationOptions(catalog);

  return (
    <LocationPicker
      provinces={provinces}
      municipalitiesByProvince={municipalitiesByProvince}
      selected={selected}
      propuesta={propuesta}
      onSubmit={saveLocation}
      className={className}
    />
  );
};
