import { Suspense } from 'react';
import { HeroBannerSkeleton } from '@/feature/home/components/HeroBannerSkeleton';
import { HomeNotices } from '@/feature/home/components/HomeNotices';
import { HomeSections } from '@/feature/home/components/HomeSections';
import { PreviewNotice } from '@/feature/home/components/PreviewNotice';

export default function Home() {
  return (
    <>
      <h1 className='sr-only'>Maxi — Supermercado online</h1>

      <PreviewNotice />

      <Suspense fallback={null}>
        <HomeNotices />
      </Suspense>

      <Suspense fallback={<HeroBannerSkeleton />}>
        <HomeSections />
      </Suspense>
    </>
  );
}
