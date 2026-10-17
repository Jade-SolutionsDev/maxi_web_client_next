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
    notify.info('Inicia sesión para completar tu compra', { id });
    return;
  }

  if (failure.kind === 'rejected') {
    notify.error('No pudimos crear tu pedido', {
      id,
      description:
        failure.reason ??
        'El pedido no pasó una comprobación nuestra. Inténtalo de nuevo y, si vuelve a pasar, escríbenos.',
    });
    return;
  }

  if (failure.kind === 'gateway-unavailable') {
    // No se dice «revisa tu conexión»: quien tardó fue el servidor. Y no se
    // pide reintentar a secas, porque la petición que se abandonó pudo crear
    // el pedido igual — reintentar a ciegas es como se duplica (D-055).
    notify.warning('Tardamos demasiado en responder', {
      id,
      description:
        'Puede que tu pedido se haya creado igual. Revisa «Mis pedidos» antes de volver a intentarlo.',
    });
    return;
  }

  notify.error('No pudimos crear tu pedido', {
    id,
    description:
      'Inténtalo de nuevo en un momento. Si vuelve a pasar, escríbenos.',
  });
};

export const notifyPaymentFailure = (failure: OrderFailure) => {
  const id = 'payment-failure';

  if (failure.kind === 'already-paid') {
    notify.success('Este pedido ya está pagado', { id });
    return;
  }

  if (failure.kind === 'gateway-unavailable') {
    // Ni la causa ni el consejo de antes eran ciertos: decía «Esa forma de pago
    // no está disponible» y mandaba cambiarla, cuando lo que pasa es que el
    // servidor tardó más de la cuenta y cambiar de forma de pago no arregla eso
    // (D-055). No se promete confirmación manual: el pago manual puede estar
    // desactivado —lo está en producción— y entonces no llega nunca.
    notify.warning('Tardamos demasiado en responder', {
      id,
      description:
        'Tu pedido sigue reservado. Espera un momento y vuelve a intentarlo.',
    });
    return;
  }

  if (failure.kind === 'rejected') {
    notify.error('No pudimos actualizar el estado del pago', {
      id,
      description:
        failure.reason ??
        'El pago no pasó una comprobación nuestra. Inténtalo de nuevo y, si vuelve a pasar, escríbenos.',
    });
    return;
  }

  if (failure.kind === 'no-payment' || failure.kind === 'payment-conflict') {
    return;
  }

  notify.error('No pudimos actualizar el estado del pago', {
    id,
    description:
      'Inténtalo de nuevo en un momento. Si vuelve a pasar, escríbenos.',
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
