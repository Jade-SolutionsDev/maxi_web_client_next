import { cn } from '@/lib/utils';
import { LocationMarker } from './LocationMarker';
import {
  LOCATION_BADGE_LABEL,
  locationBadgeClass,
  locationLabelClass,
  locationValueClass,
} from './location-badge.styles';

interface LocationBadgeProps {
  location: string;
  label?: string;
  className?: string;
}

export const LocationBadge = ({
  location,
  label = LOCATION_BADGE_LABEL,
  className,
}: LocationBadgeProps) => {
  return (
    <span className={cn(locationBadgeClass, className)}>
      <LocationMarker />

      <span className='flex min-w-0 flex-col text-left leading-tight'>
        <span className={locationLabelClass}>{label}</span>
        <span className={locationValueClass}>{location}</span>
      </span>
    </span>
  );
};
