import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/app/components/layout/Container';
import { Markdown } from '@/app/components/ui/markdown';
import { PageHero } from '@/app/components/ui/page-hero';
import { truncate } from '@/helpers';
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
    description: truncate(page.content.replace(/[#*_>[\]`-]/g, ' '), 155),
    alternates: { canonical: `/paginas/${page.slug}` },
  };
}

export default async function CmsInfoPage({ params }: CmsPageProps) {
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
