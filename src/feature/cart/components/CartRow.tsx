'use client';

import { Trash2 } from 'lucide-react';
import { QuantityStepper } from '@/app/components/ui/quantity-stepper';
import { SafeImage } from '@/app/components/ui/safe-image';
import { formatPrice } from '@/helpers';
import type { CartItem } from '@/store/cart.store';
import { useCartActions } from '../hook/useCart';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeFromCart } = useCartActions();

  const lineTotal = item.price * item.quantity;

  return (
    <li className='flex items-center gap-3 py-4 first:pt-0'>
      <div className='relative size-14 shrink-0 overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-background sm:size-16'>
        <SafeImage
          src={item.image}
          alt={item.name}
          fill
          sizes='64px'
          className='object-contain p-1.5'
        />
      </div>

      <div className='flex min-w-0 max-w-65 w-full flex-1 flex-col gap-2'>
        <p className=' text-sm font-bold text-heading'>{item.name}</p>

        <div className='flex items-center justify-between gap-2'>
          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) => updateQuantity(item.id, quantity)}
            min={1}
            itemLabel={item.name}
            variant='surface'
          />

          <span className='shrink-0 text-base font-bold text-heading tabular-nums'>
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>

      <button
        type='button'
        aria-label={`Eliminar ${item.name} del carrito`}
        onClick={() => removeFromCart(item.id)}
        className='flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-destructive/10 text-destructive outline-none transition hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-destructive/40'
      >
        <Trash2 className='size-4.5' aria-hidden='true' />
      </button>
    </li>
  );
};
