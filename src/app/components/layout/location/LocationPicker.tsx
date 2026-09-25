'use client';

import { MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { ConfirmDialog } from '@/app/components/form/ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  cartHasLines,
  clearCartForNewMunicipality,
} from '@/feature/cart/lib/cart-zone-reset';
import type { LocationFormSchemaType } from '@/shared/location/schema/location.schema';
import type {
  LocationOption,
  SaveLocationResult,
  SelectedLocation,
} from '@/shared/location/type/location.interface';
import { LocationBadge } from './LocationBadge';
import { LocationForm } from './LocationForm';

const DISCARD_CART_TITLE = '¿Deseas cambiar tu ubicación?';

const DISCARD_CART_DESCRIPTION =
  'Al cambiar la dirección o zona de compra, la disponibilidad de los productos puede variar. Para evitar inconsistencias, los productos de tu carrito actual serán eliminados.';

interface LocationPickerProps {
  provinces: LocationOption[];
  municipalitiesByProvince: Record<string, LocationOption[]>;
  selected: SelectedLocation | null;
  onSubmit: (input: { municipalityId: string }) => Promise<SaveLocationResult>;
  className?: string;
}

/** Ver el comentario de `preguntarLaZona`, dentro del componente. */
const RUTAS_SIN_PREGUNTAR = [
  '/seguimiento',
  '/invitacion',
  '/login',
  '/register',
  '/reset-password',
];

export const LocationPicker = ({
  provinces,
  municipalitiesByProvince,
  selected,
  onSubmit,
  className,
}: LocationPickerProps) => {
  /**
   * Rutas donde no se pregunta la zona nada más entrar. El seguimiento de un
   * pedido se abre desde un enlace reenviado —WhatsApp, un correo— y quien lo
   * abre no viene a comprar: encontrarse un formulario de provincia y
   * municipio tapando la pantalla es pedirle datos para algo que no pidió.
   * El selector sigue estando en la cabecera por si quiere usarlo.
   *
   * Lo mismo vale para las páginas de cuenta: quien va a entrar, a registrarse
   * o a recuperar su clave tiene un formulario delante, y el diálogo se abría
   * justo encima, tapando el botón. Se vio en las pruebas de navegador —tres
   * escenarios muertos por «timeout» al pulsar— pero le pasa igual a cualquiera
   * que abra el enlace de recuperar contraseña sin haber elegido zona.
   */
  const ruta = usePathname();
  const preguntarLaZona = !RUTAS_SIN_PREGUNTAR.some((r) => ruta?.startsWith(r));

  const [isOpen, setIsOpen] = useState(selected === null && preguntarLaZona);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const answerConfirm = useRef<((accepted: boolean) => void) | null>(null);

  const changesMunicipalityWithCart = (municipalityId: string) =>
    selected !== null &&
    municipalityId !== selected.municipalityId &&
    cartHasLines();

  const askToDiscardCart = () =>
    new Promise<boolean>((accept) => {
      answerConfirm.current = accept;
      setIsConfirmOpen(true);
    });

  const answerConfirmWith = (accepted: boolean) => {
    setIsConfirmOpen(false);
    answerConfirm.current?.(accepted);
    answerConfirm.current = null;
  };

  const handleSubmit = async ({ municipalityId }: LocationFormSchemaType) => {
    const municipalityChanged =
      selected !== null && municipalityId !== selected.municipalityId;

    if (
      changesMunicipalityWithCart(municipalityId) &&
      !(await askToDiscardCart())
    ) {
      return {};
    }

    const result = await onSubmit({ municipalityId });

    if (result.error) return result;

    if (municipalityChanged) clearCartForNewMunicipality();

    setIsOpen(false);

    return result;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal='trap-focus'>
      <DialogTrigger
        render={
          <button
            type='button'
            aria-label={
              selected
                ? `Ubicación actual: ${selected.municipalityName}. Cambiar ubicación`
                : 'Elegir tu ubicación'
            }
            className='min-w-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
          >
            <LocationBadge
              location={selected?.municipalityName ?? 'Elegir'}
              className={className}
            />
          </button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold text-heading'>
            ¿Dónde estás?
          </DialogTitle>
          {/*
            Este texto nació de una queja real: una clienta eligió Arroyo
            Naranjo y escribió preguntando si repartíamos allí. «Tu zona»,
            junto a un selector con las quince provincias, se lee como una
            dirección de reparto aunque solo sirva para filtrar el catálogo.

            OJO al activar la entrega a domicilio: la última frase deja de ser
            cierta y hay que quitarla o condicionarla.
          */}
          <DialogDescription className='text-muted'>
            Lo usamos para mostrarte lo que hay disponible cerca de ti. No es
            una dirección de entrega: hoy los pedidos se recogen en nuestros
            locales.
          </DialogDescription>
        </DialogHeader>

        <LocationForm
          provinces={provinces}
          municipalitiesByProvince={municipalitiesByProvince}
          selected={selected}
          onSubmit={handleSubmit}
        />

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => answerConfirmWith(false)}
          onConfirm={() => answerConfirmWith(true)}
          variant='warning'
          align='center'
          icon={MapPin}
          title={DISCARD_CART_TITLE}
          description={DISCARD_CART_DESCRIPTION}
          submitText='Cambiar ubicación'
          cancelText='Cancelar'
        />
      </DialogContent>
    </Dialog>
  );
};
