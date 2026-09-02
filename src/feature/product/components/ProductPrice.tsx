import { formatPrice } from '@/helpers';
import { resolvePreviousPrice } from '@/lib/product-price';
import { cn } from '@/lib/utils';

interface ProductPriceProps {
  price: number;
  basePrice?: number;
  discount?: number;
  /** `sm` = product card. `lg` = product detail. */
  size?: 'sm' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: { root: 'gap-1.5', current: 'text-lg', previous: 'text-xs' },
  lg: { root: 'gap-2', current: 'text-3xl sm:text-4xl', previous: 'text-base' },
} as const;

/**
 * Current price plus the crossed-out previous one when the product is
 * discounted. Presentational only, so both the server-rendered detail page
 * and the client product card can share it.
 */
export const ProductPrice = ({
  price,
  basePrice,
  discount = 0,
  size = 'sm',
  className,
}: ProductPriceProps) => {
  const previousPrice = resolvePreviousPrice(price, discount, basePrice);
  const theme = sizeStyles[size];

  return (
    <p className={cn('flex items-baseline', theme.root, className)}>
      <span className={cn('font-bold text-heading', theme.current)}>
        {formatPrice(price)}
      </span>
      {previousPrice !== null && (
        <span className={cn('text-muted line-through', theme.previous)}>
          {formatPrice(previousPrice)}
        </span>
      )}
    </p>
  );
};
