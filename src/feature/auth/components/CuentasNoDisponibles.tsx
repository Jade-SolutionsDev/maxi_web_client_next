import { toWhatsAppHref } from '@/helpers';
import { DEFAULT_SITE_SETTINGS } from '@/shared/cms/constants/site-settings.constants';

const { phone: TELEFONO_DE_RESPALDO } = DEFAULT_SITE_SETTINGS.contact;

interface CuentasNoDisponiblesProps {
  children: string;
}

export const CuentasNoDisponibles = ({
  children,
}: CuentasNoDisponiblesProps) => (
  <output className='block rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive'>
    {children}{' '}
    <a
      href={toWhatsAppHref(TELEFONO_DE_RESPALDO)}
      target='_blank'
      rel='noopener noreferrer'
      className='font-semibold underline underline-offset-2'
    >
      Escríbenos al {TELEFONO_DE_RESPALDO}
    </a>{' '}
    y lo resolvemos contigo.
  </output>
);
