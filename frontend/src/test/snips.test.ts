import { describe, expect, it } from "vitest";

import {
  areSnipBoundingBoxesNear,
  boxToPagePixels,
  buildManualSnipBoundingBox,
  hasRealSnipGeometry,
  isDuplicateSnip,
  isNormalizedBox,
  nextInspectionEpoch,
  toNormalizedBox,
} from "@/features/snipping/services/snips";
import type { Snip } from "@/types/domain";

describe("snip utilities", () => {
  it("stores manual snip boxes as page fractions", () => {
    const topLeft = buildManualSnipBoundingBox(5, 5, 200, 100);
    expect(isNormalizedBox(topLeft)).toBe(true);
    expect(topLeft.x).toBe(0);
    expect(topLeft.width).toBeCloseTo(0.28);
    expect(topLeft.height).toBeCloseTo(0.08);

    const bottomRight = buildManualSnipBoundingBox(500, 500, 200, 100);
    expect(bottomRight.x + bottomRight.width).toBeCloseTo(1);
    expect(bottomRight.y + bottomRight.height).toBeCloseTo(1);
  });

  it("detects equivalent normalized boxes", () => {
    expect(
      areSnipBoundingBoxesNear(
        { x: 0.1, y: 0.2, width: 0.3, height: 0.1 },
        { x: 0.11, y: 0.21, width: 0.31, height: 0.11 },
      ),
    ).toBe(true);
  });

  it("detects equivalent legacy pixel boxes", () => {
    expect(
      areSnipBoundingBoxesNear(
        { x: 10, y: 20, width: 100, height: 24 },
        { x: 14, y: 23, width: 103, height: 25 },
      ),
    ).toBe(true);
  });

  it("converts legacy PDF pixels when the render scale changes", () => {
    const drawn = boxToPagePixels(
      { x: 15, y: 30, width: 45, height: 15 },
      1200,
      1600,
      { currentPdfRenderScale: 3 },
    );

    expect(drawn.x).toBe(30);
    expect(drawn.y).toBe(60);
    expect(drawn.width).toBe(90);
    expect(drawn.height).toBe(30);
  });

  it("converts current-page pixels into normalized boxes", () => {
    expect(
      toNormalizedBox({ x: 50, y: 25, width: 100, height: 50 }, 200, 100),
    ).toEqual({
      x: 0.25,
      y: 0.25,
      width: 0.5,
      height: 0.5,
    });
  });

  it("detects duplicate snips for the same document, page, text, and region", () => {
    const first = buildSnip("Invoice 123", 0.1, 0.2);
    const second = buildSnip("  invoice   123  ", 0.11, 0.21);
    const third = buildSnip("Invoice 456", 0.11, 0.21);

    expect(isDuplicateSnip(first, second)).toBe(true);
    expect(isDuplicateSnip(first, third)).toBe(false);
  });

  it("treats table snips as duplicates by grid, not summary text", () => {
    const first = {
      ...buildSnip("A | B (2x2)", 0.1, 0.2),
      sourceType: "pdf-table" as const,
      grid: [
        ["A", "B"],
        ["C", "D"],
      ],
    };
    const sameGrid = {
      ...buildSnip("other label", 0.11, 0.21),
      sourceType: "pdf-table" as const,
      grid: [
        ["A", "B"],
        ["C", "D"],
      ],
    };
    const differentGrid = {
      ...buildSnip("A | B (2x2)", 0.11, 0.21),
      sourceType: "pdf-table" as const,
      grid: [
        ["A", "B"],
        ["C", "E"],
      ],
    };

    expect(isDuplicateSnip(first, sameGrid)).toBe(true);
    expect(isDuplicateSnip(first, differentGrid)).toBe(false);
  });

  it("treats word, line, and table source types as real geometry", () => {
    expect(hasRealSnipGeometry({ sourceType: "pdf-word" })).toBe(true);
    expect(hasRealSnipGeometry({ sourceType: "pdf-line" })).toBe(true);
    expect(hasRealSnipGeometry({ sourceType: "pdf-table" })).toBe(true);
  });

  it("increments inspection epoch from zero", () => {
    expect(nextInspectionEpoch(undefined)).toBe(1);
    expect(nextInspectionEpoch(4)).toBe(5);
  });
});

function buildSnip(text: string, x: number, y: number): Snip {
  return {
    id: `snip-${text}`,
    documentId: "doc-1",
    fileName: "invoice.pdf",
    pageNumber: 1,
    text,
    boundingBox: {
      x,
      y,
      width: 0.2,
      height: 0.1,
    },
    createdAt: "2026-04-29T00:00:00.000Z",
  };
}
