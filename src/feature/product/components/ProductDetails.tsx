import { notFound } from 'next/navigation';
import { ApiError } from '@/api/http';
import { Section } from '@/app/components/layout/Section';
import { PageHero } from '@/app/components/ui/page-hero';
import { SafeImage } from '@/app/components/ui/safe-image';
import {
  FLIGHT_SOURCE_ATTR,
  PRODUCT_DETAIL_SOURCE,
} from '@/feature/cart/flight/flight-source';
import { getProductById } from '../service/product.service';
import { ProductPrice } from './ProductPrice';
import { ProductPurchase } from './ProductPurchase';

type ProductDetailsProps = {
  params: Promise<{ id: string }>;
};

async function ProductDetails({ params }: ProductDetailsProps) {
  const { id } = await params;
  const product = await getProductById(id).catch((error) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  });

  return (
    <>
      <PageHero
        title={product.name}
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Catálogo', href: '/catalog' },
          { label: product.name },
        ]}
      />

      <Section direction='row'>
        <div className='relative aspect-square w-full max-w-125 self-start overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8'>
          <div className='relative h-full w-full'>
            <SafeImage
              src={product.image}
              alt={product.name}
              fill
              sizes='(max-width: 768px) 100vw, 500px'
              className='object-contain'
              {...{ [FLIGHT_SOURCE_ATTR]: PRODUCT_DETAIL_SOURCE }}
            />
          </div>
        </div>

        <div className='flex-1 space-y-5 max-w-145'>
          {product.category && (
            <p className='inline-flex rounded-full bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent'>
              {product.category}
            </p>
          )}

          <h2 className='text-3xl font-bold text-heading sm:text-4xl'>
            {product.name}
          </h2>

          <ProductPrice
            price={product.price}
            discount={product.discount}
            size='lg'
          />

          <p className='text-muted whitespace-pre-line leading-relaxed'>
            {product.description}
          </p>

          <hr className='border-black/10' />

          <ProductPurchase product={product} />
        </div>
      </Section>
    </>
  );
}

export { ProductDetails };
