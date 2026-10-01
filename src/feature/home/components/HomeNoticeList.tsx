import { Megaphone } from 'lucide-react';
import { Container } from '@/app/components/layout/Container';
import { Markdown } from '@/app/components/ui/markdown';
import type { HomeNotice } from '@/shared/cms/type/cms.interface';

type HomeNoticeListProps = {
  notices: HomeNotice[];
};

const noticeProse =
  'mx-0 max-w-none gap-1 text-sm text-heading [&>p:first-of-type]:text-sm [&_a]:text-heading';

const noticeTitleId = (id: string) => `aviso-${id}`;

export const HomeNoticeList = ({ notices }: HomeNoticeListProps) => {
  if (notices.length === 0) return null;

  return (
    <aside aria-label='Avisos de la tienda' className='bg-sand'>
      <Container className='flex flex-col gap-4 py-4'>
        {notices.map((notice) => (
          <article
            key={notice.id}
            aria-labelledby={noticeTitleId(notice.id)}
            className='flex items-start gap-3'
          >
            <Megaphone
              aria-hidden='true'
              className='mt-0.5 size-5 shrink-0 text-heading'
            />
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <h2
                id={noticeTitleId(notice.id)}
                className='font-bold text-balance text-heading'
              >
                {notice.title}
              </h2>
              <Markdown content={notice.content} className={noticeProse} />
            </div>
          </article>
        ))}
      </Container>
    </aside>
  );
};
