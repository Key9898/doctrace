# DocTrace Project Rules

## Code and styling

1. Never use inline CSS styles.
2. Use Tailwind utility classes and shared component primitives only.
3. Keep icons on `lucide-react`.
4. Do not add `framer-motion` to the Excel task pane bundle unless a future phase explicitly approves it.
5. Use lightweight Tailwind/CSS animations for motion so the Excel sidebar stays fast on Windows, Mac, and Web.
6. Prefer ASCII in source files unless a file already requires Unicode.
7. Keep locale, date, number, currency, and OCR-language behavior centralized in `frontend/src/lib/i18n/` and formatter utilities instead of hardcoding regional assumptions.
8. Keep API secrets in `backend/` env files. Never prefix secrets with `VITE_`. Empty `VITE_API_URL` means the task pane stays local-first.

## Collaboration and edits

1. Mind Your Own Business: only edit what the task requires.
2. Do not regress working UI, UX, logic, or functions outside the assigned scope.
3. Keep feature UI under `frontend/src/features/<slice>/components/*ComponentName*/`.
4. Keep feature side-effect services under `frontend/src/features/<slice>/services/`.
5. Keep shared pure helpers and i18n in `frontend/src/lib/`.
6. Keep Zustand state in `frontend/src/stores/`.
7. Keep composition in `frontend/src/app/` and shell layout in `frontend/src/layouts/`.
8. Do not add feature barrel `index.ts` files. Import files directly.
9. Keep demo/mock data in `frontend/src/demo/mocks/`.

## Git branches

Keep both long-lived branches. Solo: merge only when asked. Do not open a GitHub pull request. Ignore the Compare & pull request banner (`development` can stay ahead of `main`).

1. Daily work is `development`. After any `main` edit, check out `development` again.
2. Client drop path is `main` plus a version tag at drop time. Do not tag until a client drop is requested. `v0.1.0` is not tagged yet.
3. Never name a git branch `phase-N`. Wiki phases are not git branches. Do not recreate `phase-2` or `legacy-saas-mocks`.
4. Do not merge `development` into `main` while prep-module commit `d7f47c6` (or later prep-module work) is on `development`. That merge would put Trial Balance, Workpapers, and Client PBC files on `main`.
5. `main` has the local-first add-in from `33b4cab` (merge `cac3878`). It must not contain `d7f47c6`. `AppModule` on `main` is matching and engagements only.
6. To update `main` without prep-module files, copy or cherry-pick commits that do not introduce those features. Do not merge the `development` tip.
7. Prep-module mocks live on `development` only, behind empty-by-default `VITE_SHOW_PREP_MODULES`. Do not set that variable on Vercel. Empty `VITE_API_URL` keeps the task pane local-first.
8. Vercel production must deploy `main`. Do not point production at `development`.

## Quality gates

1. After each meaningful change batch, do all four: an Impl row in `wiki/architecture/implementation-phases.md`, a note in `wiki/notes/`, a gitignored session summary in `docs/sessions/`, and a Lark Task in the chat reply (see Handoff output below). Skip none of these.
2. Do not write `CHANGELOG.md` or a last-session file as the source of truth.
3. Run Prettier, ESLint, and TypeScript validation before concluding work when possible.
4. Never commit generated noise, local certificates, runtime caches, or `docs/sessions/`.
5. Keep `.gitignore` current from day one.
6. Keep `manifest.xml` XML-formatted through the project Prettier configuration.
7. Validate both `manifest.xml` and `manifest.production.xml` before any release or sideload handoff.

## Handoff output

After the four quality-gate items above, the chat reply must include one Lark Task the user can copy in a single click.

Rules:

1. Put the entire Lark Task inside one markdown fenced code block (triple backticks) so the UI shows a copy button. Do not split Title, Notes, Wiki, or Session across multiple blocks or plain paragraphs.
2. Do not put this Lark Task block into committed wiki notes. Wiki + session files stay the written record; the Lark Task is chat-only for the user to paste.
3. Use the next Impl number from `wiki/architecture/implementation-phases.md`. Title form: `Impl N — <short what changed>`.
4. Notes are short bullets (what shipped, what did not change, validate/test status, commit status). Include Wiki and Session paths.

Exact shape inside the single fence:

```
=== LARK TASK — COPY FROM BELOW THIS LINE ===
Title: Impl N — <short what changed>

Notes:
- <bullet>
- <bullet>

Wiki: wiki/notes/YYYY-MM-DD-<slug>.md
Session: docs/sessions/YYYY-MM-DD-session-summary.md
=== LARK TASK — COPY UNTIL ABOVE THIS LINE ===
```

Same-day extra Impls use `docs/sessions/YYYY-MM-DD-session-summary-impl-NN.md` as already used in the phases table.

## Product constraints

1. Optimize for Excel task pane responsiveness first.
2. Build for Windows, Mac, and Excel on the web parity wherever the Office platform allows it.
3. Prefer deterministic and explainable workflows.
4. Treat audit traceability as a first-class feature.
5. Keep Browser Preview showcase-ready whenever Excel licensing or host issues block live sideload testing.
6. Keep Myanmar supported as a first-class locale while preserving English fallback behavior for international audit teams.
