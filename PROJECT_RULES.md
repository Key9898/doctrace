# DocTrace Project Rules

## Code and styling

1. Never use inline CSS styles.
2. Use Tailwind utility classes and shared component primitives only.
3. Keep icons on `lucide-react`.
4. Do not add `framer-motion` to the Excel task pane bundle unless a future phase explicitly approves it.
5. Use lightweight Tailwind/CSS animations for motion so the Excel sidebar stays fast on Windows, Mac, and Web.
6. Prefer ASCII in source files unless a file already requires Unicode.
7. Keep locale, date, number, currency, and OCR-language behavior centralized in `src/i18n/` and formatter utilities instead of hardcoding regional assumptions.

## Collaboration and edits

1. Mind Your Own Business: only edit what the task requires.
2. Do not regress working UI, UX, logic, or functions outside the assigned scope.
3. Prefer modular components under `src/components/*ComponentName*/`.
4. Keep reusable logic in `src/hooks/`.
5. Keep side-effect services in `src/services/`.
6. Keep pure helpers in `src/utils/`.
7. Keep demo/mock data in `src/demo/mocks/`.

## Quality gates

1. Update `CHANGELOG.md` after each meaningful change batch.
2. Update `docs/last_session_summary.md` after each meaningful change batch.
3. Run Prettier, ESLint, and TypeScript validation before concluding work when possible.
4. Never commit generated noise, local certificates, or runtime caches.
5. Keep `.gitignore` current from day one.
6. Keep `manifest.xml` XML-formatted through the project Prettier configuration.
7. Validate both `manifest.xml` and `manifest.production.xml` before any release or sideload handoff.

## Product constraints

1. Optimize for Excel task pane responsiveness first.
2. Build for Windows, Mac, and Excel on the web parity wherever the Office platform allows it.
3. Prefer deterministic and explainable workflows in the MVP.
4. Treat audit traceability as a first-class feature.
5. Keep Browser Preview showcase-ready whenever Excel licensing or host issues block live sideload testing.
6. Keep Myanmar supported as a first-class locale while preserving English fallback behavior for international audit teams.
