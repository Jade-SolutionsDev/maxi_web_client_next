'use client';

import { Store, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FulfillmentType } from '../type/fulfillment.type';

interface FulfillmentMethodTabsProps {
  available: FulfillmentType[];
  value: FulfillmentType;
  onChange: (value: FulfillmentType) => void;
  disabled?: boolean;
}

const COPY: Record<FulfillmentType, { label: string; hint: string }> = {
  delivery: { label: 'Entrega a domicilio', hint: 'Te lo llevamos' },
  pickup: { label: 'Recoger en tienda', hint: 'Lo buscás vos' },
};

const ICONS = { delivery: Truck, pickup: Store };

export const FulfillmentMethodTabs = ({
  available,
  value,
  onChange,
  disabled,
}: FulfillmentMethodTabsProps) => {
  if (available.length < 2) return null;

  return (
    <fieldset className='flex flex-col gap-2' disabled={disabled}>
      <legend className='mb-2 text-sm font-medium text-heading'>
        ¿Cómo querés recibirlo?
      </legend>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
        {available.map((method) => {
          const Icon = ICONS[method];
          const selected = method === value;

          return (
            <label
              key={method}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors',
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-input hover:bg-surface',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              <input
                type='radio'
                name='fulfillmentType'
                className='sr-only'
                checked={selected}
                onChange={() => onChange(method)}
              />
              <Icon
                className={cn(
                  'size-5 shrink-0',
                  selected ? 'text-primary' : 'text-muted',
                )}
                aria-hidden='true'
              />
              <span className='min-w-0'>
                <span className='block text-sm font-semibold text-heading'>
                  {COPY[method].label}
                </span>
                <span className='block text-xs text-muted'>
                  {COPY[method].hint}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
