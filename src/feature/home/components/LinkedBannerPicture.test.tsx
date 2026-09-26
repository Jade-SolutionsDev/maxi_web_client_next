import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { BannerSlide } from '@/shared/cms/type/cms.interface';
import { LinkedBannerPicture } from './LinkedBannerPicture';

const asset = { src: '/banner.jpg', width: 1200, height: 400 };
const banner = (target: BannerSlide['target']): BannerSlide => ({
  id: 'banner-1',
  alt: 'Ofertas de la semana',
  desktop: asset,
  tablet: asset,
  mobile: asset,
  target,
});

afterEach(cleanup);

describe('LinkedBannerPicture', () => {
  it('renders a crawlable link when the banner has a destination', () => {
    render(
      <LinkedBannerPicture
        slide={banner({
          type: 'category',
          id: '55555555-5555-4555-8555-555555555555',
          slug: 'arroces',
        })}
        eager
      />,
    );

    expect(
      screen
        .getByRole('link', { name: /ofertas de la semana/i })
        .getAttribute('href'),
    ).toBe('/catalog?category=arroces');
  });

  it('keeps a banner without a destination non-interactive', () => {
    render(<LinkedBannerPicture slide={banner(null)} eager />);

    expect(screen.queryByRole('link')).toBeNull();
    expect(
      screen.getByRole('img', { name: 'Ofertas de la semana' }),
    ).toBeTruthy();
  });
});
