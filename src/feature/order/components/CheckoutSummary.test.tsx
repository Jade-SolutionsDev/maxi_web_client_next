import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Un `span` y no un `a`: aquí no se navega a ninguna parte y un enlace sin
// destino es justo lo que el linter de accesibilidad señala, con razón.
vi.mock('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));
vi.mock('@/app/components/ui/safe-image', () => ({
  SafeImage: () => null,
}));

import type { Cart } from '@/feature/cart/type/cart.interface';
import { CheckoutSummary } from './CheckoutSummary';

/**
 * MxH-0045. La línea del envío decía «Gratis» siempre que no costara nada, y
 * cero no quiere decir lo mismo en los tres casos que puede haber:
 *
 * - se recoge en el mostrador → no hay envío que valorar
 * - hay reparto y la compra alcanzó el umbral → eso sí es un regalo
 * - hay reparto gratuito de por sí → gratis a secas
 *
 * Con la promoción por importe encima (MxH-0043), «Gratis» pasaría a significar
 * dos cosas a la vez: la que te ahorró dinero y la que nunca costó.
 */
describe('CheckoutSummary · la línea del envío', () => {
  afterEach(cleanup);

  const carrito = (subtotal: number): Cart =>
    ({
      lines: [],
      subtotal,
      totalItems: 0,
    }) as unknown as Cart;

  const lineaDelEnvio = () =>
    screen.getByText('Envío').parentElement?.textContent ?? '';

  it('recogiendo en el mostrador no dice «Gratis»: no hay envío', () => {
    render(
      <CheckoutSummary
        cart={carrito(100)}
        deliveryFee={0}
        fulfillmentType='pickup'
        freeDeliveryThreshold={50}
      />,
    );

    expect(lineaDelEnvio()).toContain('No aplica');
    expect(lineaDelEnvio()).not.toContain('Gratis');
  });

  it('con reparto por debajo del umbral, dice cuánto falta', () => {
    render(
      <CheckoutSummary
        cart={carrito(38)}
        deliveryFee={5}
        fulfillmentType='delivery'
        freeDeliveryThreshold={50}
      />,
    );

    expect(
      screen.getByText(/Te faltan \$12\.00 para el envío gratis/),
    ).toBeTruthy();
  });

  it('alcanzado el umbral, dice que se aplicó y no solo «Gratis»', () => {
    render(
      <CheckoutSummary
        cart={carrito(60)}
        deliveryFee={0}
        fulfillmentType='delivery'
        freeDeliveryThreshold={50}
      />,
    );

    expect(lineaDelEnvio()).toContain('Gratis');
    expect(screen.getByText(/Se aplicó el envío gratis/)).toBeTruthy();
  });

  /**
   * Sin promoción configurada —que es como está la tienda hoy— nada de esto
   * debe asomar: ni el «te faltan», ni el «se aplicó».
   */
  it('sin promoción no promete nada', () => {
    render(
      <CheckoutSummary
        cart={carrito(10)}
        deliveryFee={5}
        fulfillmentType='delivery'
        freeDeliveryThreshold={null}
      />,
    );

    expect(lineaDelEnvio()).toContain('$5.00');
    expect(screen.queryByText(/Te faltan/)).toBeNull();
    expect(screen.queryByText(/Se aplicó/)).toBeNull();
  });

  it('un reparto que no cobra sigue siendo gratis, sin hablar de promociones', () => {
    render(
      <CheckoutSummary
        cart={carrito(10)}
        deliveryFee={0}
        fulfillmentType='delivery'
        freeDeliveryThreshold={null}
      />,
    );

    expect(lineaDelEnvio()).toContain('Gratis');
    expect(screen.queryByText(/Se aplicó/)).toBeNull();
  });

  /**
   * El umbral es de **cada** forma de entrega, no de la tienda: una Express
   * puede regalarse a partir de 200 y la normal a partir de 50. Aquí llega ya
   * resuelto el de la opción elegida, y lo que se fija es que el resumen use
   * ese y no otro.
   */
  it('cada forma de entrega trae el suyo', () => {
    const { unmount } = render(
      <CheckoutSummary
        cart={carrito(60)}
        deliveryFee={10}
        fulfillmentType='delivery'
        freeDeliveryThreshold={200}
      />,
    );

    expect(
      screen.getByText(/Te faltan \$140\.00 para el envío gratis/),
    ).toBeTruthy();
    unmount();

    render(
      <CheckoutSummary
        cart={carrito(60)}
        deliveryFee={0}
        fulfillmentType='delivery'
        freeDeliveryThreshold={50}
      />,
    );

    expect(screen.getByText(/Se aplicó el envío gratis/)).toBeTruthy();
  });

  it('el total suma el envío que de verdad se cobra', () => {
    render(
      <CheckoutSummary
        cart={carrito(38)}
        deliveryFee={5}
        fulfillmentType='delivery'
        freeDeliveryThreshold={50}
      />,
    );

    expect(screen.getByText('$43.00')).toBeTruthy();
  });
});
