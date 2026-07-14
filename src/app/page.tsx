import { Suspense } from 'react';
import { SectionBoundary } from '@/app/components/feedback/SectionBoundary';
import { CategoriesSection } from '@/feature/categories/components/CategoriesSection';
import { CategoriesSectionSkeleton } from '@/feature/categories/components/CategoriesSectionSkeleton';
import { DepartmentSection } from '@/feature/department/components/DepartmentSection';
import { DepartmentSectionSkeleton } from '@/feature/department/components/DepartmentSectionSkeleton';
import { FeaturedProducts } from '@/feature/home/components/FeaturedProducts';
import { FeaturedProductsSkeleton } from '@/feature/home/components/FeaturedProductsSkeleton';
import { HeroBanner } from '@/feature/home/components/HeroBanner';

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
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </SectionBoundary>

      <SectionBoundary label='las categorías'>
        <Suspense fallback={<CategoriesSectionSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </SectionBoundary>

      {/* Próximas secciones: Estática */}
    </>
  );
}
