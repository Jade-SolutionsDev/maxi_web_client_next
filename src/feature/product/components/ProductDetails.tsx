import { notFound, permanentRedirect } from 'next/navigation';
import { ApiError } from '@/api/http';
import { Section } from '@/app/components/layout/Section';
import { PageHero } from '@/app/components/ui/page-hero';
import { SafeImage } from '@/app/components/ui/safe-image';
import {
  FLIGHT_SOURCE_ATTR,
  PRODUCT_DETAIL_SOURCE,
} from '@/feature/cart/flight/flight-source';
import { CATALOG_PATH } from '../constants/catalog-search-href';
import {
  buildProductDetailHref,
  extractProductId,
} from '../constants/product-detail-href';
import { getProductById } from '../service/product.service';
import { ProductPrice } from './ProductPrice';
import { ProductPurchase } from './ProductPurchase';

type ProductDetailsProps = {
  params: Promise<{ slug: string }>;
};

async function ProductDetails({ params }: ProductDetailsProps) {
  const { slug } = await params;

  const id = extractProductId(slug);
  // No uuid in the segment means the url was never one of ours.
  if (!id) notFound();

  const product = await getProductById(id).catch((error) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  });

  // Legacy `/catalog/<uuid>` links and stale slugs (renamed product) land on
  // the canonical path. This component streams inside a Suspense boundary, so
  // Next emits a client-side redirect here rather than a 308 — the
  // `rel="canonical"` from `generateMetadata` is what consolidates the url for
  // search engines. Moving this above the boundary would buy a real 308 at the
  // cost of the loading skeleton on every product view.
  const canonical = buildProductDetailHref(product);
  if (canonical !== `${CATALOG_PATH}/${slug}`) permanentRedirect(canonical);

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
