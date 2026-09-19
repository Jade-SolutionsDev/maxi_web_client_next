import { AlertTriangle, CalendarClock, PackageSearch } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ApiError } from '@/api/error';
import { Container } from '@/app/components/layout/Container';
import { PageHero } from '@/app/components/ui/page-hero';
import { TrackingTimeline } from '@/feature/tracking/components/TrackingTimeline';
import { estaCancelado, plazoVencido } from '@/feature/tracking/pasos';
import { getOrderTracking } from '@/feature/tracking/service/tracking.service';

export const metadata: Metadata = {
  title: 'Seguimiento del pedido | Maxi Habana',
  // Un enlace de seguimiento no debe acabar en un buscador.
  robots: { index: false, follow: false },
};

const fechaLarga = (iso: string) =>
  new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(iso));

async function SeguimientoContenido({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tracking = await getOrderTracking(id).catch((error: unknown) => {
    // Cualquier fallo se cuenta igual: si dijéramos «este enlace existe pero
    // caducó» estaríamos confirmando cuáles son buenos.
    if (error instanceof ApiError) notFound();
    throw error;
  });

  const cancelado = estaCancelado(tracking);
  const tarde = plazoVencido(tracking);

  return (
    <Container className='flex flex-col gap-6 py-8'>
      <header className='rounded-2xl border border-input bg-background p-5'>
        <p className='text-sm text-muted'>Pedido</p>
        <h2 className='text-2xl font-bold text-heading'>
          {tracking.orderNumber ?? 'Tu pedido'}
        </h2>
        <p className='mt-1 text-lg font-semibold text-primary'>
          {tracking.status}
        </p>
        <p className='mt-2 text-sm text-muted'>
          Comprado el {fechaLarga(tracking.placedAt)}
        </p>
      </header>

      {cancelado ? (
        <section className='flex flex-col gap-3 rounded-2xl border border-input bg-background p-5'>
          <p className='flex items-center gap-2 font-bold text-heading'>
            <AlertTriangle className='size-5 text-primary' aria-hidden='true' />
            Este pedido no llegó a entregarse
          </p>
          <p className='text-sm text-muted'>
            Si crees que es un error o quieres volver a hacerlo, escríbenos y lo
            miramos contigo.
          </p>
          <Link
            href='/contacto'
            className='w-fit rounded-xl bg-primary px-4 py-2 font-semibold text-white'
          >
            Contactar con la tienda
          </Link>
        </section>
      ) : (
        <>
          {(tracking.promisedAt || tracking.promiseDays) && (
            <section
              className={`flex items-start gap-3 rounded-2xl border p-5 ${
                tarde
                  ? 'border-primary bg-primary/5'
                  : 'border-input bg-background'
              }`}
            >
              <CalendarClock
                className='mt-0.5 size-5 shrink-0 text-primary'
                aria-hidden='true'
              />
              <div>
                <p className='font-bold text-heading'>
                  {tracking.deliveredAt
                    ? `Entregado el ${fechaLarga(tracking.deliveredAt)}`
                    : tracking.promisedAt
                      ? `Fecha comprometida: ${fechaLarga(tracking.promisedAt)}`
                      : `Plazo comprometido: ${tracking.promiseDays} días`}
                </p>
                {tarde && (
                  <p className='mt-1 text-sm text-muted'>
                    La fecha comprometida ya pasó y tu pedido sigue en camino.
                    Sentimos la demora; si quieres saber más,{' '}
                    <Link
                      href='/contacto'
                      className='font-semibold text-primary underline'
                    >
                      escríbenos
                    </Link>
                    .
                  </p>
                )}
              </div>
            </section>
          )}

          <section className='rounded-2xl border border-input bg-background p-5'>
            <h3 className='mb-4 flex items-center gap-2 font-bold text-heading'>
              <PackageSearch
                className='size-5 text-primary'
                aria-hidden='true'
              />
              Cómo va tu pedido
            </h3>
            <TrackingTimeline tracking={tracking} />
          </section>
        </>
      )}

      <p className='text-center text-sm text-muted'>
        Guarda este enlace para consultar tu pedido cuando quieras.
      </p>
    </Container>
  );
}

/**
 * La consulta vive dentro de `Suspense` en vez de marcar la ruta como
 * dinámica: con `cacheComponents` esa directiva no está permitida, y además
 * así la cabecera se pinta al instante mientras el estado del pedido llega.
 */
export default function SeguimientoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main>
      <PageHero
        title='Seguimiento de tu pedido'
        titleId='seguimiento-title'
        breadcrumbs={[{ label: 'Inicio', href: '/' }]}
      />
      <Suspense
        fallback={
          <Container className='py-8'>
            <p className='text-sm text-muted'>Buscando tu pedido…</p>
          </Container>
        }
      >
        <SeguimientoContenido params={params} />
      </Suspense>
    </main>
  );
}
