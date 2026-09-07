# Impl 74 — pane toasts and activity through t()

Source: this batch (2026-09-07). Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Leftover hardcoded `pushToast` copy and leftover `recordActivity` / `pushActivity` titles plus user-authored descriptions now read the current pane locale at push time. Busy text, `Error.message`, runtime `description: msg`, worker `detail`, CSV, matching-engine `explanation`, and the hidden ISA audit sheet stay English. Already-visible activity rows do not re-translate on locale switch.

## Shipped

- New `persist.` / `match.` / `template.` keys plus `snip.` / `wp.` / `app.` / `identity.` / `eng.` / `results.` leftovers, then `activity.*` plus `app.officeBootstrapFallback` / `app.officeReadyFailedFallback` in `translations.ts`. `en-US` is the prior English verbatim. `my-MM` keeps Matching, Snip, ToD, Excel, IndexedDB, ISA, Custom XML, OCR, PDF, JSON.
- Same title with different bodies stays split keys. Reused toast titles where English matched (`match.completedTitle`, `persist.sessionCacheFailedTitle`, `app.runtimeError`). Did not reuse `snip.undoSessionWeak` or a snip-mode toast title. `{count}` / `{row}` via `.replace` and Latin `String(n)`. Engine `result.status` interpolates as-is.
- Already-`translate()` identity and import activity left unchanged. `setBusyMessage` left English.
- Vitest: `toast-i18n.test.ts` (toasts and activity keys). `app-store.test.ts` dummy `"Test toast"` / `"Test activity"` unchanged.
- Phases row 74 sits between 73 and 75. This batch does not add a new Impl number. Not a prep-module remaining item.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Leftover B is still 502/503. Already-visible toasts and activity rows do not re-translate on locale switch.

## Not changed

- 71 CSS/font/`latn`/nav. 72 chrome glossary. 73 site `copy.ts` / `site.css`. ToastViewport. EngagementManager / TrialBalance `t()` toasts. CloudSessionPanel inline keys. Engine/CSV/audit English. 75 OTP. 76 Profile.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (282 passed). Browser `/taskpane.html`: locale မြန်မာ; Match All with no sample shows MY activity title `Matching ပိတ်ထားသည်`, not `Matching blocked`.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-74.md`
