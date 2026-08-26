import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { type ApiResponse, api } from '@/api/http';
import {
  toBannerSlide,
  toCmsPage,
  toServiceItem,
  toSiteSettings,
  toStaffMember,
} from '../adapter/cms.adapter';
import { DEFAULT_SITE_SETTINGS } from '../constants/site-settings.constants';
import type {
  BannerSlide,
  CmsBannerResponse,
  CmsPage,
  CmsPageResponse,
  CmsServiceResponse,
  CmsStaffMemberResponse,
  ServiceItem,
  SiteSettings,
  SiteSettingsResponse,
  StaffMember,
} from '../type/cms.interface';

export const getSiteSettings = async (): Promise<SiteSettings> => {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');

  try {
    const { data } = await api<ApiResponse<SiteSettingsResponse>>(
      '/public/cms/settings',
    );
    return toSiteSettings(data);
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
