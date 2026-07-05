import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterForm } from '@/feature/auth/components/RegisterForm';

const register = vi.fn();

vi.mock('@/feature/auth/hook/useSignUp', () => ({
  useSignUp: () => ({
    register,
    errors: { fields: {} },
    isSubmitting: false,
    emailSent: false,
  }),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    register.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the four fields and the submit button', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/Nombre/)).toBeTruthy();
    expect(screen.getByLabelText(/Correo electrónico/)).toBeTruthy();
    expect(screen.getByLabelText(/Contraseña/)).toBeTruthy();
    expect(screen.getByLabelText(/Confirmar/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Crear cuenta/ })).toBeTruthy();
  });

  it('shows a mismatch error and does not submit when passwords differ', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/Nombre/), 'John Pérez');
    await user.type(
      screen.getByLabelText(/Correo electrónico/),
      'john@email.com',
    );
    await user.type(screen.getByLabelText(/Contraseña/), 'supersecret');
    await user.type(screen.getByLabelText(/Confirmar/), 'different');

    await user.click(screen.getByRole('button', { name: /Crear cuenta/ }));

    expect(await screen.findByText(/no coinciden/)).toBeTruthy();
    expect(register).not.toHaveBeenCalled();
  });
});
