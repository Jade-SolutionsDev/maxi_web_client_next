/**
 * Las redes de la tienda.
 *
 * Los dos enlaces están limpios a propósito: el que da Facebook al compartir
 * es un `/share/…` que redirige al perfil, y el de Instagram venía con un
 * `?stkn=…` que es un token de la sesión de quien copió el enlace — publicarlo
 * habría expuesto algo de su cuenta en cada página de la tienda.
 *
 * Viven en código hasta que el panel permita editarlas (MxH-0119). Cuando eso
 * llegue, este fichero es el que se sustituye por el CMS.
 */
export interface RedSocial {
  nombre: string;
  href: string;
}

export const redesSociales: RedSocial[] = [
  {
    nombre: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61550740714835',
  },
  { nombre: 'Instagram', href: 'https://www.instagram.com/maxihabana' },
];
