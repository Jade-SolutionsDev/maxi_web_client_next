/** Lo que devuelve `GET /storefront/tracking/:id`. Nada de esto es personal. */
export interface OrderTracking {
  orderNumber: string | null;
  /** Ya viene en el vocabulario del cliente: «En camino», no «shipped». */
  status: string;
  paid: boolean;
  placedAt: string;
  promiseDays: number | null;
  promisedAt: string | null;
  deliveredAt: string | null;
  fulfillmentType: 'delivery' | 'pickup';
  history: { status: string; at: string }[];
}
