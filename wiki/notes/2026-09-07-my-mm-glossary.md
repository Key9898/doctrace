# Impl 72 — my-MM glossary and meaning

Source: this batch (2026-09-07). Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Task-pane `my-MM` copy keeps Trial Balance and PBC as English product terms, fixes string bugs and leftover Viewer/Import ternaries, and maps `or 1%` in the Results pane only.

## Shipped

- `tb.kicker` / `tb.title` keep `Trial Balance` in English. `pbc.kicker` is `Client PBC Portal`. Five PBC categories stay English.
- String bugs: drop `P0`; `ညှပ်` not `ညုံ`; `cloud.mail` is notice copy; `activity.justNow`; `Browser preview`; Visual Snipping; Matching Logic; imported page (no false date); Firm role.
- Viewer/Import/Snip string ternaries moved to `t()` keys with `{count}` / `{page}` / `{fileName}`.
- `formatExplanation` maps `amount ±X or Y%` to `ပမာဏ ±X သို့မဟုတ် Y%` in the Results pane. Engine/CSV/audit stay English.
- Vitest: `tb-i18n`, `pbc-i18n`, `glossary-i18n.test.ts`, formatter `or 1%` assert.
- Phases row 72 sits between 71 and 75. Last numbered Impl is 75. Not a prep-module remaining item.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Leftover B is still 502/503. Stored snips keep capture-time language. `DocumentLibraryPanel` `toLocaleString(undefined)` leftover.

## Not changed

- 71 CSS/font/`latn`/nav. FirstRunCue/WorkflowStepper className ternaries. AppShell language selected state.
- Site pages (73). Hardcoded controller/store/`main.tsx` toasts and activity (74). Matching engine `explanation` source. CSV/audit log English.
- EN `pbc.kicker`. `pbc.whatBody`. Leftover test dumps. Mock/stored English. Excel `status`. Debit/Credit/Invoice/Lead/PBC/ToD/ISA/MFA.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (270 passed). Browser `/taskpane.html`: locale မြန်မာ; TB kicker/title `Trial Balance`; PBC category chips English; badge `Browser preview`.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-72.md`
