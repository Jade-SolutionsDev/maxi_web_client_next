'use client';

import { MapPin } from 'lucide-react';
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
  clearCartForNewProvince,
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

export const LocationPicker = ({
  provinces,
  municipalitiesByProvince,
  selected,
  onSubmit,
  className,
}: LocationPickerProps) => {
  const [isOpen, setIsOpen] = useState(selected === null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const answerConfirm = useRef<((accepted: boolean) => void) | null>(null);

  const leavesProvinceWithCart = (provinceId: string) =>
    selected !== null && provinceId !== selected.provinceId && cartHasLines();

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

  const handleSubmit = async ({
    provinceId,
    municipalityId,
  }: LocationFormSchemaType) => {
    if (leavesProvinceWithCart(provinceId) && !(await askToDiscardCart())) {
      return {};
    }

    const result = await onSubmit({ municipalityId });

    if (result.error) return result;

    if (result.provinceChanged) clearCartForNewProvince();

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
          <DialogDescription className='text-muted'>
            Elige tu provincia y municipio para ver los productos disponibles en
            tu zona.
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
