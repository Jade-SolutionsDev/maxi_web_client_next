import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

/**
 * Buscador estático y presentacional. Todavía no dispara ninguna búsqueda.
 * El ancho lo controla quien lo renderiza vía `className`.
 */
export const SearchBar = ({
  placeholder = 'Buscar productos…',
  className,
}: SearchBarProps) => {
  return (
    <search
      className={cn(
        'relative flex items-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition focus-within:ring-2 focus-within:ring-primary/60',
        className,
      )}
    >
      <Search
        className='pointer-events-none absolute left-4 h-5 w-5 text-muted'
        aria-hidden='true'
      />
      <label htmlFor='product-search' className='sr-only'>
        {placeholder}
      </label>
      <input
        id='product-search'
        type='search'
        placeholder={placeholder}
        className='w-full rounded-full bg-transparent py-3 pr-5 pl-12 text-heading placeholder:text-muted focus:outline-none'
      />
    </search>
  );
};
