import { type ReactNode, Suspense } from 'react';
import { SectionBoundary } from '@/app/components/feedback/SectionBoundary';
import { CategoriesSection } from '@/feature/categories/components/CategoriesSection';
import { CategoriesSectionSkeleton } from '@/feature/categories/components/CategoriesSectionSkeleton';
import { DepartmentSection } from '@/feature/department/components/DepartmentSection';
import { DepartmentSectionSkeleton } from '@/feature/department/components/DepartmentSectionSkeleton';
import { HeroBanner } from '@/feature/home/components/HeroBanner';
import { ServicesSection } from '@/feature/home/components/ServicesSection';
import { FeaturedProducts } from '@/feature/product/components/FeaturedProducts';
import { OnSaleProducts } from '@/feature/product/components/OnSaleProducts';
import { ProductsSkeleton } from '@/feature/product/components/ProductsSkeleton';
import RecientProductSection from '@/feature/product/components/RecientProduct';
import type {
  HomeContent,
  HomeSectionKey,
} from '@/shared/cms/type/cms.interface';

type SectionRenderer = (content: HomeContent) => {
  label: string;
  node: ReactNode;
};

const SECTIONS: Record<HomeSectionKey, SectionRenderer> = {
  hero: (content) => ({
    label: 'las promociones',
    node: <HeroBanner banners={content.banners} />,
  }),
  departments: (content) => ({
    label: 'los departamentos',
    node: (
      <Suspense fallback={<DepartmentSectionSkeleton />}>
        <DepartmentSection departmentIds={content.featuredDepartmentIds} />
      </Suspense>
    ),
  }),
  'featured-products': (content) => ({
    label: 'los productos destacados',
    node: (
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts productIds={content.featuredProductIds} />
      </Suspense>
    ),
  }),
  services: () => ({
    label: 'nuestros servicios',
    node: (
      <Suspense>
        <ServicesSection />
      </Suspense>
    ),
  }),
  'on-sale-products': () => ({
    label: 'los productos en oferta',
    node: (
      <Suspense fallback={<ProductsSkeleton title='En oferta' />}>
        <OnSaleProducts />
      </Suspense>
    ),
  }),
  categories: () => ({
    label: 'las categorías',
    node: (
      <Suspense fallback={<CategoriesSectionSkeleton />}>
        <CategoriesSection />
      </Suspense>
    ),
  }),
  'recent-products': () => ({
    label: 'los productos recientes',
    node: (
      <Suspense
        fallback={<ProductsSkeleton title='Nuestros productos más recientes' />}
      >
        <RecientProductSection />
      </Suspense>
    ),
  }),
};

type HomeSectionProps = {
  section: HomeSectionKey;
  content: HomeContent;
};

function HomeSection({ section, content }: HomeSectionProps) {
  const { label, node } = SECTIONS[section](content);

  return <SectionBoundary label={label}>{node}</SectionBoundary>;
}

export { HomeSection };
