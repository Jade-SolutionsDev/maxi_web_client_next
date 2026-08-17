import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Container } from '@/app/components/layout/Container';
import { Markdown } from '@/app/components/ui/markdown';
import { PageHero } from '@/app/components/ui/page-hero';
import {
  getCmsPage,
  getSiteSettings,
  getStaff,
} from '@/shared/cms/service/cms.service';
import {
  breadcrumbs,
  FALLBACK_TITLE,
  SLUG,
  TITLE_ID,
} from '../constants/about.constants';
import { ContactBand } from './ContactBand';
import { TeamBand } from './TeamBand';

export async function AboutContent() {
  const [page, staff, settings] = await Promise.all([
    getCmsPage(SLUG),
    getStaff(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHero
        title={page?.title ?? FALLBACK_TITLE}
        titleId={TITLE_ID}
        breadcrumbs={breadcrumbs}
      />

      <article aria-labelledby={TITLE_ID}>
        <Container size='sm' className='py-12 sm:py-16'>
          {page ? (
            <Markdown content={page.content} />
          ) : (
            <EmptyState
              title='Todavía no publicamos esta página'
              description='Estamos preparando el contenido. Mientras tanto podés recorrer el catálogo o escribirnos.'
              action={{ href: '/catalog', label: 'Ver el catálogo' }}
            />
          )}
        </Container>
      </article>

      <TeamBand staff={staff} />

      <ContactBand
        email={settings.contact.email}
        phone={settings.contact.phone}
      />
    </>
  );
}
