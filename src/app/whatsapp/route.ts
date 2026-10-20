import { redirect } from 'next/navigation';
import { toWhatsAppHref } from '@/helpers';
import { getSiteSettings } from '@/shared/cms/service/cms.service';

/**
 * El atajo propio hacia el WhatsApp de atención.
 *
 * Existe por dos motivos, y el segundo pesa más que el primero. Resend avisa
 * de que un correo que sale de maxihabana.com y enlaza a `wa.me` no cuadra, y
 * algunos filtros de spam puntúan esa discrepancia (MxH-0136). Pero sobre todo
 * el número deja de estar repetido: los correos enlazan aquí, aquí se lee de
 * los ajustes del sitio, y el día que cambie se cambia en un solo lugar en vez
 * de perseguirlo por las plantillas.
 *
 * La redirección es temporal a propósito. Una permanente se le queda grabada
 * al navegador y, cuando el número cambie, quien ya pasó por aquí seguiría
 * yendo al viejo sin forma de enterarse.
 */
export async function GET() {
  const { contact } = await getSiteSettings();
  redirect(toWhatsAppHref(contact.phone));
}
