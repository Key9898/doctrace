# Impl 115 — Guide TOC scroll spy

Source: this batch (2026-09-09). Does not edit Impl 71–114 row text. Excel task pane is the quality bar. Browser Preview is showcase-only. Do not claim DataSnipper-identical. This is Impl 115. Do not reuse 114.

Guide sidebar `aria-current` now follows the chapter at the sticky-header marker (scroll-margin `5.5rem`), not an IntersectionObserver ratio band. That band lagged on short chapters 07–10 and never lifted Local sideload into the sensor.

## Shipped

- [`frontend/site/guide-toc.ts`](../../frontend/site/guide-toc.ts): `GUIDE_SECTION_IDS` (same 15 ids, Matching nested leaves included). `pickGuideSectionId` walks document order; last heading with `top <= markerY + 1` (1px epsilon for subpixel hash/scroll). `pinLast` returns `guide-local` only when the last heading cannot reach the marker.
- [`frontend/site/site.ts`](../../frontend/site/site.ts) `bindGuideToc()`: Guide `IntersectionObserver` removed (`bindStuckHeader` unchanged). Window `scroll`/`resize` (`passive: true`) plus one `requestAnimationFrame`. Marker from `scrollMarginTop`. `pinLast` only when `scrollY > 0`, at max scroll, and last `top > marker`. Click sets current and does not spy in the same turn. Hash/load: set current then one rAF spy. Active row clipped in `nav.site-toc` moves `scrollTop` on the nav only (no `link.scrollIntoView`).
- [`frontend/src/test/site-guide-toc.test.ts`](../../frontend/src/test/site-guide-toc.test.ts): lead, chrome at marker+0.4px, nested Select, pinLast vs walk, id list ends chrome/cloud/assist/local.

## Known host / fail-closed gaps (open)

- Excel sideload was not run. OTP mail and cloud backup are still not live. On a tall viewport, 09 AI assist cannot physically reach the marker; max-scroll `pinLast` shows 10, which is intended.

## Not changed

- Impl 71–114 titles. Guide copy, ids, TOC 01–10 labels, screenshots, `.site-guide` grid. FAQ, pane, header stuck/rest, TRACE, tick on TOC index. `html { scroll-behavior }`. No commit until asked. No merge of `development` into `main`.

Validate: Prettier, ESLint, `tsc --noEmit`, `npm test` (374 passed). Browser `/guide.html` desktop: Select, 06–08, click 10 stays 10, page end 10, MY labels. 390px: 07, 08, 10 current and visible in the TOC.

Session (gitignored): `docs/sessions/2026-09-09-session-summary-impl-115.md`
