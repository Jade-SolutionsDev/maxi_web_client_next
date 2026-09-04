import { notify } from '@/lib/notify';
import type { CartFailure, MergeReport } from '../type/cart.interface';

const stockDescription = (available: number, name: string) => {
  if (available <= 0) return `Por ahora no queda ninguna unidad de ${name}.`;

  return available === 1
    ? `Solo queda 1 unidad de ${name}.`
    : `Solo quedan ${available} unidades de ${name}.`;
};

export const notifyCartFailure = (failure: CartFailure, name: string) => {
  const id = `cart-failure:${name}`;

  if (failure.kind === 'insufficient-stock') {
    notify.warning('No hay más stock disponible', {
      id,
      description: stockDescription(failure.available, name),
    });
    return;
  }

  if (failure.kind === 'unauthenticated') return;

  if (failure.kind === 'not-found') {
    notify.warning('Producto no disponible', {
      id,
      description: `${name} ya no está en el catálogo.`,
    });
    return;
  }

  notify.error('No pudimos actualizar tu carrito', {
    id,
    description: 'Revisa tu conexión e inténtalo de nuevo.',
  });
};

const listNames = (entries: { name: string }[]) =>
  entries.map((entry) => entry.name).join(', ');

export const notifyMergeReport = ({ clamped, dropped }: MergeReport) => {
  if (clamped.length > 0) {
    notify.warning('Ajustamos algunas cantidades', {
      id: 'cart-merge:clamped',
      description: `No había stock suficiente de ${listNames(clamped)}.`,
    });
  }

  if (dropped.length > 0) {
    notify.warning('Quitamos productos sin stock', {
      id: 'cart-merge:dropped',
      description: `${listNames(dropped)} ya no está disponible.`,
    });
  }
};

export const notifyCartClearedForNewProvince = () => {
  notify.info('Vaciamos tu carrito', {
    id: 'cart-zone:province-changed',
    description:
      'Los productos y precios cambian con la provincia, así que empiezas de nuevo con el catálogo de tu nueva zona.',
  });
};
