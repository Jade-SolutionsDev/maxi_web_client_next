import type {
  BannerSlide,
  CmsBannerResponse,
  CmsPage,
  CmsPageResponse,
  CmsServiceResponse,
  CmsStaffMemberResponse,
  ServiceItem,
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

export const toCmsPage = (page: CmsPageResponse): CmsPage => ({
  id: page.id,
  slug: page.slug,
  title: page.title.trim(),
  content: page.content,
});
