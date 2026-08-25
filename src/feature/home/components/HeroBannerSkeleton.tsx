import { Skeleton } from '@/app/components/ui/skeleton';
import { bannerFrameClass, heroSpineClass } from './hero-banner.styles';

function HeroBannerSkeleton() {
  return (
    <div aria-hidden='true' className={heroSpineClass}>
      <div className={bannerFrameClass}>
        <Skeleton className='absolute inset-0 rounded-none' />
      </div>
    </div>
  );
}

export { HeroBannerSkeleton };
