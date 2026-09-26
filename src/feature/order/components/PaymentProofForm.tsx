'use client';

import { CircleCheckBig, Paperclip } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { Button } from '@/app/components/ui/button';
import { submitPaymentProofAction } from '../action/order.action';
import type { PaymentCharge } from '../type/order.type';

interface PaymentProofFormProps {
  orderId: string;
  charge: PaymentCharge;
  onSubmitted: (charge: PaymentCharge) => void;
}

export const PaymentProofForm = ({
  orderId,
  charge,
  onSubmitted,
}: PaymentProofFormProps) => {
  const [isSending, startSending] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (charge.customerReference) {
    return (
      <div className='flex flex-col gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900'>
        <p className='flex items-center gap-2 font-semibold'>
          <CircleCheckBig className='size-4 shrink-0' aria-hidden='true' />
          Recibimos tu comprobante
        </p>
        <p>
          Referencia: <strong>{charge.customerReference}</strong>. Lo revisamos
          y confirmamos tu pedido en cuanto encontremos el pago.
        </p>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startSending(async () => {
      const result = await submitPaymentProofAction(orderId, formData);

      if (result.payment) {
        setError(null);
        formRef.current?.reset();
        onSubmitted(result.payment);
        return;
      }
      setError('No pudimos guardar el comprobante. Inténtalo de nuevo.');
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className='flex flex-col gap-3 border-t border-input pt-4'
    >
      <div className='flex flex-col gap-1'>
        <label
          htmlFor='payment-reference'
          className='text-sm font-medium text-heading'
        >
          ¿Ya pagaste? Escribe la referencia
        </label>
        <p className='text-xs text-muted'>
          El número de la transferencia, el de Transfermóvil o el hash de la
          transacción. Es lo que nos permite encontrar tu pago.
        </p>
        <input
          id='payment-reference'
          name='reference'
          type='text'
          required
          minLength={3}
          maxLength={200}
          placeholder='Ej. TM-99887766'
          className='rounded-xl border border-input bg-background px-3 py-2 text-sm text-heading focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'
        />
      </div>

      <label className='flex cursor-pointer items-center gap-2 text-sm text-muted'>
        <Paperclip className='size-4 shrink-0' aria-hidden='true' />
        <span>Adjuntar captura (opcional)</span>
        <input
          name='receipt'
          type='file'
          accept='image/*'
          className='min-w-0 flex-1 text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-surface file:px-2 file:py-1 file:text-heading'
        />
      </label>

      {error && <p className='text-sm text-destructive'>{error}</p>}

      <Button type='submit' loading={isSending} className='w-full sm:w-auto'>
        Enviar comprobante
      </Button>
    </form>
  );
};
