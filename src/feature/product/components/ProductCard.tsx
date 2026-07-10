'use client';

import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { QuantityStepper } from '@/app/components/ui/quantity-stepper';
import type { Product } from '@/feature/product/mock/products';
import { formatPrice } from '@/lib/format';

type ProductCardProps = {
  product: Product;
  /** Responsive `sizes` hint for next/image, derived from the grid the card lives in. */
  imageSizes?: string;
};

function ProductCard({ product, imageSizes = '100vw' }: ProductCardProps) {
  const { name, price, previousPrice, image } = product;
  const [quantity, setQuantity] = useState(1);
  const isOnOffer = previousPrice != null && previousPrice > price;

  const decrease = () => setQuantity((current) => Math.max(1, current - 1));
  const increase = () => setQuantity((current) => current + 1);

  return (
    <article className='flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white'>
      <div className='relative flex aspect-square items-center justify-center bg-background p-3'>
        {isOnOffer && (
          <span className='absolute top-3 left-3 z-10 rounded-full bg-orange px-3 py-1 text-xs font-semibold text-white'>
            Oferta
          </span>
        )}
        <Image
          src={image}
          alt={name}
          sizes={imageSizes}
          className='h-full w-full object-contain'
        />
      </div>

      <div className='flex flex-1 flex-col gap-3 p-4'>
        <h3 className='font-semibold text-heading leading-snug'>{name}</h3>

        <p className='mt-auto flex items-baseline gap-2'>
          <span className='text-2xl font-bold text-heading'>
            {formatPrice(price)}
          </span>
          {isOnOffer && (
            <span className='text-sm text-muted line-through'>
              {formatPrice(previousPrice)}
            </span>
          )}
        </p>

        <div className='flex items-center gap-2'>
          <QuantityStepper
            value={quantity}
            onDecrease={decrease}
            onIncrease={increase}
            itemLabel={name}
          />

          <Button
            className='flex-1 gap-2 py-2.5 text-base font-semibold'
            aria-label={`Añadir ${quantity} de ${name} al carrito`}
          >
            <ShoppingCart className='size-4' aria-hidden='true' />
            Añadir
          </Button>
        </div>
      </div>
    </article>
  );
}

export { ProductCard };
