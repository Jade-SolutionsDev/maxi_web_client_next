import { CategoriesSection } from '@/feature/home/components/CategoriesSection';
import { DepartamentSection } from '@/feature/home/components/DepartamentSection';
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
