# Impl 83 — Pane light Sky-600 BrandMark

Source: this batch (2026-09-07). Does not edit Impl 71–82 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

Excel task-pane `BrandMark` light plate is the product Sky-600 tile. Dark stays the navy lockup. Frost chip around the mark is removed. Landing SVG, favicon, and Excel PNGs stay navy.

## Shipped

- [AppShell.tsx](../../frontend/src/features/shell/components/AppShell/AppShell.tsx) `BrandMark`: light plate `fill-sky-600`; bars `fill-white`. Dark plate `fill-slate-900`; bars `#F8FAFC` / `#DBEAFE` / `#7DD3FC`. Amber `#F59E0B` unchanged. SVG `block h-full w-full`. No inline CSS.
- Logo wrapper is `h-8 w-8 shrink-0` only. Frost `bg-white/40` / border / `p-1` removed on both themes.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Personality menu still uses `icon-80.png` (`#0F172A`). Pane light Sky-600 does not restyle that host chrome.

## Not changed

- Impl 71–82 titles. Landing `logo-mark.svg`, favicon, `icon-*.png`. Manifests. Personality menu. `ThemeToggle` / `doctrace-theme`. `Office.context.officeTheme`. Language-toggle frost chip. Site `copy.ts` / `site.css`. Dark plate is not Sky-600.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`. Browser `/taskpane.html`: light Sky-600 plate, white bars, no frost bezel; dark navy plate, original bar colors. `/` landing mark still `#0F172A`.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-83.md`
