import {
  LOCATION_BADGE_LABEL,
  locationBadgeClass,
  locationLabelClass,
  locationValueSkeletonClass,
} from './location-badge.styles';
import { LocationMarker } from './LocationMarker';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LocationBadgeFallbackProps {
  label?: string;
  className?: string;
}

export const LocationBadgeFallback = ({
  label = LOCATION_BADGE_LABEL,
  className,
}: LocationBadgeFallbackProps) => {
  return (
    <span className={cn(locationBadgeClass, className)}>
      <LocationMarker />

      <span className='flex flex-col text-left leading-tight'>
        <span className={locationLabelClass}>{label}</span>
        <Skeleton className={locationValueSkeletonClass} />
      </span>
    </span>
  );
};
