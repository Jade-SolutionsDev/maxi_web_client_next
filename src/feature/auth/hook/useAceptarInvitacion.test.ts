import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const signUp = vi.hoisted(() => ({
  emailAddress: 'invitado@example.com',
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
    signUp.ticket.mockReset().mockResolvedValue({ error: null });
    signUp.update.mockReset().mockResolvedValue({ error: null });
    signUp.password.mockReset().mockResolvedValue({ error: null });
    signUp.finalize.mockReset().mockResolvedValue({ error: null });
    push.mockReset();
  });

  it('pone la contraseña sin tocar el correo', async () => {
    const { result } = renderHook(() => useAceptarInvitacion());

    const { error } = await result.current.aceptar('tk_1', 'MiClave2026');

    expect(error).toBeNull();
    expect(signUp.ticket).toHaveBeenCalledWith({ ticket: 'tk_1' });
    expect(signUp.update).toHaveBeenCalledWith({ password: 'MiClave2026' });
    expect(signUp.password).not.toHaveBeenCalled();
    expect(signUp.finalize).toHaveBeenCalledTimes(1);
  });

  it('se planta si el ticket no trae correo', async () => {
    signUp.emailAddress = '';
    const { result } = renderHook(() => useAceptarInvitacion());

    const { error } = await result.current.aceptar('tk_1', 'MiClave2026');

    expect(error).toEqual({ code: 'invitation_without_email' });
    expect(signUp.update).not.toHaveBeenCalled();
    signUp.emailAddress = 'invitado@example.com';
  });

  it('devuelve el error del canje sin seguir adelante', async () => {
    signUp.ticket.mockResolvedValue({ error: { code: 'ticket_invalid' } });
    const { result } = renderHook(() => useAceptarInvitacion());

    const { error } = await result.current.aceptar('tk_1', 'MiClave2026');

    expect(error).toEqual({ code: 'ticket_invalid' });
    expect(signUp.update).not.toHaveBeenCalled();
    expect(signUp.finalize).not.toHaveBeenCalled();
  });
});
