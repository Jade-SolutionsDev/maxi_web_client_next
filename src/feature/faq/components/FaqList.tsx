'use client';

import { Accordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type { FaqCategory } from '@/shared/cms/type/cms.interface';

interface FaqListProps {
  categories: FaqCategory[];
}

export const FaqList = ({ categories }: FaqListProps) => (
  <div className='flex flex-col gap-10 sm:gap-12'>
    {categories.map((category) => (
      <section key={category.id} aria-labelledby={`faq-${category.id}`}>
        <h2
          id={`faq-${category.id}`}
          className='font-fredoka text-2xl font-bold text-heading sm:text-[1.75rem]'
        >
          {category.title}
        </h2>

        <Accordion.Root className='mt-4 divide-y divide-input rounded-2xl border border-input bg-background'>
          {category.questions.map((item) => (
            <Accordion.Item key={item.id} value={item.id}>
              <h3>
                <Accordion.Trigger className='flex w-full items-center gap-4 px-4 py-4 text-left text-base font-semibold text-heading outline-none transition-colors hover:bg-surface focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/50 sm:px-5'>
                  <span className='flex-1'>{item.question}</span>
                  <ChevronDown
                    className='size-5 shrink-0 text-muted transition-transform duration-200 data-panel-open:rotate-180 motion-reduce:transition-none'
                    aria-hidden='true'
                  />
                </Accordion.Trigger>
              </h3>

              <Accordion.Panel
                hiddenUntilFound
                className='h-(--accordion-panel-height) overflow-hidden transition-[height,opacity] duration-200 ease-out data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0 motion-reduce:transition-none'
              >
                <div className='flex flex-col gap-3 px-4 pb-5 text-base leading-relaxed text-body sm:px-5'>
                  <p>{item.answer}</p>
                  {item.link && (
                    <Link
                      href={item.link.href}
                      className='w-fit rounded-sm font-medium text-accent underline underline-offset-2 outline-none hover:text-total focus-visible:ring-2 focus-visible:ring-primary/40'
                    >
                      {item.link.label}
                    </Link>
                  )}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
    ))}
  </div>
);
