import Image from 'next/image';
import Link from 'next/link';
import fallbackImage from '@/assets/fallback.jpeg';
import type { Category } from '@/feature/categories/type/category.interface';

type CategoryCardProps = {
  category: Category;
  /** Responsive `sizes` hint for next/image, derived from the card's fixed width. */
  imageSizes?: string;
};

function CategoryCard({
  category,
  imageSizes = '(max-width: 640px) 128px, (max-width: 1024px) 160px, 208px',
}: CategoryCardProps) {
  const { name, image, departmentId } = category;

  return (
    <Link
      href={`/departamentos/${departmentId}`}
      className='group flex flex-col items-center gap-3 text-center outline-none'
    >
      <div className='relative aspect-square w-32 overflow-hidden rounded-full bg-accent transition-transform duration-300  group-focus-visible:ring-2 group-focus-visible:ring-primary/50 motion-reduce:transform-none sm:w-40 lg:w-50'>
        <Image
          src={image ?? fallbackImage}
          alt={name}
          fill
          sizes={imageSizes}
          className='h-full w-full object-cover'
        />
      </div>

      <h3 className='text-base font-bold uppercase tracking-wide text-accent'>
        {name}
      </h3>
    </Link>
  );
}

export { CategoryCard };
