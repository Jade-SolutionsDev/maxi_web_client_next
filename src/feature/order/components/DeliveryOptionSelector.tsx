'use client';

import { formatPrice } from '@/helpers';
import { cn } from '@/lib/utils';
import type { DeliveryOption } from '../type/fulfillment.type';

interface DeliveryOptionSelectorProps {
  options: DeliveryOption[];
  value?: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export const DeliveryOptionSelector = ({
  options,
  value,
  onChange,
  disabled,
}: DeliveryOptionSelectorProps) => {
  if (options.length < 2) return null;

  return (
    <fieldset className='flex flex-col gap-2' disabled={disabled}>
      <legend className='mb-2 text-sm font-medium text-heading'>
        Forma de entrega
      </legend>

      {options.map((option) => {
        const selected = option.id === value;

        return (
          <label
            key={option.id}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
              selected
                ? 'border-primary bg-primary/5'
                : 'border-input hover:bg-surface',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <input
              type='radio'
              name='deliveryOptionId'
              className='sr-only'
              checked={selected}
              onChange={() => onChange(option.id)}
            />
            <span className='min-w-0 flex-1'>
              <span className='block text-sm font-semibold text-heading'>
                {option.label}
              </span>
              {option.description && (
                <span className='block text-xs text-muted'>
                  {option.description}
                </span>
              )}
            </span>
            <span className='shrink-0 text-sm font-bold text-total tabular-nums'>
              {option.fee > 0 ? formatPrice(option.fee) : 'Gratis'}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
};
