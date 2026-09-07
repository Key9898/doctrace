# Impl 88 — No Media Library; evidence stays in Excel

Source: this batch (2026-09-07). Does not edit Impl 71–87 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical.

No standalone Media Library. Auditor evidence stays in the workbook-local Document Library (Custom XML + IndexedDB cache). The public site does not take uploads. PBC files enter Matching via Import.

## Shipped

- [product-plan.md](../references/product-plan.md): **Public evidence lock** after the Phase 1 document-library bullet. No pane/site/admin Media Library. Site does not take uploads. PBC is Import, not a CMS gallery. Optional Account Backup is a manual copy, not auto-upload on import.
- Code already matches: Document Library + `saveEvidence` Custom XML; IndexedDB cache; `AppLayout` import callers are Matching `DocumentLibraryPanel` and flag-gated `ClientPortal` only. Grep: no `MediaAsset`, `/api/media`, Cloudinary.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. Optional live Backup still waits on working keys. Runtime evidence path unchanged this batch.

## Not changed

- Impl 71–87 titles. `DocumentLibraryPanel`. `workbook-evidence.service`. IndexedDB. PBC intake. CloudSessionPanel Backup/Restore. Site HTML / `copy.ts` / `site.css`. Manifests. BrandMark. Pane header. Embed-off + ZIP. Compress UI. CaseWare-class workpaper OS.
- No commit, no push, no merge, no tag, no `CHANGELOG.md`.

Validate: Prettier on touched markdown. No TSX/TS edits. Grep and `AppLayout` import callers confirmed.

Session (gitignored): `docs/sessions/2026-09-07-session-summary-impl-88.md`
