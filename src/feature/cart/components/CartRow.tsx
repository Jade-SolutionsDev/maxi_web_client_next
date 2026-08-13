'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import { QuantityStepper } from '@/app/components/ui/quantity-stepper';
import { SafeImage } from '@/app/components/ui/safe-image';
import { notifyStockLimit } from '@/feature/product/feedback/stock-limit.notify';
import { formatDiscount, formatPrice } from '@/helpers';
import { cn } from '@/lib/utils';
import {
  linePreviousPrice,
  useCartActions,
  useIsLinePending,
} from '../hook/useCart';
import type { CartLine } from '../type/cart.interface';

interface CartItemRowProps {
  item: CartLine;
}

export const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeFromCart, adjustToAvailable } =
    useCartActions();
  const isPending = useIsLinePending(item.productId);

  const previousPrice = linePreviousPrice(item);
  const previousLineTotal =
    previousPrice === null ? null : previousPrice * item.quantity;

  const { available, isAvailable } = item;
  const soldOut = available < 1;

  return (
    <li
      aria-busy={isPending}
      className={cn(
        'flex flex-col gap-2 py-4 transition-opacity first:pt-0',
        isPending && 'opacity-60',
      )}
    >
      <div className='flex items-start gap-3'>
        <div
          className={cn(
            'relative size-14 shrink-0 overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-background sm:size-16',
            !isAvailable && 'grayscale',
          )}
        >
          <SafeImage
            src={item.image}
            alt={item.name}
            fill
            sizes='64px'
            className='object-contain p-1.5'
          />
        </div>

        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          <div className='flex items-start justify-between gap-2'>
            <p className='text-sm font-bold text-heading'>{item.name}</p>

            {previousLineTotal !== null && item.discount !== undefined && (
              <span className='shrink-0 rounded-full bg-orange px-2 py-0.5 text-[11px] font-semibold text-white'>
                {formatDiscount(item.discount)}
              </span>
            )}
          </div>

          <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-3'>
            <QuantityStepper
              value={item.quantity}
              onChange={(quantity) => updateQuantity(item.productId, quantity)}
              onLimitReached={() =>
                notifyStockLimit({
                  id: item.productId,
                  name: item.name,
                  available,
                })
              }
              min={1}
              max={Math.max(available, 1)}
              itemLabel={item.name}
              variant='surface'
            />

            <span className='flex shrink-0 flex-col items-end leading-tight'>
              {previousLineTotal !== null && (
                <span className='text-xs text-muted line-through tabular-nums'>
                  {formatPrice(previousLineTotal)}
                </span>
              )}
              <span className='text-base font-bold text-heading tabular-nums'>
                {formatPrice(item.lineTotal)}
              </span>
            </span>
          </div>
        </div>

        <button
          type='button'
          aria-label={`Eliminar ${item.name} del carrito`}
          onClick={() => removeFromCart(item.productId)}
          className='flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-destructive/10 text-destructive outline-none transition-colors hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:ring-offset-2 active:bg-destructive/25 sm:size-10'
        >
          <Trash2 className='size-4 sm:size-4.5' aria-hidden='true' />
        </button>
      </div>

      {!isAvailable && (
        <div className='flex flex-wrap items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2'>
          <p className='flex min-w-0 flex-1 items-center gap-2 text-xs font-semibold text-destructive'>
            <AlertTriangle className='size-4 shrink-0' aria-hidden='true' />
            {soldOut
              ? 'Se quedó sin stock'
              : `Solo quedan ${available} ${available === 1 ? 'unidad' : 'unidades'}`}
          </p>

          {!soldOut && (
            <button
              type='button'
              onClick={() => adjustToAvailable(item.productId)}
              className='cursor-pointer rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-heading outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-primary/40'
            >
              Ajustar a {available}
            </button>
          )}

          <button
            type='button'
            onClick={() => removeFromCart(item.productId)}
            className='cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold text-destructive underline outline-none transition hover:brightness-90 focus-visible:ring-2 focus-visible:ring-destructive/40'
          >
            Quitar
          </button>
        </div>
      )}
    </li>
  );
};
