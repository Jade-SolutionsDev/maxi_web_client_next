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