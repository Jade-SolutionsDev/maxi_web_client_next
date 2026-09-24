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
  // La primera versión usaba lucide-react, que ya no trae iconos de marcas:
  // el componente caía a un texto de repuesto, las pruebas pasaban y el build
  // de Next se rompía. Ahora se comprueba que el logo se dibuja de verdad.
  it('dibuja el logo, no un texto de repuesto', () => {
    const { container } = render(<RedesSociales />);
    const logos = container.querySelectorAll('svg path');
    expect(logos.length).toBe(2);
    for (const logo of logos) {
      expect(logo.getAttribute('d')?.length ?? 0).toBeGreaterThan(50);
    }
  });
});
