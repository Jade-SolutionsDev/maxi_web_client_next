import { Skeleton } from '@/app/components/ui/skeleton';
import { bannerFrameClass } from './hero-banner.styles';

function HeroBannerSkeleton() {
  return (
    <div aria-hidden='true' className={bannerFrameClass}>
      <Skeleton className='absolute inset-0 rounded-none' />
    </div>
  );
}

export { HeroBannerSkeleton };
