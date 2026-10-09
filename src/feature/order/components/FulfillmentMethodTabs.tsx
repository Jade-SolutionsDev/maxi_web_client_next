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
 * «Recoger en tienda» nombraba algo que no existe: Maxi no tiene tiendas, tiene
 * puntos de recogida en sus almacenes. Lo llamaban así solo aquí — el panel
 * gestiona «puntos de recogida», los datos dicen «Mostrador Cárdenas» y tres
 * pasos más abajo este mismo checkout pregunta «¿dónde quieres recoger tu
 * pedido?»—, así que quien lo leía podía salir a buscar un comercio que no hay.
 *
 * Y los subtítulos no aportaban nada: uno repetía la etiqueta y el otro, «lo
 * buscas tú», sonaba a reproche, como si recoger fuera la opción de segunda.
 */
const COPY: Record<FulfillmentType, { label: string; hint: string }> = {
  delivery: {
    label: 'Entrega a domicilio',
    hint: 'Enviamos el pedido a la dirección que indiques',
  },
  pickup: {
    label: 'Recogida en el local',
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
