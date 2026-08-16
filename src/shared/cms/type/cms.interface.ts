export interface BannerAsset {
  src: string;
  width: number;
  height: number;
}

export interface CmsBannerResponse {
  id: string;
  alt: string;
  desktop: BannerAsset;
  tablet: BannerAsset;
  mobile: BannerAsset;
  sortOrder: number;
  isActive: boolean;
}

export interface BannerSlide {
  id: string;
  alt: string;
  desktop: BannerAsset;
  tablet: BannerAsset;
  mobile: BannerAsset;
}

export interface CmsServiceResponse {
  id: string;
  icon: string;
  title: string;
  description: string;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  featured: boolean;
}

export interface CmsStaffMemberResponse {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
  resume: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  resume?: string;
}

export interface CmsPageResponse {
  id: string;
  slug: string;
  title: string;
  content: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  content: string;
}

export interface SiteLegalLink {
  label: string;
  slug: string;
}

export interface SiteSettings {
  footer: {
    blurb: string;
    copyright: string;
    legalLinks: SiteLegalLink[];
  };
  contact: {
    email: string;
    phone: string;
  };
  payments: {
    visa: boolean;
    mastercard: boolean;
    mibilletera: boolean;
  };
  services: {
    heading: string;
    subheading: string;
  };
}
