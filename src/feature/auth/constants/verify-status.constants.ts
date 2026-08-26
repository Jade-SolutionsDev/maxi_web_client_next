import {
  CircleCheckBig,
  Clock,
  MonitorSmartphone,
  TriangleAlert,
} from 'lucide-react';
import type { VerifyStatus } from '@/feature/auth/lib/emailLinkStatus';
import type {
  VerifyStatusView,
  VerifyTone,
} from '@/feature/auth/type/verify-status.interface';

const SUPPORT_HINT = '¿Sigue fallando? Escríbenos al +53 5 432 6665.';

export const VERIFY_STATUS_VIEWS: Record<VerifyStatus, VerifyStatusView> = {
  loading: {
    tone: 'progress',
    icon: null,
    title: 'Verificando tu correo',
    description:
      'Estamos confirmando tu cuenta. Tarda unos segundos, no cierres esta ventana.',
  },
  verified: {
    tone: 'success',
    icon: CircleCheckBig,
    title: '¡Listo! Tu correo está verificado',
    description:
      'Vuelve a la pestaña donde empezaste el registro para terminar de crear tu cuenta.',
    action: { href: '/', label: 'Ir a la tienda' },
  },
  client_mismatch: {
    tone: 'warning',
    icon: MonitorSmartphone,
    title: 'Abre el enlace en el mismo navegador',
    description:
      'Este enlace se abrió en un navegador o dispositivo distinto al que usaste para registrarte. Por seguridad tienes que abrirlo donde empezaste.',
    action: { href: '/register', label: 'Volver al registro' },
    hint: 'Copia el enlace del correo y pégalo en el navegador donde iniciaste el registro.',
  },
  expired: {
    tone: 'danger',
    icon: Clock,
    title: 'El enlace ya venció',
    description:
      'Por seguridad los enlaces caducan y solo se pueden usar una vez. Pide uno nuevo y vuelve a intentarlo.',
    action: { href: '/register', label: 'Pedir un enlace nuevo' },
  },
  failed: {
    tone: 'danger',
    icon: TriangleAlert,
    title: 'No pudimos verificar tu correo',
    description:
      'Algo salió mal al validar el enlace. Regístrate de nuevo para recibir uno nuevo.',
    action: { href: '/register', label: 'Volver al registro' },
    hint: SUPPORT_HINT,
  },
  timeout: {
    tone: 'danger',
    icon: TriangleAlert,
    title: 'La verificación está tardando demasiado',
    description:
      'No recibimos una respuesta. Revisa tu conexión y vuelve a abrir el enlace del correo.',
    action: { href: '/register', label: 'Volver al registro' },
    hint: SUPPORT_HINT,
  },
};

/** Static class maps: Tailwind cannot resolve interpolated class names. */
export const VERIFY_MEDALLION_TONE: Record<VerifyTone, string> = {
  progress: 'bg-primary/10',
  success: 'bg-primary/15 text-total',
  /** Dark glyph on the amber tint: orange alone does not clear 3:1 on white. */
  warning: 'bg-orange/20 text-heading',
  danger: 'bg-destructive/10 text-destructive',
};

export const VERIFY_HALO_TONE: Record<VerifyTone, string> = {
  progress: 'bg-primary/30',
  success: 'bg-primary/30',
  warning: 'bg-orange/30',
  danger: 'bg-destructive/25',
};
