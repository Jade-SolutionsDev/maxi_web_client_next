import { getHomeContent } from '@/shared/cms/service/cms.service';
import { HomeSection } from './HomeSection';

async function HomeSections() {
  const content = await getHomeContent();

  return content.sections.map((section) => (
    <HomeSection key={section} section={section} content={content} />
  ));
}

export { HomeSections };
