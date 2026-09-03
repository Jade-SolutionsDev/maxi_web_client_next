'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import type { PaymentMethod } from '../type/order.type';
import { PaymentMethodSelector } from './PaymentMethodSelector';

interface PaymentMethodSwitcherProps {
  methods: PaymentMethod[];
  currentProvider: string;
  value: string;
  onChange: (code: string) => void;
  onConfirm: () => void;
  isStarting?: boolean;
}

export const PaymentMethodSwitcher = ({
  methods,
  currentProvider,
  value,
  onChange,
  onConfirm,
  isStarting,
}: PaymentMethodSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (methods.length < 2) return null;

  if (!isOpen) {
    return (
      <button
        type='button'
        aria-expanded={false}
        onClick={() => setIsOpen(true)}
        className='self-center rounded-sm text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'
      >
        ¿Prefieres otra forma de pago?
      </button>
    );
  }

  return (
    <div className='flex flex-col gap-4 border-t border-input pt-4'>
      <PaymentMethodSelector
        methods={methods}
        value={value}
        onChange={onChange}
        legend='Elige otra forma de pago'
        disabled={isStarting}
      />

      {value !== currentProvider && (
        <Button
          type='button'
          variant='outline'
          loading={isStarting}
          onClick={onConfirm}
          className='w-full sm:w-auto sm:self-start'
        >
          Cambiar forma de pago
        </Button>
      )}
    </div>
  );
};
