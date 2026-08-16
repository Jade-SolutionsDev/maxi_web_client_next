import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

type MarkdownProps = {
  content: string;
  className?: string;
};

export const Markdown = ({ content, className }: MarkdownProps) => (
  <div
    className={cn(
      'flex flex-col gap-4 text-muted leading-relaxed',
      '[&_h2]:mt-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-heading',
      '[&_h3]:mt-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-heading',
      '[&_strong]:font-semibold [&_strong]:text-heading',
      '[&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2',
      '[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-6',
      '[&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-1.5 [&_ol]:pl-6',
      '[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic',
      className,
    )}
  >
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
);
