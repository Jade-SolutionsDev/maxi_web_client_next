import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HomeNoticeList } from './HomeNoticeList';

afterEach(cleanup);

describe('HomeNoticeList', () => {
  it('shows each notice with its title and formatted text', () => {
    render(
      <HomeNoticeList
        notices={[
          {
            id: 'notice-1',
            title: 'Cerrado el lunes',
            content: 'Escríbenos por [WhatsApp](https://wa.me/5352519414).',
          },
        ]}
      />,
    );

    const region = screen.getByRole('complementary', {
      name: 'Avisos de la tienda',
    });
    expect(region.textContent).toContain('Cerrado el lunes');
    expect(
      screen.getByRole('link', { name: 'WhatsApp' }).getAttribute('href'),
    ).toBe('https://wa.me/5352519414');
  });

  it('renders nothing when there is no notice', () => {
    const { container } = render(<HomeNoticeList notices={[]} />);

    expect(container.innerHTML).toBe('');
  });
});
