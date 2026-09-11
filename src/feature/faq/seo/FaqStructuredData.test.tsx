import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { FaqStructuredData } from './FaqStructuredData';

describe('FaqStructuredData', () => {
  afterEach(cleanup);

  it('publishes only question and answer text as FAQPage JSON-LD', () => {
    const { container } = render(
      <FaqStructuredData
        categories={[
          {
            id: 'payments',
            title: 'Pagos',
            questions: [
              {
                id: 'how',
                question: '¿Cómo pago?',
                answer: 'Sigue las instrucciones <seguras>.',
                link: { label: 'Ayuda', href: '/contacto' },
              },
            ],
          },
        ]}
      />,
    );

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).not.toBeNull();
    expect(script?.textContent).toContain('FAQPage');
    expect(script?.textContent).toContain('¿Cómo pago?');
    expect(script?.textContent).toContain('\\u003cseguras>');
    expect(script?.textContent).not.toContain('/contacto');
  });

  it('does not render an empty FAQPage schema', () => {
    const { container } = render(
      <FaqStructuredData
        categories={[{ id: 'empty', title: 'Vacía', questions: [] }]}
      />,
    );

    expect(container.querySelector('script')).toBeNull();
  });
});
