import { FormInput } from '@/app/components/form/FormInput';

/**
 * Quién recibe el pedido: el beneficiario.
 *
 * **No es quien compra.** Aquí la mayoría de las compras las paga alguien de
 * fuera y las recoge un familiar en Cuba, así que son dos personas distintas.
 * El rótulo decía «Datos del cliente» y eso empujaba al comprador a poner sus
 * propios datos; el carnet que acaba en el pedido es el que se pide en el
 * almacén al entregar, de modo que un rótulo equivocado termina en alguien
 * que no puede identificarse con lo que figura en su pedido.
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
      Datos del beneficiario
    </legend>

    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <FormInput
        name='recipientName'
        label='Nombre y apellido'
        placeholder='Ana Rodríguez'
        autoComplete='name'
        required
      />
      <FormInput
        name='idCard'
        label='Carnet de identidad'
        placeholder='90051512345'
        inputMode='numeric'
        maxLength={11}
        required
      />
      <FormInput
        name='contactPhone'
        label='Teléfono de contacto'
        placeholder='+53 5251 9414'
        autoComplete='tel'
        inputMode='tel'
        required
      />
    </div>
  </fieldset>
);
