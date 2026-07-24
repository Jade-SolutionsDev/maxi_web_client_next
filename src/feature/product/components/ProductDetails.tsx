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
        <div className='relative aspect-square w-full max-w-100 self-start overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm'>
          <div className='relative h-full w-full'>
            <SafeImage
              src={product.image}
              alt={product.name}
              fill
              sizes='(max-width: 768px) 100vw, 400px'
              className='object-contain'
              {...{ [FLIGHT_SOURCE_ATTR]: PRODUCT_DETAIL_SOURCE }}
            />
          </div>
        </div>

        <div className='space-y-4 max-w-145'>
          <div className='space-y-10'>
            <h2 className='text-3xl font-bold text-heading mb-3 '>
              {product.name}
            </h2>
            <p className='text-muted text-[14.5px] whitespace-pre-line'>
              {product.description}
            </p>
          </div>

          <ProductPurchase product={product} />
        </div>
      </Section>
    </>
  );
}

export { ProductDetails };
