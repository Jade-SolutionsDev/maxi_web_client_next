import { Skeleton } from '@/app/components/ui/skeleton';
import {
  CATALOG_RESULTS_ID,
  CATALOG_RESULTS_SCROLL_MARGIN,
} from '../constants/catalog-anchor';
import { catalogGridClass } from './product-grid.styles';

const SKELETON_PLACEHOLDERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function ProductResultsSkeleton() {
  return (
    <div
      id={CATALOG_RESULTS_ID}
      className={`flex-1 min-w-0 ${CATALOG_RESULTS_SCROLL_MARGIN}`}
    >
      <header className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-9 w-40' />
      </header>
      <ul className={catalogGridClass}>
        {SKELETON_PLACEHOLDERS.map((id) => (
          <li key={id} className='flex flex-col gap-2'>
            <Skeleton className='aspect-[4/3] w-full rounded-xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-5 w-1/2' />
          </li>
        ))}
      </ul>
    </div>
  );
}
