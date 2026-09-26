import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/feature/auth/components/LoginForm';

const clerk = vi.hoisted(() => ({ caido: false, listo: false }));

vi.mock('@/feature/auth/hook/useSignIn', () => ({
  useSignIn: () => ({
    login: vi.fn(),
    isSubmitting: false,
    isReady: clerk.listo,
  }),
}));

vi.mock('@/feature/auth/hook/useClerkDisponible', () => ({
  useClerkDisponible: () => ({ listo: clerk.listo, caido: clerk.caido }),
}));

describe('LoginForm cuando Clerk no responde', () => {
  beforeEach(() => {
    clerk.caido = false;
    clerk.listo = false;
  });

  afterEach(() => {
    cleanup();
  });

  it('no alarma mientras Clerk todavía puede cargar', () => {
    render(<LoginForm />);

    expect(screen.queryByRole('status')).toBeNull();
  });

  it('explica por qué no se puede entrar y deja el WhatsApp de la tienda', () => {
    clerk.caido = true;
    render(<LoginForm />);

    const aviso = screen.getByRole('status');
    expect(aviso.textContent).toContain('servicio de cuentas');

    const enlace = screen.getByRole('link', { name: /Escríbenos al/ });
    expect(enlace.getAttribute('href')).toBe('https://wa.me/5352519414');
  });

  it('deja de avisar en cuanto Clerk carga', () => {
    clerk.listo = true;
    render(<LoginForm />);

    expect(screen.queryByRole('status')).toBeNull();
    expect(
      screen
        .getByRole('button', { name: /Iniciar sesión/ })
        .hasAttribute('disabled'),
    ).toBe(false);
  });
});
