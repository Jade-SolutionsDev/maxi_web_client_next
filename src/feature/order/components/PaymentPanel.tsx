'use client';

import {
  CircleCheckBig,
  CircleDollarSign,
  ExternalLink,
  HandCoins,
  TriangleAlert,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, buttonVariants } from '@/app/components/ui/button';
import { formatPrice, truncateDecimals } from '@/helpers';
import { cn } from '@/lib/utils';
import {
  fetchPaymentStatus,
  startPaymentAttempt,
} from '../action/order.action';
import { CHARGE_FAILURE_COPY } from '../constants/order-status.constants';
import {
  notifyOrderPaid,
  notifyPaymentFailure,
  notifyPaymentReturn,
} from '../feedback/order.notify';
import { remainingSeconds } from '../lib/payment-time';
import {
  type Order,
  type PaymentCharge,
  type PaymentMethod,
  TERMINAL_CHARGE_STATUSES,
} from '../type/order.type';
import { CopyButton } from './CopyButton';
import { PaymentCountdown } from './PaymentCountdown';
import { PaymentMethodSelector } from './PaymentMethodSelector';

const POLL_INTERVAL_MS = 8000;

interface PaymentPanelProps {
  order: Order;
  payment?: PaymentCharge | null;
  paymentMethods?: PaymentMethod[];
}

type PanelMode =
  | 'paid'
  | 'refunded'
  | 'redirect'
  | 'instructions'
  | 'confirming'
  | 'charge-failed'
  | 'manual-pending'
  | 'start';

const resolveMode = (
  order: Order,
  charge: PaymentCharge | null,
): PanelMode => {
  if (order.paymentStatus === 'paid' || charge?.status === 'SUCCEEDED') {
    return 'paid';
  }
  if (order.paymentStatus === 'refunded') return 'refunded';
  if (charge) {
    if (charge.status === 'REQUIRES_ACTION') {
      if (
        (charge.expiresAt || charge.expiresInSeconds !== null) &&
        remainingSeconds(charge.expiresInSeconds, charge.expiresAt) <= 0
      ) {
        return 'charge-failed';
      }

      return charge.kind === 'redirect' && charge.redirectUrl
        ? 'redirect'
        : 'instructions';
    }
    if (charge.status === 'PENDING' || charge.status === 'PROCESSING') {
      return charge.kind === 'manual' ? 'manual-pending' : 'confirming';
    }
    return 'charge-failed';
  }

  /**
   * Una pasarela caída ya no se lleva el panel por delante.
   *
   * Antes acababa siempre en «lo confirmaremos manualmente»: sustituía al
   * selector —dejando al cliente sin ninguna otra forma de pagar— y prometía
   * una confirmación a mano que nadie había pedido; el cliente había elegido
   * Mi Billetera, no pago manual. Ahora se vuelve al selector con la pasarela
   * caída señalada, y quien quiera pago manual lo elige él.
   *
   * `manual-pending` sigue existiendo arriba, para lo que de verdad es: un
   * cobro manual ya creado y esperando confirmación.
   */
  return 'start';
};

