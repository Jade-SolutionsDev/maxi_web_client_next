'use client';

import { useState } from 'react';
import { LocationBadge } from './LocationBadge';
import { LocationForm } from './LocationForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import type {
  LocationOption,
  SelectedLocation,
} from '@/shared/location/type/location.interface';

interface LocationPickerProps {
  provinces: LocationOption[];
  municipalitiesByProvince: Record<string, LocationOption[]>;
  selected: SelectedLocation | null;
  onSubmit: (input: { municipalityId: string }) => Promise<{ error?: string }>;
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

  const handleSubmit = async (input: { municipalityId: string }) => {
    const result = await onSubmit(input);

    if (!result.error) setIsOpen(false);

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
            className='rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
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
            Elegí tu provincia y municipio para ver los productos disponibles en
            tu zona.
          </DialogDescription>
        </DialogHeader>

        <LocationForm
          provinces={provinces}
          municipalitiesByProvince={municipalitiesByProvince}
          selected={selected}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
