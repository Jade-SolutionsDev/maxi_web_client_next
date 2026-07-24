import { SafeImage } from '@/app/components/ui/safe-image';
import type { Category } from '@/feature/categories/type/category.interface';

type CategoryCardProps = {
  category: Category;
  /** Responsive `sizes` hint for next/image, derived from the card's fixed width. */
  imageSizes?: string;
};

function CategoryCard({
  category,
  imageSizes = '(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 200px',
}: CategoryCardProps) {
  const { name, image } = category;

  return (
    <div className='group flex w-full min-w-0 flex-col items-center gap-3 text-center outline-none'>
      <div className='relative aspect-square w-full max-w-24 overflow-hidden rounded-full bg-accent transition-transform duration-300 group-focus-visible:ring-2 group-focus-visible:ring-primary/50 motion-reduce:transform-none sm:max-w-32 md:max-w-40 lg:max-w-50'>
        <SafeImage
          src={image}
          alt={name}
          fill
          sizes={imageSizes}
          className='h-full w-full object-cover'
        />
      </div>

      <h3 className='line-clamp-2 w-full wrap-break-word text-sm font-bold uppercase tracking-wide text-accent sm:text-base'>
        {name}
      </h3>
    </div>
  );
}

export { CategoryCard };
