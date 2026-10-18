import { getStorePopup } from '@/shared/cms/service/cms.service';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { StorePopupDialog } from './StorePopupDialog';

export async function StorePopup() {
  /**
   * En la primera visita la portada ya abre el selector de zona, que es
   * obligatorio para ver precios y existencias. Si el aviso saliera a la vez,
   * el cliente se encontraría dos ventanas apiladas nada más entrar: se
   * espera a que haya zona elegida, y entonces sale en la visita siguiente.
   *
   * Medido en staging el 18-oct-2026: sin esto, los dos diálogos conviven.
   */
  const [municipalityId, popup] = await Promise.all([
    readMunicipalityId(),
    getStorePopup(),
  ]);

  if (!municipalityId || !popup) return null;

  return <StorePopupDialog popup={popup} />;
}
