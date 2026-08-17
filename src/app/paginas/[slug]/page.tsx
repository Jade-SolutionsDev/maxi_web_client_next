import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Container } from '@/app/components/layout/Container';
import { Markdown } from '@/app/components/ui/markdown';
import { PageHero } from '@/app/components/ui/page-hero';
import { Skeleton } from '@/app/components/ui/skeleton';
import { markdownToPlainText, truncate } from '@/helpers';
import { getCmsPage } from '@/shared/cms/service/cms.service';

type CmsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPage(slug);

  if (!page) return {};

  return {
    title: page.title,
    description: truncate(markdownToPlainText(page.content), 155),
    alternates: { canonical: `/paginas/${page.slug}` },
  };
}

async function CmsPageContent({ params }: CmsPageProps) {
  const { slug } = await params;
  const page = await getCmsPage(slug);

  if (!page) notFound();

  return (
    <>
      <PageHero
        title={page.title}
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: page.title }]}
      />
      <Container size='sm' className='py-12'>
        <Markdown content={page.content} />
      </Container>
    </>
  );
}

function CmsPageSkeleton() {
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

      <Container size='sm' className='py-12'>
        <div className='space-y-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <Skeleton className='h-4 w-2/3' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </Container>
    </>
  );
}

export default function CmsInfoPage({ params }: CmsPageProps) {
  return (
    <Suspense fallback={<CmsPageSkeleton />}>
      <CmsPageContent params={params} />
    </Suspense>
  );
}
