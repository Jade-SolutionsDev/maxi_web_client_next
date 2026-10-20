import { beforeEach, describe, expect, it, vi } from 'vitest';

const redirect = vi.fn();
const getSiteSettings = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirect(url),
}));
vi.mock('@/shared/cms/service/cms.service', () => ({
  getSiteSettings: () => getSiteSettings(),
}));

import { GET } from './route';

describe('GET /whatsapp', () => {
  beforeEach(() => {
    redirect.mockReset();
    getSiteSettings.mockReset();
  });

  it('lleva al WhatsApp del número que tengan los ajustes', async () => {
    getSiteSettings.mockResolvedValue({ contact: { phone: '+53 5251 9414' } });

    await GET();

    expect(redirect).toHaveBeenCalledWith('https://wa.me/5352519414');
  });

  // El número vive en los ajustes del sitio, no aquí: si lo cambian desde el
  // panel, este atajo tiene que seguirlo sin tocar código (MxH-0136).
  it('sigue al número que haya, no a uno escrito a mano', async () => {
    getSiteSettings.mockResolvedValue({ contact: { phone: '+53 5555 0000' } });

    await GET();

    expect(redirect).toHaveBeenCalledWith('https://wa.me/5355550000');
  });
});
