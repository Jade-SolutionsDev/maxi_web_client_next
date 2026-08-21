'use client';

import { ListFilter } from 'lucide-react';
import {
  filterFieldClass,
  filterInputClass,
} from './categories-directory.styles';

type CategoryFilterFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const FIELD_ID = 'categories-filter';

const PLACEHOLDER = 'Filtrar categorías…';

export const CategoryFilterField = ({
  value,
  onChange,
}: CategoryFilterFieldProps) => (
  <div className={filterFieldClass}>
    <ListFilter className='h-4 w-4 shrink-0 text-accent' aria-hidden='true' />

    <label htmlFor={FIELD_ID} className='sr-only'>
      {PLACEHOLDER}
    </label>
    <input
      id={FIELD_ID}
      type='search'
      autoComplete='off'
      placeholder={PLACEHOLDER}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={filterInputClass}
    />
  </div>
);
