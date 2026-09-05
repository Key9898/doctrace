# Impl 55 — remaining firm-terminology i18n

Source: this batch (2026-09-06). Same leftover family as Impl 46–54; session file uses `-impl-55`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Pane-only leftover Engagements firm-terminology. Matching stays unblocked. Public landing (Impl 53) is unchanged.

## Shipped

- `getFrameworkLabel` and create-wizard framework options use existing `eng.fw.*` keys. Store values (`ISA`, `IAS_IFRS`, `IFRS_SMEs`) unchanged.
- Wizard progress uses `eng.wizard.progress` (`{current}` / `{total}`). Summary status uses `getStatusLabel`. Wizard materiality uses `formatCurrency(value)` with no selected-engagement override.
- my-MM leftovers filled for `nav.engagements`, `nav.trialBalance`, `nav.workpapers`, `nav.clientPortal`, `eng.kicker`, `eng.wizard.title`. Existing bilingual role labels not rewritten. `ISO` stays `ISO`.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Leftover B is still 502/503. Live GetObject stays later.

## Not changed

- Status enum values, FY option values/defaults, `frontend/site/`, manifests, prep-module component files.
- Impl 56 firm chrome, Admin mock, Railway, Phase 3.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser `/taskpane.html`: Engagements locale switch for framework / wizard progress / status; Matching unblocked; `/` stays landing.

Session (gitignored): `docs/sessions/2026-09-06-session-summary-impl-55.md`
