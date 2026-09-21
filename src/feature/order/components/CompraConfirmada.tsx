'use client';

import { CircleCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface CompraConfirmadaProps {
  orderNumber: string | null;
  esperandoPago: boolean;
}

export const CompraConfirmada = ({
  orderNumber,
  esperandoPago,
}: CompraConfirmadaProps) => {
  const searchParams = useSearchParams();

  if (!searchParams.get('compraConfirmada')) return null;

  return (
    <section
      aria-label='Compra confirmada'
      className='flex items-start gap-3 rounded-2xl border border-total/30 bg-total/5 p-4 sm:p-5'
    >
      <CircleCheck
        className='mt-0.5 size-6 shrink-0 text-total'
        aria-hidden='true'
      />
      <div className='flex min-w-0 flex-col gap-1'>
        <p className='text-base font-bold text-heading'>
          ¡Listo! Tu pedido está confirmado
        </p>
        <p className='text-sm text-muted'>
          {orderNumber ? (
            <>
              Lo guardamos con el número{' '}
              <strong className='text-heading'>{orderNumber}</strong>.{' '}
            </>
          ) : (
            'Ya lo tenemos guardado. '
          )}
          {esperandoPago
            ? 'Te apartamos los productos mientras completas el pago: abajo tienes las instrucciones y el tiempo que queda.'
            : 'Aquí abajo tienes todos los detalles.'}
        </p>
        <p className='text-sm text-muted'>
          Puedes volver a esta página cuando quieras desde{' '}
          <strong className='text-heading'>Mis pedidos</strong>.
        </p>
      </div>
    </section>
  );
};
