# Impl 102 — Guide sidebar TOC and pane-fit screenshots

Source: this batch (2026-09-08). Does not edit Impl 71–101 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Getting started uses a left dashboard table of contents on desktop and pane-only screenshots that fill a larger figure frame. Support, FAQ, Privacy, and 404 keep the existing `site-page` column. TRACE on Home is unchanged.

## Shipped

- [`frontend/guide.html`](../../frontend/guide.html) `class="site-page site-guide"` (site-page first). `nav.site-toc` is a `ul` of dashboard links (`01`–`07`), then `div.site-guide-body`. Header Guide links have `aria-current="page"`. Logo `alt="DocTrace"`.
- Guide-scoped CSS in [`frontend/site/site.css`](../../frontend/site/site.css): mobile TOC stacked; `min-width: 48rem` grid `14rem minmax(0,1fr)` with sticky TOC; `.site-section { scroll-margin-top: 5.5rem }`; `.site-figure` `max-width: 28rem` (`max-w-md`), no `max-w-[360px]`, no wash letterbox around the bitmap.
- [`frontend/site/site.ts`](../../frontend/site/site.ts) `bindGuideToc()` IntersectionObserver sets `aria-current="true"` on the matching TOC link.
- Copy: `guideExcel2` has no URL; sibling `<a href="https://doctrace-one.vercel.app/taskpane.html">`. `guideLocalBody` still contains `127.0.0.1` plus sibling localhost Support link. End CTAs: `guideAfterHome`, `navSupport`, `ctaPane`. `guideSnipBody` states it is not a numbered Matching step.
- Eight PNGs recaptured at ~390px English pane-only (prep empty; API empty except `account.png` with Account panel open). `loading="eager"` on `shell.png`; `lazy` on the rest. Width/height match PNG intrinsics.
- Tests in [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts). Impl 96–101 asserts stay, including `ctaSupport` → `/guide.html`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Captures still show Browser Preview / DEV host badges. Account shot is fail-closed OTP (not live). Empty inspection filling the snip frame is honest, not a Matching step.

## Not changed

- Impl 71–101 titles. Landing TRACE/hero. Dock. Guide chapter order and product claims. Pane React (capture-only Vite). `404.html` / `500.html` / `PaneErrorBoundary`. Cookie page. No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier on Guide/site files and tests. ESLint on `copy.ts`, `site.ts`, `site-pages-i18n.test.ts`. `tsc --noEmit`. `npm test` (361 passed). Browser: `/guide.html` desktop sidebar + mobile stacked TOC; figures fill the frame; en/my; `/` TRACE unchanged; `/taskpane.html` / `/404.html` unchanged.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-102.md`
