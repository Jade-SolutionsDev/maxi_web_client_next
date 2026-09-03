import { Suspense } from 'react';
import { CmsPageContent } from '@/feature/cms-page/components/CmsPageContent';
import { CmsPageSkeleton } from '@/feature/cms-page/components/CmsPageSkeleton';
import type { CmsPageProps } from '@/feature/cms-page/type/cms-page.interface';
import { getCmsPages } from '@/shared/cms/service/cms.service';

export { generateCmsPageMetadata as generateMetadata } from '@/feature/cms-page/seo/cms-page-metadata';

export async function generateStaticParams() {
  const pages = await getCmsPages();

  return pages.map(({ slug }) => ({ slug }));
}

export default function CmsInfoPage({ params }: CmsPageProps) {
  return (
    <Suspense fallback={<CmsPageSkeleton />}>
      <CmsPageContent params={params} />
    </Suspense>
  );
}
