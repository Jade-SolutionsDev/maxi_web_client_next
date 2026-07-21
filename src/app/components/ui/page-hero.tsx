import { Container } from '@/app/components/layout/Container';

interface PageHeroProps {
  title: string;

  titleId?: string;
}

export const PageHero = ({
  title,
  titleId = 'page-hero-title',
}: PageHeroProps) => (
  <section
    aria-labelledby={titleId}
    className='relative isolate overflow-hidden bg-linear-to-br from-primary via-secondary to-total'
  >
    <Container className='pb-16 pt-8 sm:pb-20 sm:pt-10'>
      <h1
        id={titleId}
        className='font-fredoka text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[42px]'
      >
        {title}
      </h1>
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
);
