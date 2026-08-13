import { Skeleton } from '@/app/components/ui/skeleton';
import { catalogSidebarClass } from './catalog-sidebar.styles';

const SKELETON_ROWS = ['a', 'b', 'c', 'd', 'e', 'f'];

export function CatalogSidebarSkeleton() {
  return (
    <>
      {/* Mobile: matches the collapsed "Filtros" trigger button */}
      <Skeleton className='h-12 w-full rounded-xl md:hidden' />

      <aside className={catalogSidebarClass}>
        <div className='mb-6'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='mt-4 h-5 w-28' />
        </div>
        <div>
          <Skeleton className='h-5 w-36' />
          <ul className='mt-4 flex flex-col gap-3'>
            {SKELETON_ROWS.map((id) => (
              <li key={id} className='flex items-center gap-2.5'>
                <Skeleton className='size-5 rounded-md' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='ml-auto h-4 w-6' />
                <Skeleton className='size-7 rounded-md' />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
