import { Suspense } from 'react';
import { hasFaqContent } from '@/shared/cms/service/cms.service';
import { NavItemsFallback } from './NavItemsFallback';
import { PrimaryNav } from './PrimaryNav';

export const PrimaryNavBoundary = async () => {
  const showFaq = await hasFaqContent();
  return (
    <Suspense fallback={<NavItemsFallback showFaq={showFaq} />}>
      <PrimaryNav showFaq={showFaq} />
    </Suspense>
  );
};
