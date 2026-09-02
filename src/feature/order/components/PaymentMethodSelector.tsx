'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '../type/order.type';
import { PaymentMethodIcon } from './PaymentMethodIcon';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  value: string;
  onChange: (code: string) => void;
  legend?: string;
  disabled?: boolean;
}

export const PaymentMethodSelector = ({
  methods,
  value,
  onChange,
  legend = 'Forma de pago',
  disabled,
}: PaymentMethodSelectorProps) => {
  if (methods.length === 0) return null;

  if (methods.length === 1) {
    const [method] = methods;
    if (!method) return null;

    return (
      <div className='flex flex-col gap-2'>
        <p className='mb-2 text-sm font-medium text-heading'>{legend}</p>
        <div
          className={cn(
            'flex items-start gap-3 rounded-xl border border-primary bg-primary/5 p-3',
            disabled && 'opacity-60',
          )}
        >
          <PaymentMethodIcon
            icon={method.icon}
            className='mt-0.5 size-5 shrink-0 text-primary'
          />
          <span className='min-w-0 flex-1'>
            <span className='block text-sm font-semibold text-heading'>
              {method.label}
            </span>
            {method.description && (
              <span className='block text-xs text-muted'>
                {method.description}
              </span>
            )}
          </span>
          <Check
            className='size-4 shrink-0 text-primary'
            aria-hidden='true'
          />
        </div>
      </div>
    );
  }

  return (
    <fieldset className='flex flex-col gap-2' disabled={disabled}>
      <legend className='mb-2 text-sm font-medium text-heading'>
        {legend}
      </legend>

      {methods.map((method) => {
        const selected = method.code === value;

        return (
          <label
            key={method.code}
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
              name='paymentMethod'
              value={method.code}
              checked={selected}
              onChange={() => onChange(method.code)}
              className='sr-only'
            />
            <PaymentMethodIcon
              icon={method.icon}
              className='mt-0.5 size-5 shrink-0 text-primary'
            />
            <span className='min-w-0 flex-1'>
              <span className='block text-sm font-semibold text-heading'>
                {method.label}
              </span>
              {method.description && (
                <span className='block text-xs text-muted'>
                  {method.description}
                </span>
              )}
            </span>
            {selected && (
              <Check
                className='size-4 shrink-0 text-primary'
                aria-hidden='true'
              />
            )}
          </label>
        );
      })}
    </fieldset>
  );
};
