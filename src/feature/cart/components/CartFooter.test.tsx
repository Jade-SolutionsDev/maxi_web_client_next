import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fetchDisponibilidadDeLaZona = vi.fn();

vi.mock('@/feature/order/action/order.action', () => ({
  fetchDisponibilidadDeLaZona: () => fetchDisponibilidadDeLaZona(),
}));
/**
 * El pie vive dentro del panel lateral, y `SheetClose` pide el contexto del
 * diálogo de Base UI. Aquí no hay panel que abrir —lo que se prueba es el
 * aviso—, así que el envoltorio se sustituye por lo mínimo que renderiza.
 */
vi.mock('@/app/components/ui/sheet', () => ({
  SheetFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetClose: ({ render }: { render: React.ReactElement }) => render,
}));
vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ isLoaded: true, isSignedIn: true }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('@/feature/auth/hook/useClerkDisponible', () => ({
  useClerkDisponible: () => ({ caido: false }),
}));
vi.mock('../hook/useCart', () => ({
  useCartData: () => ({
    totalItems: 2,
    totalPrice: 100,
    originalTotalPrice: 100,
    totalSavings: 0,
    hasUnavailableLines: false,
  }),
}));
vi.mock('../store/cart.store', () => ({
  useCartStore: Object.assign(
    (selector: (estado: unknown) => unknown) =>
      selector({ mode: 'account', actions: { adoptGuestCart: vi.fn() } }),
    { getState: () => ({ mode: 'account' }) },
  ),
}));

import { CartFooter } from './CartFooter';

/**
 * P-046. Cubrir un municipio no es poder despachar en él: el catálogo enseña
 * productos donde hay cobertura y stock, y el checkout exige además una vía.
 * Quien compraba en una zona sin ninguna se enteraba en el último paso, con el
 * carrito hecho. El aviso se da aquí, que es el último momento tranquilo.
 */
describe('CartFooter · el aviso de que en esta zona no se puede recibir', () => {
  beforeEach(() => {
    fetchDisponibilidadDeLaZona.mockReset();
  });
  afterEach(cleanup);

  const avisoEnPantalla = () =>
    screen.queryByText(/no podemos|coordinamos|escríbenos/i);

  const botonDePagar = () =>
    screen.getByRole('button', {
      name: /proceder al pago/i,
    }) as HTMLButtonElement;

  it('avisa, con las palabras que manda la tienda', async () => {
    fetchDisponibilidadDeLaZona.mockResolvedValue({
      fulfillable: false,
      unavailableMessage: 'Escríbenos y coordinamos tu compra.',
    });

    render(<CartFooter closeSheet={vi.fn()} />);

    // `findByText` ya falla si no aparece; esto deja dicho qué se espera ver.
    expect(
      await screen.findByText('Escríbenos y coordinamos tu compra.'),
    ).toBeTruthy();
  });

  it('con una zona servida no dice nada', async () => {
    fetchDisponibilidadDeLaZona.mockResolvedValue({
      fulfillable: true,
      unavailableMessage: null,
    });

    render(<CartFooter closeSheet={vi.fn()} />);

    await waitFor(() => expect(fetchDisponibilidadDeLaZona).toHaveBeenCalled());
    expect(avisoEnPantalla()).toBeNull();
  });

  /**
   * Un aviso que no se puede comprobar es peor que ninguno: pararía una compra
   * que quizá sí se podía hacer.
   */
  it('si la consulta falla, se calla y deja comprar', async () => {
    fetchDisponibilidadDeLaZona.mockResolvedValue(null);

    render(<CartFooter closeSheet={vi.fn()} />);

    await waitFor(() => expect(fetchDisponibilidadDeLaZona).toHaveBeenCalled());
    expect(avisoEnPantalla()).toBeNull();
    expect(botonDePagar().disabled).toBe(false);
  });

  /**
   * El aviso informa, no bloquea: la decisión fue avisar antes, no apagar la
   * compra por nuestra cuenta.
   */
  it('avisar no impide seguir: el botón sigue vivo', async () => {
    fetchDisponibilidadDeLaZona.mockResolvedValue({
      fulfillable: false,
      unavailableMessage: 'No podemos entregar en tu zona.',
    });

    render(<CartFooter closeSheet={vi.fn()} />);

    await screen.findByText('No podemos entregar en tu zona.');
    expect(botonDePagar().disabled).toBe(false);
  });
});
