import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CompraConfirmada } from './CompraConfirmada';

const params = vi.hoisted(() => ({ valor: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => params.valor,
}));

describe('CompraConfirmada', () => {
  beforeEach(() => {
    params.valor = new URLSearchParams();
  });

  afterEach(() => {
    cleanup();
  });

  it('no aparece cuando se entra al pedido desde Mis pedidos', () => {
    render(<CompraConfirmada orderNumber='ORD-20260150' esperandoPago />);

    expect(screen.queryByLabelText('Compra confirmada')).toBeNull();
  });

  it('confirma la compra y da el número al llegar desde el checkout', () => {
    params.valor = new URLSearchParams('compraConfirmada=1');

    render(<CompraConfirmada orderNumber='ORD-20260150' esperandoPago />);

    const aviso = screen.getByLabelText('Compra confirmada');
    expect(aviso.textContent).toContain('ORD-20260150');
    expect(aviso.textContent).toContain('mientras completas el pago');
    expect(aviso.textContent).toContain('Mis pedidos');
  });

  it('no manda a pagar un pedido que ya está pagado', () => {
    params.valor = new URLSearchParams('compraConfirmada=1');

    render(
      <CompraConfirmada orderNumber='ORD-20260150' esperandoPago={false} />,
    );

    const aviso = screen.getByLabelText('Compra confirmada');
    expect(aviso.textContent).not.toContain('completas el pago');
  });

  it('aguanta un pedido sin número', () => {
    params.valor = new URLSearchParams('compraConfirmada=1');

    render(<CompraConfirmada orderNumber={null} esperandoPago />);

    expect(screen.getByLabelText('Compra confirmada').textContent).toContain(
      'Ya lo tenemos guardado',
    );
  });
});
