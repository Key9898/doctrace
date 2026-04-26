# DocTrace Project Rules

## Code and styling

1. Never use inline CSS styles.
2. Use Tailwind utility classes and shared component primitives only.
3. Keep icons on `lucide-react`.
4. Use `framer-motion` for any animation work.
5. Prefer ASCII in source files unless a file already requires Unicode.

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

## Product constraints

1. Optimize for Excel task pane responsiveness first.
2. Build for Windows, Mac, and Excel on the web parity wherever the Office platform allows it.
3. Prefer deterministic and explainable workflows in the MVP.
4. Treat audit traceability as a first-class feature.
