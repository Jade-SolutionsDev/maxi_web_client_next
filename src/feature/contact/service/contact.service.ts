import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { type ApiResponse, api, apiAuth } from '@/api/http';
import type {
  ContactMotive,
  ContactMotiveResponse,
} from '../type/contact.interface';

export interface ContactMessagePayload {
  motiveId: string;
  message: string;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export const getContactMotives = async (): Promise<ContactMotive[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('nomenclators');

  try {
    const { data } = await api<ApiResponse<ContactMotiveResponse[]>>(
      '/public/contact/motives',
    );
    return data.map((motive) => ({ id: motive.id, label: motive.label }));
  } catch {
    return [];
  }
};

export const sendContactMessage = async (
  payload: ContactMessagePayload,
): Promise<void> => {
  await api('/public/contact/messages', { method: 'POST', body: payload });
};

export const sendContactMessageAsClient = async (payload: {
  motiveId: string;
  message: string;
}): Promise<void> => {
  await apiAuth('/public/contact/messages', { method: 'POST', body: payload });
};
