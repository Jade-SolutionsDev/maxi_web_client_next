import { Clock, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/components/layout/Container';
import jade from '@/assets/jade.svg';
import logo from '@/assets/logo.svg';
import { toWhatsAppHref } from '@/helpers';
import { getSiteSettings } from '@/shared/cms/service/cms.service';
import { FooterLinkColumn } from './FooterLinkColumn';
import { getFooterDepartmentLinks } from './constants/footer-departments';
import {
  paymentLogos,
  paymentsPageLink,
  siteLinks,
} from './constants/footer.constants';

const contactClass =
  'flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange rounded-sm';

export const Footer = async () => {
  const [{ footer, contact, payments }, departmentLinks] = await Promise.all([
    getSiteSettings(),
    getFooterDepartmentLinks(),
  ]);

  const enabledMethods = (
    Object.keys(paymentLogos) as (keyof typeof paymentLogos)[]
  ).filter((method) => payments[method]);

  const cmsLegalLinks = footer.legalLinks.map(({ label, slug }) => ({
    label,
    href: `/paginas/${slug}`,
  }));

  const legalLinks = cmsLegalLinks.some(
    (link) => link.href === paymentsPageLink.href,
  )
    ? cmsLegalLinks
    : [...cmsLegalLinks, paymentsPageLink];

  return (
    <footer className='bg-footer text-white'>
      <Container className='py-12'>
        <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]'>
          {/* Marca + contacto */}
          <div className='flex flex-col gap-6'>
            <Link href='/' aria-label='Maxi Habana - inicio'>
              <Image src={logo} alt='Maxi Habana' className='h-10 w-auto' />
            </Link>

            <p className='text-sm text-white/80'>Datos de atención al cliente</p>

            <address className='flex flex-col gap-4 not-italic'>
              <a
                href={toWhatsAppHref(contact.phone)}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`Escríbenos por WhatsApp al ${contact.phone}`}
                className={contactClass}
              >
                <Phone className='h-5 w-5 shrink-0' aria-hidden='true' />
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className={contactClass}>
                <Mail className='h-5 w-5 shrink-0' aria-hidden='true' />
                {contact.email}
              </a>
              <p className='flex items-center gap-3 text-sm text-white/80'>
                <Clock className='h-5 w-5 shrink-0' aria-hidden='true' />
                {contact.hours}
              </p>
            </address>
          </div>

          <FooterLinkColumn title='Enlaces' label='Enlaces' links={siteLinks} />
          <FooterLinkColumn
            title='Departamentos'
            label='Departamentos'
            links={departmentLinks}
          />
          <FooterLinkColumn title='Legal' label='Legal' links={legalLinks} />
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
        <Container className='flex flex-wrap items-center gap-x-2 gap-y-1 py-6 text-sm text-white/70'>
          <span>{footer.copyright}</span>
          <span className='flex items-center gap-2'>
            Desarrollado por
            <Image src={jade} alt='Jade' height={20} />
          </span>
        </Container>
      </div>
    </footer>
  );
};
