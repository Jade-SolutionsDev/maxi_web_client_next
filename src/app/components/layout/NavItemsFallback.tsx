import Link from "next/link";
import { navItems, visibleNavItems } from "./constants/nav.constants";
import { navItemClass, primaryNavClass } from "./nav-item.styles";

/**
 * Static primary-nav rendered in the prerendered shell while the interactive
 * {@link PrimaryNav} streams in. It keeps the <nav> landmark and links in the
 * static HTML (good for SEO/a11y) but has no active state or sliding indicator —
 * those arrive with the hydrated version.
 */
export const NavItemsFallback = ({ showFaq }: { showFaq: boolean }) => (
  <nav aria-label="Navegación principal" className={primaryNavClass}>
    {visibleNavItems(navItems, { showFaq }).map(({ href, label }) => (
      <Link key={href} href={href} className={navItemClass(false)}>
        {label}
      </Link>
    ))}
  </nav>
);
