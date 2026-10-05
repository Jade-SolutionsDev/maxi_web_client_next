import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ContactIntro } from './ContactIntro';

afterEach(cleanup);

describe('ContactIntro', () => {
  it('shows the text the store published for the contact page', () => {
    render(
      <ContactIntro
        page={{
          id: 'page-1',
          slug: 'contacto',
          title: 'Contacto',
          content: 'Atendemos de **lunes a sábado**.\n\n- Pedidos\n- Pagos',
        }}
      />,
    );

    expect(screen.getByText('lunes a sábado')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('falls back to the default invitation while there is no published text', () => {
    render(<ContactIntro page={null} />);

    expect(
      screen.getByText(/Escríbenos y te respondemos lo antes posible/),
    ).toBeTruthy();
  });
});
