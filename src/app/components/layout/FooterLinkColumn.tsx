import Link from 'next/link';
import type { FooterColumn } from './constants/footer.constants';

const linkClass =
  'text-sm uppercase tracking-wide text-white/90 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange rounded-sm';

export const FooterLinkColumn = ({ title, label, links }: FooterColumn) => {
  if (links.length === 0) return null;

  return (
    <nav aria-label={label}>
      <h2 className='mb-5 text-sm font-semibold tracking-wide text-primary'>
        {title}
      </h2>
      <ul className='flex flex-col gap-4'>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
