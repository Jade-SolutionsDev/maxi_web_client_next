import Link from 'next/link';
import { SafeImage } from '@/app/components/ui/safe-image';
import type { Department } from '../type/department.interface';

type DepartmentCardProps = {
  department: Department;
};

const imageClass =
  'object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none';

/** Matches the grid tracks: full width on phones, capped at the 26rem track. */
const IMAGE_SIZES = '(min-width: 768px) 26rem, 100vw';

function DepartmentCard({ department }: DepartmentCardProps) {
  const { imageMobile, imageDesktop } = department;

  // Art direction costs a second <img>, and a hidden <img> is still downloaded.
  // Only pay for it when the API actually returns two different crops — today
  // `imageMobileUrl` is null and the adapter falls back to the desktop URL.
  const hasArtDirection = Boolean(
    imageMobile && imageDesktop && imageMobile !== imageDesktop,
  );

  return (
    <Link
      href={`/catalog?departmentId=${department.id}`}
      className='group block overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
    >
      <div className='relative aspect-2184/1146 w-full overflow-hidden rounded-2xl bg-primary/5'>
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
              src={imageDesktop}
              alt={department.name}
              fill
              sizes='26rem'
              className={`hidden ${imageClass} md:block`}
            />
          </>
        ) : (
          <SafeImage
            src={imageDesktop ?? imageMobile}
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
