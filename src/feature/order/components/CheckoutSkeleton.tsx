import { Container } from '@/app/components/layout/Container';
import { Skeleton } from '@/app/components/ui/skeleton';

const FieldSkeleton = () => (
  <div className='flex flex-col gap-2'>
    <Skeleton className='h-4 w-28' />
    <Skeleton className='h-11 w-full rounded-xl' />
  </div>
);

export const CheckoutSkeleton = () => (
  <Container className='grid gap-6 py-8 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-start'>
    <div className='rounded-2xl border border-input bg-background p-5 sm:p-6 lg:order-first'>
      <Skeleton className='mb-4 h-6 w-36' />

      <div className='flex flex-col gap-5'>
        <div className='flex gap-3'>
          <Skeleton className='h-11 flex-1 rounded-xl' />
          <Skeleton className='h-11 flex-1 rounded-xl' />
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>

        <div className='flex flex-col gap-3 border-t border-input pt-5'>
          <Skeleton className='h-5 w-32' />
          {[0, 1].map((i) => (
            <Skeleton key={i} className='h-16 w-full rounded-xl' />
          ))}
        </div>

        <Skeleton className='h-12 w-full rounded-xl' />
      </div>
    </div>

    <div className='rounded-2xl border border-input bg-background p-5 sm:p-6'>
      <Skeleton className='mb-4 h-6 w-24' />

      <ul className='flex flex-col divide-y divide-input'>
        {[0, 1, 2].map((i) => (
          <li key={i} className='flex items-center gap-3 py-3'>
            <Skeleton className='size-12 shrink-0 rounded-lg' />
            <div className='min-w-0 flex-1'>
              <Skeleton className='h-4 w-2/3' />
              <Skeleton className='mt-2 h-3 w-20' />
            </div>
            <Skeleton className='h-4 w-16 shrink-0' />
          </li>
        ))}
      </ul>

      <div className='mt-4 flex flex-col gap-2 border-t border-input pt-4'>
        <div className='flex items-baseline justify-between'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-20' />
        </div>
        <div className='flex items-baseline justify-between'>
          <Skeleton className='h-4 w-12' />
          <Skeleton className='h-4 w-16' />
        </div>
        <div className='flex items-baseline justify-between'>
          <Skeleton className='h-5 w-14' />
          <Skeleton className='h-6 w-28' />
        </div>
      </div>
    </div>
  </Container>
);
