'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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

interface LocationFormProps {
  provinces: LocationOption[];
  municipalitiesByProvince: Record<string, LocationOption[]>;
  selected?: SelectedLocation | null;
  onSubmit: (input: { municipalityId: string }) => Promise<{ error?: string }>;
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

  const handleSubmit = async ({ municipalityId }: LocationFormSchemaType) => {
    form.clearErrors();

    const { error } = await onSubmit({ municipalityId });
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
        placeholder='Elegí tu provincia'
        options={provinces}
        required
        onValueChange={() =>
          form.resetField('municipalityId', { defaultValue: '' })
        }
      />

      <FormSelect
        name='municipalityId'
        label='Municipio'
        placeholder='Elegí tu municipio'
        options={municipalityOptions}
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
