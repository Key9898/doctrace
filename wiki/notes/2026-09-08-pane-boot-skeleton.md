# Impl 99 — Pane boot splash and busy skeletons

Source: this batch (2026-09-08). Does not edit Impl 71–98 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 99, not 98.

Excel first-open used to show a dark pane with host **Loading...** because `taskpane.html` had an empty `#root` and a blocking `office.js` in `<head>`. React skeletons cannot paint before that CDN script. This batch adds a static first-paint splash, a pane skeleton while Office is booting, and busy skeletons on library / results / PDF viewer.

## Shipped

- [`frontend/taskpane.html`](../../frontend/taskpane.html): critical CSS (`#020617`) and splash (sky brand SVG, DocTrace, `Booting / စတင်နေသည်`) inside `#root` before `office.js`. `office.js` is at the end of `<body>`, before the module script. Public [`frontend/index.html`](../../frontend/index.html) is unchanged.
- [`frontend/src/features/shell/components/PaneSkeleton/PaneSkeleton.tsx`](../../frontend/src/features/shell/components/PaneSkeleton/PaneSkeleton.tsx) plus `.dt-skeleton` in [`frontend/src/styles.css`](../../frontend/src/styles.css). Tailwind `animate-pulse` only. No `framer-motion`. No React inline styles.
- [`frontend/src/layouts/AppLayout.tsx`](../../frontend/src/layouts/AppLayout.tsx): while `officeReady` is false, `AppShell` stays (header, Booting badge, tabs); main shows `PaneSkeleton` for every module. Workflow, Engagements, and flag-gated prep modules wait for Office.
- Busy skeletons: Document Library rows when `busyMessage` is set (busy text stays); Results card bars while matching; Viewer PDF overlay is a pulse frame instead of `Loader2` + `backdrop-blur`. Not leftover B, not `CloudSessionPanel`, not Admin, not Backup/Mail/Restore.
- Aria keys in en-US and my-MM: `app.bootSkeletonAria`, `import.busySkeletonAria`, `results.busySkeletonAria`, `viewer.busySkeletonAria`.
- Tests in [`frontend/src/test/pane-boot-skeleton.test.tsx`](../../frontend/src/test/pane-boot-skeleton.test.tsx).

## Known host / fail-closed gaps (open)

- Excel sideload smoke is user-owned (first open should show the DocTrace splash, not a blank black Loading... pane). Leftover B R2/Brevo still wait on team-leader keys.

## Not changed

- Impl 71–98 titles. Matching, OCR, persist, R2, Brevo, `busyMessage` meaning. `framer-motion` is not in the pane graph. Public landing `index.html`. Cloud session leftover-B buttons. No commit until asked. No merge of `development` into `main`. No `samples/` or `scripts/` copy. No tag. No `CHANGELOG.md`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test`. Browser/task pane: splash markup in `taskpane.html`; `officeReady` false shows pane skeleton; library/results/viewer skeleton when busy.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-99.md`
