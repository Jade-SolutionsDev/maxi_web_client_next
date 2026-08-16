import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { type ApiResponse, api } from '@/api/http';
import {
  toBannerSlide,
  toCmsPage,
  toServiceItem,
  toStaffMember,
} from '../adapter/cms.adapter';
import type {
  BannerSlide,
  CmsBannerResponse,
  CmsPage,
  CmsPageResponse,
  CmsServiceResponse,
  CmsStaffMemberResponse,
  ServiceItem,
  SiteSettings,
  StaffMember,
} from '../type/cms.interface';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  footer: {
    blurb:
      'Del mercado a tu mesa, sin complicaciones. Productos frescos y de confianza, con entrega rápida en toda La Habana.',
    copyright: '© 2026 Maxi. Todos los derechos reservados.',
    legalLinks: [
      { label: 'Política de privacidad', slug: 'politica-de-privacidad' },
      { label: 'Términos y condiciones', slug: 'terminos-y-condiciones' },
    ],
  },
  contact: {
    email: 'comercialmaxihabana@gmail.com',
    phone: '+53 5 432 6665',
  },
  payments: {
    visa: true,
    mastercard: true,
    mibilletera: false,
  },
  services: {
    heading: 'Nuestros servicios',
    subheading:
      'Cuidamos cada pedido para que tu familia en La Habana reciba lo que necesita, con la mejor calidad.',
  },
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');

  try {
    const { data } = await api<ApiResponse<SiteSettings>>(
      '/public/cms/settings',
    );
    return data;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
};

export const getBanners = async (): Promise<BannerSlide[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');

  try {
    const { data } = await api<ApiResponse<CmsBannerResponse[]>>(
      '/public/cms/banners',
    );
    return data.map(toBannerSlide);
  } catch {
    return [];
  }
};

export const getCmsServices = async (): Promise<ServiceItem[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');

  try {
    const { data } = await api<ApiResponse<CmsServiceResponse[]>>(
      '/public/cms/services',
    );
    return data.map(toServiceItem);
  } catch {
    return [];
  }
};

export const getStaff = async (): Promise<StaffMember[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');

  try {
    const { data } =
      await api<ApiResponse<CmsStaffMemberResponse[]>>('/public/cms/staff');
    return data.map(toStaffMember);
  } catch {
    return [];
  }
};

export const getCmsPage = async (slug: string): Promise<CmsPage | null> => {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');

  try {
    const { data } = await api<ApiResponse<CmsPageResponse>>(
      `/public/cms/pages/${encodeURIComponent(slug)}`,
    );
    return toCmsPage(data);
  } catch {
    return null;
  }
};
