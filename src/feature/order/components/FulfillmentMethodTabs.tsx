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

/**
 * «Recogida en la tienda» lo decide Jade (9-oct-2026), y es la forma que se usa
 * en todas partes: aquí, en el panel y en los dos PDF de pedidos. Antes cada
 * sitio decía una cosa —«Recoger en tienda», «Recogida en el local», «Recogida
 * en mostrador»—, y el cliente que lee una y el empleado que lee otra no saben
 * que hablan de lo mismo.
 *
 * Esta pestaña había llegado a «el local» por un razonamiento que ya no vale:
 * que Maxi no tiene tiendas, solo puntos de recogida en sus almacenes. Es el
 * dueño quien nombra su negocio; queda escrito aquí para que nadie lo vuelva a
 * cambiar por el mismo motivo.
 *
 * Los subtítulos sí siguen el criterio de antes: ninguno repite la etiqueta, y
 * el de recogida no dice «lo buscas tú», que sonaba a reproche.
 */
const COPY: Record<FulfillmentType, { label: string; hint: string }> = {
  delivery: {
    label: 'Entrega a domicilio',
    hint: 'Enviamos el pedido a la dirección que indiques',
  },
  pickup: {
    label: 'Recogida en la tienda',
    hint: 'Pasas a buscarlo por el punto que elijas',
  },
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
        Forma de entrega
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
