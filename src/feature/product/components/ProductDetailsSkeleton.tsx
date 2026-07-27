import { Container } from '@/app/components/layout/Container';
import { Section } from '@/app/components/layout/Section';
import { Skeleton } from '@/app/components/ui/skeleton';

function ProductDetailsSkeleton() {
  return (
    <>
      <section
        aria-hidden='true'
        className='relative isolate overflow-hidden bg-linear-to-br from-primary via-secondary to-total'
      >
        <Container className='pb-16 pt-8 sm:pb-20 sm:pt-10'>
          <Skeleton className='h-9 w-64 bg-white/30 sm:h-10 sm:w-80' />
        </Container>

        <svg
          aria-hidden='true'
          className='absolute inset-x-0 bottom-0 h-6 w-full text-background sm:h-10'
          viewBox='0 0 1440 60'
          preserveAspectRatio='none'
          fill='currentColor'
        >
          <path d='M0 32C240 8 480 8 720 24C960 40 1200 40 1440 20V60H0V32Z' />
        </svg>
      </section>

      <Section direction='row'>
        <Skeleton className='aspect-square w-full max-w-125 rounded-2xl' />

        <div className='flex-1 space-y-5 max-w-145'>
          <Skeleton className='h-6 w-32 rounded-full' />

          <Skeleton className='h-9 w-3/4' />

          <Skeleton className='h-10 w-28' />

          <div className='space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-2/3' />
          </div>

          <hr className='border-black/10' />

          <div className='flex flex-col items-stretch gap-3 sm:flex-row'>
            <Skeleton className='h-12 w-36 rounded-xl' />
            <Skeleton className='h-12 flex-1 rounded-xl' />
          </div>
        </div>
      </Section>
    </>
  );
}

export { ProductDetailsSkeleton };
