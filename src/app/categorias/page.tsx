import { Suspense } from 'react';
import { SectionBoundary } from '@/app/components/feedback/SectionBoundary';
import { PageHero } from '@/app/components/ui/page-hero';
import { CategoriesDirectory } from '@/feature/categories/components/CategoriesDirectory';
import { CategoriesDirectorySkeleton } from '@/feature/categories/components/CategoriesDirectorySkeleton';

export { generateCategoriesMetadata as generateMetadata } from '@/feature/categories/seo/categories-metadata';

export default function CategoriasPage() {
  return (
    <>
      <PageHero
        title='Categorías'
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Categorías' }]}
      />

      <main>
        <SectionBoundary label='las categorías'>
          <Suspense fallback={<CategoriesDirectorySkeleton />}>
            <CategoriesDirectory />
          </Suspense>
        </SectionBoundary>
      </main>
    </>
  );
}
