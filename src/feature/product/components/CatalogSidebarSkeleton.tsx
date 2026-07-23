import { Skeleton } from '@/app/components/ui/skeleton';

const SKELETON_ROWS = ['a', 'b', 'c', 'd'];

export function CatalogSidebarSkeleton() {
  return (
    <>
      {/* Mobile: matches the collapsed "Filtros" trigger button */}
      <Skeleton className='h-12 w-full rounded-xl md:hidden' />

      <aside className='hidden h-fit w-full max-w-70 flex-col rounded-[18px] bg-white px-6.5 py-6 shadow-md md:flex'>
        <div className='mb-6'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='mt-4 h-5 w-28' />
          <ul className='mt-4 flex flex-col gap-3'>
            {SKELETON_ROWS.map((id) => (
              <li key={id} className='flex items-center gap-2.5'>
                <Skeleton className='size-5 rounded-md' />
                <Skeleton className='h-4 w-24' />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Skeleton className='h-5 w-28' />
          <ul className='mt-4 flex flex-col gap-3'>
            {SKELETON_ROWS.map((id) => (
              <li key={id} className='flex items-center gap-3'>
                <Skeleton className='size-5 rounded-md' />
                <Skeleton className='h-4 w-24' />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
