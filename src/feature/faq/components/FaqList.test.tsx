import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import type { FaqCategory } from '@/shared/cms/type/cms.interface';
import { FaqList } from './FaqList';

const faqCategories: FaqCategory[] = [
  {
    id: 'crypto',
    title: 'Mi Billetera — Criptomonedas',
    questions: [
      {
        id: 'network',
        question: '¿Qué red debo utilizar?',
        answer: 'Envía los USDT únicamente por la red BEP20.',
      },
    ],
  },
  { id: 'wallet', title: 'Mi Billetera — Saldo', questions: [] },
  { id: 'orders', title: 'Pagos y pedidos', questions: [] },
];

describe('FaqList', () => {
  afterEach(() => {
    cleanup();
  });

  it('muestra las categorías y preguntas publicadas', () => {
    render(<FaqList categories={faqCategories} />);

    expect(
      screen.getByRole('heading', {
        name: 'Mi Billetera — Criptomonedas',
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Mi Billetera — Saldo' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Pagos y pedidos' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: '¿Qué red debo utilizar?' }),
    ).toBeTruthy();
  });

  it('abre y cierra una respuesta usando un botón accesible', async () => {
    const user = userEvent.setup();
    render(<FaqList categories={faqCategories} />);

    const trigger = screen.getByRole('button', {
      name: '¿Qué red debo utilizar?',
    });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(/red BEP20/)).toBeTruthy();

    await user.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('no publica Tropipay ni reglas de devolución o comisiones sin confirmar', () => {
    const publishedContent = faqCategories
      .flatMap((category) => category.questions)
      .map(({ question, answer }) => `${question} ${answer}`)
      .join(' ')
      .toLowerCase();

    expect(publishedContent).not.toContain('tropipay');
    expect(publishedContent).not.toContain('devolverá');
    expect(publishedContent).not.toContain('comisión de red');
  });
});
