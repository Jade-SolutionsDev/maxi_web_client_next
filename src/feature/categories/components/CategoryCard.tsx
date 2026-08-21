import { SafeImage } from '@/app/components/ui/safe-image';
import { getInitials } from '@/helpers';
import type { Taxonomy } from '@/shared/taxonomy/type/taxonomy.interface';

type CategoryCardProps = {
  category: Taxonomy;
  /** Responsive `sizes` hint for next/image, derived from the card's fixed width. */
  imageSizes?: string;
  /** Optional "N productos" line under the name. */
  productsCount?: number;
  /** Only the first card above the fold should opt out of lazy loading. */
  priority?: boolean;
};

const thumbClass =
  'relative aspect-square w-full max-w-24 overflow-hidden rounded-full bg-accent transition-transform duration-300 group-focus-visible:ring-2 group-focus-visible:ring-primary/50 motion-reduce:transform-none sm:max-w-32 md:max-w-40 lg:max-w-50';

function CategoryCard({
  category,
  imageSizes = '(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 200px',
  productsCount,
  priority = false,
}: CategoryCardProps) {
  const { name, image, imageMobile } = category;
  const artwork = image ?? imageMobile;

  return (
    <div className='group flex w-full min-w-0 flex-col items-center gap-3 text-center outline-none'>
      {artwork ? (
        <div className={thumbClass}>
          <SafeImage
            src={artwork}
            alt={name}
            fill
            sizes={imageSizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className='h-full w-full object-cover'
          />
        </div>
      ) : (
        <div
          className={`${thumbClass} grid place-items-center bg-sand font-fredoka text-2xl font-semibold text-total sm:text-3xl lg:text-4xl`}
          aria-hidden='true'
        >
          {getInitials(name)}
        </div>
      )}

      <div className='flex w-full flex-col gap-0.5'>
        <h3 className='line-clamp-2 w-full wrap-break-word text-sm font-bold uppercase tracking-wide text-accent sm:text-base'>
          {name}
        </h3>

        {productsCount !== undefined && (
          <p className='text-xs text-muted tabular-nums'>
            {productsCount} {productsCount === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </div>
    </div>
  );
}

export { CategoryCard };
