import { Markdown } from '@/app/components/ui/markdown';
import type { CmsPage } from '@/shared/cms/type/cms.interface';

type ContactIntroProps = {
  page: CmsPage | null;
};

const DEFAULT_INTRO =
  '¿Tienes dudas sobre un pedido o quieres trabajar con nosotros? Escríbenos y te respondemos lo antes posible.';

export const ContactIntro = ({ page }: ContactIntroProps) =>
  page ? (
    <Markdown
      content={page.content}
      className='max-w-2xl text-center text-muted [&_ol]:mx-auto [&_ol]:w-fit [&_ul]:mx-auto [&_ul]:w-fit [&_li]:text-left'
    />
  ) : (
    <p className='mx-auto max-w-2xl text-center text-lg text-muted'>
      {DEFAULT_INTRO}
    </p>
  );
