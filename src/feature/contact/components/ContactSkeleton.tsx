import { Container } from '@/app/components/layout/Container';
import { Skeleton } from '@/app/components/ui/skeleton';

export function ContactSkeleton() {
  return (
    <Container size='md' className='py-12'>
      <Skeleton className='mx-auto h-6 w-full max-w-2xl' />

      <div className='mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2'>
        <Skeleton className='h-48 rounded-2xl' />
        <Skeleton className='h-48 rounded-2xl' />
      </div>

      <div className='mx-auto mt-12 flex max-w-2xl flex-col gap-4'>
        <Skeleton className='mx-auto h-8 w-64' />
        <Skeleton className='h-96 rounded-2xl' />
      </div>
    </Container>
  );
}
