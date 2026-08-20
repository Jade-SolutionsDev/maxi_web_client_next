'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCountdown, secondsUntil } from '../lib/payment-time';

interface PaymentCountdownProps {
  expiresAt: string;
  onExpire: () => void;
}

export const PaymentCountdown = ({
  expiresAt,
  onExpire,
}: PaymentCountdownProps) => {
  const [remaining, setRemaining] = useState(() => secondsUntil(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      const next = secondsUntil(expiresAt);
      setRemaining(next);

      if (next <= 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  return (
    <p className='flex items-center justify-center gap-2 text-sm font-semibold text-heading tabular-nums'>
      <Clock className='size-4 shrink-0 text-muted' aria-hidden='true' />
      Tiempo restante: {formatCountdown(remaining)}
    </p>
  );
};
