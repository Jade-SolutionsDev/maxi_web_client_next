import type { Metadata } from 'next';

const TITLE = 'Categorías';

const DESCRIPTION =
  'Recorré todo el supermercado pasillo por pasillo: departamentos, categorías y el catálogo completo de Maxi a un clic.';

export function generateCategoriesMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: '/categorias' },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: '/categorias',
      type: 'website',
    },
  };
}
