'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  itemLabel?: string;
  className?: string;
}

export const QuantityStepper = ({
  value,
  onDecrease,
  onIncrease,
  min = 1,
  itemLabel,
  className,
}: QuantityStepperProps) => {
  const forItem = itemLabel ? ` de ${itemLabel}` : '';

  return (
    <div
      className={cn('flex items-center rounded-xl bg-background', className)}
    >
      <button
        type='button'
        onClick={onDecrease}
        disabled={value <= min}
        aria-label={`Quitar una unidad${forItem}`}
        className='flex size-10 items-center justify-center rounded-l-xl text-secondary outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-40'
      >
        <Minus className='size-4' aria-hidden='true' />
      </button>

      <output
        aria-label={`Cantidad${forItem}`}
        className='w-8 text-center font-medium text-heading'
      >
        {value}
      </output>

      <button
        type='button'
        onClick={onIncrease}
        aria-label={`Agregar una unidad${forItem}`}
        className='flex size-10 items-center justify-center rounded-r-xl text-secondary outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-primary/40'
      >
        <Plus className='size-4' aria-hidden='true' />
      </button>
    </div>
  );
};