export const PaymentPanel = ({
  order,
  payment,
  paymentMethods = [],
}: PaymentPanelProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gatewayOutcome = searchParams.get('pago');
  // Lo pone el checkout cuando el pedido se creó pero su cobro no.
  const failedAtCheckout = searchParams.get('pagoFallido');
  const openCharge = payment ?? order.payment ?? null;
  const [charge, setCharge] = useState<PaymentCharge | null>(openCharge);
  /**
   * La pasarela que acaba de fallar y el porqué. Vive en el panel y no en un
   * aviso pasajero: el aviso se va solo y deja al cliente delante de un
   * selector que parece no haber hecho nada.
   */
  const [failedMethod, setFailedMethod] = useState<{
    code: string;
    reason: string;
  } | null>(
    failedAtCheckout
      ? { code: failedAtCheckout, reason: 'no pudo iniciar el pago' }
      : null,
  );
  const [isStarting, setIsStarting] = useState(false);
  const [expiredLocally, setExpiredLocally] = useState(false);
  const [method, setMethod] = useState(
    openCharge?.provider ?? paymentMethods[0]?.code ?? '',
  );
  const paidNotified = useRef(order.paymentStatus === 'paid');

  const applyCharge = useCallback(
    (next: PaymentCharge) => {
      setCharge(next);
      setFailedMethod(null);

      if (next.status === 'SUCCEEDED' && !paidNotified.current) {
        paidNotified.current = true;
        notifyOrderPaid();
        router.refresh();
      }
    },
    [router],
  );

  const refresh = useCallback(async () => {
    const result = await fetchPaymentStatus({ orderId: order.id });

    if (result.payment) {
      applyCharge(result.payment);
      return;
    }
  }, [order.id, applyCharge]);

  useEffect(() => {
    if (!gatewayOutcome) return;

    notifyPaymentReturn(gatewayOutcome);
    void refresh();
  }, [gatewayOutcome, refresh]);

  const isPolling =
    !paidNotified.current &&
    charge !== null &&
    !TERMINAL_CHARGE_STATUSES.includes(charge.status) &&
    !expiredLocally;

  useEffect(() => {
    if (!isPolling) return;

    const tick = () => {
      if (!document.hidden) void refresh();
    };
    const interval = setInterval(tick, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [isPolling, refresh]);

  const handleStart = async () => {
    setIsStarting(true);
    setExpiredLocally(false);
    const result = await startPaymentAttempt({
      orderId: order.id,
      method: method || undefined,
    });
    setIsStarting(false);

    if (result.payment) {
      applyCharge(result.payment);
      return;
    }
    setFailedMethod({
      code: method,
      reason:
        result.failure.kind === 'gateway-unavailable'
          ? 'no está disponible en este momento'
          : 'no pudo iniciar el pago',
    });
    notifyPaymentFailure(result.failure);
  };

  const handleExpire = useCallback(() => {
    setExpiredLocally(true);
    void refresh();
  }, [refresh]);

  const mode = expiredLocally
    ? resolveMode(order, charge && { ...charge, status: 'EXPIRED' })
    : resolveMode(order, charge);

  return (
    <section
      aria-labelledby='payment-title'
      aria-live='polite'
      className='rounded-2xl border border-input bg-background p-5 sm:p-6'
    >
      <h2
        id='payment-title'
        className='mb-4 flex items-center gap-2 text-lg font-bold text-heading'
      >
        <CircleDollarSign className='size-5 text-primary' aria-hidden='true' />
        Pago
      </h2>

      {mode === 'paid' && (
        <PanelState
          tone='success'
          icon={<CircleCheckBig className='size-8' aria-hidden='true' />}
          title='Pago confirmado'
          description='Recibimos tu pago. Estamos preparando tu pedido.'
        />
      )}

      {mode === 'refunded' && (
        <PanelState
          tone='muted'
          icon={<HandCoins className='size-8' aria-hidden='true' />}
          title='Pago reembolsado'
          description='El importe de este pedido fue devuelto.'
        />
      )}

      {mode === 'confirming' && (
        <PanelState
          tone='progress'
          icon={
            <span
              aria-hidden='true'
              className='status-spinner size-8 rounded-full border-[3px] border-primary/25 border-t-total'
            />
          }
          title='Confirmando tu pago…'
          description='Estamos esperando la confirmación de la red. Esta pantalla se actualiza sola.'
        />
      )}

      {mode === 'redirect' && charge?.redirectUrl && (
        <div className='flex flex-col gap-4'>
          <p className='text-sm text-muted'>
            Vas a pagar{' '}
            <strong className='text-heading'>
              {formatPrice(
                Number(charge.amount ?? 0),
                charge.currency ?? undefined,
              )}
            </strong>{' '}
            en la pasarela segura. Al terminar vuelves a esta página.
          </p>

          <a
            href={charge.redirectUrl}
            rel='noopener'
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full gap-2 sm:w-auto sm:self-start',
            )}
          >
            Pagar ahora
            <ExternalLink className='size-4' aria-hidden='true' />
          </a>

          {charge.expiresAt && (
            <PaymentCountdown
              expiresAt={charge.expiresAt}
              expiresInSeconds={charge.expiresInSeconds}
              onExpire={handleExpire}
            />
          )}

          <p className='text-center text-xs text-muted'>
            ¿Ya pagaste? Esta pantalla se actualiza sola en cuanto lo
            confirmemos. Referencia: {charge.reference}
          </p>
        </div>
      )}

      {mode === 'instructions' && charge && charge.depositAddress && (
        <div className='flex flex-col gap-4'>
          <p className='text-sm text-muted'>
            Envía{' '}
            <strong className='text-heading'>
              exactamente {charge.amount} {charge.token?.toUpperCase()}
            </strong>{' '}
            por la red{' '}
            <strong className='text-heading'>{charge.blockchain}</strong> a esta
            dirección:
          </p>

          <div className='flex items-center gap-2 rounded-xl bg-surface p-3'>
            <code className='min-w-0 flex-1 text-sm font-semibold break-all text-heading'>
              {charge.depositAddress}
            </code>
            <CopyButton
              value={charge.depositAddress}
              label='Copiar dirección de depósito'
            />
          </div>

          <div className='rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900'>
            Usa únicamente la red {charge.blockchain}. Un envío por otra red
            puede perder los fondos.
          </div>

          {charge.expiresAt && (
            <PaymentCountdown
              expiresAt={charge.expiresAt}
              expiresInSeconds={charge.expiresInSeconds}
              onExpire={handleExpire}
            />
          )}

          <p className='text-center text-xs text-muted'>
            Esta pantalla se actualiza sola cuando detectemos tu pago.
            Referencia: {charge.reference}
          </p>
        </div>
      )}

      {mode === 'instructions' && charge && !charge.depositAddress && (
        <div className='flex flex-col gap-4'>
          <p className='text-sm text-muted'>
            Abre tu app de Mi Billetera y paga la solicitud de cobro por{' '}
            <strong className='text-heading'>
              {truncateDecimals(charge.amount ?? '0')} {charge.currency ?? ''}
            </strong>
            .
          </p>

          <div className='flex items-center gap-2 rounded-xl bg-surface p-3'>
            <div className='min-w-0 flex-1'>
              <p className='text-xs text-muted'>
                {charge.operationNumber
                  ? 'Solicitud de cobro'
                  : 'Referencia del cobro'}
              </p>
              <code className='text-sm font-semibold break-all text-heading'>
                {charge.operationNumber ?? charge.reference}
              </code>
            </div>
            <CopyButton
              value={charge.operationNumber ?? charge.reference}
              label='Copiar el número de la solicitud de cobro'
            />
          </div>

          {charge.expiresAt && (
            <PaymentCountdown
              expiresAt={charge.expiresAt}
              expiresInSeconds={charge.expiresInSeconds}
              onExpire={handleExpire}
            />
          )}

          <p className='text-center text-xs text-muted'>
            Esta pantalla se actualiza sola cuando detectemos tu pago.
          </p>
        </div>
      )}

      {mode === 'charge-failed' && (
        <div className='flex flex-col gap-4'>
          <PanelState
            tone='danger'
            icon={<TriangleAlert className='size-8' aria-hidden='true' />}
            title={
              CHARGE_FAILURE_COPY[charge?.status ?? 'FAILED']?.title ??
              CHARGE_FAILURE_COPY.FAILED?.title ??
              'El pago falló'
            }
            description={
              (charge?.errorMessage ||
                CHARGE_FAILURE_COPY[charge?.status ?? 'FAILED']?.description) ??
              ''
            }
          />
          <PaymentMethodSelector
            methods={paymentMethods}
            value={method}
            onChange={setMethod}
            legend='Elige cómo reintentar'
            disabled={isStarting}
          />

          <Button
            type='button'
            size='lg'
            loading={isStarting}
            onClick={handleStart}
            className='w-full sm:w-auto sm:self-center'
          >
            Reintentar pago
          </Button>
        </div>
      )}

      {mode === 'start' && (
        <div className='flex flex-col gap-4'>
          <p className='text-sm text-muted'>
            Tu pedido está reservado. Elige cómo pagarlo para continuar.
          </p>

          {failedMethod && (
            <p
              role='alert'
              className='rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-heading'
            >
              <strong>
                {paymentMethods.find((o) => o.code === failedMethod.code)
                  ?.label ?? 'La forma de pago elegida'}
              </strong>{' '}
              {failedMethod.reason}.{' '}
              {paymentMethods.length > 1
                ? 'Prueba con otra de las opciones.'
                : 'Vuelve a intentarlo en unos minutos.'}
            </p>
          )}

          <PaymentMethodSelector
            methods={paymentMethods}
            value={method}
            onChange={setMethod}
            disabled={isStarting}
          />

          <Button
            type='button'
            size='lg'
            loading={isStarting}
            onClick={handleStart}
            className='w-full sm:w-auto sm:self-start'
          >
            Continuar con el pago
          </Button>
        </div>
      )}

      {mode === 'manual-pending' && (
        <PanelState
          tone='progress'
          icon={<HandCoins className='size-8' aria-hidden='true' />}
          title='Pago pendiente de confirmación'
          description='Tu pedido queda registrado. Nos pondremos en contacto contigo para coordinar el pago y lo confirmaremos a mano.'
        />
      )}
    </section>
  );
};

const STATE_TONES = {
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-destructive/10 text-destructive',
  progress: 'bg-primary/10 text-primary',
  muted: 'bg-surface text-muted',
} as const;

const PanelState = ({
  tone,
  icon,
  title,
  description,
}: {
  tone: keyof typeof STATE_TONES;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className='flex flex-col items-center gap-3 py-4 text-center'>
    <span
      className={cn(
        'status-medallion flex size-16 items-center justify-center rounded-full',
        STATE_TONES[tone],
      )}
    >
      {icon}
    </span>
    <p className='text-lg font-bold text-heading'>{title}</p>
    <p className='mx-auto max-w-[44ch] text-sm text-pretty text-muted'>
      {description}
    </p>
  </div>
);
