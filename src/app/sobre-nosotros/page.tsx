import { Mail, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Container } from '@/app/components/layout/Container';
import { buttonVariants } from '@/app/components/ui/button';
import { Markdown } from '@/app/components/ui/markdown';
import { PageHero } from '@/app/components/ui/page-hero';
import { Skeleton } from '@/app/components/ui/skeleton';
import { markdownToPlainText, toTelHref, truncate } from '@/helpers';
import { cn } from '@/lib/utils';
import { StaffCarousel } from '@/shared/cms/components/StaffCarousel';
import {
  getCmsPage,
  getSiteSettings,
  getStaff,
} from '@/shared/cms/service/cms.service';
import type { StaffMember } from '@/shared/cms/type/cms.interface';

const SLUG = 'sobre-nosotros';
const FALLBACK_TITLE = 'Sobre nosotros';
const TITLE_ID = 'sobre-nosotros-titulo';
const TEAM_ID = 'sobre-nosotros-equipo';
const CONTACT_ID = 'sobre-nosotros-contacto';

const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: FALLBACK_TITLE }];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage(SLUG);
  const canonical = { canonical: `/${SLUG}` };

  if (!page) return { title: FALLBACK_TITLE, alternates: canonical };

  return {
    title: page.title,
    description: truncate(markdownToPlainText(page.content), 155),
    alternates: canonical,
  };
}

const TeamBand = ({ staff }: { staff: StaffMember[] }) => (
  <section aria-labelledby={TEAM_ID} className='bg-surface py-14 sm:py-20'>
    <Container className='flex flex-col gap-10 sm:gap-12'>
      <h2
        id={TEAM_ID}
        className='text-center font-fredoka text-3xl font-bold text-balance text-heading sm:text-4xl'
      >
        Nuestro equipo
      </h2>
      <StaffCarousel staff={staff} />
    </Container>
  </section>
);

const ContactBand = ({ email, phone }: { email: string; phone: string }) => (
  <section aria-labelledby={CONTACT_ID} className='py-14 sm:py-20'>
    <Container
      size='sm'
      className='flex flex-col items-center gap-5 text-center'
    >
      <h2
        id={CONTACT_ID}
        className='font-fredoka text-3xl font-bold text-balance text-heading sm:text-4xl'
      >
        ¿Hablamos?
      </h2>
      <p className='max-w-[52ch] text-pretty text-body'>
        Estamos para responder dudas sobre pedidos, productos y entregas.
      </p>

      <div className='mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row'>
        <a
          href={toTelHref(phone)}
          className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}
        >
          <Phone aria-hidden='true' className='size-4 shrink-0' />
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'gap-2',
          )}
        >
          <Mail aria-hidden='true' className='size-4 shrink-0' />
          {email}
        </a>
      </div>
    </Container>
  </section>
);

async function SobreNosotrosContent() {
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

      {staff.length > 0 && <TeamBand staff={staff} />}

      <ContactBand
        email={settings.contact.email}
        phone={settings.contact.phone}
      />
    </>
  );
}

function SobreNosotrosSkeleton() {
  return (
    <>
      <section
        aria-hidden='true'
        className='relative isolate overflow-hidden bg-linear-to-br from-primary via-secondary to-total'
      >
        <Container className='pb-16 pt-8 sm:pb-20 sm:pt-10'>
          <Skeleton className='h-9 w-64 bg-white/30 sm:h-10 sm:w-80' />
        </Container>

        <svg
          aria-hidden='true'
          className='absolute inset-x-0 bottom-0 h-6 w-full text-background sm:h-10'
          viewBox='0 0 1440 60'
          preserveAspectRatio='none'
          fill='currentColor'
        >
          <path d='M0 32C240 8 480 8 720 24C960 40 1200 40 1440 20V60H0V32Z' />
        </svg>
      </section>

      <Container size='sm' className='py-12 sm:py-16'>
        <div className='mx-auto w-full max-w-[68ch] space-y-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <Skeleton className='h-4 w-2/3' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </Container>
    </>
  );
}

export default function SobreNosotrosPage() {
  return (
    <Suspense fallback={<SobreNosotrosSkeleton />}>
      <SobreNosotrosContent />
    </Suspense>
  );
}
