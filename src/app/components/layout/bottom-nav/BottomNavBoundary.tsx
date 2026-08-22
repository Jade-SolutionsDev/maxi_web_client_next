import { Suspense } from 'react';
import { BottomNavLinks } from './BottomNavLinks';
import { BottomNavLinksFallback } from './BottomNavLinksFallback';

export const BottomNavBoundary = () => (
  <Suspense fallback={<BottomNavLinksFallback />}>
    <BottomNavLinks />
  </Suspense>
);
