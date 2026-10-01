import { Suspense } from 'react';
import { HeroBannerSkeleton } from '@/feature/home/components/HeroBannerSkeleton';
import { HomeSections } from '@/feature/home/components/HomeSections';

export default function Home() {
  return (
    <>
      <h1 className='sr-only'>Maxi — Supermercado online</h1>

      <Suspense fallback={<HeroBannerSkeleton />}>
        <HomeSections />
      </Suspense>
    </>
  );
}
