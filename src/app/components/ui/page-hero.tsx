import { Container } from '@/app/components/layout/Container';
import { Breadcrumbs, type Crumb } from './breadcrumbs';

interface PageHeroProps {
  title: string;
  /** Optional breadcrumb trail rendered above the title. */
  breadcrumbs?: Crumb[];
  titleId?: string;
}

export const PageHero = ({
  title,
  breadcrumbs,
  titleId = 'page-hero-title',
}: PageHeroProps) => (
  <section
    aria-labelledby={titleId}
    className='relative isolate overflow-hidden bg-linear-to-br from-primary via-secondary to-total'
  >
    <Container className='pb-16 pt-8 sm:pb-20 sm:pt-10'>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} tone='inverted' className='mb-4' />
      )}
      <h1
        id={titleId}
        className='font-fredoka text-2xl tracking-tight text-white sm:text-4xl md:text-[42px]'
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
