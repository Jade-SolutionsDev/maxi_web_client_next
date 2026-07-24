import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { PageHero } from '@/app/components/ui/page-hero';
import { CatalogSidebar } from '@/feature/product/components/CatalogSidebar';
import { CatalogSidebarSkeleton } from '@/feature/product/components/CatalogSidebarSkeleton';
import { ProductResults } from '@/feature/product/components/ProductResults';
import { ProductResultsSkeleton } from '@/feature/product/components/ProductResultsSkeleton';
import { Section } from '../components/layout/Section';

type CatalogPageProps = {
  searchParams: Promise<SearchParams>;
};

function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <>
      <PageHero
        title='Descubre nuestros productos'
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Catálogo', href: '/catalog' },
        ]}
      />
      <Section direction='row'>
        <Suspense fallback={<CatalogSidebarSkeleton />}>
          <CatalogSidebar />
        </Suspense>

        <Suspense fallback={<ProductResultsSkeleton />}>
          <ProductResults searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}

export default CatalogPage;
