<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI Conventions

## Mobile-first (mandatory)

Design and write every component mobile-first. This is the default, not an option.

- Base Tailwind classes target the smallest screen (phone). Layer larger screens with `sm:`, `md:`, `lg:` breakpoints — never the reverse.
- Default layout for card/product grids: single column on mobile (`grid-cols-1`), expand with `md:grid-cols-*` / `lg:grid-cols-*`.
- Never hardcode desktop widths on mobile. Use fluid units (`w-full`, `max-w-*`) and let breakpoints add constraints.
- Reuse the shared `Container` (`src/app/components/layout/Container.tsx`) for horizontal padding — it is already mobile-first.
- Test the phone layout first; the desktop layout is the progressive enhancement.

## SEO (mandatory)

Every section and component must be built with SEO in mind — not as an afterthought.

- Use semantic HTML: one `<h1>` per page, then `<h2>`/`<h3>` in order; wrap regions in `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` — never a `<div>` where a landmark fits.
- Label every landmark: `aria-label` or `aria-labelledby` pointing at the section's heading.
- Every `<Image>` needs a meaningful, descriptive `alt`. Decorative-only images use `alt=''`.
- Prioritize LCP media: the first above-the-fold image uses `fetchPriority='high'`; below-the-fold stays lazy.
- Use real `<Link href>` for navigation so URLs are crawlable — never a click handler on a `<div>`.

## UX/UI (mandatory)

- Accessibility is part of UX: keyboard-reachable controls, visible focus (`focus-visible:ring-*`), and `aria-label` on icon-only buttons.
- Use `<button type='button'>` for actions and real form semantics for inputs; never a clickable `<div>`.
- Give interactive elements clear states: hover, focus, disabled, and loading where relevant.
- Respect the design tokens in `globals.css` (`text-heading`, `bg-primary`, `text-muted`, …) — do not hardcode hex colors in components.
- Keep feedback obvious: prices, offers, quantities, and actions must read at a glance and never rely on color alone.
## CMS content (mandatory)

Editorial content is NOT hardcoded in this repo — it is managed from the
backoffice and served by the API. When redesigning any of the surfaces below,
change the JSX/Tailwind freely but KEEP the data source: fetch through
`src/shared/cms/service/cms.service.ts`, never inline `fetch` and never
reintroduce hardcoded copy, banner images, or service cards.

- Hero slider (`src/feature/home/components/HeroBanner.tsx`) → `getBanners()`.
  Each slide carries desktop/tablet/mobile variants with intrinsic
  `width`/`height` used to build the `next/image` srcsets — always render
  through `BannerPicture` or preserve that art-direction contract.
- "Nuestros servicios" (`src/feature/home/components/ServicesSection.tsx`) →
  `getCmsServices()` + `getSiteSettings().services` for the heading. Icons are
  NAMES resolved via `src/feature/home/constants/service-icons.ts`; that
  allowlist must stay in sync with the admin's
  `src/pages/cms-services/service-icons.ts` (maxi_admin_react). Unknown names
  fall back to a default icon — never crash on one.
- Footer (`src/app/components/layout/Footer.tsx`) and the header phone →
  `getSiteSettings()` (blurb, contact, copyright, legal links, payment
  toggles). Payment logos stay bundled in `src/assets`; settings only decide
  which render.
- About us (`src/app/sobre-nosotros/page.tsx`) → `getCmsPage('sobre-nosotros')`
  (Markdown intro) + `getStaff()` (team cards).
- Contacto (`src/app/contacto/page.tsx`) → `getSiteSettings().contact`.
- Info pages (`src/app/paginas/[slug]/page.tsx`) → `getCmsPage(slug)`,
  rendered with `src/app/components/ui/markdown.tsx` (react-markdown, no raw
  HTML). New pages need no code: create them in the backoffice.

Contracts to preserve when touching these surfaces:

- Every service function is `'use cache'` + `cacheLife('hours')` +
  `cacheTag('cms')`. The API pings `POST /api/revalidate` with the `cms` tag on
  every admin write, so edits appear without redeploys. Keep new CMS fetches on
  the same tag.
- The services swallow fetch failures and return `[]` / `null` /
  `DEFAULT_SITE_SETTINGS` — the footer renders in the layout of every page, so
  a CMS outage must degrade to defaults, never throw. Components return `null`
  on empty lists.
- CMS image hosts must be allowed in `next.config.ts` via
  `NEXT_PUBLIC_MEDIA_URL` (the API's public storage base URL); the hardcoded
  S3 entry only covers legacy `/BANNER/**` paths.
- API endpoints (all under `GET /public/cms/`): `settings`, `banners`,
  `services`, `staff`, `pages`, `pages/:slug`.
