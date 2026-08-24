import { Skeleton } from '@/app/components/ui/skeleton';

export const AddressListSkeleton = () => (
  <div className='flex flex-col gap-4'>
    <Skeleton className='h-10 w-44 self-end' />

    <ul className='grid gap-4 md:grid-cols-2'>
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className='rounded-xl border border-heading/10 p-4'>
          <Skeleton className='mb-3 h-5 w-28' />
          <Skeleton className='mb-2 h-4 w-full' />
          <Skeleton className='mb-2 h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </li>
      ))}
    </ul>
  </div>
);
