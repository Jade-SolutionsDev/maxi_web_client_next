import { User } from 'lucide-react';
import Link from 'next/link';

export const UserMenu = () => {
  return (
    <Link href='/login' aria-label='Iniciar sesión'>
      <User className='icon' />
    </Link>
  );
};
