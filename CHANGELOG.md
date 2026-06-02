# Changelog

## 2026-04-30

- Added a production Office manifest for `https://doctrace-one.vercel.app/` and a dedicated `validate:manifest:prod` script.
- Added Myanmar-first i18n foundations with centralized locale config, locale-aware date/number/currency formatting, a task-pane language switcher, and OCR language selection with English fallback.
- Upgraded Step 4 results review for 1000+ row workflows by rendering match result cards through a deferred, batch-loaded, render-safe list path.
- Deep-scanned and refactored the Viewer/Snip workflow from a last-snip-only interaction into a multi-snip review queue.
- Added duplicate snip prevention, active snip focus/highlighting, and clearer source labels for `PDF text`, `Manual region`, and `Extracted snippet` captures.
- Added PDF blank-region manual snips, image-region snips, and extracted-snippet snips so reviewers can capture evidence even when no PDF text layer is available.
- Redesigned the Snip review panel with captured/linked/open counters, clearer link status, view/link/remove actions, and grouped Excel cell links.
- Persisted snips, snip links, and viewer focus in Browser Preview state so refreshes preserve the review queue.
- Hardened Prettier scripts with explicit file globs so formatting no longer depends on `prettier --write .` behavior.
- Added snip utility tests covering manual bounding boxes and duplicate detection.

## 2026-04-29

- Aligned project rules and product plan with the lightweight native Tailwind/CSS animation direction after removing `framer-motion` from the Excel task pane bundle.
- Added XML-aware Prettier formatting through `@prettier/plugin-xml`, a `.prettierignore`, and a `format:check` gate in the full validation script.
- Wired the main matching flow through a Web Worker service with a safe main-thread fallback, progress reporting, and a 1000-row smoke test for large-workbook matching readiness.
- Fully wired PDF text-layer snipping into the viewer through a lazy-loaded overlay, so PDF text regions can create reviewable snips instead of relying on coordinate-only placeholder snips.
- Hardened browser-mode PDF/image persistence by awaiting raw blob writes before import completion and cleaning stale blob entries when demo documents are reset or removed.
- Reworked task-pane shell sizing away from fixed viewport widths so Browser Preview and Excel WebView hosts can resize more naturally.
- Restored production-facing ribbon labels to `DocTrace` / `Open DocTrace` and bumped the local manifest version to `1.0.0.3`.
- Confirmed the dev server recovery path for `ERR_CONNECTION_REFUSED`: trusted Office certificates are installed and `https://127.0.0.1:3000/` responds successfully when `npm.cmd run dev` is running.

## 2026-04-28

- Fixed PDF/image preview failure (`ERR_FILE_NOT_FOUND`) caused by stale blob URLs after garbage collection or session restore. Raw file data is now persisted in a dedicated IndexedDB `blobs` store and blob URLs are recreated on restore.
- Added favicon link tag to `index.html` to resolve 404 on `/favicon.ico`.
- Updated `PRODUCT_PLAN.md` with production cleanup checklist and template sharing roadmap.

## 2026-04-26

- Revamped the global design system with a premium, modern aesthetic, incorporating glassmorphism (backdrop-blur), refined typography (Outfit font), and a harmonized color palette.
- Fixed critical visibility issues in Light/Dark modes, including the "DocTrace" title visibility and Amber warning box contrast.
- Upgraded the button system to "Pro" level: Primary buttons now use brand-consistent Sky-600/700 for better weight, and secondary buttons feature subtle backgrounds for depth.
- Optimized performance by removing the unused `framer-motion` dependency, significantly reducing bundle size for Excel sidebar constraints. All animations are now handled via lightweight, native Tailwind CSS utilities.
- Achieved 100% Quality Assurance (QA) PASS: Resolved all ESLint errors (unused imports, logical errors in tests) and synchronized Prettier formatting across the entire codebase.
- Implemented "Final Polish" enhancements: Overhauled AppShell with a glassy BrandMark and responsive stats grid (truncate/title), and upgraded the Toast system with full Dark Mode support and visual progress bars.
- Synchronized global vertical gaps across the entire taskpane (44px visual gap between components, gap-3 internal) and unified panel padding (py-4) for a professional, harmonized layout.
- Enhanced all interactive elements with tactile feedback (scaling, hover translations, and refined shadow transitions) for a premium "Pro" software experience.
- Overhauled "Workflow Section" with premium glassmorphism, professional step markers (rounded-2xl), and pulsing success indicators for completed tasks.
- Overhauled "Project Status" (Current Shape) section with glassy articles (2.5rem corners), brand-colored icons (Sky/Emerald), and refined information hierarchy.
- Overhauled "Viewer Pane" with a premium document preview container (deep dark background, 2.5rem corners), glassy metadata cards with icon-driven headers (Sparkles/FileText), and a professional icon-driven empty state.
- Overhauled "Templates Section" with premium glassmorphism, fixing non-standard Dark Mode backgrounds (replaced solid gray with glassy cards) and upgrading inputs with icon-driven headers (Sparkles/Upload).
- Overhauled "Step 4: Results Panel" with color-coded confidence scores, professional evidence inspection cards (Sky/Emerald themes), and a refined information hierarchy for audit trails.
- Upgraded "Step 3: Match Configuration" with a full custom checkbox system, icon-driven section headers, glassmorphism containers, and a redesigned action footer with a glowing status indicator.
- Overhauled "Step 2: Document Library" with premium aesthetics and glassmorphism, fixing non-standard Dark Mode backgrounds and restacking upload cards vertically for better Excel taskpane compliance.
- Upgraded the "Step 1: Selection Panel" with a custom-styled checkbox system (glow effects, "Enabled" labels), refined header card contrast, and a professional icon-driven empty state.
- Overhauled the Excel Diagnostics panel with premium aesthetics, fixing non-standard background colors in Dark Mode and grouping metrics into logical, icon-driven sections.
- Enhanced the "Live Activity" empty state with a professional layout and icon-driven hierarchy.
- Standardized layout spacing across the task pane and improved visual depth for stats boxes using refined shadows and borders.
- Forced class-based Dark Mode strategy in Tailwind CSS for more reliable theme switching.
- Promoted the latest Excel verification marker to `dev-2026-04-26-a`.

