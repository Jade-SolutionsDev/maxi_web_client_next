import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const signUp = vi.hoisted(() => ({
  emailAddress: 'invitado@example.com',
  create: vi.fn(),
  ticket: vi.fn(),
  update: vi.fn(),
  password: vi.fn(),
  finalize: vi.fn(),
}));

const push = vi.hoisted(() => vi.fn());

vi.mock('@clerk/nextjs', () => ({
  useSignUp: () => ({ signUp }),
  useClerk: () => ({ loaded: true }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

import { useAceptarInvitacion } from '@/feature/auth/hook/useAceptarInvitacion';

describe('Aceptar una invitación no vuelve a mandar el correo', () => {
  beforeEach(() => {
    signUp.create.mockReset().mockResolvedValue({ error: null });
    signUp.ticket.mockReset().mockResolvedValue({ error: null });
    signUp.update.mockReset().mockResolvedValue({ error: null });
    signUp.password.mockReset().mockResolvedValue({ error: null });
    signUp.finalize.mockReset().mockResolvedValue({ error: null });
    push.mockReset();
  });

  it('canjea el ticket y pone la contraseña en una sola llamada', async () => {
    const { result } = renderHook(() => useAceptarInvitacion());

    const { error } = await result.current.aceptar('tk_1', 'MiClave2026');

    expect(error).toBeNull();
    expect(signUp.create).toHaveBeenCalledWith({
      strategy: 'ticket',
      ticket: 'tk_1',
      password: 'MiClave2026',
    });
    expect(signUp.finalize).toHaveBeenCalledTimes(1);
  });

  it('nunca manda el correo, que el ticket ya trae verificado', async () => {
    const { result } = renderHook(() => useAceptarInvitacion());

    await result.current.aceptar('tk_1', 'MiClave2026');

    expect(signUp.password).not.toHaveBeenCalled();
    expect(signUp.update).not.toHaveBeenCalled();
    for (const [params] of signUp.create.mock.calls) {
      expect(params).not.toHaveProperty('emailAddress');
    }
  });

  it('devuelve el error del canje sin intentar cerrar el alta', async () => {
    signUp.create.mockResolvedValue({ error: { code: 'ticket_invalid' } });
    const { result } = renderHook(() => useAceptarInvitacion());

    const { error } = await result.current.aceptar('tk_1', 'MiClave2026');

    expect(error).toEqual({ code: 'ticket_invalid' });
    expect(signUp.finalize).not.toHaveBeenCalled();
  });
});
