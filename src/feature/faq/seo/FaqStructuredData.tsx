import type { FaqCategory } from '@/shared/cms/type/cms.interface';

export function FaqStructuredData({
  categories,
}: {
  categories: FaqCategory[];
}) {
  const mainEntity = categories.flatMap((category) =>
    category.questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  );

  if (mainEntity.length === 0) return null;

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };

  return (
    <script type='application/ld+json'>
      {JSON.stringify(payload).replaceAll('<', '\\u003c')}
    </script>
  );
}
