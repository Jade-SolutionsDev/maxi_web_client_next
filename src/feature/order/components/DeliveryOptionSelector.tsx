'use client';

import { formatPrice } from '@/helpers';
import { plazoEnDiasHabiles } from '@/lib/plazo';
import { cn } from '@/lib/utils';
import type { DeliveryOption } from '../type/fulfillment.type';

/**
 * El plazo de la opción, si tiene uno. La tarifa estaba a la vista desde
 * MxH-0045 y el plazo no (MxH-0118): se elegía forma de entrega sabiendo lo que
 * costaba y no cuándo llegaba.
 *
 * Una opción sin plazo configurado no enseña nada —ni «—», ni un hueco—: es la
 * diferencia entre «no lo prometemos» y «lo prometemos vacío».
 */
const Plazo = ({ dias }: { dias: number | null }) =>
  dias === null || dias <= 0 ? null : (
    <span className='mt-0.5 block text-xs font-medium text-primary'>
      Listo en {plazoEnDiasHabiles(dias)}
    </span>
  );

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
  if (options.length === 0) return null;

  if (options.length === 1) {
    const [only] = options;

    return (
      <section
        aria-label='Forma de entrega'
        className='flex items-start gap-3 rounded-xl border border-input bg-surface p-3'
      >
        <span className='min-w-0 flex-1'>
          <span className='block text-sm font-semibold text-heading'>
            {only.label}
          </span>
          {only.description && (
            <span className='block text-xs text-muted'>{only.description}</span>
          )}
          <Plazo dias={only.promiseDays} />
        </span>
        <span className='shrink-0 text-sm font-bold text-total tabular-nums'>
          {only.fee > 0 ? formatPrice(only.fee) : 'Gratis'}
        </span>
      </section>
    );
  }

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
              <Plazo dias={option.promiseDays} />
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
