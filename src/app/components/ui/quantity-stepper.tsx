'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  itemLabel?: string;
  /** `surface` = light chip (default). `primary` = filled accent, used when it replaces a CTA. */
  variant?: 'surface' | 'primary';
  className?: string;
}

const variantStyles = {
  surface: {
    root: 'gap-0.5 bg-background p-0.5',
    button:
      'rounded-lg text-primary hover:bg-black/5 focus-visible:ring-primary/40',
    value: 'rounded-lg bg-white text-heading shadow-sm',
  },
  primary: {
    root: 'bg-accent text-white',
    button:
      'first:rounded-l-xl last:rounded-r-xl text-white hover:brightness-90 focus-visible:ring-white/60',
    value: 'text-white',
  },
} as const;

export const QuantityStepper = ({
  value,
  onDecrease,
  onIncrease,
  min = 1,
  itemLabel,
  variant = 'surface',
  className,
}: QuantityStepperProps) => {
  const forItem = itemLabel ? ` de ${itemLabel}` : '';
  const theme = variantStyles[variant];

  return (
    <div className={cn('flex items-center rounded-xl', theme.root, className)}>
      <button
        type='button'
        onClick={onDecrease}
        disabled={value <= min}
        aria-label={`Quitar una unidad${forItem}`}
        className={cn(
          'flex size-8 shrink-0 items-center justify-center outline-none transition focus-visible:ring-2 disabled:opacity-40',
          theme.button,
        )}
      >
        <Minus className='size-4' aria-hidden='true' />
      </button>

      <output
        aria-label={`Cantidad${forItem}`}
        className={cn(
          'flex h-8 min-w-8 flex-1 items-center justify-center font-semibold tabular-nums',
          theme.value,
        )}
      >
        {value}
      </output>

      <button
        type='button'
        onClick={onIncrease}
        aria-label={`Agregar una unidad${forItem}`}
        className={cn(
          'flex size-8 shrink-0 items-center justify-center outline-none transition focus-visible:ring-2',
          theme.button,
        )}
      >
        <Plus className='size-4' aria-hidden='true' />
      </button>
    </div>
  );
};
