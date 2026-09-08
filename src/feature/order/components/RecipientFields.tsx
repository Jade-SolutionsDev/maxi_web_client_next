import { FormInput } from '@/app/components/form/FormInput';

/**
 * Quién recibe el pedido.
 *
 * Un solo componente para entrega y recogida a propósito: son los mismos tres
 * datos con las mismas reglas, y tenerlos duplicados es cómo empiezan a
 * divergir —uno pide el carnet y el otro no— sin que nadie lo note.
 *
 * Dos columnas en escritorio y una en móvil (MxH-0104): apilados, estos campos
 * más los de la dirección alargaban el checkout hasta dejar el botón de
 * confirmar muy por debajo del pliegue.
 */
export const RecipientFields = ({ disabled }: { disabled?: boolean }) => (
  <fieldset className='flex flex-col gap-2' disabled={disabled}>
    <legend className='mb-2 text-sm font-medium text-heading'>
      Datos del cliente
    </legend>

    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <FormInput
        name='recipientName'
        label='Nombre y apellido'
        placeholder='Daniel Smith'
        autoComplete='name'
        required
      />
      <FormInput
        name='idCard'
        label='Carnet de identidad'
        placeholder='91031512345'
        inputMode='numeric'
        maxLength={11}
        required
      />
      <FormInput
        name='contactPhone'
        label='Teléfono de contacto'
        placeholder='+53 5 555 5555'
        autoComplete='tel'
        inputMode='tel'
        required
      />
    </div>
  </fieldset>
);
