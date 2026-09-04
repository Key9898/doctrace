# Impl 34 — Phase 1 Perfect cleanup

Source: this batch (2026-09-01). Same day family as Impl 30, 31, 32, and 33; session file uses `-impl-34`. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

## Shipped

- Deleted leftover trees that were not on the live graph: `src/components/`, `src/state/`, `src/i18n/`, `src/services/`, `src/hooks/`, `src/utils/`, leftover `src/app/App.tsx`, and `src/demo/mocks/README.md`. Live entry remains `src/main.tsx` → `src/App.tsx` → `src/layouts/AppLayout.tsx`. `useDocTraceController` stayed.
- Client-facing honesty copy: `activity.emptyState` no longer mentions a demo workspace; unused `quick.*` and `workflow.badge` keys dropped from live i18n. Diagnostics `buildLabel` is `0.1.0`. README, product-plan Phase 1 heading, and AGENTS no longer use MVP / DataSnipper-style / demo-seed wording.
- Step 3 Matching Logic now exposes invoice/amount/date confidence weights (`config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS`). Matcher math is unchanged. Weights are relative; they do not need to sum to 100.

## Known host / fail-closed gaps (open)

- Excel sideload was not run in this Impl (no download-host smoke, no OCR-pack smoke).
- Download may be swallowed without `showSaveFilePicker`. That path is an info toast (`import.downloadHostUnconfirmed`), not a success toast.
- Snip-anchor Custom XML `fileName` can stay stale after a library rename. Click-back uses `documentId` / `contentSha256`, not the display name.
- The hidden audit log helps an auditor document who/what/when for ISA 230. The software is not ISA-certified.

## Not changed

- Matching formulas, snip-anchor XML rewrite, download byte logic.
- Auth, SharePoint, SSO, retention, Find All Sums, version compare, comments/markup, folder organizer, AI, backend.
- EngagementManager English placeholders (Phase 2 full i18n).

Validate: Prettier, ESLint on touched files, `tsc --noEmit`, `npm test`.

Session (gitignored): `docs/sessions/2026-09-01-session-summary-impl-34.md`
