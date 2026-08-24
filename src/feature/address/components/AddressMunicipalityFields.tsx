'use client';

import { MapPinOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormSelect } from '@/app/components/form/FormSelect';
import type { LocationCatalog } from '@/shared/location/type/location.interface';
import type { AddressFormValues } from '../schema/address.schema';

/**
 * Province narrows the municipality list; only the municipality is ever sent.
 * Changing province clears the chosen municipality, so a form can never end up
 * carrying a municipality that belongs to a different province.
 */
export const AddressMunicipalityFields = ({
  catalog,
}: {
  catalog: LocationCatalog;
}) => {
  'use no memo';

  const { watch, setValue } = useFormContext<AddressFormValues>();
  const provinceId = watch('provinceId');

  const provinceOptions = catalog.provinces.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  const municipalityOptions = (
    catalog.municipalitiesByProvince[provinceId] ?? []
  ).map((municipality) => ({
    value: municipality.id,
    label: municipality.name,
  }));

  /**
   * The API only lists provinces an active storage can deliver to, so an empty
   * catalog is a real state, not a bug: it means nowhere is being served right
   * now. Saying so beats two silent, empty dropdowns the customer cannot use
   * and cannot understand.
   */
  if (catalog.provinces.length === 0) {
    return (
      <div className='flex items-start gap-3 rounded-lg border border-heading/10 bg-heading/[0.03] p-3'>
        <MapPinOff
          aria-hidden='true'
          className='mt-0.5 size-4 shrink-0 text-heading/50'
        />
        <p className='text-heading/70 text-sm'>
          Ahora mismo no hay zonas con entrega disponible, así que no puedes
          guardar una dirección todavía. Inténtalo más tarde o escríbenos.
        </p>
      </div>
    );
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <FormSelect
        name='provinceId'
        label='Provincia'
        required
        placeholder='Elige la provincia'
        options={provinceOptions}
        onValueChange={() =>
          setValue('municipalityId', '', { shouldValidate: false })
        }
      />

      <FormSelect
        name='municipalityId'
        label='Municipio'
        required
        placeholder={
          provinceId ? 'Elige el municipio' : 'Elige antes la provincia'
        }
        disabled={!provinceId}
        options={municipalityOptions}
      />
    </div>
  );
};
