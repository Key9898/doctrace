# Impl 71 — my-MM typography and Latin digits

Source: this batch (2026-09-07). Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Switching the task pane to `my-MM` no longer applies Latin uppercase or letter-spacing to Myanmar chrome, and shared number/date formatters keep Western digits.

## Shipped

- System Myanmar font fallback after Outfit (`Myanmar Text`, `Myanmar MN`, `Noto Sans Myanmar`). No Myanmar webfont download.
- Unlayered `html[lang="my-MM"]` resets on baked primitives (`.dt-kicker`, `.dt-badge`, `.dt-field`, `.dt-stat-label`, `.dt-section-title`, `.dt-chip`) and Tailwind `uppercase` / tracking / `leading-tight` utilities.
- `my-MM` nav keys are short English module names. FirstRunCue and WorkflowStepper drop truncate/tracking on `my-MM`. Nav tabs use `min-h-8 h-auto`.
- `formatNumber`, `formatCurrency`, and `formatDate` pass `numberingSystem: "latn"`. Locale ids stay `my-MM`.
- Vitest: `nav-i18n.test.ts`; formatter Myanmar-digit assertions; nav leftovers removed from `engagement-firm-i18n.test.ts`.
- Last numbered Impl 71. Not a prep-module remaining item.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Leftover B is still 502/503. Kinzi clip at 350px remains an eyeball. `overflow-x: hidden` and Engagements `text-[9px]` size were not changed.

## Not changed

- TB `စမ်းသပ်လက်ကျန်`, PBC categories, glossary calques, `app.browserPreview` copy, site pages, controller/store toasts, matching engine explanations, CSV/audit log English, `DocumentLibraryPanel` `toLocaleString(undefined)`.
- `locales.ts` `numberLocale`. Excel `status` enum. Mock/stored English. Noto webfont import. Zawgyi. RTL.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (260 passed, including `nav-i18n` and formatter Latin-digit asserts). Browser `/taskpane.html`: EN to မြန်မာ; nav `Matching` / `Engagements` / `Trial Balance` / `Workpapers` / `Client Portal`; TB kicker letter-spacing `normal` and `text-transform: none`; tie-out `MMK 0.00 / MMK 32,400.00` Latin digits.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-71.md`
