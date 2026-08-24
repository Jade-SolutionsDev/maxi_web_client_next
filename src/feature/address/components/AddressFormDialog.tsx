'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormInput } from '@/app/components/form/FormInput';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import type { LocationCatalog } from '@/shared/location/type/location.interface';
import { saveAddress, updateAddress } from '../action/address.action';
import {
  AddressFormSchema,
  type AddressFormValues,
} from '../schema/address.schema';
import type { Address, AddressFailure } from '../type/address.interface';
import { AddressMunicipalityFields } from './AddressMunicipalityFields';

const EMPTY: AddressFormValues = {
  label: '',
  street: '',
  betweenStreets: '',
  reference: '',
  provinceId: '',
  municipalityId: '',
  contactPhone: '',
};

const FAILURE_MESSAGE: Record<AddressFailure['kind'], string> = {
  'limit-reached': 'Has llegado al máximo de 20 direcciones guardadas.',
  unauthenticated:
    'Tu sesión ha caducado. Vuelve a entrar e inténtalo de nuevo.',
  'not-found':
    'Esta dirección ya no existe. Puede que la hayas borrado en otra pestaña.',
  invalid: 'Revisa los datos: hay algún campo que no es válido.',
  unknown: 'No se pudo guardar la dirección. Inténtalo de nuevo.',
};

// The province is not stored, but the API returns it resolved, so editing can
// preselect it without looking anything up.
const toFormValues = (address: Address): AddressFormValues => ({
  label: address.label ?? '',
  street: address.street,
  betweenStreets: address.betweenStreets ?? '',
  reference: address.reference ?? '',
  provinceId: address.provinceId,
  municipalityId: address.municipalityId,
  contactPhone: address.contactPhone ?? '',
});

interface AddressFormDialogProps {
  /** Absent when adding; present when editing that address. */
  address?: Address;
  catalog: LocationCatalog;
}

export const AddressFormDialog = ({
  address,
  catalog,
}: AddressFormDialogProps) => {
  'use no memo';

  const isEditing = Boolean(address);
  const [isOpen, setIsOpen] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: address ? toFormValues(address) : EMPTY,
  });

  const open = (next: boolean) => {
    setIsOpen(next);
    if (next) {
      setFailure(null);
      form.reset(address ? toFormValues(address) : EMPTY);
    }
  };

  const onSubmit = (values: AddressFormValues) => {
    setFailure(null);

    startTransition(async () => {
      const result = address
        ? await updateAddress({ id: address.id, ...values })
        : await saveAddress(values);

      if ('failure' in result) {
        setFailure(FAILURE_MESSAGE[result.failure.kind]);
        return;
      }

      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={open}>
      {/* Base UI composes through `render`, not `asChild` — same idiom as
          LocationPicker. */}
      <DialogTrigger
        render={
          isEditing ? (
            <Button type='button' size='sm' variant='ghost'>
              <Pencil aria-hidden='true' className='size-4' />
              Editar
            </Button>
          ) : (
            <Button type='button' size='sm'>
              <Plus aria-hidden='true' className='size-4' />
              Añadir dirección
            </Button>
          )
        }
      />

      <DialogContent className='max-h-[90dvh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar dirección' : 'Nueva dirección'}
          </DialogTitle>
          <DialogDescription>
            El municipio decide la zona de entrega de tu pedido.
          </DialogDescription>
        </DialogHeader>

        <Form form={form} onSubmit={onSubmit}>
          <FormInput
            name='label'
            label='Nombre'
            placeholder='Casa, Trabajo…'
            autoComplete='off'
          />

          <FormInput
            name='street'
            label='Calle y número'
            required
            placeholder='Calle 23 #456'
            autoComplete='street-address'
          />

          <FormInput
            name='betweenStreets'
            label='Entre calles'
            placeholder='entre 8 y 10'
            autoComplete='off'
          />

          <AddressMunicipalityFields catalog={catalog} />

          <FormInput
            name='reference'
            label='Referencia'
            placeholder='Edificio azul, al lado de la panadería'
            autoComplete='off'
          />

          <FormInput
            name='contactPhone'
            label='Teléfono de contacto'
            placeholder='Si lo dejas vacío usaremos el de tu cuenta'
            inputMode='tel'
            autoComplete='tel'
          />

          {failure && (
            <p role='alert' className='text-destructive text-sm'>
              {failure}
            </p>
          )}

          <DialogFooter className='flex-row justify-end gap-2'>
            <Button
              type='button'
              size='sm'
              variant='outline'
              disabled={isPending}
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>

            <Button type='submit' size='sm' loading={isPending}>
              {isEditing ? 'Guardar cambios' : 'Guardar dirección'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
