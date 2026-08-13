import { PageHero } from '@/app/components/ui/page-hero';
import { CatalogSidebarSkeleton } from '@/feature/product/components/CatalogSidebarSkeleton';
import { ProductResultsSkeleton } from '@/feature/product/components/ProductResultsSkeleton';
import { Section } from '../components/layout/Section';

export default function Loading() {
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
        <CatalogSidebarSkeleton />
        <ProductResultsSkeleton />
      </Section>
    </>
  );
}
