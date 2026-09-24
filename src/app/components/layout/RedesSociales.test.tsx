import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RedesSociales } from './RedesSociales';

describe('RedesSociales', () => {
  it('enlaza a Facebook y a Instagram', () => {
    render(<RedesSociales />);
    expect(
      screen.getByLabelText('Maxi Habana en Facebook').getAttribute('href'),
    ).toContain('facebook.com');
    expect(
      screen.getByLabelText('Maxi Habana en Instagram').getAttribute('href'),
    ).toContain('instagram.com/maxihabana');
  });

  // Venía con un `?stkn=…` que es un token de la sesión de quien copió el
  // enlace: publicarlo en todas las páginas habría expuesto algo de su cuenta.
  it('no publica el token de sesión del enlace original', () => {
    render(<RedesSociales />);
    for (const enlace of screen.getAllByRole('link')) {
      expect(enlace.getAttribute('href')).not.toContain('stkn=');
    }
  });

  // Un icono sin nombre accesible es un enlace mudo para un lector de pantalla.
  it('cada enlace dice a dónde va', () => {
    render(<RedesSociales />);
    for (const enlace of screen.getAllByRole('link')) {
      expect(enlace.getAttribute('aria-label')).toMatch(/Maxi Habana en/);
    }
  });
});
