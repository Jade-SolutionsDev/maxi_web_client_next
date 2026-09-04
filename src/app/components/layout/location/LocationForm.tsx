'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormSelect } from '@/app/components/form/FormSelect';
import { Button } from '@/app/components/ui/button';
import {
  LocationFormSchema,
  type LocationFormSchemaType,
} from '@/shared/location/schema/location.schema';
import type {
  LocationOption,
  SelectedLocation,
} from '@/shared/location/type/location.interface';

const selectTriggerClass =
  'border-2 border-heading/15 bg-white text-heading shadow-sm transition-colors hover:border-heading/35 data-popup-open:border-heading/70 disabled:bg-white/60';

const selectContentClass =
  'rounded-xl bg-white p-1.5 ring-heading/10 [&_[data-slot=select-item]]:rounded-lg [&_[data-slot=select-item]]:py-2.5 [&_[data-slot=select-item]]:text-base';

const selectIconClass = 'size-5 text-heading';

interface LocationFormProps {
  provinces: LocationOption[];
  municipalitiesByProvince: Record<string, LocationOption[]>;
  selected?: SelectedLocation | null;
  onSubmit: (input: LocationFormSchemaType) => Promise<{ error?: string }>;
}

export const LocationForm = ({
  provinces,
  municipalitiesByProvince,
  selected,
  onSubmit,
}: LocationFormProps) => {
  'use no memo';

  const form = useForm<LocationFormSchemaType>({
    resolver: zodResolver(LocationFormSchema),
    defaultValues: {
      provinceId: selected?.provinceId ?? '',
      municipalityId: selected?.municipalityId ?? '',
    },
  });

  const provinceId = useWatch({ control: form.control, name: 'provinceId' });
  const municipalityOptions = municipalitiesByProvince[provinceId] ?? [];

  const handleSubmit = async (values: LocationFormSchemaType) => {
    form.clearErrors();

    const { error } = await onSubmit(values);
    if (!error) return;

    form.setError('root', { message: error });
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      {form.formState.errors.root && (
        <p className='text-sm text-red-500' role='alert'>
          {form.formState.errors.root.message}
        </p>
      )}

      <FormSelect
        name='provinceId'
        label='Provincia'
        placeholder='Elige tu provincia'
        options={provinces}
        size='lg'
        icon={<MapPin className={selectIconClass} aria-hidden='true' />}
        triggerClassName={selectTriggerClass}
        contentClassName={selectContentClass}
        required
        onValueChange={() =>
          form.resetField('municipalityId', { defaultValue: '' })
        }
      />

      <FormSelect
        name='municipalityId'
        label='Municipio'
        placeholder='Elige tu municipio'
        options={municipalityOptions}
        size='lg'
        icon={<Building2 className={selectIconClass} aria-hidden='true' />}
        triggerClassName={selectTriggerClass}
        contentClassName={selectContentClass}
        required
      />

      <Button
        type='submit'
        size='lg'
        className='mt-2 w-full'
        loading={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? 'Guardando...' : 'Confirmar'}
      </Button>
    </Form>
  );
};
