import { notify } from '@/lib/notify';
import type { Product } from '../type/product.interface';

type StockLimitProduct = Pick<Product, 'id' | 'name' | 'available'>;

export const notifyStockLimit = ({
  id,
  name,
  available,
}: StockLimitProduct) => {
  const toastId = `stock-limit:${id}`;

  if (available <= 0) {
    notify.warning('Producto sin stock', {
      id: toastId,
      description: `Por ahora no queda ninguna unidad de ${name}.`,
    });
    return;
  }

  notify.warning('No hay más stock disponible', {
    id: toastId,
    description:
      available === 1
        ? `Solo queda 1 unidad de ${name}.`
        : `Solo quedan ${available} unidades de ${name}.`,
  });
};
