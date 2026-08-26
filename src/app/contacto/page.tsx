import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero } from '@/app/components/ui/page-hero';
import { ContactSection } from '@/feature/contact/components/ContactSection';
import { ContactSkeleton } from '@/feature/contact/components/ContactSkeleton';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escribí al equipo de MaxiHabana: dudas sobre pedidos, pagos, entregas y sugerencias. Te respondemos lo antes posible.',
  alternates: { canonical: '/contacto' },
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        title='Contacto'
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Contacto' }]}
      />
      <Suspense fallback={<ContactSkeleton />}>
        <ContactSection />
      </Suspense>
    </>
  );
}
