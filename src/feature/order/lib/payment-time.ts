export const secondsUntil = (iso: string | null, now = Date.now()): number => {
  if (!iso) return 0;

  const target = Date.parse(iso);

  if (Number.isNaN(target)) return 0;

  return Math.max(0, Math.floor((target - now) / 1000));
};

/**
 * Seconds left, preferring what the server measured. Comparing `expiresAt`
 * against the browser clock breaks on any machine whose clock is off: a charge
 * with half an hour left reads as expired and the customer is told the payment
 * failed. The server's own count has no such dependency.
 */
export const remainingSeconds = (
  expiresInSeconds: number | null | undefined,
  expiresAt: string | null,
  elapsedSeconds = 0,
): number => {
  if (typeof expiresInSeconds === 'number') {
    return Math.max(0, expiresInSeconds - elapsedSeconds);
  }

  return secondsUntil(expiresAt);
};

export const formatCountdown = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