## 2026-04-25

- Rotated the local development manifest ID, bumped the manifest version to `1.0.0.2`, and promoted the Excel verification marker to `dev-2026-04-25-b` so Excel can be forced to sideload a fresh DocTrace identity instead of a stale cached add-in.
- Temporarily labeled the local verification ribbon command as `Open DocTrace B` so stale Excel buttons can be distinguished from the current sideloaded manifest.
- Added an in-task-pane Excel diagnostics smoke-test panel and promoted the verification marker to `dev-2026-04-25-c` so Excel WebView width, native click delivery, React click handling, and `Excel.run` availability can be verified without relying on DevTools.
- Promoted the diagnostics marker to `dev-2026-04-25-d` and moved click/`Excel.run` status directly under the smoke-test buttons so Excel task pane interaction results are visible without scrolling to the log.
- Promoted the latest Excel verification marker to `dev-2026-04-25-a`.
- Added a WebView-safe ID generator and replaced `crypto.randomUUID()` usage so Excel Desktop runtimes without that API cannot silently break clicks, toasts, activity logs, document imports, templates, or matching rows.
- Removed remaining `.at(...)`, `matchAll`, `flatMap`, and `Object.fromEntries` usage from parser, Excel, and matching paths to reduce runtime compatibility risk in embedded Excel WebView hosts.
- Hardened task-pane viewport sizing with `100vw`/`100dvw` shell widths so resizing the Excel sidebar can expand the usable DocTrace UI instead of leaving a blank right gutter.
- Updated the manifest version to `1.0.0.1` and changed the Office manifest description away from the old DataSnipper wording to reduce stale first-run notification confusion after sideload refresh.
- Verified the patch with targeted Prettier, ESLint, TypeScript, manifest validation, and production build.

## 2026-04-23

