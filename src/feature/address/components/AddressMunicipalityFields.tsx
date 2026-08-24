'use client';

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
