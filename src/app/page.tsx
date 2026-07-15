import { Suspense } from 'react';
import { SectionBoundary } from '@/app/components/feedback/SectionBoundary';
import { CategoriesSection } from '@/feature/categories/components/CategoriesSection';
import { CategoriesSectionSkeleton } from '@/feature/categories/components/CategoriesSectionSkeleton';
import { DepartmentSection } from '@/feature/department/components/DepartmentSection';
import { DepartmentSectionSkeleton } from '@/feature/department/components/DepartmentSectionSkeleton';
import { FeaturedProducts } from '@/feature/product/components/FeaturedProducts';
import { ProductsSkeleton } from '@/feature/product/components/ProductsSkeleton';
import { HeroBanner } from '@/feature/home/components/HeroBanner';
import RecientProductSection from '@/feature/product/components/RecientProduct';

export default function Home() {
  return (
    <>
      <HeroBanner />

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

      <SectionBoundary label='las categorías'>
        <Suspense fallback={<CategoriesSectionSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary label='los productos recientes '>
        <Suspense fallback={<ProductsSkeleton />}>
          <RecientProductSection />
        </Suspense>
      </SectionBoundary>

      {/* Próximas secciones: Estática */}
    </>
  );
}
