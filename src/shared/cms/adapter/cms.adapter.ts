import { DEFAULT_SITE_SETTINGS } from '../constants/site-settings.constants';
import type {
  BannerSlide,
  CmsBannerResponse,
  CmsPage,
  CmsPageLink,
  CmsPageResponse,
  CmsServiceResponse,
  CmsStaffMemberResponse,
  ServiceItem,
  SiteSettings,
  SiteSettingsResponse,
  StaffMember,
} from '../type/cms.interface';

export const toBannerSlide = (banner: CmsBannerResponse): BannerSlide => ({
  id: banner.id,
  alt: banner.alt.trim(),
  desktop: banner.desktop,
  tablet: banner.tablet,
  mobile: banner.mobile,
});

export const toServiceItem = (service: CmsServiceResponse): ServiceItem => ({
  id: service.id,
  icon: service.icon,
  title: service.title.trim(),
  description: service.description.trim(),
  featured: service.isFeatured,
});

export const toStaffMember = (member: CmsStaffMemberResponse): StaffMember => ({
  id: member.id,
  name: member.name.trim(),
  role: member.role.trim(),
  photo: member.photoUrl ?? undefined,
  resume: member.resume?.trim() || undefined,
});

export const toSiteSettings = (
  settings: SiteSettingsResponse,
): SiteSettings => ({
  footer: {
    blurb: settings.footer?.blurb?.trim() || DEFAULT_SITE_SETTINGS.footer.blurb,
    copyright:
      settings.footer?.copyright?.trim() ||
      DEFAULT_SITE_SETTINGS.footer.copyright,
    legalLinks:
      settings.footer?.legalLinks ?? DEFAULT_SITE_SETTINGS.footer.legalLinks,
  },
  contact: {
    email:
      settings.contact?.email?.trim() || DEFAULT_SITE_SETTINGS.contact.email,
    phone:
      settings.contact?.phone?.trim() || DEFAULT_SITE_SETTINGS.contact.phone,
    hours:
      settings.contact?.hours?.trim() || DEFAULT_SITE_SETTINGS.contact.hours,
  },
  payments: { ...DEFAULT_SITE_SETTINGS.payments, ...settings.payments },
  services: {
    heading:
      settings.services?.heading?.trim() ||
      DEFAULT_SITE_SETTINGS.services.heading,
    subheading:
      settings.services?.subheading?.trim() ||
      DEFAULT_SITE_SETTINGS.services.subheading,
  },
});

export const toCmsPage = (page: CmsPageResponse): CmsPage => ({
  id: page.id,
  slug: page.slug,
  title: page.title.trim(),
  content: page.content,
});

export const toCmsPageLink = (page: CmsPageResponse): CmsPageLink => ({
  slug: page.slug,
  title: page.title.trim(),
});
