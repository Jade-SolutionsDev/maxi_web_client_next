'use client';

import { Crosshair, MapPin, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/app/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';
import type { AddressFormValues } from '../schema/address.schema';
import type { AddressLocation } from '../type/address.interface';

/**
 * El punto en el mapa dentro del formulario de dirección (MxH-0072).
 *
 * **El mapa no se embebe aquí, se abre en un panel.** El formulario vive en un
 * diálogo con `max-h-[90dvh] overflow-y-auto`, y un marcador arrastrable dentro
 * de un contenedor que se desplaza pelea con el gesto: el dedo que quiere mover
 * el mapa mueve el diálogo. Como esto se usa sobre todo con el pulgar, el mapa
 * se lleva a un `Sheet` propio, por encima de todo, donde el gesto es suyo.
 *
 * De paso resuelve otros dos criterios con el mismo mecanismo: el mapa está
 * **plegado por omisión** y **no pesa** hasta que alguien lo abre, porque
 * mientras no se monte, Leaflet no se descarga.
 */

const AddressMap = dynamic(() => import('./AddressMap'), {
  ssr: false,
  loading: () => (
    <div className='flex h-full w-full items-center justify-center bg-muted'>
      <p className='text-muted-foreground text-sm'>Cargando el mapa…</p>
    </div>
  ),
});

/** Seis decimales son unos 11 cm; enseñar más es fingir precisión. */
const formatear = ({ latitude, longitude }: AddressLocation) =>
  `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

const PROCEDENCIA: Record<AddressLocation['source'], string> = {
  device: 'Tomada de tu dispositivo',
  manual: 'Marcada a mano en el mapa',
};

export const AddressLocationField = () => {
  const form = useFormContext<AddressFormValues>();
  const guardada = form.watch('location') ?? null;

  const [abierto, setAbierto] = useState(false);
  /**
   * El punto que se está eligiendo, aparte del guardado: la tarjeta pide
   * **confirmación explícita**, así que cerrar sin confirmar no cambia nada.
   */
  const [borrador, setBorrador] = useState<AddressLocation | null>(null);
  const [avisoUbicacion, setAvisoUbicacion] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);

  const abrir = () => {
    setBorrador(guardada);
    setAvisoUbicacion(null);
    setAbierto(true);
  };

  const confirmar = () => {
    // `shouldDirty` para que el formulario sepa que hay cambios sin tocar
    // ningún campo de texto.
    form.setValue('location', borrador, { shouldDirty: true });
    setAbierto(false);
  };

  const quitar = () => {
    // `null`, no `undefined`: es la diferencia entre «quita el punto» y «no lo
    // toques», y el payload la respeta hasta la API.
    form.setValue('location', null, { shouldDirty: true });
  };

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
      setAvisoUbicacion(
        'Tu navegador no puede darnos tu ubicación. Marca el punto en el mapa.',
      );
      return;
    }

    setBuscando(true);
    setAvisoUbicacion(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setBorrador({
          latitude: coords.latitude,
          longitude: coords.longitude,
          source: 'device',
        });
        setBuscando(false);
      },
      () => {
        setBuscando(false);
        // Denegar el permiso **no es un error**: la ubicación es opcional y el
        // mapa sigue ahí para marcarla a mano. De ahí que esto no sea un
        // `role='alert'` rojo sino una indicación de qué hacer ahora.
        setAvisoUbicacion(
          'No pudimos obtener tu ubicación. Puedes marcar el punto en el mapa.',
        );
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-baseline justify-between gap-2'>
        <span className='font-medium text-sm'>Ubicación en el mapa</span>
        <span className='text-muted-foreground text-xs'>Opcional</span>
      </div>

      <div className='rounded-lg border border-border bg-muted/40 p-3'>
        {guardada ? (
          <div className='space-y-2'>
            <p className='flex items-center gap-2 font-medium text-sm'>
              <MapPin
                className='size-4 shrink-0 text-primary'
                aria-hidden='true'
              />
              <span className='tabular-nums'>{formatear(guardada)}</span>
            </p>

            <p className='text-muted-foreground text-xs'>
              {PROCEDENCIA[guardada.source]}
            </p>

            <div className='flex flex-wrap gap-2'>
              <Button type='button' size='sm' variant='outline' onClick={abrir}>
                Cambiar
              </Button>

              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={quitar}
                className='text-destructive'
              >
                <Trash2 className='size-4' aria-hidden='true' />
                Quitar
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-2'>
            <p className='text-muted-foreground text-sm'>
              Sin ubicación. La dirección escrita basta para entregar; un punto
              en el mapa solo le ahorra vueltas a quien te lleva el pedido.
            </p>

            <Button type='button' size='sm' variant='outline' onClick={abrir}>
              <MapPin className='size-4' aria-hidden='true' />
              Marcar en el mapa
            </Button>
          </div>
        )}
      </div>

      <Sheet open={abierto} onOpenChange={setAbierto}>
        <SheetContent
          side='bottom'
          /**
           * `data-[side=bottom]:h-[92dvh]` y no `h-[92dvh]`: el propio
           * `SheetContent` trae `data-[side=bottom]:h-auto`, que es un selector
           * de atributo y **gana a una clase plana** por especificidad, sin que
           * el orden importe. Medido el 18-oct-2026: con `h-[92dvh]` el panel
           * salía de 231 px y el mapa se quedaba en **altura 0**, así que
           * pintaba tres teselas y tocarlo no ponía el marcador.
           */
          className='flex flex-col gap-0 p-0 data-[side=bottom]:h-[92dvh]'
        >
          <SheetHeader className='px-4 pt-4 pb-2'>
            <SheetTitle>Marca dónde entregamos</SheetTitle>
            <SheetDescription>
              Toca el mapa o arrastra el marcador. También puedes usar tu
              ubicación actual.
            </SheetDescription>
          </SheetHeader>

          <div className='min-h-0 flex-1'>
            <AddressMap
              value={borrador}
              onPick={(coords) => setBorrador({ ...coords, source: 'manual' })}
            />
          </div>

          <SheetFooter className='flex-col items-stretch gap-2 border-border border-t px-4 py-3'>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={usarMiUbicacion}
              disabled={buscando}
            >
              <Crosshair className='size-4' aria-hidden='true' />
              {buscando ? 'Buscándote…' : 'Usar mi ubicación'}
            </Button>

            {avisoUbicacion && (
              <p className='text-muted-foreground text-xs'>{avisoUbicacion}</p>
            )}

            <p className='text-muted-foreground text-xs tabular-nums'>
              {borrador ? formatear(borrador) : 'Todavía no has marcado nada'}
            </p>

            <div className='flex flex-row justify-end gap-2'>
              <SheetClose
                render={
                  <Button type='button' size='sm' variant='outline'>
                    Cancelar
                  </Button>
                }
              />

              <Button
                type='button'
                size='sm'
                onClick={confirmar}
                disabled={!borrador}
              >
                Confirmar este punto
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
