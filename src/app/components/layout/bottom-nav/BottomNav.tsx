import { Cart } from '@/feature/cart/components/Cart';
import { CartTabTrigger } from '@/feature/cart/components/CartTabTrigger';
import { getSiteSettings } from '@/shared/cms/service/cms.service';
import { MobileNav } from '../mobile-nav';
import { BottomNavLinks } from './BottomNavLinks';
import { bottomNavBarClass, bottomNavClass } from './bottom-nav.styles';

export const BottomNav = async () => {
  const { contact } = await getSiteSettings();

  return (
    <div className={bottomNavClass}>
      <nav aria-label='Navegación principal' className={bottomNavBarClass}>
        <BottomNavLinks />
        <Cart trigger={<CartTabTrigger />} />
        <MobileNav phone={contact.phone} />
      </nav>
    </div>
  );
};
