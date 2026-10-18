import 'server-only';

import { type ApiResponse, apiAuth } from '@/api/http';
import { toAddress } from '../adapter/address.adapter';
import type { AddressPayload } from '../lib/address-payload';
import type { Address, AddressResponse } from '../type/address.interface';

// Reexportado: el tipo vive en `lib/` para poder probarlo sin `server-only`,
// y quien ya lo importaba desde aquí sigue funcionando.
export type { AddressPayload };

const ADDRESSES_PATH = '/storefront/addresses';

const addressPath = (id: string) =>
  `${ADDRESSES_PATH}/${encodeURIComponent(id)}`;

export const getAddresses = async (): Promise<Address[]> => {
  const { data } =
    await apiAuth<ApiResponse<AddressResponse[]>>(ADDRESSES_PATH);

  return data.map(toAddress);
};

export const createAddress = async (payload: AddressPayload): Promise<void> => {
  await apiAuth(ADDRESSES_PATH, { method: 'POST', body: payload });
};

export const editAddress = async (
  id: string,
  payload: AddressPayload,
): Promise<void> => {
  await apiAuth(addressPath(id), { method: 'PATCH', body: payload });
};

export const removeAddress = async (id: string): Promise<void> => {
  await apiAuth(addressPath(id), { method: 'DELETE' });
};

export const promoteAddress = async (id: string): Promise<void> => {
  await apiAuth(`${addressPath(id)}/default`, { method: 'PATCH' });
};
