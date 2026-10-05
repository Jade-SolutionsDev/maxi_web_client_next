import { HOME_SECTION_KEYS, type HomeContent } from '../type/cms.interface';

export const DEFAULT_HOME_CONTENT: HomeContent = {
  sections: [...HOME_SECTION_KEYS],
  featuredProductIds: [],
  featuredDepartmentIds: [],
  banners: [],
};
