import { Eye } from 'lucide-react';
import { isPreviewingHome } from '@/shared/cms/service/cms.service';

async function PreviewNotice() {
  if (!(await isPreviewingHome())) return null;

  return (
    <aside
      aria-label='Vista previa de la portada'
      className='flex flex-col gap-2 bg-orange px-4 py-3 text-sm font-semibold text-heading sm:flex-row sm:items-center sm:justify-between'
    >
      <p className='flex items-center gap-2'>
        <Eye aria-hidden='true' className='size-4 shrink-0' />
        Estás viendo el borrador de la portada. Los clientes aún no lo ven.
      </p>
      <a
        href='/api/vista-previa/salir'
        className='w-fit rounded-lg bg-heading/10 px-3 py-1.5 underline-offset-2 outline-none transition hover:bg-heading/20 hover:underline focus-visible:ring-2 focus-visible:ring-heading/50'
      >
        Salir de la vista previa
      </a>
    </aside>
  );
}

export { PreviewNotice };
