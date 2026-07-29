import { Suspense } from 'react';
import { LocationBadgeFallback } from './LocationBadgeFallback';
import { LocationGate } from './LocationGate';

interface LocationBoundaryProps {
  className?: string;
}


export const LocationBoundary = ({ className }: LocationBoundaryProps) => (
  <Suspense fallback={<LocationBadgeFallback className={className} />}>
    <LocationGate className={className} />
  </Suspense>
);
