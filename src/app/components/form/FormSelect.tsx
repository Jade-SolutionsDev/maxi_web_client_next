'use client';

import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface FormSelectProps {
  name: string;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  size?: 'sm' | 'default' | 'lg';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;

  onValueChange?: (value: string) => void;
}

export const FormSelect = ({
  name,
  options,
  label,
  placeholder,
  icon,
  size,
  required,
  disabled,
  className,
  triggerClassName,
  contentClassName,
  onValueChange,
}: FormSelectProps) => {
  'use no memo';

  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
    >
      {({ id, invalid, describedBy }) => (
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const value =
              field.value === '' || field.value == null ? null : field.value;

            return (
              <Select
                items={options}
                name={field.name}
                value={value}
                onValueChange={(next) => {
                  const selected = next ?? '';
                  field.onChange(selected);
                  onValueChange?.(selected);
                }}
                required={required}
                disabled={disabled || field.disabled || options.length === 0}
              >
                <SelectTrigger
                  id={id}
                  ref={field.ref}
                  size={size}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  onBlur={field.onBlur}
                  className={cn('w-full', triggerClassName)}
                >
                  {icon}
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent className={contentClassName}>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
      )}
    </FormField>
  );
};
