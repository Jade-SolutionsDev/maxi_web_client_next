'use server';

import { getSessionToken } from '@/api/session';
import { toContactFailure } from '../lib/contact-error';
import {
  AnonymousContactSchema,
  ContactBaseSchema,
} from '../schema/contact.schema';
import {
  sendContactMessage,
  sendContactMessageAsClient,
} from '../service/contact.service';
import type { ContactActionResult } from '../type/contact.interface';

export const submitContactMessage = async (
  input: unknown,
): Promise<ContactActionResult> => {
  const token = await getSessionToken();

  try {
    if (token) {
      const parsed = ContactBaseSchema.safeParse(input);
      if (!parsed.success) return { failure: { kind: 'invalid' } };

      await sendContactMessageAsClient(parsed.data);
      return { ok: true };
    }

    const parsed = AnonymousContactSchema.safeParse(input);
    if (!parsed.success) return { failure: { kind: 'invalid' } };

    await sendContactMessage({
      ...parsed.data,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
    });
    return { ok: true };
  } catch (error) {
    return { failure: toContactFailure(error) };
  }
};
