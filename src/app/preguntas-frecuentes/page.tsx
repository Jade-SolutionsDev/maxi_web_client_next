import type { Metadata } from 'next';
import { Container } from '@/app/components/layout/Container';
import { PageHero } from '@/app/components/ui/page-hero';
import { FaqContent } from '@/feature/faq/components/FaqContent';
import { FaqStructuredData } from '@/feature/faq/seo/FaqStructuredData';
import { getFaqCategories } from '@/shared/cms/service/cms.service';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description:
    'Resuelve tus dudas sobre los pagos con Mi Billetera, el estado de tu pedido y cómo obtener ayuda en Maxi Habana.',
  alternates: { canonical: '/preguntas-frecuentes' },
};

export default async function PreguntasFrecuentesPage() {
  const categories = await getFaqCategories();

  return (
    <>
      <FaqStructuredData categories={categories} />
      <PageHero
        title='Preguntas frecuentes'
        titleId='faq-page-title'
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Preguntas frecuentes' },
        ]}
      />

      <section aria-labelledby='faq-page-title'>
        <Container size='sm' className='py-12 sm:py-16'>
          <p className='text-lg leading-relaxed text-body'>
            Encuentra respuestas claras sobre los pagos con Mi Billetera y tus
            pedidos.
          </p>
          <div className='mt-8'>
            <FaqContent categories={categories} />
          </div>
        </Container>
      </section>
    </>
  );
}
