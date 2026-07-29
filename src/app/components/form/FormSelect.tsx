'use client';

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
  required?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;

  onValueChange?: (value: string) => void;
}

export const FormSelect = ({
  name,
  options,
  label,
  placeholder,
  required,
  disabled,
  className,
  triggerClassName,
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
      {({ id, invalid }) => (
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
                  aria-invalid={invalid}
                  onBlur={field.onBlur}
                  className={cn('w-full', triggerClassName)}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
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
