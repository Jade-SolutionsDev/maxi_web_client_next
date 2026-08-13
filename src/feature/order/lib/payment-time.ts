export const secondsUntil = (iso: string | null, now = Date.now()): number => {
  if (!iso) return 0;

  const target = Date.parse(iso);

  if (Number.isNaN(target)) return 0;

  return Math.max(0, Math.floor((target - now) / 1000));
};

export const formatCountdown = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
