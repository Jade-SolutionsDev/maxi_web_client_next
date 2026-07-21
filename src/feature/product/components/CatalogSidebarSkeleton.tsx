import { Skeleton } from '@/app/components/ui/skeleton';

const SKELETON_ROWS = ['a', 'b', 'c', 'd'];

export function CatalogSidebarSkeleton() {
  return (
    <aside className='max-w-70 w-full flex flex-col h-fit py-6 px-6.5 rounded-[18px] bg-white shadow-md'>
      <div className='mb-6'>
        <Skeleton className='h-5 w-32' />
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
  );
}
