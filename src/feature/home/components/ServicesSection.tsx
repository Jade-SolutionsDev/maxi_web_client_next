import { Container } from '@/app/components/layout/Container';
import { ServiceCard } from '@/feature/home/components/ServiceCard';
import { services } from '@/feature/home/constants/services';

const titleId = 'nuestros-servicios';

function ServicesSection() {
  return (
    <section aria-labelledby={titleId} className='mt-11'>
      <Container className='bg-linear-135 from-sand to-sand-strong pb-12 pt-10 lg:pb-[60px] lg:pt-[54px]'>
        <header className='mx-auto mb-10 max-w-3xl text-center lg:mb-14'>
          <h2
            id={titleId}
            className='font-fredoka text-3xl font-bold text-heading sm:text-4xl lg:text-[42px]'
          >
            Nuestros servicios
          </h2>
          <p className='mt-3 text-pretty text-base text-muted'>
            Cuidamos cada pedido para que tu familia en La Habana reciba lo que
            necesita, con la mejor calidad.
          </p>
        </header>

        <ul className='grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8'>
          {services.map((service) => (
            <li key={service.id} className='h-full'>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export { ServicesSection };
