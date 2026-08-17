import { Container } from '@/app/components/layout/Container';
import { PageHeroSkeleton } from '@/app/components/ui/page-hero-skeleton';
import { Skeleton } from '@/app/components/ui/skeleton';

export function AboutSkeleton() {
  return (
    <>
      <PageHeroSkeleton />

      <Container size='sm' className='py-12 sm:py-16'>
        <div className='mx-auto w-full max-w-[68ch] space-y-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <Skeleton className='h-4 w-2/3' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </Container>
    </>
  );
}
