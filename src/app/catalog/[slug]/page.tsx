import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetails } from '@/feature/product/components/ProductDetails';
import { ProductDetailsSkeleton } from '@/feature/product/components/ProductDetailsSkeleton';
import { extractProductId } from '@/feature/product/constants/product-detail-href';
import { buildProductMetadata } from '@/feature/product/seo/product-metadata';
import { getProductById } from '@/feature/product/service/product.service';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = extractProductId(slug);
  if (!id) return {};

  const product = await getProductById(id).catch(() => null);

  return product ? buildProductMetadata(product) : {};
}

function DetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

export default DetailsPage;
