'use client';

import type { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { FormField } from './FormField';

interface FormInputProps extends ComponentProps<'input'> {
  name: string;
  label?: string;
  required?: boolean;
}

export const FormInput = ({
  name,
  label,
  className,
  required,
  ...props
}: FormInputProps) => {
  'use no memo';

  const { register } = useFormContext();

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
    >
      {({ id, invalid }) => (
        <Input id={id} aria-invalid={invalid} {...register(name)} {...props} />
      )}
    </FormField>
  );
};
