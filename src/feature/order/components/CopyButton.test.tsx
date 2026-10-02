import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  it('por defecto es solo el icono, como en los datos de pago', () => {
    render(<CopyButton value='123' label='Copiar número' />);
    const boton = screen.getByRole('button', { name: 'Copiar número' });
    // El nombre accesible viene del aria-label; no hay texto a la vista.
    expect(boton.textContent).toBe('');
  });

  it('con withText enseña el nombre, que es lo que pidió Merly', () => {
    render(
      <CopyButton
        value='https://maxihabana.com/seguimiento/abc'
        label='Copiar enlace'
        withText
      />,
    );
    expect(screen.getByText('Copiar enlace')).toBeDefined();
  });
});
