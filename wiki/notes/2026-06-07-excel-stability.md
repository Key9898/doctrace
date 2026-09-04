# Impl 15 — Excel add-in stability

Source: last_session Previous; git `921f4fb` (2026-06-07). git `538fcfe` same day is type annotations / formatting only.

- Natural document scrolling: `height: auto`, `min-height: 100%`, `overflow: visible` on `body` and `#root` so WebView2 hit-testing aligns
- Zustand infinite loop: template loading no longer depends on the whole store object; uses `officeAvailable`/`officeReady` and `useDocTraceStore.getState()`
- Workbook template optional chaining (`template.config?.amountTolerance`) and malformed-template filter
- Vite `POST /api/log` client diagnostics logger writing `client_errors.log`
- DEV (localhost) / PROD (Vercel) environment badge on AppShell
- `.dt-excel-host` panel overflow `visible` so clipped GPU layers cannot trap clicks

`useEffectEvent` removal is Impl 13 only.

Session (gitignored): `docs/sessions/2026-06-07-session-summary.md`
