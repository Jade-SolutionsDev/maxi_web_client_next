import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResetPasswordForm } from '@/feature/auth/components/ResetPasswordForm';

const requestCode = vi.fn();
const resetPassword = vi.fn();
const resendCode = vi.fn();

const hookState = { codeSent: false };

vi.mock('@/feature/auth/hook/useResetPassword', () => ({
  useResetPassword: () => ({
    requestCode,
    resetPassword,
    resendCode,
    isSubmitting: false,
    isResending: false,
    resendError: null,
    codeSent: hookState.codeSent,
  }),
}));

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    requestCode.mockReset();
    resetPassword.mockReset();
    resendCode.mockReset();
    hookState.codeSent = false;
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the email step with a send-code button', () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText(/Correo electrónico/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Enviar código/ })).toBeTruthy();
  });

  it('requests a code with the entered email', async () => {
    requestCode.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(
      screen.getByLabelText(/Correo electrónico/),
      'john@email.com',
    );
    await user.click(screen.getByRole('button', { name: /Enviar código/ }));

    expect(requestCode).toHaveBeenCalledWith({ email: 'john@email.com' });
  });

  it('shows a mismatch error and does not submit when passwords differ', async () => {
    hookState.codeSent = true;
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText(/Código de verificación/), '424242');
    await user.type(screen.getByLabelText(/Contraseña/), 'supersecret');
    await user.type(screen.getByLabelText(/Confirmar/), 'different');

    await user.click(
      screen.getByRole('button', { name: /Cambiar contraseña/ }),
    );

    expect(await screen.findByText(/no coinciden/)).toBeTruthy();
    expect(resetPassword).not.toHaveBeenCalled();
  });
});
