# Impl 10 — IndexedDB blobs and favicon

Source: CHANGELOG 2026-04-28; git `013a214` (2026-04-27 favicon).

- Fixed PDF/image preview `ERR_FILE_NOT_FOUND` from stale blob URLs after GC or session restore
- Raw file data persisted in IndexedDB `blobs`; blob URLs recreated on restore
- Favicon link in `index.html` to resolve `/favicon.ico` 404
- Product plan updated with production cleanup checklist and template sharing roadmap (now `wiki/references/product-plan.md`)

Session (gitignored): `docs/sessions/2026-04-28-session-summary.md`
