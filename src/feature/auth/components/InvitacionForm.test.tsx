import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InvitacionForm } from '@/feature/auth/components/InvitacionForm';

const estado = vi.hoisted(() => ({
  params: new URLSearchParams('__clerk_ticket=tk_123'),
  caido: false,
}));
const aceptar = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useSearchParams: () => estado.params,
}));

vi.mock('@/feature/auth/hook/useAceptarInvitacion', () => ({
  useAceptarInvitacion: () => ({
    aceptar,
    enviando: false,
    listo: true,
  }),
}));

vi.mock('@/feature/auth/hook/useClerkDisponible', () => ({
  useClerkDisponible: () => ({ listo: true, caido: estado.caido }),
}));

describe('InvitacionForm', () => {
  beforeEach(() => {
    estado.params = new URLSearchParams('__clerk_ticket=tk_123');
    estado.caido = false;
    aceptar.mockReset().mockResolvedValue({ error: null });
  });

  afterEach(() => {
    cleanup();
  });

  it('pide la contraseña dos veces, y no el correo', () => {
    render(<InvitacionForm />);

    expect(screen.getByLabelText(/Tu contraseña/)).toBeTruthy();
    expect(screen.getByLabelText(/Repite la contraseña/)).toBeTruthy();
    expect(screen.queryByLabelText(/Correo/)).toBeNull();
  });

  it('canjea el ticket de la dirección con la contraseña elegida', async () => {
    const user = userEvent.setup();
    render(<InvitacionForm />);

    await user.type(screen.getByLabelText(/Tu contraseña/), 'MiClave2026');
    await user.type(
      screen.getByLabelText(/Repite la contraseña/),
      'MiClave2026',
    );
    await user.click(screen.getByRole('button', { name: /Activar mi cuenta/ }));

    expect(aceptar).toHaveBeenCalledWith('tk_123', 'MiClave2026');
  });

  it('no activa nada si las contraseñas no coinciden', async () => {
    const user = userEvent.setup();
    render(<InvitacionForm />);

    await user.type(screen.getByLabelText(/Tu contraseña/), 'MiClave2026');
    await user.type(
      screen.getByLabelText(/Repite la contraseña/),
      'OtraClave2026',
    );
    await user.click(screen.getByRole('button', { name: /Activar mi cuenta/ }));

    expect(await screen.findByText(/no coinciden/)).toBeTruthy();
    expect(aceptar).not.toHaveBeenCalled();
  });

  it('sin ticket explica el problema en vez de pedir una contraseña', () => {
    estado.params = new URLSearchParams();

    render(<InvitacionForm />);

    expect(screen.queryByLabelText(/Tu contraseña/)).toBeNull();
    expect(screen.getByText(/no sirve para activar/)).toBeTruthy();
  });

  it('avisa si el servicio de cuentas no responde', () => {
    estado.caido = true;

    render(<InvitacionForm />);

    expect(screen.getByRole('status').textContent).toContain(
      'servicio de cuentas',
    );
  });
});
