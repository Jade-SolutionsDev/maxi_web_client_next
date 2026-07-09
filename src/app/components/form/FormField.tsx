'use client';

import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

type FieldRenderProps = {
  id: string;
  invalid: boolean;
};

interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  /** Renders the actual control; receives the field id and validity state. */
  children: (field: FieldRenderProps) => ReactNode;
}

/**
 * Shared field shell: label (with required marker) + control + error message.
 * Consumed by FormInput, FormPassword, and any future field component so the
 * layout, spacing, and error styling stay in one place.
 */
export const FormField = ({
  name,
  label,
  required,
  className,
  children,
}: FormFieldProps) => {
  'use no memo';

  const { formState, getFieldState } = useFormContext();
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

      {children({ id: name, invalid: !!error })}

      {error && <p className='text-sm text-red-500'>{error.message}</p>}
    </div>
  );
};
