import 'server-only';

import { type ApiResponse, apiAuth } from '@/api/http';
import { toAddress } from '../adapter/address.adapter';
import type { Address, AddressResponse } from '../type/address.interface';

const ADDRESSES_PATH = '/storefront/addresses';

const addressPath = (id: string) =>
  `${ADDRESSES_PATH}/${encodeURIComponent(id)}`;

/**
 * Body the API accepts. The province is deliberately absent: the API derives it
 * from the municipality, and sending it would create a second source of truth.
 */
export interface AddressPayload {
  label?: string;
  street: string;
  betweenStreets?: string;
  reference?: string;
  municipalityId: string;
  contactPhone?: string;
}

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
