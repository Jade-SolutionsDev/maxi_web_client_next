import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PaymentInstructions } from './PaymentInstructions';

describe('PaymentInstructions', () => {
  afterEach(() => {
    cleanup();
  });

  it('muestra la cuenta de una transferencia', () => {
    render(
      <PaymentInstructions
        instructions={{
          type: 'bank',
          bankName: 'Banco Metropolitano',
          accountNumber: '9227 0699 1234 5678',
          accountHolder: 'Maxi Habana',
        }}
      />,
    );

    expect(screen.getByText('Banco Metropolitano')).toBeTruthy();
    expect(screen.getByText('9227 0699 1234 5678')).toBeTruthy();
  });

  it('muestra el QR con texto alternativo', () => {
    render(
      <PaymentInstructions
        instructions={{ type: 'qr', imageUrl: 'https://cdn/qr.png' }}
      />,
    );

    const image = screen.getByAltText(/código qr/i) as HTMLImageElement;
    expect(image.src).toContain('https://cdn/qr.png');
  });

  it('abre el enlace de pago en otra pestaña', () => {
    render(
      <PaymentInstructions
        instructions={{ type: 'link', url: 'https://pago.example/abc' }}
      />,
    );

    const link = screen.getByRole('link', { name: /ir a pagar/i });
    expect(link.getAttribute('href')).toBe('https://pago.example/abc');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  // Mandar por la red equivocada pierde los fondos: el aviso no es decorativo.
  it('avisa de la red en una dirección de cripto', () => {
    render(
      <PaymentInstructions
        instructions={{
          type: 'crypto',
          address: '0xabc123',
          network: 'BEP20',
          asset: 'USDT',
        }}
      />,
    );

    expect(screen.getByText('0xabc123')).toBeTruthy();
    // El aviso va en un solo elemento: dentro de un <p> flex, cada nodo suelto
    // se convierte en un item y la frase acaba repartida en columnas.
    const warning = screen.getByText(
      (_, element) =>
        element?.tagName === 'SPAN' &&
        /Usa únicamente la red BEP20\. Un envío por otra red puede perder los fondos\./.test(
          element.textContent?.replace(/\s+/g, ' ') ?? '',
        ),
    );
    expect(warning).toBeTruthy();
  });

  it('pide el memo cuando la dirección lo lleva', () => {
    render(
      <PaymentInstructions
        instructions={{
          type: 'crypto',
          address: '0xabc',
          network: 'TRC20',
          memo: '556677',
        }}
      />,
    );

    expect(screen.getByText('556677')).toBeTruthy();
    expect(
      screen.getByText(/sin él, el pago puede quedarse trabado/i),
    ).toBeTruthy();
  });
});
