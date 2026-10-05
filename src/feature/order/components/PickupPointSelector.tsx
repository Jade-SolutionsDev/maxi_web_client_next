'use client';

import { MapPin } from 'lucide-react';
import { plazoEnDiasHabiles } from '@/lib/plazo';
import { cn } from '@/lib/utils';
import type { PickupPoint } from '../type/fulfillment.type';

interface PickupPointSelectorProps {
  points: PickupPoint[];
  value?: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  /**
   * El plazo de la recogida (MxH-0118). Va aquí y no en cada punto porque sale
   * de los ajustes de entrega: es el mismo en todos los mostradores.
   */
  promiseDays?: number | null;
}

export const PickupPointSelector = ({
  points,
  value,
  onChange,
  disabled,
  promiseDays,
}: PickupPointSelectorProps) => (
  <fieldset className='flex flex-col gap-2' disabled={disabled}>
    <legend className='mb-2 text-sm font-medium text-heading'>
      ¿Dónde lo recoges?
    </legend>

    {promiseDays != null && promiseDays > 0 && (
      <p className='-mt-1 mb-1 text-xs font-medium text-primary'>
        Listo en {plazoEnDiasHabiles(promiseDays)} desde que recibamos el pago
      </p>
    )}

    {points.map((point) => {
      const selected = point.id === value;

      return (
        <label
          key={point.id}
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
            name='pickupAddressId'
            className='sr-only'
            checked={selected}
            onChange={() => onChange(point.id)}
          />
          <MapPin
            className={cn(
              'mt-0.5 size-4 shrink-0',
              selected ? 'text-primary' : 'text-muted',
            )}
            aria-hidden='true'
          />
          <span className='min-w-0'>
            <span className='block text-sm font-semibold text-heading'>
              {point.locationName}
              {point.label ? ` · ${point.label}` : ''}
            </span>
            <span className='block text-sm text-muted'>{point.address}</span>
          </span>
        </label>
      );
    })}
  </fieldset>
);
