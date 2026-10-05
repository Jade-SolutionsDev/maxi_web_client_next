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

/**
 * La fecha comprometida en cristiano: `martes 22 de septiembre`.
 *
 * Con **día de la semana** porque «el 22» obliga a mirar un calendario, y es
 * justo el dato que alguien necesita para decirle a su familia cuándo pasar.
 * Sin año: un plazo de entrega no cae en otro.
 *
 * Y **en hora de Cuba**, no en la del navegador. El compromiso es del mostrador
 * de La Habana: quien lo mira desde Madrid vería un día más en cuanto la fecha
 * caiga de noche, y el servidor, que corre en UTC, otro distinto. El mismo
 * pedido con tres fechas según quién lo abra.
 */
export const fechaComprometida = (iso: string): string =>
  new Date(iso)
    .toLocaleDateString('es-CU', {
      timeZone: 'America/Havana',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    .replace(', ', ' ');
