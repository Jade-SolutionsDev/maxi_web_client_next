import {
  LOCATION_BADGE_LABEL,
  locationBadgeClass,
  locationLabelClass,
  locationValueClass,
} from './location-badge.styles';
import { LocationMarker } from './LocationMarker';
import { cn } from '@/lib/utils';

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

      <span className='flex flex-col text-left leading-tight'>
        <span className={locationLabelClass}>{label}</span>
        <span className={locationValueClass}>{location}</span>
      </span>
    </span>
  );
};
