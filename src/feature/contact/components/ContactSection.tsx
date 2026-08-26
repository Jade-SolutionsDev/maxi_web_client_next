import { auth } from '@clerk/nextjs/server';
import { Mail, Phone } from 'lucide-react';
import { Container } from '@/app/components/layout/Container';
import { toTelHref } from '@/helpers';
import { getSiteSettings } from '@/shared/cms/service/cms.service';
import { getContactMotives } from '../service/contact.service';
import { ContactForm } from './ContactForm';

const cardClass =
  'flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white px-6 py-10 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none';

export async function ContactSection() {
  const [{ contact }, motives, { userId }] = await Promise.all([
    getSiteSettings(),
    getContactMotives(),
    auth(),
  ]);

  return (
    <Container size='md' className='py-12'>
      <p className='mx-auto max-w-2xl text-center text-lg text-muted'>
        ¿Tienes dudas sobre un pedido o quieres trabajar con nosotros?
        Escribinos y te respondemos lo antes posible.
      </p>

      <div className='mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2'>
        <a href={`mailto:${contact.email}`} className={cardClass}>
          <span className='flex size-14 items-center justify-center rounded-full bg-surface text-accent'>
            <Mail className='size-6' aria-hidden='true' />
          </span>
          <h2 className='font-bold text-heading'>Correo</h2>
          <p className='break-all text-sm text-muted'>{contact.email}</p>
        </a>

        <a href={toTelHref(contact.phone)} className={cardClass}>
          <span className='flex size-14 items-center justify-center rounded-full bg-surface text-accent'>
            <Phone className='size-6' aria-hidden='true' />
          </span>
          <h2 className='font-bold text-heading'>Teléfono</h2>
          <p className='text-sm text-muted'>{contact.phone}</p>
        </a>
      </div>

      <section
        aria-labelledby='contacto-formulario'
        className='mx-auto mt-12 max-w-2xl'
      >
        <h2
          id='contacto-formulario'
          className='mb-6 text-center font-fredoka text-2xl font-bold text-heading sm:text-3xl'
        >
          Envianos un mensaje
        </h2>
        <ContactForm motives={motives} isSignedIn={Boolean(userId)} />
      </section>
    </Container>
  );
}
