'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { StorePopup } from '@/shared/cms/type/cms.interface';

const CLAVE = 'maxi:popup-cerrado';

type Cierre = { version: string; at: number };

const leerCierre = (): Cierre | null => {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Cierre) : null;
  } catch {
    return null;
  }
};

const guardarCierre = (version: string) => {
  try {
    window.localStorage.setItem(
      CLAVE,
      JSON.stringify({ version, at: Date.now() } satisfies Cierre),
    );
  } catch {
    // Navegación privada o almacenamiento bloqueado: el aviso volverá a salir
    // en la siguiente visita. Molesta menos que romper la portada.
  }
};

export const debeVerse = (
  popup: Pick<StorePopup, 'version' | 'repeatAfterHours'>,
  cierre: Cierre | null,
  ahora: number,
): boolean => {
  if (!cierre) return true;
  if (cierre.version !== popup.version) return true;
  if (popup.repeatAfterHours == null) return false;
  return ahora - cierre.at >= popup.repeatAfterHours * 3600 * 1000;
};

export function StorePopupDialog({ popup }: { popup: StorePopup }) {
  const [abierto, setAbierto] = useState(false);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const devolverFocoA = useRef<Element | null>(null);

  useEffect(() => {
    if (debeVerse(popup, leerCierre(), Date.now())) {
      devolverFocoA.current = document.activeElement;
      setAbierto(true);
    }
  }, [popup]);

  useEffect(() => {
    if (!abierto) return;
    cerrarRef.current?.focus();
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') cerrar();
    };
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  });

  const cerrar = () => {
    guardarCierre(popup.version);
    setAbierto(false);
    (devolverFocoA.current as HTMLElement | null)?.focus?.();
  };

  if (!abierto) return null;

  const imagen = popup.desktop;

  return (
    <>
      {/* El velo no cubre el teléfono: ahí el aviso es una tarjeta abajo y la
          tienda sigue usable. Un intersticial a pantalla completa en móvil
          penaliza en buscadores, y el catálogo vive de esas visitas. */}
      <button
        type='button'
        aria-label='Cerrar el aviso'
        onClick={cerrar}
        className='fixed inset-0 z-40 hidden cursor-default bg-heading/55 sm:block'
      />

      <div
        role='dialog'
        aria-modal='false'
        aria-labelledby='titulo-aviso-tienda'
        className='fixed inset-x-3 bottom-3 z-50 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[min(46rem,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:ring-0'
      >
        <div className='flex flex-col sm:flex-row'>
          {imagen ? (
            <picture className='hidden sm:block sm:w-2/5 sm:shrink-0'>
              {popup.mobile ? (
                <source media='(max-width: 639px)' srcSet={popup.mobile.src} />
              ) : null}
              {popup.tablet ? (
                <source media='(max-width: 1023px)' srcSet={popup.tablet.src} />
              ) : null}
              <img
                src={imagen.src}
                alt=''
                width={imagen.width}
                height={imagen.height}
                className='h-full w-full object-cover'
              />
            </picture>
          ) : null}

          <div className='relative flex flex-1 flex-col gap-2 p-5 sm:gap-3 sm:p-8'>
            <button
              ref={cerrarRef}
              type='button'
              onClick={cerrar}
              aria-label='Cerrar el aviso'
              className='absolute top-3 right-3 flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-heading focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:size-9'
            >
              <X className='size-5' aria-hidden='true' />
            </button>

            <h2
              id='titulo-aviso-tienda'
              className='pr-12 text-lg font-bold text-balance text-heading sm:text-2xl'
            >
              {popup.title}
            </h2>

            <p className='text-sm leading-relaxed text-pretty text-muted sm:text-base'>
              {popup.body}
            </p>

            {popup.buttonLabel ? (
              <div className='mt-1 flex flex-wrap items-center gap-2 sm:mt-3 sm:gap-3'>
                {popup.buttonHref ? (
                  <Link
                    href={popup.buttonHref}
                    onClick={cerrar}
                    className='inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none'
                  >
                    {popup.buttonLabel}
                  </Link>
                ) : (
                  <button
                    type='button'
                    onClick={cerrar}
                    className='inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90'
                  >
                    {popup.buttonLabel}
                  </button>
                )}
                <button
                  type='button'
                  onClick={cerrar}
                  className='h-12 px-3 text-sm text-muted transition-colors hover:text-heading'
                >
                  Ahora no
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
