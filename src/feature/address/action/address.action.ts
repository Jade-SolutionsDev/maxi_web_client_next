'use server';

import { revalidatePath } from 'next/cache';
import { toAddressFailure } from '../lib/address-error';
import {
  AddressFormSchema,
  type AddressFormValues,
  AddressIdSchema,
} from '../schema/address.schema';
import type { AddressPayload } from '../service/address.service';
import * as addresses from '../service/address.service';
import type { AddressActionResult } from '../type/address.interface';

const ADDRESSES_ROUTE = '/cuenta/direcciones';

// The form says "no value" with an empty string; the API wants the field absent.
const toPayload = (values: AddressFormValues): AddressPayload => ({
  street: values.street,
  municipalityId: values.municipalityId,
  label: values.label || undefined,
  betweenStreets: values.betweenStreets || undefined,
  reference: values.reference || undefined,
  contactPhone: values.contactPhone || undefined,
});

const attempt = async (
  run: () => Promise<void>,
): Promise<AddressActionResult> => {
  try {
    await run();
    revalidatePath(ADDRESSES_ROUTE);
    return { ok: true };
  } catch (error) {
    return { failure: toAddressFailure(error) };
  }
};

export const saveAddress = async (
  input: unknown,
): Promise<AddressActionResult> => {
  const parsed = AddressFormSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'invalid' } };

  return attempt(() => addresses.createAddress(toPayload(parsed.data)));
};

export const updateAddress = async (
  input: unknown,
): Promise<AddressActionResult> => {
  const parsed = AddressIdSchema.and(AddressFormSchema).safeParse(input);

  if (!parsed.success) return { failure: { kind: 'invalid' } };

  return attempt(() =>
    addresses.editAddress(parsed.data.id, toPayload(parsed.data)),
  );
};

export const deleteAddress = async (
  input: unknown,
): Promise<AddressActionResult> => {
  const parsed = AddressIdSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'invalid' } };

  return attempt(() => addresses.removeAddress(parsed.data.id));
};

export const makeAddressDefault = async (
  input: unknown,
): Promise<AddressActionResult> => {
  const parsed = AddressIdSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'invalid' } };

  return attempt(() => addresses.promoteAddress(parsed.data.id));
};
