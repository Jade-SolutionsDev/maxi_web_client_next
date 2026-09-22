/**
 * El plazo de entrega se cuenta en días HÁBILES —de lunes a sábado, sin
 * feriados cubanos— y así lo calcula la API (`common/business-days.ts`). La
 * tienda decía «3 días» a secas, que un cliente lee como tres días de calendario
 * y le sale una fecha anterior a la que se le va a cumplir.
 *
 * Una sola función para las dos pantallas que lo muestran: el pedido y el
 * seguimiento público.
 */
export const plazoEnDiasHabiles = (dias: number): string =>
  dias === 1 ? '1 día hábil' : `${dias} días hábiles`;
