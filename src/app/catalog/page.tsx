import type { Metadata } from 'next';
import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { PageHero } from '@/app/components/ui/page-hero';
import { CatalogSidebar } from '@/feature/product/components/CatalogSidebar';
import { CatalogSidebarSkeleton } from '@/feature/product/components/CatalogSidebarSkeleton';
import { CatalogFilters } from '@/feature/product/components/filters';
import { ProductResults } from '@/feature/product/components/ProductResults';
import { ProductResultsSkeleton } from '@/feature/product/components/ProductResultsSkeleton';
import { CATALOG_PATH } from '@/feature/product/constants/catalog-search-href';
import { Section } from '../components/layout/Section';

const title = 'Catálogo de productos';
const description =
  'Explorá el catálogo de MaxiHabana: filtrá por departamento, categoría y precio, y encontrá las mejores ofertas con recogida en tienda.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: CATALOG_PATH },
  openGraph: {
    type: 'website',
    title,
    description,
    url: CATALOG_PATH,
  },
};

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
        {/*
          `Root` reads the search params through nuqs, so with `cacheComponents`
          it cannot render in the static shell: it needs its own boundary above
          the inner ones. The fallback mirrors the full row so the shell keeps
          the sidebar + results layout instead of collapsing to nothing.
        */}
        <Suspense
          fallback={
            <>
              <CatalogSidebarSkeleton />
              <ProductResultsSkeleton />
            </>
          }
        >
          {/*
            Wraps both boundaries: the sidebar filters and the results sort control
            sit on opposite sides of the grid but must share one filter state.
          */}
          <CatalogFilters.Root>
            <Suspense fallback={<CatalogSidebarSkeleton />}>
              <CatalogSidebar />
            </Suspense>

            <Suspense fallback={<ProductResultsSkeleton />}>
              <ProductResults searchParams={searchParams} />
            </Suspense>
          </CatalogFilters.Root>
        </Suspense>
      </Section>
    </>
  );
}

export default CatalogPage;
