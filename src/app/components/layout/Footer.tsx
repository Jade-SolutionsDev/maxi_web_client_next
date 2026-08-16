import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/components/layout/Container';
import jade from '@/assets/jade.svg';
import logo from '@/assets/logo.svg';
import { toTelHref } from '@/helpers';
import { getSiteSettings } from '@/shared/cms/service/cms.service';
import { columns, paymentLogos } from './constants/footer.constants';

const linkClass =
  'text-sm text-white/80 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange rounded-sm';

export const Footer = async () => {
  const { footer, contact, payments } = await getSiteSettings();

  const enabledMethods = (
    Object.keys(paymentLogos) as (keyof typeof paymentLogos)[]
  ).filter((method) => payments[method]);

  return (
    <footer className='bg-footer text-white'>
      <Container className='py-12'>
        <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Marca + contacto */}
          <div className='flex flex-col gap-5'>
            <Link href='/' aria-label='Maxi Habana - inicio'>
              <Image src={logo} alt='Maxi Habana' className='h-10 w-auto' />
            </Link>

            <p className='max-w-xs text-sm leading-relaxed text-white/80'>
              {footer.blurb}
            </p>

            <address className='flex flex-col gap-3 not-italic'>
              <a
                href={`mailto:${contact.email}`}
                className={`flex items-center gap-3 ${linkClass}`}
              >
                <Mail className='h-5 w-5 shrink-0' aria-hidden='true' />
                {contact.email}
              </a>
              <a
                href={toTelHref(contact.phone)}
                className={`flex items-center gap-3 ${linkClass}`}
              >
                <Phone className='h-5 w-5 shrink-0' aria-hidden='true' />
                {contact.phone}
              </a>
            </address>
          </div>

          {/* Columnas de enlaces */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.label}>
              <h2 className='mb-4 text-lg font-bold text-orange'>
                {column.title}
              </h2>
              <ul className='flex flex-col gap-3'>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Métodos de pago */}
        {enabledMethods.length > 0 && (
          <div className='mt-10 flex flex-wrap items-center gap-4'>
            <span className='text-xs font-semibold tracking-wider text-white/60'>
              MÉTODOS DE PAGO
            </span>
            <ul className='flex flex-wrap items-center gap-3'>
              {enabledMethods.map((method) => {
                const display = paymentLogos[method];
                return (
                  <li
                    key={method}
                    className='flex h-9 items-center justify-center rounded-md bg-white px-3'
                  >
                    {display.src ? (
                      <Image src={display.src} alt={display.alt} height={16} />
                    ) : (
                      <span className='text-xs font-bold text-heading'>
                        {display.alt}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Container>

      {/* Barra inferior */}
      <div className='border-t border-white/10'>
        <Container className='flex flex-col gap-4 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
            <span>{footer.copyright}</span>
            <span className='flex items-center gap-2'>
              Desarrollado por
              <Image src={jade} alt='Jade' height={20} />
            </span>
          </div>

          <div className='flex flex-wrap gap-x-6 gap-y-2'>
            {footer.legalLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/paginas/${link.slug}`}
                className={linkClass}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
};
