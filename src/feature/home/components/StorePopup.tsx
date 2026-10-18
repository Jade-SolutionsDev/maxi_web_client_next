import { getStorePopup } from '@/shared/cms/service/cms.service';
import { StorePopupDialog } from './StorePopupDialog';

export async function StorePopup() {
  const popup = await getStorePopup();

  if (!popup) return null;

  return <StorePopupDialog popup={popup} />;
}
