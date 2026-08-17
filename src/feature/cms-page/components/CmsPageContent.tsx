import { notFound } from 'next/navigation';
import { Container } from '@/app/components/layout/Container';
import { Markdown } from '@/app/components/ui/markdown';
import { PageHero } from '@/app/components/ui/page-hero';
import { getCmsPage } from '@/shared/cms/service/cms.service';
import { TITLE_ID } from '../constants/cms-page.constants';
import type { CmsPageProps } from '../type/cms-page.interface';

export async function CmsPageContent({ params }: CmsPageProps) {
  const { slug } = await params;
  const page = await getCmsPage(slug);

  if (!page) notFound();

  return (
    <>
      <PageHero
        title={page.title}
        titleId={TITLE_ID}
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: page.title }]}
      />
      <article aria-labelledby={TITLE_ID}>
        <Container size='sm' className='py-12 sm:py-16'>
          <Markdown content={page.content} />
        </Container>
      </article>
    </>
  );
}
