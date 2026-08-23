'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormInput } from '@/app/components/form/FormInput';
import { FormTextarea } from '@/app/components/form/FormTextarea';
import { Button } from '@/app/components/ui/button';
import { useCartActions } from '@/feature/cart/hook/useCart';
import { checkoutAction } from '../action/order.action';
import { notifyCheckoutFailure } from '../feedback/order.notify';
import {
  type CheckoutInput,
  CheckoutInputSchema,
} from '../schema/checkout.schema';
import type { PaymentMethod } from '../type/order.type';
import { PaymentMethodSelector } from './PaymentMethodSelector';

interface CheckoutFormProps {
  municipalityName: string | null;
  paymentMethods: PaymentMethod[];
}

export const CheckoutForm = ({
  municipalityName,
  paymentMethods,
}: CheckoutFormProps) => {
  const router = useRouter();
  const { refreshIfStale } = useCartActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(CheckoutInputSchema),
    defaultValues: {
      direccion: '',
      referencias: '',
      notas: '',
      paymentMethod: paymentMethods[0]?.code ?? '',
    },
  });
  const paymentMethod = form.watch('paymentMethod') ?? '';

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;

      setIsSubmitting(false);
      router.refresh();
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [router]);

  const handleSubmit = async (values: CheckoutInput) => {
    setIsSubmitting(true);
    const result = await checkoutAction(values);

    if (result.order) {
      refreshIfStale(0);
      router.push(`/pedidos/${result.order.id}`);
      return;
    }

    setIsSubmitting(false);
    notifyCheckoutFailure(result.failure);

    if (result.failure.kind === 'stale-cart') router.refresh();
    if (result.failure.kind === 'unauthenticated') router.push('/login');
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      {municipalityName && (
        <p className='flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm text-heading'>
          <MapPin className='size-4 shrink-0 text-primary' aria-hidden='true' />
          Entrega en <strong>{municipalityName}</strong>
        </p>
      )}

      <FormInput
        name='direccion'
        label='Dirección de entrega'
        placeholder='Calle, número, entre calles'
        autoComplete='street-address'
        required
      />
      <FormInput
        name='referencias'
        label='Referencias (opcional)'
        placeholder='Edificio, apartamento, punto de referencia'
      />
      <FormTextarea
        name='notas'
        label='Notas para la entrega (opcional)'
        placeholder='Horario preferido, instrucciones para el repartidor…'
      />

      <PaymentMethodSelector
        methods={paymentMethods}
        value={paymentMethod}
        onChange={(code) => form.setValue('paymentMethod', code)}
        disabled={isSubmitting}
      />

      <Button
        type='submit'
        size='lg'
        loading={isSubmitting}
        className='w-full gap-2'
      >
        Confirmar pedido
      </Button>

      <p className='text-center text-xs text-muted'>
        Al confirmar reservamos tu stock y te mostramos las instrucciones de
        pago.
      </p>
    </Form>
  );
};
