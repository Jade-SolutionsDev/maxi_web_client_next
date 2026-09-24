import { Facebook, Instagram } from 'lucide-react';
import type { ComponentType } from 'react';
import { redesSociales } from './constants/redes-sociales';

const iconos: Record<string, ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
};

/**
 * Los enlaces a las redes, con el nombre en `aria-label` porque el icono solo
 * no dice nada a quien navega con lector de pantalla.
 */
export const RedesSociales = ({ className }: { className?: string }) => (
  <ul className={className}>
    {redesSociales.map((red) => {
      const Icono = iconos[red.nombre];
      return (
        <li key={red.nombre}>
          <a
            href={red.href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`Maxi Habana en ${red.nombre}`}
            className='flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
          >
            {Icono ? <Icono className='size-5' /> : red.nombre}
          </a>
        </li>
      );
    })}
  </ul>
);
