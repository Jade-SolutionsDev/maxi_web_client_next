import { notify } from '@/lib/notify';
import type { OrderFailure } from '../type/order.type';

export const notifyCheckoutFailure = (failure: OrderFailure) => {
  const id = 'checkout-failure';

  if (failure.kind === 'stale-cart') {
    const detail = failure.lines
      .map((line) =>
        line.available > 0
          ? `${line.name}: quedan ${line.available}`
          : `${line.name}: sin stock`,
      )
      .join(' · ');

    notify.warning('Tu carrito cambió', {
      id,
      description: `Ajusta estas líneas antes de continuar. ${detail}`,
    });
    return;
  }

  if (failure.kind === 'empty-cart') {
    notify.warning('Tu carrito está vacío', { id });
    return;
  }

  if (failure.kind === 'unauthenticated') {
    notify.info('Iniciá sesión para completar tu compra', { id });
    return;
  }

  notify.error('No pudimos crear tu pedido', {
    id,
    description: 'Revisa tu conexión e inténtalo de nuevo.',
  });
};

export const notifyPaymentFailure = (failure: OrderFailure) => {
  const id = 'payment-failure';

  if (failure.kind === 'already-paid') {
    notify.success('Este pedido ya está pagado', { id });
    return;
  }

  if (failure.kind === 'gateway-unavailable') {
    notify.info('La pasarela de pago no está disponible', {
      id,
      description:
        'Tu pedido queda registrado y lo confirmaremos manualmente. También puedes reintentar más tarde.',
    });
    return;
  }

  if (failure.kind === 'no-payment' || failure.kind === 'payment-conflict') {
    return;
  }

  notify.error('No pudimos actualizar el estado del pago', {
    id,
    description: 'Revisa tu conexión e inténtalo de nuevo.',
  });
};

export const notifyOrderCancelled = () => {
  notify.success('Pedido cancelado', {
    id: 'order-cancelled',
    description: 'El stock reservado quedó liberado.',
  });
};

export const notifyPaymentReturn = (outcome: string) => {
  const id = 'payment-return';

  if (outcome === 'ok') {
    notify.info('Estamos confirmando tu pago', {
      id,
      description: 'En cuanto la pasarela lo confirme verás el pedido pagado.',
    });
    return;
  }

  notify.warning('No pudimos completar el pago', {
    id,
    description: 'Puedes reintentar o elegir otra forma de pago.',
  });
};

export const notifyOrderPaid = () => {
  notify.success('¡Pago confirmado!', {
    id: 'order-paid',
    description: 'Tu pedido está pagado y en proceso.',
  });
};
