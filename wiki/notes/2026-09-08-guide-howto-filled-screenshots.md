# Impl 108 — Guide how-to and filled screenshots

Source: this batch (2026-09-08). Does not edit Impl 71–107 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 108. Do not reuse 107.

Public Guide now teaches Engagements and Matching as real how-to steps, with filled pane screenshots. Trial Balance, Workpapers, and Client Portal stay off the Guide.

## Shipped

- [`frontend/site/copy.ts`](../../frontend/site/copy.ts): Myanmar `guideTitle` is `စတင်အသုံးပြုရန်`. Engagements steps `guideEngagements1`–`4`. Matching Select/Import/Match/Snip/Review how-to. `guideLocalBody` has no `127.0.0.1` (sibling Support link in HTML). Review copy ends at workbook writeback.
- [`frontend/guide.html`](../../frontend/guide.html): nested TOC under Matching; Matching intro is `#guide-matching` only; Select–Review are sibling sections; Account figcaption; localhost Support `href` is a sibling `<a>`.
- [`frontend/site/site.ts`](../../frontend/site/site.ts) `bindGuideToc()`: observes leaf ids including Matching steps; TOC click and `hashchange` set `aria-current` immediately.
- [`frontend/site/site.css`](../../frontend/site/site.css): `.site-toc li ul` indent. Other `site-page` pages unchanged.
- Eight PNGs in [`frontend/public/assets/guide/`](../../frontend/public/assets/guide/) recaptured at width 375, crop starts at the module tabs (Account shot starts below the DEV/Browser Preview row so the open Account menu is visible). Filled Engagements, Select, Import (`1 DOCUMENT(S)`), Match (suggested mapping), Snip (invoice image), Review (matched outputs). Last 80px row-average luminance is above 60.
- Heights: `shell` 640, `engagements`/`select`/`match`/`snip`/`review`/`account` 820, `import` 840. HTML `height` and [`site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts) match.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Captures are Add-in preview. Account shot is fail-closed OTP (email/sign-in, mail not live). Review PNG may show Send to Workpapers; Guide copy does not name that control. Capture Vite on 3015/3016 may still be running locally; stop them if they are leftover from this batch.

## Not changed

- Impl 71–107 titles. Pane React / AppShell badge hiding. `VITE_SHOW_PREP_MODULES`. Home `not3`. TRACE / FAQ / Privacy / Terms. Trial Balance, Workpapers, Client Portal Guide chapters. No commit until asked. No `CHANGELOG.md`.

Validate: Prettier on Guide/site/test files. ESLint on `copy.ts`, `site.ts`, `site-pages-i18n.test.ts`. `tsc --noEmit`. `npm test`. Browser `/guide.html` nested TOC + scrollspy; en/my title; figures filled; `/` TRACE unchanged; `/taskpane.html` two tabs.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-108.md`
