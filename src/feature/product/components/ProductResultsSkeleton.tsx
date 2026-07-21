import { Skeleton } from '@/app/components/ui/skeleton';

const SKELETON_PLACEHOLDERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function ProductResultsSkeleton() {
  return (
    <div className='flex-1 min-w-0'>
      <header className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-9 w-40' />
      </header>
      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {SKELETON_PLACEHOLDERS.map((id) => (
          <li key={id} className='flex flex-col gap-3'>
            <Skeleton className='aspect-square w-full rounded-xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-5 w-1/2' />
          </li>
        ))}
      </ul>
    </div>
  );
}
