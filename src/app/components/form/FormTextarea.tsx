'use client';

import type { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

interface FormTextareaProps extends ComponentProps<'textarea'> {
  name: string;
  label?: string;
  required?: boolean;
}

export const FormTextarea = ({
  name,
  label,
  className,
  required,
  ...props
}: FormTextareaProps) => {
  'use no memo';

  const { register } = useFormContext();

  return (
    <FormField name={name} label={label} required={required}>
      {({ id, invalid }) => (
        <textarea
          id={id}
          aria-invalid={invalid}
          rows={3}
          className={cn(
            'w-full min-w-0 resize-y rounded-xl border-[1.5px] border-input bg-transparent px-4 py-3.5 text-[14.5px] leading-[1.4] text-heading transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20',
            className,
          )}
          {...register(name)}
          {...props}
        />
      )}
    </FormField>
  );
};
