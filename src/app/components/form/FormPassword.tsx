'use client';

import { Eye, EyeOff } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { FormField } from './FormField';

interface FormPasswordProps extends ComponentProps<'input'> {
  name: string;
  label?: string;
  required?: boolean;
}

export const FormPassword = ({
  name,
  label,
  className,
  required,
  ...props
}: FormPasswordProps) => {
  'use no memo';

  const { register } = useFormContext();

  const [visible, setVisible] = useState(false);

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
    >
      {({ id, invalid }) => (
        <div className='relative'>
          <Input
            id={id}
            type={visible ? 'text' : 'password'}
            aria-invalid={invalid}
            className='pr-11'
            {...register(name)}
            {...props}
            placeholder='••••••'
          />
          <button
            type='button'
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className='absolute inset-y-0 right-3 flex items-center text-muted transition-colors hover:text-heading'
          >
            {visible ? (
              <EyeOff className='h-5 w-5' aria-hidden='true' />
            ) : (
              <Eye className='h-5 w-5' aria-hidden='true' />
            )}
          </button>
        </div>
      )}
    </FormField>
  );
};
