export type FulfillmentType = 'delivery' | 'pickup';

export interface DeliveryOption {
  id: string;
  label: string;
  description: string | null;
  fee: number;
}

export interface PickupPoint {
  id: string;
  locationId: string;
  locationName: string;
  label: string | null;
  address: string;
}

export interface FulfillmentOffer {
  deliveryOptions: DeliveryOption[];
  pickupPoints: PickupPoint[];
  pickupEnabled: boolean;
  unavailableMessage: string | null;
}
