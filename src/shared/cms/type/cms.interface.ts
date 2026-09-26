export interface BannerAsset {
  src: string;
  width: number;
  height: number;
}

export interface CmsBannerTarget {
  type: 'department' | 'category' | 'product';
  id: string;
  slug: string;
}

export interface CmsBannerResponse {
  id: string;
  alt: string;
  desktop: BannerAsset;
  tablet: BannerAsset;
  mobile: BannerAsset;
  sortOrder: number;
  isActive: boolean;
  target: CmsBannerTarget | null;
}

export interface BannerSlide {
  id: string;
  alt: string;
  desktop: BannerAsset;
  tablet: BannerAsset;
  mobile: BannerAsset;
  target: CmsBannerTarget | null;
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

export interface CmsPageLink {
  slug: string;
  title: string;
}

export interface CmsFaqQuestionResponse {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  link: { label: string; href: string } | null;
}

export interface CmsFaqCategoryResponse {
  id: string;
  title: string;
  sortOrder: number;
  questions: CmsFaqQuestionResponse[];
}

export interface FaqQuestion {
  id: string;
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

export interface FaqCategory {
  id: string;
  title: string;
  questions: FaqQuestion[];
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
    hours: string;
  };
  payments: {
    visa: boolean;
    mastercard: boolean;
    mibilletera: boolean;
    tropipay: boolean;
  };
  services: {
    heading: string;
    subheading: string;
  };
}

export interface SiteSettingsResponse {
  footer?: Partial<SiteSettings['footer']>;
  contact?: Partial<SiteSettings['contact']>;
  payments?: Partial<SiteSettings['payments']>;
  services?: Partial<SiteSettings['services']>;
}
