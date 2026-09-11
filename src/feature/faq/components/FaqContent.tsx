import { EmptyState } from '@/app/components/feedback/EmptyState';
import type { FaqCategory } from '@/shared/cms/type/cms.interface';
import { FaqList } from './FaqList';

export function FaqContent({ categories }: { categories: FaqCategory[] }) {
  const publishedCategories = categories.filter(
    (category) => category.questions.length > 0,
  );

  if (publishedCategories.length === 0) {
    return (
      <EmptyState
        eyebrow='Preguntas frecuentes'
        title='Estamos preparando esta sección'
        description='Mientras publicamos las respuestas, puedes escribirnos y te ayudaremos directamente.'
        action={{ href: '/contacto', label: 'Contactar al equipo' }}
      />
    );
  }

  return <FaqList categories={publishedCategories} />;
}
