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

const rootClass =
  'flex w-full min-w-0 flex-col items-center gap-3 text-center transition-transform duration-300 ease-spring group-hover:-translate-y-1 group-active:scale-[0.97] motion-reduce:transition-none motion-reduce:transform-none';

const thumbClass =
  'relative aspect-square w-full max-w-24 overflow-hidden rounded-full bg-surface transition-shadow duration-300 ease-spring group-hover:shadow-popover group-hover:ring-4 group-hover:ring-primary/15 motion-reduce:transition-none sm:max-w-32 md:max-w-40 lg:max-w-50';

const artworkClass =
  'h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:transform-none';

const initialsClass =
  'font-fredoka text-2xl font-semibold text-total transition-transform duration-500 ease-spring group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:transform-none sm:text-3xl lg:text-4xl';

function CategoryCard({
  category,
  imageSizes = '(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 200px',
  productsCount,
  priority = false,
}: CategoryCardProps) {
  const { name, image, imageMobile } = category;
  const artwork = image ?? imageMobile;

  return (
    <div className={rootClass}>
      <div className={thumbClass}>
        {artwork ? (
          <SafeImage
            src={artwork}
            alt={name}
            fill
            sizes={imageSizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className={artworkClass}
          />
        ) : (
          <div
            aria-hidden='true'
            className='grid h-full w-full place-items-center bg-sand'
          >
            <span className={initialsClass}>{getInitials(name)}</span>
          </div>
        )}
      </div>

      <div className='flex w-full flex-col gap-0.5'>
        <h3 className='line-clamp-2 w-full wrap-break-word text-sm font-bold uppercase tracking-wide text-accent transition-colors duration-300 group-hover:text-total motion-reduce:transition-none sm:text-base'>
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
