import { DEFAULT_HOME_CONTENT } from '../constants/home.constants';
import {
  type CmsHomeResponse,
  HOME_SECTION_KEYS,
  type HomeContent,
  type HomeSectionKey,
} from '../type/cms.interface';
import { toBannerSlide } from './cms.adapter';

const isHomeSectionKey = (key: string): key is HomeSectionKey =>
  (HOME_SECTION_KEYS as readonly string[]).includes(key);

const toSections = (
  sections: CmsHomeResponse['sections'],
): HomeSectionKey[] => {
  const known = sections.filter(
    (section): section is { key: HomeSectionKey; isVisible: boolean } =>
      isHomeSectionKey(section.key),
  );
  if (!known.length) return DEFAULT_HOME_CONTENT.sections;
  return known.filter((section) => section.isVisible).map(({ key }) => key);
};

export const toHomeContent = (response: CmsHomeResponse): HomeContent => ({
  sections: toSections(response.sections),
  featuredProductIds: response.featuredProductIds,
  featuredDepartmentIds: response.featuredDepartmentIds,
  banners: response.banners.map(toBannerSlide),
});
