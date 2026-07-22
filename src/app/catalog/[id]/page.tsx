import { Suspense } from 'react';
import { ProductDetails } from '@/feature/product/components/ProductDetails';
import { ProductDetailsSkeleton } from '@/feature/product/components/ProductDetailsSkeleton';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function DetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

export default DetailsPage;
