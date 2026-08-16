import { Container } from '@/app/components/layout/Container';
import { Markdown } from '@/app/components/ui/markdown';
import { PageHero } from '@/app/components/ui/page-hero';
import { SafeImage } from '@/app/components/ui/safe-image';
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
            <ul className='grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-4'>
              {staff.map((member) => (
                <li
                  key={member.id}
                  className='flex w-full max-w-45 flex-col items-center gap-3 text-center'
                >
                  <div className='relative aspect-square w-full overflow-hidden rounded-full border border-black/5 bg-surface'>
                    <SafeImage
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes='(max-width: 640px) 40vw, 180px'
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h3 className='font-bold text-heading'>{member.name}</h3>
                    <p className='text-sm text-muted'>{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
