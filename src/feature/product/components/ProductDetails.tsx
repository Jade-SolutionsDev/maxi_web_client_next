import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ApiError } from '@/api/http';
import { Section } from '@/app/components/layout/Section';
import { PageHero } from '@/app/components/ui/page-hero';
import fallbackImage from '@/assets/fallback.jpeg';
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
        <div className='flex items-center justify-center rounded-2xl shadow-sm border border-black/5 bg-white p-4'>
          <Image
            src={product.image ?? fallbackImage}
            alt={product.name}
            width={400}
            height={400}
            className='object-contain'
            // Lets the client-side purchase button launch its flight from this
            // photo — a ref cannot cross the server/client boundary.
            {...{ [FLIGHT_SOURCE_ATTR]: PRODUCT_DETAIL_SOURCE }}
          />
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
