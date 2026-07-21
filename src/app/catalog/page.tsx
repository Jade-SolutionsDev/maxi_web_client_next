import { Suspense } from 'react';
import { PageHero } from '@/app/components/ui/page-hero';
import { CatalogSidebar } from '@/feature/product/components/CatalogSidebar';
import { CatalogSidebarSkeleton } from '@/feature/product/components/CatalogSidebarSkeleton';
import { ProductResults } from '@/feature/product/components/ProductResults';
import { ProductResultsSkeleton } from '@/feature/product/components/ProductResultsSkeleton';
import type { CatalogSearchParams } from '@/feature/product/constants/product-search-params';
import { Section } from '../components/layout/Section';

type CatalogPageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <div>
      <PageHero title='Descubre nuestros productos' />
      <Section direction='row'>
        <Suspense fallback={<CatalogSidebarSkeleton />}>
          <CatalogSidebar />
        </Suspense>

        <Suspense fallback={<ProductResultsSkeleton />}>
          <ProductResults searchParams={searchParams} />
        </Suspense>
      </Section>
    </div>
  );
}

export default CatalogPage;
