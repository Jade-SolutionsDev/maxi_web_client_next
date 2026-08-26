'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormTextarea } from '@/app/components/form/FormTextarea';
import { Button } from '@/app/components/ui/button';
import type { Address } from '@/feature/address/type/address.interface';
import { useCartActions } from '@/feature/cart/hook/useCart';
import type { LocationCatalog } from '@/shared/location/type/location.interface';
import { checkoutAction } from '../action/order.action';
import { notifyCheckoutFailure } from '../feedback/order.notify';
import {
  type CheckoutInput,
  CheckoutInputSchema,
} from '../schema/checkout.schema';
import type {
  FulfillmentOffer,
  FulfillmentType,
} from '../type/fulfillment.type';
import type { PaymentMethod } from '../type/order.type';
import { CheckoutAddressSelector } from './CheckoutAddressSelector';
import { DeliveryOptionSelector } from './DeliveryOptionSelector';
import { FulfillmentMethodTabs } from './FulfillmentMethodTabs';
import { FulfillmentUnavailable } from './FulfillmentUnavailable';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PickupPointSelector } from './PickupPointSelector';

interface CheckoutFormProps {
  paymentMethods: PaymentMethod[];
  offer: FulfillmentOffer;
  addresses: Address[];
  catalog: LocationCatalog;
  zone: { municipalityId: string; municipalityName: string } | null;
  onDeliveryFeeChange?: (fee: number) => void;
}

const zoneProvinceId = (catalog: LocationCatalog, municipalityId: string) =>
  Object.entries(catalog.municipalitiesByProvince).find(([, municipalities]) =>
    municipalities.some((municipality) => municipality.id === municipalityId),
  )?.[0] ?? '';

const availableMethods = (offer: FulfillmentOffer): FulfillmentType[] => {
  const methods: FulfillmentType[] = [];
  if (offer.deliveryOptions.length > 0) methods.push('delivery');
  if (offer.pickupEnabled && offer.pickupPoints.length > 0) {
    methods.push('pickup');
  }
  return methods;
};

export const CheckoutForm = ({
  paymentMethods,
  offer,
  addresses: allAddresses,
  catalog,
  zone,
  onDeliveryFeeChange,
}: CheckoutFormProps) => {
  const router = useRouter();
  const { refreshIfStale } = useCartActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, startNavigation] = useTransition();
  const busy = isSubmitting || isNavigating;

  const methods = availableMethods(offer);
  // The cart was priced and stocked for the zone the customer is browsing, so
  // that is the only place this order can go. Other saved addresses stay in the
  // address book; they are simply not choices here.
  const addresses = zone
    ? allAddresses.filter(
        (address) => address.municipalityId === zone.municipalityId,
      )
    : allAddresses;
  const defaultAddress = addresses.find((address) => address.isDefault);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(CheckoutInputSchema),
    defaultValues: {
      fulfillmentType: methods[0] ?? 'pickup',
      deliveryOptionId: offer.deliveryOptions[0]?.id ?? '',
      pickupAddressId: offer.pickupPoints[0]?.id ?? '',
      addressId: defaultAddress?.id ?? addresses[0]?.id ?? '',
      saveAddress: false,
      notas: '',
      paymentMethod: paymentMethods[0]?.code ?? '',
      provinceId: zone ? zoneProvinceId(catalog, zone.municipalityId) : '',
      municipalityId: zone?.municipalityId ?? '',
    },
  });

  const fulfillmentType = form.watch('fulfillmentType');
  const deliveryOptionId = form.watch('deliveryOptionId') ?? '';
  const pickupAddressId = form.watch('pickupAddressId') ?? '';
  const addressId = form.watch('addressId') ?? '';
  const paymentMethod = form.watch('paymentMethod') ?? '';

  useEffect(() => {
    const options = offer.deliveryOptions;
    if (options.length === 0) {
      form.setValue('deliveryOptionId', '');
      return;
    }
    if (!options.some((option) => option.id === deliveryOptionId)) {
      form.setValue('deliveryOptionId', options[0].id);
    }
  }, [offer.deliveryOptions, deliveryOptionId, form]);

  const selectedFee =
    fulfillmentType === 'pickup'
      ? 0
      : (offer.deliveryOptions.find((option) => option.id === deliveryOptionId)
          ?.fee ?? 0);

  useEffect(() => {
    onDeliveryFeeChange?.(selectedFee);
  }, [selectedFee, onDeliveryFeeChange]);

  if (offer.unavailableMessage || methods.length === 0) {
    return (
      <FulfillmentUnavailable
        message={
          offer.unavailableMessage ??
          'Por el momento no podemos procesar tu pedido. Escríbenos y lo coordinamos.'
        }
      />
    );
  }

  const handleSubmit = async (values: CheckoutInput) => {
    setIsSubmitting(true);
    const result = await checkoutAction(values);

    if (result.order) {
      refreshIfStale(0);
      startNavigation(() => router.push(`/pedidos/${result.order.id}`));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    notifyCheckoutFailure(result.failure);

    if (result.failure.kind === 'stale-cart') router.refresh();
    if (result.failure.kind === 'unauthenticated') router.push('/login');
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FulfillmentMethodTabs
        available={methods}
        value={fulfillmentType}
        onChange={(value) => form.setValue('fulfillmentType', value)}
        disabled={busy}
      />

      {fulfillmentType === 'pickup' ? (
        <PickupPointSelector
          points={offer.pickupPoints}
          value={pickupAddressId}
          onChange={(id) => form.setValue('pickupAddressId', id)}
          disabled={busy}
        />
      ) : (
        <>
          <CheckoutAddressSelector
            addresses={addresses}
            catalog={catalog}
            zone={zone}
            value={addressId}
            onChange={(id) => form.setValue('addressId', id)}
            disabled={busy}
          />
          <DeliveryOptionSelector
            options={offer.deliveryOptions}
            value={deliveryOptionId}
            onChange={(id) => form.setValue('deliveryOptionId', id)}
            disabled={busy}
          />
        </>
      )}

      <FormTextarea
        name='notas'
        label='Notas para el pedido (opcional)'
        placeholder='Horario preferido, instrucciones para el repartidor…'
      />

      <PaymentMethodSelector
        methods={paymentMethods}
        value={paymentMethod}
        onChange={(code) => form.setValue('paymentMethod', code)}
        disabled={busy}
      />

      <Button type='submit' size='lg' loading={busy} className='w-full gap-2'>
        Confirmar pedido
      </Button>

      <p className='text-center text-xs text-muted'>
        Al confirmar reservamos tu stock y te mostramos las instrucciones de
        pago.
      </p>
    </Form>
  );
};
