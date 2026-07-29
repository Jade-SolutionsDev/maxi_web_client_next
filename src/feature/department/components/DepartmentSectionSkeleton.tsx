import { Section } from '@/app/components/layout/Section';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  departmentSlideClass,
  departmentSlideMediaClass,
  departmentTrackClass,
} from './department-carousel.styles';

const PLACEHOLDERS = ['a', 'b', 'c'];

/** Mirrors the Embla viewport/track markup so the layout does not shift. */
function DepartmentSectionSkeleton() {
  return (
    <Section label='Departamentos'>
      <div className='overflow-hidden'>
        <div className={cn('flex', departmentTrackClass)}>
          {PLACEHOLDERS.map((id) => (
            <div key={id} className={departmentSlideClass}>
              <Skeleton className={departmentSlideMediaClass} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export { DepartmentSectionSkeleton };
