import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckoutForm } from './CheckoutForm';

const checkoutAction = vi.fn();
const fetchFulfillmentOffer = vi.fn();
const push = vi.fn();
const refresh = vi.fn();

vi.mock('../action/order.action', () => ({
  checkoutAction: (input: unknown) => checkoutAction(input),
  fetchFulfillmentOffer: (municipalityId?: string) =>
    fetchFulfillmentOffer(municipalityId),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock('@/feature/cart/hook/useCart', () => ({
  useCartActions: () => ({ refreshIfStale: vi.fn() }),
}));

vi.mock('../feedback/order.notify', () => ({
  notifyCheckoutFailure: vi.fn(),
}));

const offer = {
  deliveryOptions: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      label: 'Mensajería',
      description: null,
      fee: 5,
    },
  ],
  pickupPoints: [
    {
      id: '22222222-2222-4222-8222-222222222222',
      locationId: '33333333-3333-4333-8333-333333333333',
      locationName: 'Almacén Centro',
      label: 'Mostrador',
      address: 'Calle 1 #2',
    },
  ],
  pickupEnabled: true,
  unavailableMessage: null,
};

const addresses = [
  {
    id: '44444444-4444-4444-8444-444444444444',
    street: 'Calle 23 #456',
    municipalityId: '55555555-5555-4555-8555-555555555555',
    municipalityName: 'Plaza',
    provinceId: '66666666-6666-4666-8666-666666666666',
    provinceName: 'La Habana',
    isDefault: true,
  },
];

const zone = {
  municipalityId: '55555555-5555-4555-8555-555555555555',
  municipalityName: 'Plaza',
};

const catalog = {
  provinces: [
    {
      id: '66666666-6666-4666-8666-666666666666',
      name: 'La Habana',
      code: '03',
    },
  ],
  municipalitiesByProvince: {
    '66666666-6666-4666-8666-666666666666': [
      {
        id: '55555555-5555-4555-8555-555555555555',
        provinceId: '66666666-6666-4666-8666-666666666666',
        name: 'Plaza',
        code: '0301',
      },
    ],
  },
};

const methods = [
  {
    code: 'tropipay',
    label: 'Tarjeta (Tropipay)',
    description: 'Paga con tarjeta.',
    icon: 'CreditCard',
    kind: 'redirect' as const,
  },
  {
    code: 'manual',
    label: 'Pago manual',
    description: 'Coordinamos el pago.',
    icon: 'HandCoins',
    kind: 'manual' as const,
  },
];

const submit = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /Confirmar pedido/ }));
};

describe('CheckoutForm', () => {
  beforeEach(() => {
    checkoutAction.mockReset();
    fetchFulfillmentOffer.mockReset().mockResolvedValue(null);
    push.mockReset();
    refresh.mockReset();
    checkoutAction.mockResolvedValue({ order: { id: 'order-1' } });
  });

  afterEach(() => {
    cleanup();
  });

  it('navigates to the order once the checkout succeeds', async () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    await submit();

    await waitFor(() => expect(push).toHaveBeenCalledWith('/pedidos/order-1'));
  });

  it('keeps the button busy while the order is being created', async () => {
    let release: (value: unknown) => void = () => {};
    checkoutAction.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }),
    );
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    await submit();

    const button = screen.getByRole('button', { name: /Confirmar pedido/ });
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('true'));

    await act(async () => {
      release({ order: { id: 'order-1' } });
    });
  });

  it('does not leave the button busy once navigation is done', async () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    await submit();
    await waitFor(() => expect(push).toHaveBeenCalled());

    const button = screen.getByRole('button', { name: /Confirmar pedido/ });
    await waitFor(() => {
      expect(button.getAttribute('aria-busy')).toBe('false');
      expect((button as HTMLButtonElement).disabled).toBe(false);
    });
  });

  it('blocks a second submit while the order is being created', async () => {
    let release: (value: unknown) => void = () => {};
    checkoutAction.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }),
    );
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    await submit();
    const button = screen.getByRole('button', { name: /Confirmar pedido/ });
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('true'));

    await userEvent.click(button);
    expect(checkoutAction).toHaveBeenCalledTimes(1);

    await act(async () => {
      release({ order: { id: 'order-1' } });
    });
  });

  it('sends the chosen pickup point instead of an address', async () => {
    const user = userEvent.setup();
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    await user.click(screen.getByText(/Recoger en tienda/));
    await user.click(screen.getByRole('button', { name: /Confirmar pedido/ }));

    await waitFor(() =>
      expect(checkoutAction).toHaveBeenCalledWith(
        expect.objectContaining({
          fulfillmentType: 'pickup',
          pickupAddressId: offer.pickupPoints[0].id,
        }),
      ),
    );
  });

  it('sends the preselected default address for a delivery', async () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    await submit();

    await waitFor(() =>
      expect(checkoutAction).toHaveBeenCalledWith(
        expect.objectContaining({
          fulfillmentType: 'delivery',
          addressId: addresses[0].id,
        }),
      ),
    );
  });

  it('offers no choice and blocks when the shop cannot fulfil anything', () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={{
          deliveryOptions: [],
          pickupPoints: [],
          pickupEnabled: false,
          unavailableMessage: 'Escríbenos y coordinamos tu compra.',
        }}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    expect(screen.getByText(/Escríbenos y coordinamos/)).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: /Confirmar pedido/ }),
    ).toBeNull();
  });

  it('hides the method picker when only one way is possible', () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={{ ...offer, deliveryOptions: [] }}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    expect(screen.queryByText(/¿Cómo quieres recibirlo\?/)).toBeNull();
    expect(screen.getByText(/¿Dónde lo recoges\?/)).toBeTruthy();
  });

  // Nothing serves this zone by delivery: pickup is simply the only offer, so
  // the customer never reaches a checkout that could only fail.
  it('offers pickup alone when the zone cannot be delivered to', () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={{ ...offer, deliveryOptions: [] }}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    expect(screen.getByText(/¿Dónde lo recoges\?/)).toBeTruthy();
    expect(screen.queryByText(/Dirección de entrega/)).toBeNull();
  });

  // The cart was priced and stocked for the zone being browsed, so an address
  // somewhere else cannot be what this order ships to.
  it('offers only addresses inside the zone being browsed', () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={[
          ...addresses,
          {
            ...addresses[0],
            id: '77777777-7777-4777-8777-777777777777',
            street: 'Calle de otra provincia',
            municipalityId: '88888888-8888-4888-8888-888888888888',
            isDefault: false,
          },
        ]}
        catalog={catalog}
        zone={zone}
      />,
    );

    expect(screen.getAllByText(/Calle 23 #456/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Calle de otra provincia/)).toBeNull();
  });

  it('explains why addresses elsewhere are missing', () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    expect(screen.getByText(/Solo mostramos direcciones en/)).toBeTruthy();
    expect(screen.getByText(zone.municipalityName)).toBeTruthy();
  });

  it('pins a new address to the zone instead of asking for the municipality', async () => {
    render(
      <CheckoutForm
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
      />,
    );

    await userEvent.click(screen.getByText(/Usar otra dirección/));

    expect(screen.getByText(/Entrega en/)).toBeTruthy();
    expect(screen.queryByLabelText(/Provincia/)).toBeNull();
  });
});
