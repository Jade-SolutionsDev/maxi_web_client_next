'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { QuantityStepper } from '@/app/components/ui/quantity-stepper';
import { SafeImage } from '@/app/components/ui/safe-image';
import { useFlyToCart } from '@/feature/cart/flight/useFlyToCart';
import { useCartActions } from '@/feature/cart/hook/useCart';
import type { Product } from '@/feature/product/type/product.interface';
import { formatPrice } from '@/helpers';
import { computePreviousPrice } from '@/lib/product-price';

type ProductCardProps = {
  product: Product;
  /** Responsive `sizes` hint for next/image, derived from the grid the card lives in. */
  imageSizes?: string;
};

function ProductCard({ product, imageSizes = '100vw' }: ProductCardProps) {
  const { name, price, image } = product;

  const { addToCart } = useCartActions();
  const flyToCart = useFlyToCart();
  /** Quantity picked before adding; the cart owns the quantity once added. */
  const [quantity, setQuantity] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const discount = product.discount ?? 0;
  const previousPrice = computePreviousPrice(price, discount);

  const handleAddToCart = () => {
    // State first: the cart must be right even if the animation cannot run.
    addToCart(product, quantity);
    setQuantity(1);

    flyToCart({ sourceEl: imageRef.current });
  };

  return (
    <article className='@container group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none'>
      <Link
        href={`/catalog/${product.id}`}
        className='flex flex-1 flex-col rounded-t-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
      >
        <div className='relative flex aspect-square items-center justify-center overflow-hidden bg-background p-3'>
          {previousPrice !== null && (
            <span className='absolute top-3 left-3 z-10 rounded-full bg-orange px-3 py-1 text-xs font-semibold text-white'>
              -{Math.round(discount * 100) / 100}%
            </span>
          )}
          <div className='relative h-full w-full'>
            <SafeImage
              ref={imageRef}
              src={image}
              alt={name}
              fill
              sizes={imageSizes}
              className='object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none'
            />
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-3 p-4 pb-0'>
          <h3 className=' min-h-10 font-semibold text-heading leading-snug'>
            {name}
          </h3>

          <p className='mt-auto flex items-baseline gap-2'>
            <span className='text-2xl font-bold text-heading'>
              {formatPrice(price)}
            </span>
            {previousPrice !== null && (
              <span className='text-sm text-muted line-through'>
                {formatPrice(previousPrice)}
              </span>
            )}
          </p>
        </div>
      </Link>

      <div className='flex flex-col gap-3 p-4 pt-3'>
        <div className='mt-1 flex flex-col gap-2 @[13rem]:flex-row @[13rem]:items-stretch'>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            min={1}
            variant='surface'
            itemLabel={name}
            className='shrink-0'
          />
          <Button
            type='button'
            onClick={handleAddToCart}
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
