'use client';

import { Eye, EyeOff } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

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

  const { register, formState, getFieldState } = useFormContext();

  const { error } = getFieldState(name, formState);

  const [visible, setVisible] = useState(false);

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

      <div className='relative'>
        <Input
          id={name}
          type={visible ? 'text' : 'password'}
          aria-invalid={!!error}
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

      {error && <p className='text-sm text-red-500'>{error.message}</p>}
    </div>
  );
};
