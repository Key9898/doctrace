# Code conventions

See also root [AGENTS.md](../../AGENTS.md) and [handoff](handoff.md).

## Styling

- No inline CSS. Tailwind utilities and shared primitives only.
- Icons from `lucide-react`.
- Do not add `framer-motion` unless a future phase explicitly approves it.
- Lightweight Tailwind/CSS animation only.
- Prefer ASCII in source files unless a file already requires Unicode.
- Locale, date, number, currency, and OCR language live in `frontend/src/lib/i18n/` and formatters.

## Structure

- Feature UI: `frontend/src/features/<slice>/components/*ComponentName*/`
- Feature services: `frontend/src/features/<slice>/services/`
- Shared helpers: `frontend/src/lib/`
- Store: `frontend/src/stores/app-store.ts` (`useDocTraceStore`)
- Composition: `frontend/src/app/useDocTraceController.ts`
- Layout: `frontend/src/layouts/AppLayout.tsx`
- No feature barrel files
- Demo mocks: `frontend/src/demo/mocks/`
- Optional API: `backend/` (Node, port 3001, HTTPS when office-addin-dev-certs exist). Secrets stay off `VITE_` names. Empty `VITE_API_URL` keeps the task pane local-first.
