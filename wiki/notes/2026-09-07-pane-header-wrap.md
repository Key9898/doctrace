# Impl 86 — Pane header wrap and Account menu

Source: this batch (2026-09-07). Does not edit Impl 71–85 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Language / Theme / Profile stay on the right when the header wraps. The Account menu is clamped to the pane viewport. Host drag width and `overflow-x: hidden` stay unchanged.

## Shipped

- [AppShell.tsx](../../frontend/src/features/shell/components/AppShell/AppShell.tsx): header row drops `justify-between`. Utility cluster is `ml-auto flex shrink-0 items-center gap-1` (no `min-w-0 flex-wrap`). Order stays Language, Theme, Profile.
- [CloudSessionPanel.tsx](../../frontend/src/features/shell/components/CloudSessionPanel/CloudSessionPanel.tsx): menu `w-56` becomes `w-[min(14rem,calc(100vw-1rem))]`. `absolute top-full right-0` kept. No `calc(100%)` of the trigger.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Fast-drag body-text reflow is unchanged. EN nav labels still wrap on a tight pane.

## Not changed

- Impl 71–85 titles. Destination lang button. BrandMark. `ThemeToggle` internals. `overflow-x: hidden`. `.dt-excel-host`. `scrollbar-gutter`. EN tab names. Site HTML / `copy.ts`. Manifests. `RequestedWidth`.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`. Browser `/taskpane.html` narrow EN/MY: utilities stay right; Account menu stays in pane.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-86.md`
