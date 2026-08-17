import type { Metadata } from 'next';
import { markdownToPlainText, truncate } from '@/helpers';
import { getCmsPage } from '@/shared/cms/service/cms.service';
import { FALLBACK_TITLE, SLUG } from '../constants/about.constants';

export async function generateAboutMetadata(): Promise<Metadata> {
  const page = await getCmsPage(SLUG);
  const canonical = { canonical: `/${SLUG}` };

  if (!page) return { title: FALLBACK_TITLE, alternates: canonical };

  return {
    title: page.title,
    description: truncate(markdownToPlainText(page.content), 155),
    alternates: canonical,
  };
}
