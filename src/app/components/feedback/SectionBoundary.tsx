'use client';

import { type ErrorInfo, unstable_catchError } from 'next/error';
import { Section } from '@/app/components/layout/Section';
import { Button } from '@/app/components/ui/button';

type SectionBoundaryProps = {
  /** Human-readable name of the section, used in the message and landmark label. */
  label: string;
};

/**
 * Per-section error fallback. Isolates a failing section so one broken data
 * fetch degrades gracefully instead of taking down the whole page.
 * `unstable_retry` re-fetches and re-renders the boundary's children.
 */
function SectionErrorFallback(
  { label }: SectionBoundaryProps,
  { unstable_retry }: ErrorInfo,
) {
  return (
    <Section label={`No se pudo cargar ${label}`}>
      <div
        role='alert'
        className='flex flex-col items-center gap-3 rounded-2xl bg-surface px-6 py-10 text-center'
      >
        <p className='font-medium text-heading'>No pudimos cargar {label}.</p>
        <p className='text-sm text-muted'>
          Revisa tu conexión e inténtalo de nuevo.
        </p>
        <Button type='button' size='lg' onClick={() => unstable_retry()}>
          Reintentar
        </Button>
      </div>
    </Section>
  );
}

export const SectionBoundary = unstable_catchError(SectionErrorFallback);
