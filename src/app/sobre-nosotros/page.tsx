import { Suspense } from 'react';
import { AboutContent } from '@/feature/about/components/AboutContent';
import { AboutSkeleton } from '@/feature/about/components/AboutSkeleton';

export { generateAboutMetadata as generateMetadata } from '@/feature/about/seo/about-metadata';

export default function SobreNosotrosPage() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutContent />
    </Suspense>
  );
}
