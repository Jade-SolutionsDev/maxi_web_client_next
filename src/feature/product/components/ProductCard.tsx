'use client';

import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { QuantityStepper } from '@/app/components/ui/quantity-stepper';
import fallbackImage from '@/assets/fallback.jpeg';
import type { Product } from '@/feature/product/type/product.interface';
import { formatPrice } from '@/lib/format';

type ProductCardProps = {
  product: Product;
  /** Responsive `sizes` hint for next/image, derived from the grid the card lives in. */
  imageSizes?: string;
};

function ProductCard({ product, imageSizes = '100vw' }: ProductCardProps) {
  const { name, price, image } = product;
  const [quantity, setQuantity] = useState(1);
  const discount = product.discount ?? 0;
  const isOnOffer = discount > 0;
  const previousPrice = isOnOffer ? price / (1 - discount / 100) : price;

  const decrease = () => setQuantity((current) => Math.max(1, current - 1));
  const increase = () => setQuantity((current) => current + 1);

  return (
    <article className='@container group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none'>
      <div className='relative flex aspect-square items-center justify-center overflow-hidden bg-background p-3'>
        {isOnOffer && (
          <span className='absolute top-3 left-3 z-10 rounded-full bg-orange px-3 py-1 text-xs font-semibold text-white'>
            -{Math.round(discount * 100) / 100}%
          </span>
        )}
        <div className='relative h-full w-full'>
          <Image
            src={image ?? fallbackImage}
            alt={name}
            fill
            sizes={imageSizes}
            className='object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none'
          />
        </div>
      </div>

      <div className='flex flex-1 flex-col gap-3 p-4'>
        <h3 className=' min-h-10 font-semibold text-heading leading-snug'>
          {name}
        </h3>

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

        <div className='mt-1 flex flex-col gap-2 @[13rem]:flex-row @[13rem]:items-stretch'>
          <QuantityStepper
            value={quantity}
            onDecrease={decrease}
            onIncrease={increase}
            min={1}
            variant='surface'
            itemLabel={name}
            className='shrink-0'
          />
          <Button
            className='min-w-0 gap-1.5 truncate px-2.5 py-2 text-sm font-semibold @[13rem]:flex-1'
            aria-label={`Añadir ${quantity} ${name} al carrito`}
          >
            <ShoppingCart className='size-4 shrink-0' aria-hidden='true' />
            Añadir
          </Button>
        </div>
      </div>
    </article>
  );
}

export { ProductCard };
