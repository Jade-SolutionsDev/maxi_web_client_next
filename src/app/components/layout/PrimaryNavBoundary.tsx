import { Suspense } from 'react';
import { NavItemsFallback } from './NavItemsFallback';
import { PrimaryNav } from './PrimaryNav';

export const PrimaryNavBoundary = () => (
  <Suspense fallback={<NavItemsFallback />}>
    <PrimaryNav />
  </Suspense>
);
