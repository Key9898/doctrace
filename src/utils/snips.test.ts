import { describe, expect, it } from "vitest";

import {
  areSnipBoundingBoxesNear,
  buildManualSnipBoundingBox,
  isDuplicateSnip,
} from "./snips";
import type { Snip } from "@/types/domain";

describe("snip utilities", () => {
  it("keeps manual snip boxes inside the page", () => {
    expect(buildManualSnipBoundingBox(5, 5, 200, 100)).toEqual({
      x: 0,
      y: 0,
      width: 180,
      height: 52,
    });

    expect(buildManualSnipBoundingBox(500, 500, 200, 100)).toEqual({
      x: 20,
      y: 48,
      width: 180,
      height: 52,
    });
  });

  it("detects equivalent bounding boxes with a small tolerance", () => {
    expect(
      areSnipBoundingBoxesNear(
        { x: 10, y: 20, width: 100, height: 24 },
        { x: 14, y: 23, width: 103, height: 25 },
      ),
    ).toBe(true);
  });

  it("detects duplicate snips for the same document, page, text, and region", () => {
    const first = buildSnip("Invoice 123", 10, 20);
    const second = buildSnip("  invoice   123  ", 12, 22);
    const third = buildSnip("Invoice 456", 12, 22);

    expect(isDuplicateSnip(first, second)).toBe(true);
    expect(isDuplicateSnip(first, third)).toBe(false);
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
      width: 100,
      height: 24,
    },
    createdAt: "2026-04-29T00:00:00.000Z",
  };
}
