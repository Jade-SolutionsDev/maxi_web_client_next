import { describe, expect, it } from 'vitest';
import { AnonymousContactSchema, ContactBaseSchema } from './contact.schema';

const base = {
  motiveId: 'f3f09219-18cc-44ec-b297-41853727c21e',
  message: 'Necesito ayuda con mi último pedido, por favor.',
  name: 'Ana',
  lastName: 'Pérez',
};

describe('AnonymousContactSchema', () => {
  it('acepta un envío con solo correo', () => {
    const result = AnonymousContactSchema.safeParse({
      ...base,
      email: 'ana@ejemplo.com',
    });
    expect(result.success).toBe(true);
  });

  it('acepta un envío con solo teléfono', () => {
    const result = AnonymousContactSchema.safeParse({
      ...base,
      phone: '+53 5 123 4567',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza un envío sin correo ni teléfono', () => {
    const result = AnonymousContactSchema.safeParse(base);
    expect(result.success).toBe(false);
  });

  it('rechaza mensajes demasiado cortos', () => {
    const result = AnonymousContactSchema.safeParse({
      ...base,
      email: 'ana@ejemplo.com',
      message: 'Hola',
    });
    expect(result.success).toBe(false);
  });

  it('exige nombre y apellidos', () => {
    const result = AnonymousContactSchema.safeParse({
      ...base,
      name: '',
      email: 'ana@ejemplo.com',
    });
    expect(result.success).toBe(false);
  });
});

describe('ContactBaseSchema', () => {
  it('solo exige motivo y mensaje (remitente con sesión)', () => {
    const result = ContactBaseSchema.safeParse({
      motiveId: base.motiveId,
      message: base.message,
    });
    expect(result.success).toBe(true);
  });

  it('deja pasar el honeypot como texto libre', () => {
    const result = ContactBaseSchema.safeParse({
      motiveId: base.motiveId,
      message: base.message,
      website: 'http://spam.example',
    });
    expect(result.success).toBe(true);
  });
});
