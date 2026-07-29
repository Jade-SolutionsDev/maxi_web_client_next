'use client';

import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clamp } from '@/helpers';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  /** Reports the quantity the user asked for, already clamped to `min`/`max`. */
  onChange: (value: number) => void;
  onLimitReached?: (max: number) => void;
  min?: number;
  max?: number;
  itemLabel?: string;
  /** `surface` = light chip (default). `primary` = filled accent, used when it replaces a CTA. */
  variant?: 'surface' | 'primary';
  /** `sm` = compact chip (default). `lg` = matches a full-size CTA next to it. */
  size?: 'sm' | 'lg';
  className?: string;
}

const variantStyles = {
  surface: {
    root: 'gap-0.5 bg-background p-0.5',
    button:
      'rounded-lg text-primary hover:bg-black/5 focus-visible:ring-primary/40',
    value:
      'rounded-lg bg-white text-heading shadow-sm focus-visible:ring-primary/40',
  },
  primary: {
    root: 'bg-accent text-white',
    button:
      'first:rounded-l-xl last:rounded-r-xl text-white hover:brightness-90 focus-visible:ring-white/60',
    value: 'bg-transparent text-white focus-visible:ring-white/60',
  },
} as const;

const sizeStyles = {
  sm: { button: 'size-8', value: 'h-8 w-8 min-w-8' },
  lg: { button: 'size-10', value: 'h-10 w-10 min-w-10 text-lg' },
} as const;

export const QuantityStepper = ({
  value,
  onChange,
  onLimitReached,
  min = 1,
  max = Number.POSITIVE_INFINITY,
  itemLabel,
  variant = 'surface',
  size = 'sm',
  className,
}: QuantityStepperProps) => {
  const forItem = itemLabel ? ` de ${itemLabel}` : '';
  const theme = variantStyles[variant];
  const scale = sizeStyles[size];

  const [draft, setDraft] = useState(String(value));
  const isAtMax = value >= max;

  useEffect(() => setDraft(String(value)), [value]);

  const commit = (requested: number) => {
    if (requested > max) onLimitReached?.(max);
    onChange(clamp(requested, min, max));
  };

  const handleInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const parsed = Number(digits);

    if (digits !== '' && parsed > max) {
      setDraft(String(max));
      commit(parsed);
      return;
    }

    setDraft(digits);
    if (digits !== '' && parsed >= min) commit(parsed);
  };

  const handleBlur = () => {
    const parsed = Number(draft);
    const next = draft === '' || parsed < min ? min : clamp(parsed, min, max);

    setDraft(String(next));
    onChange(next);
  };

  return (
    <div className={cn('flex items-center rounded-xl', theme.root, className)}>
      <button
        type='button'
        onClick={(e) => {
          e.preventDefault();
          onChange(clamp(value - 1, min, max));
        }}
        disabled={value <= min}
        aria-label={`Quitar una unidad${forItem}`}
        className={cn(
          'flex shrink-0 items-center justify-center outline-none transition focus-visible:ring-2 disabled:opacity-40',
          scale.button,
          theme.button,
        )}
      >
        <Minus className='size-4' aria-hidden='true' />
      </button>

      <input
        type='text'
        inputMode='numeric'
        pattern='[0-9]*'
        value={draft}
        onChange={(e) => handleInput(e.target.value)}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        aria-label={`Cantidad${forItem}`}
        className={cn(
          'flex-1 text-center font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-inset',
          scale.value,
          theme.value,
        )}
      />

      <button
        type='button'
        onClick={(e) => {
          e.preventDefault();
          commit(value + 1);
        }}
        aria-disabled={isAtMax}
        aria-label={`Agregar una unidad${forItem}`}
        className={cn(
          'flex shrink-0 items-center justify-center outline-none transition focus-visible:ring-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-40',
          scale.button,
          theme.button,
        )}
      >
        <Plus className='size-4' aria-hidden='true' />
      </button>
    </div>
  );
};
