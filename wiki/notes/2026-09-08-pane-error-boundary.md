# Impl 101 — Pane crash ErrorBoundary

Source: this batch (2026-09-08). Does not edit Impl 71–100 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 101, not 100.

A render throw after React replaces the splash used to blank the pane. This batch wraps `AppLayout` in a class ErrorBoundary and shows a 350px-first crash screen. Site `404.html` / `500.html` stay on the public site only.

## Shipped

- [`frontend/src/features/shell/components/PaneErrorBoundary/PaneErrorBoundary.tsx`](../../frontend/src/features/shell/components/PaneErrorBoundary/PaneErrorBoundary.tsx): class `PaneErrorBoundary` (`getDerivedStateFromError` / optional `console.error` in `componentDidCatch`). Unexported `PaneCrashScreen` uses pane `dt-shell` chrome, copied BrandMark SVG (not `AppShell`), lucide `AlertCircle`, title + lead, `dt-button-primary` → `window.location.reload()`. No `framer-motion`, no React inline styles, no site TRACE/dock.
- [`frontend/src/App.tsx`](../../frontend/src/App.tsx): `<PaneErrorBoundary><AppLayout /></PaneErrorBoundary>`.
- i18n in [`frontend/src/lib/i18n/translations.ts`](../../frontend/src/lib/i18n/translations.ts): `app.crashTitle`, `app.crashLead`, `app.crashReload`, `app.crashAria` in en-US and my-MM. Matching stays the product term. Locale via `useI18n()` (Zustand) on the function child.
- Tests in [`frontend/src/test/pane-error-boundary.test.tsx`](../../frontend/src/test/pane-error-boundary.test.tsx). Folder map lists `PaneErrorBoundary/`.

## Known host / fail-closed gaps (open)

- ErrorBoundary catches render / lifecycle errors of descendants only. Event-handler and async errors stay on activity/toast. Excel sideload smoke is user-owned. No permanent throw in Browser Preview.

## Not changed

- Impl 71–100 titles. Site `404.html` / `500.html` / `vercel.json` / site `copy.ts`. `taskpane.html` splash. `PaneSkeleton`. Matching, OCR, persist, R2, Brevo. Office bootstrap fallback toasts in `main.tsx`. No commit until asked. No merge of `development` into `main`. No `samples/` or `scripts/` copy. No tag. No `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser/task pane still boots; crash UI is covered by the throw test.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-101.md`
