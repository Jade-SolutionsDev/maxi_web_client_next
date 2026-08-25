import { Container } from '@/app/components/layout/Container';
import { Skeleton } from '@/app/components/ui/skeleton';

export const OrderListSkeleton = () => (
  <Container className='py-8'>
    <ul className='flex flex-col gap-3'>
      {[0, 1, 2, 3].map((i) => (
        <li
          key={i}
          className='flex items-center gap-4 rounded-2xl border border-input bg-background p-4 sm:p-5'
        >
          <Skeleton className='size-11 shrink-0 rounded-xl' />

          <div className='min-w-0 flex-1'>
            <Skeleton className='h-5 w-40' />
            <Skeleton className='mt-1.5 h-4 w-32' />
            <div className='mt-2 flex flex-wrap gap-1.5'>
              <Skeleton className='h-6 w-24 rounded-full' />
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='size-4' />
          </div>
        </li>
      ))}
    </ul>
  </Container>
);
