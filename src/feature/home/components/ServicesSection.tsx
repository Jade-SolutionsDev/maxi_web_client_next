import { Container } from '@/app/components/layout/Container';
import { ServiceCard } from '@/feature/home/components/ServiceCard';
import { resolveServiceIcon } from '@/feature/home/constants/service-icons';
import {
  getCmsServices,
  getSiteSettings,
} from '@/shared/cms/service/cms.service';

const titleId = 'nuestros-servicios';

async function ServicesSection() {
  const [items, settings] = await Promise.all([
    getCmsServices(),
    getSiteSettings(),
  ]);

  if (items.length === 0) return null;

  const services = items.map((item) => ({
    id: item.id,
    icon: resolveServiceIcon(item.icon),
    title: item.title,
    description: item.description,
    featured: item.featured,
  }));

  return (
    <section aria-labelledby={titleId} className='mt-11'>
      <Container className='bg-linear-135 from-sand to-sand-strong pb-12 pt-10 lg:pb-[60px] lg:pt-[54px]'>
        <header className='mx-auto mb-10 max-w-3xl text-center lg:mb-14'>
          <h2
            id={titleId}
            className='font-fredoka text-3xl font-bold text-heading sm:text-4xl lg:text-[42px]'
          >
            {settings.services.heading}
          </h2>
          <p className='mt-3 text-pretty text-base text-muted'>
            {settings.services.subheading}
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
