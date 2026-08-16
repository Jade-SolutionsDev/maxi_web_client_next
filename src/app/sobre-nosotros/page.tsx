import { Container } from '@/app/components/layout/Container';
import { Markdown } from '@/app/components/ui/markdown';
import { PageHero } from '@/app/components/ui/page-hero';
import { StaffCarousel } from '@/shared/cms/components/StaffCarousel';
import { getCmsPage, getStaff } from '@/shared/cms/service/cms.service';

export default async function SobreNosotrosPage() {
  const [page, staff] = await Promise.all([
    getCmsPage('sobre-nosotros'),
    getStaff(),
  ]);

  return (
    <>
      <PageHero
        title={page?.title ?? 'Sobre nosotros'}
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Sobre nosotros' },
        ]}
      />
      <Container size='md' className='py-12'>
        {page ? (
          <Markdown content={page.content} className='mx-auto max-w-3xl' />
        ) : (
          <p className='text-center text-lg text-muted'>
            Estamos trabajando en esta sección. Próximamente.
          </p>
        )}

        {staff.length > 0 && (
          <section
            aria-labelledby='nuestro-equipo'
            className='mt-14 flex flex-col gap-8'
          >
            <h2
              id='nuestro-equipo'
              className='text-center font-fredoka text-3xl font-bold text-heading'
            >
              Nuestro equipo
            </h2>
            <StaffCarousel staff={staff} />
          </section>
        )}
      </Container>
    </>
  );
}
