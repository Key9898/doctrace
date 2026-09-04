# Impl 12 — i18n, prod manifest, snip queue, large results

Source: CHANGELOG 2026-04-30; git `81125ba` (2026-06-02 i18n/prod tooling).

- Production Office manifest for `https://doctrace-one.vercel.app/` and `validate:manifest:prod`
- Myanmar-first i18n: locale config, locale-aware date/number/currency, task-pane language switcher, OCR language with English fallback
- Step 4 results for 1000+ rows: deferred, batch-loaded, render-safe list
- Viewer/Snip changed from last-snip-only to a multi-snip review queue
- Duplicate snip prevention, active snip focus, source labels (`PDF text`, `Manual region`, `Extracted snippet`)
- PDF blank-region, image-region, and extracted-snippet snips
- Snip panel counters, link status, view/link/remove, grouped Excel cell links
- Persist snips, snip links, and viewer focus in Browser Preview
- Prettier scripts use explicit file globs
- Snip utility tests for manual bounding boxes and duplicate detection

Session (gitignored): `docs/sessions/2026-04-30-session-summary.md`
