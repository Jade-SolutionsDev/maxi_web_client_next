import Link from 'next/link';
import { SafeImage } from '@/app/components/ui/safe-image';
import { departmentHref } from '@/feature/product/constants/catalog-taxonomy-href';
import { cn } from '@/lib/utils';
import type { Taxonomy } from '@/shared/taxonomy/type/taxonomy.interface';
import { departmentSlideMediaClass } from './department-carousel.styles';

type DepartmentCardProps = {
  department: Taxonomy;
};

const imageClass =
  'object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none';

/** Matches the carousel slides: one per view on phones, two from md, three from lg. */
const IMAGE_SIZES = '(min-width: 1024px) 27rem, (min-width: 768px) 50vw, 100vw';

function DepartmentCard({ department }: DepartmentCardProps) {
  const { imageMobile, image } = department;

  // Art direction costs a second <img>, and a hidden <img> is still downloaded.
  // Only pay for it when the API actually returns two different crops — today
  // `imageMobileUrl` is null and the adapter falls back to the desktop URL.
  const hasArtDirection = Boolean(
    imageMobile && image && imageMobile !== image,
  );

  return (
    <Link
      href={departmentHref(department.slug)}
      className='group block overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
    >
      <div
        className={cn(
          'relative overflow-hidden bg-primary/5',
          departmentSlideMediaClass,
        )}
      >
        {hasArtDirection ? (
          <>
            <SafeImage
              src={imageMobile}
              alt={department.name}
              fill
              sizes='100vw'
              className={`block ${imageClass} md:hidden`}
            />
            <SafeImage
              src={image}
              alt={department.name}
              fill
              sizes='26rem'
              className={`hidden ${imageClass} md:block`}
            />
          </>
        ) : (
          <SafeImage
            src={image ?? imageMobile}
            alt={department.name}
            fill
            sizes={IMAGE_SIZES}
            className={imageClass}
          />
        )}
      </div>
    </Link>
  );
}

export { DepartmentCard };
