import { Mail, Phone } from 'lucide-react';
import { Container } from '@/app/components/layout/Container';
import { buttonVariants } from '@/app/components/ui/button';
import { toTelHref } from '@/helpers';
import { cn } from '@/lib/utils';
import { CONTACT_ID } from '../constants/about.constants';

export const ContactBand = ({
  email,
  phone,
}: {
  email: string;
  phone: string;
}) => (
  <section aria-labelledby={CONTACT_ID} className='py-14 sm:py-20'>
    <Container
      size='sm'
      className='flex flex-col items-center gap-5 text-center'
    >
      <h2
        id={CONTACT_ID}
        className='font-fredoka text-3xl font-bold text-balance text-heading sm:text-4xl'
      >
        ¿Hablamos?
      </h2>
      <p className='max-w-[52ch] text-pretty text-body'>
        Estamos para responder dudas sobre pedidos, productos y entregas.
      </p>

      <div className='mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row'>
        <a
          href={toTelHref(phone)}
          className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}
        >
          <Phone aria-hidden='true' className='size-4 shrink-0' />
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'gap-2',
          )}
        >
          <Mail aria-hidden='true' className='size-4 shrink-0' />
          {email}
        </a>
      </div>
    </Container>
  </section>
);
