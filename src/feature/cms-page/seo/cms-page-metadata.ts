import type { Metadata } from 'next';
import { markdownToPlainText, truncate } from '@/helpers';
import { getCmsPage } from '@/shared/cms/service/cms.service';
import type { CmsPageProps } from '../type/cms-page.interface';

export async function generateCmsPageMetadata({
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
