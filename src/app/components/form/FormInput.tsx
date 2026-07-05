'use client';

import type { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

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
  const { register, formState, getFieldState } = useFormContext();

  const { error } = getFieldState(name, formState);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label
          htmlFor={name}
          className='text-sm flex gap-2 font-medium text-heading'
        >
          {label}
          {required && <span className='text-red-500 mb-2'>*</span>}
        </Label>
      )}

      <Input id={name} aria-invalid={!!error} {...register(name)} {...props} />

      {error && <p className='text-sm text-red-500'>{error.message}</p>}
    </div>
  );
};
