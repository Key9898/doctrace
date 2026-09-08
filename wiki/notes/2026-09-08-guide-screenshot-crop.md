# Impl 104 — Guide screenshot black-bar crop

Source: this batch (2026-09-08). Does not edit Impl 71–103 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 104 (not 107).

Guide figures had a dark strip at the bottom. That was not CSS. Two capture leftovers sat in the PNGs:

1. `taskpane.html` boot background `#020617` below `.dt-shell` (captures were 919–1080 tall; light pane ended near y=899).
2. Matching navy viewer dock and hard crops through card drop-shadows a few rows above the last light pixels, so a "last row is light" crop missed them.

## Shipped

- Cropped the eight files in [`frontend/public/assets/guide/`](../../frontend/public/assets/guide/) so the last 80px contain no near-black rows (luminance under 60). Width is 375. Heights:

  | File              | Height |
  | ----------------- | ------ |
  | `shell.png`       | 520    |
  | `engagements.png` | 814    |
  | `select.png`      | 888    |
  | `import.png`      | 900    |
  | `match.png`       | 864    |
  | `snip.png`        | 900    |
  | `review.png`      | 838    |
  | `account.png`     | 889    |

- [`frontend/guide.html`](../../frontend/guide.html) `width`/`height` match those IHDR values.
- `.site-figure` `overflow-hidden`, `line-height: 0`, zero padding, transparent background so the bitmap sits flush above the caption.
- [`frontend/src/test/site-pages-i18n.test.ts`](../../frontend/src/test/site-pages-i18n.test.ts) asserts the same IHDR heights.

## Not changed

- Impl 71–103 titles. Rows 105–106 stay TB listing / Selection preview. Guide TOC/layout copy. Pane React. `taskpane.html` boot color (needed for Impl 99 splash). Landing TRACE. No commit.

Validate: Prettier. ESLint on the test file. `tsc --noEmit`. `npm test` (365 passed). Browser `/guide.html` figures have no black footer.

Session (gitignored): `docs/sessions/2026-09-08-session-summary-impl-104.md`
