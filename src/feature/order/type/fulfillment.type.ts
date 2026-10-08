export type FulfillmentType = 'delivery' | 'pickup';

export interface DeliveryOption {
  id: string;
  label: string;
  description: string | null;
  fee: number;
  /**
   * Días hábiles que promete esta opción (MxH-0092). `null` si no se configuró
   * ninguno: entonces no se inventa un plazo ni se deja el hueco.
   */
  promiseDays: number | null;
}

export interface PickupPoint {
  id: string;
  locationId: string;
  locationName: string;
  label: string | null;
  address: string;
  /**
   * Cuándo se puede pasar a recogerlo (MxH-0160). `null` si el mostrador no
   * tiene horario publicado: entonces no se enseña nada.
   */
  hours: string | null;
}

export interface FulfillmentOffer {
  deliveryOptions: DeliveryOption[];
  pickupPoints: PickupPoint[];
  pickupEnabled: boolean;
  unavailableMessage: string | null;
  /**
   * El plazo de la recogida. No va por punto de recogida: sale de los ajustes
   * de entrega y vale para todos los mostradores.
   */
  pickupPromiseDays: number | null;
}

/**
 * Lo que la tienda puede saber **sin sesión** sobre si en una zona se puede
 * recibir algo. A propósito no trae mostradores ni direcciones.
 */
export interface PublicFulfillment {
  fulfillable: boolean;
  unavailableMessage: string | null;
}
