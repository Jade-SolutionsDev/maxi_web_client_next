import { Suspense } from 'react';
import { SectionBoundary } from '@/app/components/feedback/SectionBoundary';
import { CategoriesSection } from '@/feature/categories/components/CategoriesSection';
import { CategoriesSectionSkeleton } from '@/feature/categories/components/CategoriesSectionSkeleton';
import { DepartmentSection } from '@/feature/department/components/DepartmentSection';
import { DepartmentSectionSkeleton } from '@/feature/department/components/DepartmentSectionSkeleton';
import { HeroBanner } from '@/feature/home/components/HeroBanner';
import { HeroBannerSkeleton } from '@/feature/home/components/HeroBannerSkeleton';
import { ServicesSection } from '@/feature/home/components/ServicesSection';
import { FeaturedProducts } from '@/feature/product/components/FeaturedProducts';
import { OnSaleProducts } from '@/feature/product/components/OnSaleProducts';
import { ProductsSkeleton } from '@/feature/product/components/ProductsSkeleton';
import RecientProductSection from '@/feature/product/components/RecientProduct';

export default function Home() {
  return (
    <>
      <h1 className='sr-only'>Maxi — Supermercado online</h1>

      <SectionBoundary label='las promociones'>
        <Suspense fallback={<HeroBannerSkeleton />}>
          <HeroBanner />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary label='los departamentos'>
        <Suspense fallback={<DepartmentSectionSkeleton />}>
          <DepartmentSection />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary label='los productos destacados'>
        <Suspense fallback={<ProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary label='nuestros servicios'>
        <Suspense>
          <ServicesSection />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary label='los productos en oferta'>
        <Suspense fallback={<ProductsSkeleton title='En oferta' />}>
          <OnSaleProducts />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary label='las categorías'>
        <Suspense fallback={<CategoriesSectionSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary label='los productos recientes '>
        <Suspense
          fallback={
            <ProductsSkeleton title='Nuestros productos más recientes' />
          }
        >
          <RecientProductSection />
        </Suspense>
      </SectionBoundary>

      {/* Próximas secciones: Estática */}
    </>
  );
}
