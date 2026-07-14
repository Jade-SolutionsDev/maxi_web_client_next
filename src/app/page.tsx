import { DepartamentSection } from '@/feature/departament/components/DepartamentSection';
import { CategoriesSection } from '@/feature/categories/components/CategoriesSection';

import { FeaturedProducts } from '@/feature/home/components/FeaturedProducts';
import { HeroBanner } from '@/feature/home/components/HeroBanner';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <DepartamentSection />
      <FeaturedProducts />
      <CategoriesSection />
      {/* Próximas secciones: Estática */}
    </>
  );
}
