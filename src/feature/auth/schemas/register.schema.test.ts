import { describe, expect, it } from 'vitest';
import { RegisterSchema } from '@/feature/auth/schemas/register.schema';

const valid = {
  name: 'John Pérez',
  email: 'john@email.com',
  password: 'supersecret',
  confirmPassword: 'supersecret',
};

describe('RegisterSchema', () => {
  it('accepts a valid payload', () => {
    const result = RegisterSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = RegisterSchema.safeParse({ ...valid, email: 'nope' });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 chars', () => {
    const result = RegisterSchema.safeParse({
      ...valid,
      password: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords with the confirmPassword path', () => {
    const result = RegisterSchema.safeParse({
      ...valid,
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes('confirmPassword'),
      );
      expect(issue?.message).toBe('Las contraseñas no coinciden');
    }
  });
});
