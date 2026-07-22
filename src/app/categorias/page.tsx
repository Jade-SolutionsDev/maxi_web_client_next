import { Container } from '@/app/components/layout/Container';
import { PageHero } from '@/app/components/ui/page-hero';

export default function CategoriasPage() {
  return (
    <>
      <PageHero
        title='Categorías'
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Categorías' }]}
      />
      <Container className='py-12 text-center'>
        <p className='text-lg text-muted'>
          Estamos trabajando en esta sección. Próximamente.
        </p>
      </Container>
    </>
  );
}
