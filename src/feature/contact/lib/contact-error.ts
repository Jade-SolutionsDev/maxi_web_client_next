import { ApiError } from '@/api/error';
import type { ContactFailure } from '../type/contact.interface';

export const toContactFailure = (error: unknown): ContactFailure => {
  if (!(error instanceof ApiError)) return { kind: 'unknown' };

  if (error.status === 429) return { kind: 'rate-limited' };
  if (error.status === 400 || error.status === 422) return { kind: 'invalid' };

  return { kind: 'unknown' };
};
