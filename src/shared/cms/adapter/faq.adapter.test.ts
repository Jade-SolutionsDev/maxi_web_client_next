import { describe, expect, it } from 'vitest';
import { toFaqCategory } from './cms.adapter';

describe('toFaqCategory', () => {
  it('maps the public CMS contract and removes editorial whitespace', () => {
    expect(
      toFaqCategory({
        id: 'category-1',
        title: '  Pagos  ',
        sortOrder: 10,
        questions: [
          {
            id: 'question-1',
            question: '  ¿Cómo pago?  ',
            answer: '  Sigue las instrucciones.  ',
            sortOrder: 20,
            link: { label: '  Ver pedidos  ', href: '/pedidos' },
          },
        ],
      }),
    ).toEqual({
      id: 'category-1',
      title: 'Pagos',
      questions: [
        {
          id: 'question-1',
          question: '¿Cómo pago?',
          answer: 'Sigue las instrucciones.',
          link: { label: 'Ver pedidos', href: '/pedidos' },
        },
      ],
    });
  });
});
