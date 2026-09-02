'use client';

import { Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatCountdown, remainingSeconds } from '../lib/payment-time';

interface PaymentCountdownProps {
  expiresAt: string | null;
  expiresInSeconds: number | null;
  onExpire: () => void;
}

export const PaymentCountdown = ({
  expiresAt,
  expiresInSeconds,
  onExpire,
}: PaymentCountdownProps) => {
  const startedAt = useRef(Date.now());
  const [remaining, setRemaining] = useState(() =>
    remainingSeconds(expiresInSeconds, expiresAt),
  );

  useEffect(() => {
    startedAt.current = Date.now();
    setRemaining(remainingSeconds(expiresInSeconds, expiresAt));
  }, [expiresAt, expiresInSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      const next = remainingSeconds(expiresInSeconds, expiresAt, elapsed);
      setRemaining(next);

      if (next <= 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, expiresInSeconds, onExpire]);

  return (
    <p className='flex items-center justify-center gap-2 text-sm font-semibold text-heading tabular-nums'>
      <Clock className='size-4 shrink-0 text-muted' aria-hidden='true' />
      Tiempo restante: {formatCountdown(remaining)}
    </p>
  );
};
