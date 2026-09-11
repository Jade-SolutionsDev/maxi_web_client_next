import { Banknote, ExternalLink, Landmark, TriangleAlert } from 'lucide-react';
import type { PaymentInstructions as Instructions } from '../type/order.type';
import { CopyButton } from './CopyButton';

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className='flex items-center gap-2 rounded-xl bg-surface p-3'>
    <span className='min-w-0 flex-1'>
      <span className='block text-xs text-muted'>{label}</span>
      <code className='block text-sm font-semibold break-all text-heading'>
        {value}
      </code>
    </span>
    <CopyButton value={value} label={`Copiar ${label.toLowerCase()}`} />
  </div>
);

export const PaymentInstructions = ({
  instructions,
}: {
  instructions: Instructions;
}) => {
  if (instructions.type === 'bank') {
    return (
      <div className='flex flex-col gap-3'>
        <p className='flex items-center gap-2 text-sm text-muted'>
          <Landmark
            className='size-4 shrink-0 text-primary'
            aria-hidden='true'
          />
          Transfiere el importe a esta cuenta y guarda el comprobante.
        </p>
        <Field label='Banco' value={instructions.bankName} />
        {instructions.accountHolder && (
          <Field label='Titular' value={instructions.accountHolder} />
        )}
        {instructions.accountNumber && (
          <Field label='Cuenta' value={instructions.accountNumber} />
        )}
        {instructions.cardNumber && (
          <Field label='Tarjeta' value={instructions.cardNumber} />
        )}
        {instructions.note && (
          <p className='text-sm text-muted'>{instructions.note}</p>
        )}
      </div>
    );
  }

  if (instructions.type === 'qr') {
    return (
      <div className='flex flex-col items-center gap-3'>
        <p className='flex items-center gap-2 self-start text-sm text-muted'>
          <Banknote
            className='size-4 shrink-0 text-primary'
            aria-hidden='true'
          />
          Escanea este código desde tu app de pago.
        </p>
        <img
          src={instructions.imageUrl}
          alt='Código QR para pagar el pedido'
          className='w-full max-w-[260px] rounded-xl bg-white p-3'
        />
        {instructions.note && (
          <p className='text-sm text-pretty text-muted'>{instructions.note}</p>
        )}
      </div>
    );
  }

  if (instructions.type === 'link') {
    return (
      <div className='flex flex-col gap-3'>
        {instructions.note && (
          <p className='text-sm text-muted'>{instructions.note}</p>
        )}
        <a
          href={instructions.url}
          target='_blank'
          rel='noreferrer noopener'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'
        >
          Ir a pagar
          <ExternalLink className='size-4' aria-hidden='true' />
        </a>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-sm text-muted'>
        Envía el importe en{' '}
        <strong className='text-heading'>
          {instructions.asset ?? 'cripto'}
        </strong>{' '}
        a esta dirección:
      </p>
      <Field label='Dirección' value={instructions.address} />
      <p className='flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900'>
        <TriangleAlert className='mt-0.5 size-4 shrink-0' aria-hidden='true' />
        <span>
          Usa únicamente la red <strong>{instructions.network}</strong>. Un
          envío por otra red puede perder los fondos.
        </span>
      </p>
      {instructions.memo && (
        <>
          <Field label='Memo / Tag' value={instructions.memo} />
          <p className='text-sm text-amber-900'>
            Incluye el memo: sin él, el pago puede quedarse trabado.
          </p>
        </>
      )}
      {instructions.note && (
        <p className='text-sm text-muted'>{instructions.note}</p>
      )}
    </div>
  );
};
