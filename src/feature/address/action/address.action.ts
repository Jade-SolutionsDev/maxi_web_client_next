'use server';

import { revalidatePath } from 'next/cache';
import { toAddressFailure } from '../lib/address-error';
import { toAddressPayload as toPayload } from '../lib/address-payload';
import { AddressFormSchema, AddressIdSchema } from '../schema/address.schema';
import * as addresses from '../service/address.service';
import type { AddressActionResult } from '../type/address.interface';

const ADDRESSES_ROUTE = '/direcciones';

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
