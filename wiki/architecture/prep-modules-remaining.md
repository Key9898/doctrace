# Prep modules remaining

Living list for Trial Balance, Audit Workpapers, and Client PBC Portal on `main` and `development`. Product thesis stays in [product-plan.md](../references/product-plan.md). Impl history stays in [implementation-phases.md](implementation-phases.md) (last numbered Impl is 95).

This is **not** a product phase number. It is not Phase 2 cloud. It is not Phase 4. EZAI Phase 4 stays regional SaaS. Leftover A–D (including leftover B) stays in [phase1-integration-remaining.md](phase1-integration-remaining.md). Team and cloud stays in [phase2-remaining.md](phase2-remaining.md). Phase 3 stays in [phase3-remaining.md](phase3-remaining.md).

ISA-oriented, not ISA-certified. PBC intake then TB sample then Matching ToD then workpaper documentation (ISA 230-oriented). Human review before file sign-off. No DataSnipper-identical claim. No CaseWare-class workpaper OS.

Status: **scaffold** = mock UI exists behind an empty-by-default flag. **open** = not wired yet.

## Scaffold

Code exists. Mock only. Hidden unless `VITE_SHOW_PREP_MODULES` is non-empty.

- **Flag-gated mocks (Impl 44):** `frontend/src/features/trial-balance`, `workpapers`, and `pbc-portal`. Empty or whitespace hides them (showcase and client drop). Do not set the flag on Vercel. Do not gate on localhost or the DEV badge. Not a git `phase-2` branch.
- **Local env on (this machine, Impl 61):** gitignored root `.env` `VITE_SHOW_PREP_MODULES=1`. Vite restarted. Committed `.env.example` stays empty. Not Vercel. Vitest pins the flag empty so unit tests keep the two-tab contract.
- **PBC into Import (Impl 62):** ToD invoice and bank PDF / image / JSON from Client Portal call existing Matching `importPickedDocuments`. List-only stays on the request list: confirmations (ISA 505), minutes, ledgers, trial balance, and `.xlsx`. Completeness is correct routing, not stuffing every row into Import. Remove on the PBC list does not delete Matching library documents.
- **TB sample into Matching (Impl 63):** two `.xlsx` parses (TB accounts + detail listing), F/S lead mapping, auditor ticks, then Zustand `selection` for Matching Step 1. Listing files do not enter Matching Import. Debit-equals-credit and tie-out are visible only. Mapping is by account code, not filtered-row index.
- **ToD into workpaper sign-off (Impl 64):** Matching Review Send snapshots results and snip metadata onto the engagement. First send replaces the fake workpaper list. File sign-off is blocked while partial/exception rows lack a live row sign-off. Follow-up is visible only. No Excel file-level log. Dashboard counts stay placeholders.
- **TB chrome i18n (Impl 65):** Trial Balance UI chrome is `tb.*` in `en-US` and `my-MM`. Kicker and title mojibake removed. Debit-equals-credit helper is visible only and does not claim Send is blocked. Mock account names and F/S group strings stay English lead keys.
- **Workpapers chrome i18n (Impl 66):** Workpapers UI chrome is `wp.*` in `en-US` and `my-MM`. Kicker and title mojibake removed. Pack Sign gate and snapshot stay as Impl 64. Mock workpaper names, authors, and note bodies stay English.
- **PBC chrome i18n (Impl 67):** Client PBC UI chrome is `pbc.*` in `en-US` and `my-MM`. Kicker and title mojibake removed. Impl 62 intake keys unchanged. Mock request `item`, `fileName`, `dueDate`, and stored `category` stay English. Category chips and status badges are display-only maps.
- **Minutes to workpaper (Impl 68):** PBC minutes with a file name appear on Workpapers as an engagement sibling link (`pbcMinutesLinks`). They stay list-only and do not enter Matching Import or `TodWorkpaperPack`. Pack re-send does not clear the link. File Sign stays Impl 64. Mock `item` / `fileName` stay English.
- **Dashboard workpaper counts (Impl 69):** Engagements workpaper tile is live ToD pack file sign-off (`0/0`, `0/1`, `1/1`). Match rows and PBC minutes links are not counted. Notes and PBC dashboard tiles stay mock.
- **PBC Remove to library delete (Impl 70):** ToD PBC Remove deletes Matching library documents by stored import ids from that row. List-only Remove (ledger, confirmation, minutes, TB, `.xlsx`) does not call library delete. Ids stay on the Client Portal request, not the engagement. Leftover Import after remount is Matching Remove.
- **Engagements placeholders:** workpaper tile is live pack file sign-off. Notes and PBC dashboard tiles stay mock.

## Open

Nothing remaining on this prep-module list. Do not reserve later Impl numbers here.

Notes and PBC dashboard tiles stay mock (Scaffold Engagements placeholders). They are not a new numbered Impl.

## Not this list

- Leftover B live R2 PutObject / Brevo (Phase 1 tracker).
- Phase 2 public host, live firm auth, live GET-restore, admin, organization templates.
- Phase 3 live LLM: [phase3-remaining.md](phase3-remaining.md). Account not-live chrome is Impl 58 / 94.
- ISA 505 confirmation portal. ISA 580 representation letters.
- CaseWare-class workpaper OS.
- `VITE_SHOW_PREP_MODULES` on Vercel. Merge of the `development` tip into `main` (would bring `samples/` and `scripts/`).
