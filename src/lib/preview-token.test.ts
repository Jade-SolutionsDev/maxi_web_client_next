import { describe, expect, it } from 'vitest';
import { verifyPreviewToken } from './preview-token';

const SECRET = 'dev-revalidate-secret';
const TOKEN = '1790000000.1pUXbrHlhVQUCIGKUhmKV0QxiyP58FE8WiFcXUor8is';
const BEFORE_EXPIRY = new Date('2026-09-21T14:00:00Z');

describe('verifyPreviewToken', () => {
  it('accepts the vector the API signs, before it expires', () => {
    expect(verifyPreviewToken(SECRET, TOKEN, BEFORE_EXPIRY)).toBe(true);
  });

  it('rejects it once it expired', () => {
    expect(
      verifyPreviewToken(SECRET, TOKEN, new Date('2026-09-21T14:13:21Z')),
    ).toBe(false);
  });

  it('rejects it with another secret', () => {
    expect(verifyPreviewToken('otro-secreto', TOKEN, BEFORE_EXPIRY)).toBe(
      false,
    );
  });

  it('rejects an expiry pushed forward by hand', () => {
    const forged = TOKEN.replace('1790000000', '1890000000');

    expect(verifyPreviewToken(SECRET, forged, BEFORE_EXPIRY)).toBe(false);
  });

  it('rejects a missing secret or a malformed token', () => {
    expect(verifyPreviewToken('', TOKEN, BEFORE_EXPIRY)).toBe(false);
    expect(verifyPreviewToken(SECRET, '', BEFORE_EXPIRY)).toBe(false);
    expect(verifyPreviewToken(SECRET, 'abc.def', BEFORE_EXPIRY)).toBe(false);
  });
});
