'use client';

import { Check, MapPin, Plus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/app/components/form/FormInput';
import { AddressMunicipalityFields } from '@/feature/address/components/AddressMunicipalityFields';
import type { Address } from '@/feature/address/type/address.interface';
import { cn } from '@/lib/utils';
import type { LocationCatalog } from '@/shared/location/type/location.interface';

interface CheckoutAddressSelectorProps {
  addresses: Address[];
  catalog: LocationCatalog;
  zone: { municipalityId: string; municipalityName: string } | null;
  value: string;
  onChange: (addressId: string) => void;
  disabled?: boolean;
}

export const NEW_ADDRESS = '';

export const CheckoutAddressSelector = ({
  addresses,
  catalog,
  zone,
  value,
  onChange,
  disabled,
}: CheckoutAddressSelectorProps) => {
  const { formState, register } = useFormContext();
  const usingNew = value === NEW_ADDRESS;
  const error = formState.errors.addressId?.message;

  return (
    <fieldset className='flex flex-col gap-2' disabled={disabled}>
      <legend className='mb-2 text-sm font-medium text-heading'>
        Dirección de entrega
      </legend>

      {addresses.map((address) => {
        const selected = address.id === value;

        return (
          <label
            key={address.id}
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
              name='addressId'
              className='sr-only'
              checked={selected}
              onChange={() => onChange(address.id)}
            />
            <MapPin
              className={cn(
                'mt-0.5 size-4 shrink-0',
                selected ? 'text-primary' : 'text-muted',
              )}
              aria-hidden='true'
            />
            <span className='min-w-0 flex-1'>
              <span className='block text-sm font-semibold text-heading'>
                {address.label ?? address.street}
                {address.isDefault && (
                  <span className='ml-2 rounded bg-surface px-1.5 py-0.5 text-xs font-normal text-muted'>
                    Predeterminada
                  </span>
                )}
              </span>
              <span className='block text-sm text-muted'>
                {address.street}
                {address.betweenStreets ? `, ${address.betweenStreets}` : ''} ·{' '}
                {address.municipalityName}
              </span>
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

      {/*
        Solo cuando hay algo entre lo que elegir. Sin direcciones guardadas el
        formulario ya sale abierto debajo, y esta fila era un botón aparente
        que no hacía nada (MxH-0104).
      */}
      {addresses.length > 0 && (
        <label
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors',
            usingNew
              ? 'border-primary bg-primary/5'
              : 'border-input hover:bg-surface',
            disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          <input
            type='radio'
            name='addressId'
            className='sr-only'
            checked={usingNew}
            onChange={() => onChange(NEW_ADDRESS)}
          />
          <Plus
            className={cn(
              'size-4 shrink-0',
              usingNew ? 'text-primary' : 'text-muted',
            )}
            aria-hidden='true'
          />
          <span className='text-sm font-semibold text-heading'>
            Usar otra dirección
          </span>
        </label>
      )}

      {zone && (
        <p className='text-xs text-muted'>
          Solo mostramos direcciones en <strong>{zone.municipalityName}</strong>
          , la zona que estás viendo. Para enviar a otra, cambia la zona arriba.
        </p>
      )}

      {error && <p className='text-sm text-destructive'>{String(error)}</p>}

      {usingNew && (
        <div className='mt-2 flex flex-col gap-4 rounded-xl border border-input p-3'>
          {/* Dos columnas en escritorio, una en móvil (MxH-0104). */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormInput
              name='street'
              label='Calle y número'
              placeholder='Calle 23 #456'
              autoComplete='street-address'
              required
            />
            <FormInput
              name='betweenStreets'
              label='Entre calles (opcional)'
              placeholder='Entre 10 y 12'
            />
            <FormInput
              name='reference'
              label='Referencia (opcional)'
              placeholder='Edificio azul, al lado de la panadería'
              className='md:col-span-2'
            />
          </div>
          {/*
            Sin zona hay que preguntar el municipio. Con zona no se dice nada:
            la línea de arriba ya explica en cuál estamos y cómo cambiarla.
          */}
          {!zone && <AddressMunicipalityFields catalog={catalog} />}
          <label className='flex cursor-pointer items-center gap-2 text-sm text-heading'>
            <input
              type='checkbox'
              className='size-4 rounded border-input accent-primary'
              {...register('saveAddress')}
            />
            Guardar en mis direcciones
          </label>
        </div>
      )}
    </fieldset>
  );
};
