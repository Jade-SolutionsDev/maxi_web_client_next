import type { Order } from '../type/order.type';

const line = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/**
 * Quién recibe el pedido, para que el cliente pueda comprobar lo que escribió.
 * Hasta ahora se le pedían estos datos y no volvía a verlos: un carnet mal
 * tecleado se descubría en el mostrador, cuando ya no tiene arreglo fácil.
 */
const Beneficiario = ({ order }: { order: Order }) => {
  const contacto = order.contactSnapshot;
  const nombre = line(contacto?.recipientName);
  const carnet = line(contacto?.idCard);
  const telefono = line(contacto?.contactPhone);

  if (!nombre && !carnet && !telefono) return null;

  const etiqueta = order.fulfillmentType === 'pickup' ? 'Recoge' : 'Recibe';

  return (
    <div className='flex flex-col gap-1 border-b border-input pb-2 text-sm text-muted'>
      <span className='font-semibold text-heading'>
        {etiqueta}: {nombre ?? '—'}
      </span>
      {carnet && <span>Carnet: {carnet}</span>}
      {telefono && <span>Teléfono: {telefono}</span>}
    </div>
  );
};

const Destino = ({ order }: { order: Order }) => {
  if (order.fulfillmentType === 'pickup') {
    const pickup = order.pickupAddress;

    return pickup ? (
      <dl className='flex flex-col gap-1 text-sm text-muted'>
        <div className='flex gap-1.5'>
          <dt className='font-semibold'>Recoges en:</dt>
          <dd>{pickup.locationName}</dd>
        </div>
        {pickup.label && (
          <div className='flex gap-1.5'>
            <dt className='font-semibold'>Punto:</dt>
            <dd>{pickup.label}</dd>
          </div>
        )}
        <dd>{pickup.address}</dd>
      </dl>
    ) : (
      <p className='text-sm text-muted'>Sin punto de recogida registrado.</p>
    );
  }

  const address = order.deliveryAddress;

  if (!address) {
    return <p className='text-sm text-muted'>Sin dirección registrada.</p>;
  }

  const place = [line(address.municipalityName), line(address.provinceName)]
    .filter(Boolean)
    .join(', ');

  return (
    <dl className='flex flex-col gap-1 text-sm text-muted'>
      {line(address.label) && (
        <dt className='font-semibold text-heading'>{line(address.label)}</dt>
      )}
      <dd>{line(address.street)}</dd>
      {line(address.betweenStreets) && (
        <dd>Entre {line(address.betweenStreets)}</dd>
      )}
      {place && <dd>{place}</dd>}
      {line(address.reference) && <dd>{line(address.reference)}</dd>}
      {line(address.contactPhone) && (
        <dd>Teléfono: {line(address.contactPhone)}</dd>
      )}
      {order.deliveryOptionLabel && (
        <dd className='pt-1'>Forma de entrega: {order.deliveryOptionLabel}</dd>
      )}
    </dl>
  );
};

export const OrderDeliveryDetails = ({ order }: { order: Order }) => (
  <div className='flex flex-col gap-2'>
    <Beneficiario order={order} />
    <Destino order={order} />
  </div>
);
