import { getHomeNotices } from '@/shared/cms/service/cms.service';
import { HomeNoticeList } from './HomeNoticeList';

export async function HomeNotices() {
  const notices = await getHomeNotices();

  return <HomeNoticeList notices={notices} />;
}
