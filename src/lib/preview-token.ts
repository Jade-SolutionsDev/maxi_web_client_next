import { createHmac, timingSafeEqual } from 'node:crypto';

const PURPOSE = 'cms-home-preview';

const sign = (secret: string, expiresAtSeconds: number) =>
  createHmac('sha256', secret)
    .update(`${PURPOSE}:${expiresAtSeconds}`)
    .digest('base64url');

export const verifyPreviewToken = (
  secret: string,
  token: string,
  now: Date = new Date(),
): boolean => {
  const [expiry, signature, ...rest] = token.split('.');
  if (!secret || !expiry || !signature || rest.length) return false;

  const expiresAtSeconds = Number(expiry);
  if (!Number.isInteger(expiresAtSeconds)) return false;
  if (expiresAtSeconds * 1000 < now.getTime()) return false;

  const expected = Buffer.from(sign(secret, expiresAtSeconds));
  const received = Buffer.from(signature);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
};
