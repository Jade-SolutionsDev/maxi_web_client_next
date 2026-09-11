import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FaqContent } from './FaqContent';

vi.mock('@/app/components/feedback/EmptyState', () => ({
  EmptyState: ({
    title,
    action,
  }: {
    title: string;
    action: { href: string; label: string };
  }) => (
    <div>
      <p>{title}</p>
      <a href={action.href}>{action.label}</a>
    </div>
  ),
}));

describe('FaqContent', () => {
  afterEach(cleanup);

  it('shows a safe empty state when no FAQ content is published', () => {
    render(<FaqContent categories={[]} />);

    expect(screen.getByText('Estamos preparando esta sección')).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'Contactar al equipo' })
        .getAttribute('href'),
    ).toBe('/contacto');
  });

  it('omits empty categories returned by the API', () => {
    render(
      <FaqContent
        categories={[
          { id: 'empty', title: 'Sin preguntas', questions: [] },
          {
            id: 'published',
            title: 'Pagos',
            questions: [
              {
                id: 'question',
                question: '¿Cómo pago?',
                answer: 'Sigue las instrucciones.',
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.queryByText('Sin preguntas')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Pagos' })).toBeTruthy();
  });
});
