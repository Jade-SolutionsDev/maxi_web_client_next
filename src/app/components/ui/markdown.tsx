import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

type MarkdownProps = {
  content: string;
  className?: string;
};

const TableScroller = ({ children }: { children?: ReactNode }) => (
  <div className='-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0'>
    <table className='w-full min-w-[28rem] border-collapse text-left text-sm'>
      {children}
    </table>
  </div>
);

const measure = 'mx-auto w-full max-w-[68ch]';

const rhythm = cn(
  'flex flex-col gap-5',
  '[&>*:first-child]:mt-0',
  '[&_h2]:mt-5 [&_h3]:mt-3 [&_h4]:mt-2 [&_hr]:my-3',
);

const display = cn(
  '[&_h2]:font-fredoka [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-balance [&_h2]:text-heading sm:[&_h2]:text-[1.75rem]',
  '[&_h3]:font-fredoka [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-balance [&_h3]:text-heading',
  '[&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-heading',
);

const prose = cn(
  '[&>p:first-of-type]:text-lg',
  '[&_strong]:font-semibold [&_strong]:text-heading',
  '[&_del]:line-through [&_del]:text-muted',
  '[&_a]:rounded-sm [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:outline-none',
  '[&_a:hover]:text-total [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-primary/40',
);

const lists = cn(
  '[&_ul]:list-disc [&_ol]:list-decimal',
  '[&_ul]:space-y-1.5 [&_ol]:space-y-1.5 [&_ul]:pl-6 [&_ol]:pl-6',
  '[&_li]:marker:text-primary',
  '[&_li>ul]:mt-1.5 [&_li>ol]:mt-1.5',
);

const blocks = cn(
  '[&_blockquote]:rounded-2xl [&_blockquote]:bg-surface [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-heading',
  '[&_blockquote>*+*]:mt-3',
  '[&_hr]:border-input',
  '[&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl',
  '[&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:font-medium [&_code]:text-total',
  '[&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:text-sm',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit',
);

const table = cn(
  '[&_th]:border-b [&_th]:border-input [&_th]:pb-2 [&_th]:pr-4 [&_th]:font-semibold [&_th]:text-heading',
  '[&_td]:border-b [&_td]:border-input/60 [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top',
);

export const Markdown = ({ content, className }: MarkdownProps) => (
  <div
    className={cn(
      measure,
      rhythm,
      'text-base leading-relaxed text-pretty text-body',
      display,
      prose,
      lists,
      blocks,
      table,
      className,
    )}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{ table: TableScroller }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