- Initialized the DocTrace repository structure and engineering rules.
- Added Phase 0 and Phase 1 planning documents.
- Began scaffolding the Excel add-in workspace and local-first audit workflow foundation.
- Flattened the repository into a single-app root structure with `src/` at the project root.
- Moved session summary tracking into `docs/last_session_summary.md`.
- Completed the Phase 0 and Phase 1 root scaffold with Excel task pane UI, Office manifest, OCR/PDF parsing, deterministic matching, templates, and audit log services.
- Verified formatting, linting, type checking, and production build after lazy-splitting heavy document-processing code.
- Added JSON evidence import support for structured document payloads and JSON bundles with multiple documents.
- Added Excel-side output column mapping so each enabled result field can target a specific worksheet column.
- Added Office add-in manifest validation tooling, runtime logging helper scripts, sample JSON evidence files, and cross-platform testing docs.
- Verified full project validation including manifest validation and confirmed `npm audit --omit=dev` returns zero production vulnerabilities.
- Replaced Vite `basicSsl` with trusted `office-addin-dev-certs` HTTPS setup so `npm run dev` provisions Office-friendly localhost certificates automatically.
- Added a browser-preview fallback for Office boot state and refreshed Windows sideload docs for Excel task pane testing.
- Locked Vite dev and HMR traffic to port `3000` with `strictPort` so the Excel manifest cannot drift to a different localhost port during local testing.
- Fixed Excel task pane boot detection by combining `Office.initialize`, `Office.onReady`, and host probing so the sidebar no longer stays stuck in `Booting`.
- Added direct `Excel.run` workbook probing during startup so the task pane can detect a live Excel host even when Office host metadata arrives late.
- Moved Office host detection into the application bootstrap stage before React render, removing the effect-timing race that could leave the Excel sidebar stuck in `Booting`.
- Inlined the task pane brand mark so the header logo renders reliably inside the Excel webview instead of depending on a separate lazy-loaded asset request.
- Moved the interactive selection, import, and mapping panels above the workflow status cards so the task pane opens directly on usable controls instead of static overview content.
- Converted workflow cards into clickable in-pane navigation so `Step 1` through `Step 4` now jump to the real interactive sections instead of acting like static status tiles.
- Replaced label-based hidden file uploads with explicit button-triggered file pickers and added direct bundled JSON sample loaders for Excel webviews where file dialogs are unreliable.
- Expanded the bundled sample JSON evidence to cover three matching rows and duplicated the files into a top-level `samples/` folder so local Excel testing has ready-to-use invoice and bank datasets.
- Added a persistent in-pane `Live activity` feed so Excel-side actions and failures remain visible even when toast messages are easy to miss inside the task pane.
- Instrumented selection capture, sample import, template actions, viewer focus, and matching with explicit success/error activity events instead of silent no-ops.
- Added a one-click `Prepare demo workspace` flow that seeds a dedicated `DocTrace Demo` worksheet in Excel, captures the sample range, and loads bundled invoice and bank evidence automatically.
- Replaced evidence upload triggers with native visible file inputs to improve PDF, image, and JSON importing reliability inside Excel's embedded webview.
- Tightened narrow-sidebar responsive layout behavior so section headers, action buttons, and mapping controls no longer feel cramped in the Excel task pane.
- Added runtime error and unhandled-promise diagnostics so unexpected client-side failures surface in both toast notifications and the new activity feed.
- Revalidated the patched Excel-sidebar interaction build with `npm.cmd run format`, `npm.cmd run lint`, `npx tsc --noEmit`, and `npm.cmd run build`.
- Removed the bundled-sample network dependency by embedding the invoice and bank JSON demo payloads directly in the app bundle, so sample-loading actions no longer depend on Excel webview fetch behavior.
- Promoted the latest Excel test marker to `dev-2026-04-23-e` for clean host-side verification after the bundled sample import fix.
- Fixed the first-open blank task pane by rendering React immediately and resolving Office readiness asynchronously instead of blocking the initial paint on Office bootstrap.
- Added a local demo-selection fallback for `Prepare demo workspace` so the sidebar still populates with sample rows and evidence even if Excel worksheet seeding fails inside the host.
- Promoted the latest Excel verification marker to `dev-2026-04-23-f` after the blank-pane and demo-workspace fallback fixes.
- Reworked `Prepare demo workspace` to update the sidebar immediately with local demo data before attempting Excel host synchronization, removing the previous dead-no-op behavior when `Excel.run(...)` stalled.
- Added timeout guards around demo worksheet seeding and Excel recapture so the add-in falls back to the local demo state instead of appearing frozen.
- Promoted the latest Excel verification marker to `dev-2026-04-23-g` for the immediate local-demo and timeout-guard fixes.
- Reduced Office boot fallback timing and added an immediate Office-context short-circuit so the sidebar exits `Booting` faster in browser preview and Excel host detection.
- Added a resilient system file picker helper plus native input fallback so evidence import no longer depends on a single Office-webview file-input path.
- Added disabled/loading states to selection, import, config, and template actions so the sidebar shows active work instead of feeling static during parsing and matching.
- Hardened PDF loading with explicit worker initialization errors, switched OCR to a reusable Tesseract worker, and fixed selection-sync cleanup to avoid late-registration leaks.
- Fixed corrupted display glyphs by replacing misencoded separators and empty-value placeholders with ASCII-safe labels.
- Added JSON file validation for template imports and promoted the latest Excel verification marker to `dev-2026-04-23-h`.
- Replaced the PDF.js `workerPort` setup with a `workerSrc` URL so `pdfjs-dist@5` can initialize more reliably inside Vite and Excel WebView hosts.
- Removed the last bundled-sample `fetch(...)` fallback so quick sample loading now uses embedded invoice/bank JSON payloads only.
- Promoted the latest Excel verification marker to `dev-2026-04-24-a`.
- Made toast notifications click-through so stacked status messages cannot block buttons inside the narrow Excel task pane.
- Made evidence preview actions scroll the task pane to the viewer so `Preview` has visible feedback immediately.
- Enforced `requireInvoiceNumber` in the matching engine and fixed output-column header lookup to use the captured header row.
- Promoted the latest Excel verification marker to `dev-2026-04-24-b`.
- Hardened Office startup fallback so Excel task panes cannot remain stuck in `Booting` after an Office readiness exception.
- Forced the main task pane into a single-column tool layout and simplified output-field rendering to avoid Excel WebView breakpoint/layout glitches.
- Promoted the latest Excel verification marker to `dev-2026-04-24-c`.
- Added a native event bridge for quick-start actions so Excel WebView click delegation issues do not block demo, sample import, capture, or mapping buttons.
- Promoted the latest Excel verification marker to `dev-2026-04-24-d`.
- Restored normal button `onClick` handlers alongside the native Excel WebView bridge so cursor and click semantics remain correct.
- Restored responsive task-pane content width with a bounded max width so resizing the pane expands the usable UI instead of leaving a blank right gutter.
- Promoted the latest Excel verification marker to `dev-2026-04-24-e`.
- Removed the Office `GetStarted` teaching callout from the manifest because the Excel first-run overlay can intercept task pane clicks during local sideload testing.
