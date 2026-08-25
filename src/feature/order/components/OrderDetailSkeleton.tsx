import { Container } from '@/app/components/layout/Container';
import { Skeleton } from '@/app/components/ui/skeleton';

const InfoCard = () => (
  <div className='rounded-2xl border border-input bg-background p-5'>
    <Skeleton className='mb-3 h-5 w-24' />
    <Skeleton className='mb-2 h-3.5 w-full' />
    <Skeleton className='mb-2 h-3.5 w-4/5' />
    <Skeleton className='h-3.5 w-3/5' />
  </div>
);

export const OrderDetailSkeleton = () => (
  <Container className='flex flex-col gap-6 py-8'>
    <header className='flex flex-wrap items-center justify-between gap-3'>
      <div>
        <Skeleton className='h-7 w-40' />
        <Skeleton className='mt-2 h-4 w-48' />
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Skeleton className='h-6 w-24 rounded-full' />
        <Skeleton className='h-6 w-20 rounded-full' />
      </div>
    </header>

    <div className='grid gap-6 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-start'>
      <div className='flex flex-col gap-6'>
        <div className='rounded-2xl border border-input bg-background p-5 sm:p-6'>
          <Skeleton className='mb-4 h-6 w-28' />

          <ul className='flex flex-col divide-y divide-input'>
            {[0, 1, 2].map((i) => (
              <li key={i} className='flex items-center gap-3 py-3'>
                <Skeleton className='size-12 shrink-0 rounded-lg' />
                <div className='min-w-0 flex-1'>
                  <Skeleton className='h-4 w-2/3' />
                  <Skeleton className='mt-2 h-3 w-24' />
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
              <Skeleton className='h-4 w-20' />
            </div>
            <div className='flex items-baseline justify-between'>
              <Skeleton className='h-5 w-14' />
              <Skeleton className='h-7 w-28' />
            </div>
          </div>
        </div>

        <div className='grid gap-6 sm:grid-cols-2'>
          <InfoCard />
          <InfoCard />
        </div>
      </div>

      <div className='rounded-2xl border border-input bg-background p-5 sm:p-6'>
        <Skeleton className='mb-4 h-6 w-32' />
        <Skeleton className='mb-2 h-4 w-full' />
        <Skeleton className='mb-4 h-4 w-3/4' />
        <Skeleton className='h-11 w-full rounded-xl' />
      </div>
    </div>
  </Container>
);
