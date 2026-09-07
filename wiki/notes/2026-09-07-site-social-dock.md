# Impl 89 — Site dock and hidden scrollbar

Source: this batch (2026-09-07). Does not edit Impl 71–88 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public pages get a floating Mail / Facebook / YouTube / Viber pill on `lg+` and the same links in the footer below `lg`. The page still scrolls; the scrollbar UI is hidden on the public site only. FAQ, Contact, and Guide pages stay Impl 90. Mail still points at `/contact.html`.

## Shipped

- [`frontend/site/dock.ts`](../../frontend/site/dock.ts) React island plus [`SiteDock.tsx`](../../frontend/site/SiteDock.tsx). Framer Motion is imported only from this island, not from [`site.ts`](../../frontend/site/site.ts) or [`main.tsx`](../../frontend/src/main.tsx). Seven public HTML files load `/site/dock.ts` after `/site/site.ts`.
- Invisible `fixed` flex wrapper (`pointer-events-none`) centers a `bg-wash` rounded pill. Official glyphs, ink color, hover brand colors. Enter slide/fade, hover scale, small springy scroll offset. `prefers-reduced-motion` skips motion.
- Footer first-child row `lg:hidden`. [`site.css`](../../frontend/site/site.css) `scrollbar-width: none` on `html`/`body`. `@source "./**/*.tsx"`.
- Copy keys `dockMail`, `dockFacebook`, `dockYouTube`, `dockViber` in en and my. Hrefs in [`social-links.ts`](../../frontend/site/social-links.ts): mail `/contact.html`, networks `/`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. `/contact.html` 404 until Impl 90. Social hrefs stay `/` until live URLs exist.

## Not changed

- Impl 71–88 titles. Nav, Home CTAs, SupportUrl, pane `styles.css` scrollbar-gutter, AppShell, BrandMark, manifests, left TRACE rail.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (304 passed). Browser `/`, `/support.html`, `/sign-in.html` desktop dock and phone footer; `/taskpane.html` has no dock.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-89.md`
