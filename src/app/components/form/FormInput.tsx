'use client';

import type { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

interface FormInputProps extends ComponentProps<'input'> {
  name: string;
  label?: string;
}

export const FormInput = ({
  name,
  label,
  className,
  ...props
}: FormInputProps) => {
  const { register, formState, getFieldState } = useFormContext();

  const { error } = getFieldState(name, formState);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={name} className='text-sm font-medium text-heading'>
          {label}
        </Label>
      )}

      <Input id={name} aria-invalid={!!error} {...register(name)} {...props} />

      {error && (
        <p className='text-sm text-red-500'>{error.message}</p>
      )}
    </div>
  );
};
