# Impl 77 — Landing visitor copy

Source: this batch (2026-09-07). Does not edit Impl 71–74. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Public landing and support strings are visitor language. Matching still has no login wall. Sideload URLs stay on support. CTA hrefs are unchanged.

## Shipped

- `frontend/site/copy.ts` en + my: hero, what it does (sample → evidence → match → snip → workbook), short what it is not, where files stay, where to run it.
- Landing drops `deterministic`, IndexedDB, `VITE_API_URL`, and Phase 1.
- First CTA label is **How to open in Excel** / **Excel မှာ ဖွင့်ပုံ** (`/support.html`). Second stays **Add-in preview** (`/taskpane.html`).
- Banner shortened; `example.com` still marked placeholder. Same key on auth pages.
- Support How2 drops the “no longer the site root” aside. How1/How3 still have `manifest.xml`, Data tab, `npm run dev`, and the three URLs.
- Privacy collect body no longer names `doctrace-site-lang`.
- Vitest: jargon strip + CTA labels in `site-glossary-i18n.test.ts`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run.
- Live email OTP still waits on leftover B Brevo.

## Not changed

- Impl 71–74. HTML structure, Profile/OTP, pane `translations.ts`, BrandMark, hamburger, dark mode, manifests. CTA hrefs. Merge to `main`.
- No commit, no push, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (282 passed, including 6 `site-glossary-i18n`). Browser `/`: How to open in Excel → `/support.html`; Add-in preview → `/taskpane.html`; EN then မြန်မာ hero/does/not/data. `/support.html` still shows the three URLs. Excel sideload not run.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-77.md`
