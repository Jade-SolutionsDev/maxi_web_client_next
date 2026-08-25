'use client';

import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

type FieldRenderProps = {
  id: string;
  invalid: boolean;
  describedBy?: string;
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
  const errorId = `${name}-error`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={name} className='gap-1 text-sm font-medium text-heading'>
          {label}
          {required && (
            <span aria-hidden='true' className='text-destructive'>
              *
            </span>
          )}
        </Label>
      )}

      {children({
        id: name,
        invalid: !!error,
        describedBy: error ? errorId : undefined,
      })}

      {error && (
        <p id={errorId} className='text-sm text-destructive'>
          {error.message}
        </p>
      )}
    </div>
  );
};
