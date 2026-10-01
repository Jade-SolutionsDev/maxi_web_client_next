import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { type ApiResponse, api } from "@/api/http";
import {
  toCmsPage,
  toCmsPageLink,
  toFaqCategory,
  toServiceItem,
  toSiteSettings,
  toStaffMember,
} from "../adapter/cms.adapter";
import { toHomeContent } from "../adapter/home.adapter";
import { DEFAULT_HOME_CONTENT } from "../constants/home.constants";
import { DEFAULT_SITE_SETTINGS } from "../constants/site-settings.constants";
import type {
  CmsFaqCategoryResponse,
  CmsHomeResponse,
  CmsPage,
  CmsPageLink,
  CmsPageResponse,
  CmsServiceResponse,
  CmsStaffMemberResponse,
  FaqCategory,
  HomeContent,
  ServiceItem,
  SiteSettings,
  SiteSettingsResponse,
  StaffMember,
} from "../type/cms.interface";

/**
 * Whether the FAQ page has anything to show: at least one active category
 * with at least one active question. The public endpoint already drops empty
 * and inactive categories, so this is just «is the list non-empty». While it is
 * false the storefront hides the FAQ link everywhere (nav, drawer, sitemap).
 */
export const hasFaqContent = async (): Promise<boolean> => {
  const categories = await getFaqCategories();
  return categories.some((category) => category.questions.length > 0);
};

export const getFaqCategories = async (): Promise<FaqCategory[]> => {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");

  try {
    const { data } =
      await api<ApiResponse<CmsFaqCategoryResponse[]>>("/public/cms/faqs");
    return data.map(toFaqCategory);
  } catch {
    return [];
  }
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");

  try {
    const { data } = await api<ApiResponse<SiteSettingsResponse>>(
      "/public/cms/settings",
    );
    return toSiteSettings(data);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
};

export const getHomeContent = async (): Promise<HomeContent> => {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");

  try {
    const { data } =
      await api<ApiResponse<CmsHomeResponse>>("/public/cms/home");
    return toHomeContent(data);
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
};

export const getCmsServices = async (): Promise<ServiceItem[]> => {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");

  try {
    const { data } = await api<ApiResponse<CmsServiceResponse[]>>(
      "/public/cms/services",
    );
    return data.map(toServiceItem);
  } catch {
    return [];
  }
};

export const getStaff = async (): Promise<StaffMember[]> => {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");

  try {
    const { data } =
      await api<ApiResponse<CmsStaffMemberResponse[]>>("/public/cms/staff");
    return data.map(toStaffMember);
  } catch {
    return [];
  }
};

export const getCmsPages = async (): Promise<CmsPageLink[]> => {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");

  try {
    const { data } =
      await api<ApiResponse<CmsPageResponse[]>>("/public/cms/pages");
    return data.map(toCmsPageLink);
  } catch {
    return [];
  }
};

export const getCmsPage = async (slug: string): Promise<CmsPage | null> => {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");

  try {
    const { data } = await api<ApiResponse<CmsPageResponse>>(
      `/public/cms/pages/${encodeURIComponent(slug)}`,
    );
    return toCmsPage(data);
  } catch {
    return null;
  }
};
