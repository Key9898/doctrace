import { describe, expect, it } from "vitest";

import {
  clusterLine,
  clusterWord,
  extractTableGrid,
  formatTableSnipText,
  hitTestItem,
} from "@/features/snipping/services/pdf-text-capture";
import type { TextCaptureItem } from "@/features/snipping/services/pdf-text-capture";

function item(
  str: string,
  x: number,
  y: number,
  width = 0.04,
  height = 0.02,
): TextCaptureItem {
  return { str, boundingBox: { x, y, width, height } };
}

describe("pdf text capture", () => {
  it("clusters adjacent same-line fragments into one visual word", () => {
    const items = [
      item("INV", 0.1, 0.2),
      item("-", 0.142, 0.2, 0.01),
      item("100", 0.155, 0.2),
      item("Paid", 0.4, 0.2),
    ];

    const captured = clusterWord(items, items[0]);
    expect(captured?.text).toBe("INV-100");
    expect(captured?.boundingBox.x).toBe(0.1);
    expect(captured?.boundingBox.width).toBeCloseTo(0.095);
  });

  it("stops a word cluster at a large horizontal gap", () => {
    const items = [item("INV", 0.1, 0.2), item("100", 0.4, 0.2)];
    expect(clusterWord(items, items[0])?.text).toBe("INV");
  });

  it("stops a word cluster at a whitespace-only item", () => {
    const items = [
      item("INV", 0.1, 0.2),
      item(" ", 0.145, 0.2, 0.01),
      item("100", 0.16, 0.2),
    ];
    expect(clusterWord(items, items[0])?.text).toBe("INV");
  });

  it("joins a full line with spaces and a union box", () => {
    const items = [
      item("INV", 0.1, 0.25),
      item("100", 0.2, 0.25),
      item("Other", 0.1, 0.5),
    ];

    const captured = clusterLine(items, items[1]);
    expect(captured?.text).toBe("INV 100");
    expect(captured?.boundingBox.x).toBe(0.1);
    expect(captured?.boundingBox.width).toBeCloseTo(0.14);
  });

  it("extracts a 2x3 grid and keeps an empty cell", () => {
    const items = [
      item("A", 0.1, 0.1),
      item("B", 0.3, 0.1),
      item("C", 0.5, 0.1),
      item("D", 0.1, 0.2),
      item("E", 0.5, 0.2),
    ];
    const table = extractTableGrid(items, {
      x: 0.05,
      y: 0.05,
      width: 0.55,
      height: 0.25,
    });

    expect(table?.rowCount).toBe(2);
    expect(table?.columnCount).toBe(3);
    expect(table?.grid).toEqual([
      ["A", "B", "C"],
      ["D", "", "E"],
    ]);
    expect(formatTableSnipText(table?.grid ?? [])).toBe("A | B | C (2x3)");
  });

  it("fails closed on a 1x1 region and on empty items", () => {
    expect(
      extractTableGrid([item("Only", 0.1, 0.1)], {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      }),
    ).toBeNull();
    expect(
      extractTableGrid([], { x: 0, y: 0, width: 1, height: 1 }),
    ).toBeNull();
  });

  it("hit-tests the smallest box containing the point", () => {
    const items = [
      item("wide", 0.1, 0.1, 0.4, 0.1),
      item("tiny", 0.12, 0.12, 0.05, 0.04),
    ];
    expect(hitTestItem(items, 0.14, 0.13)?.str).toBe("tiny");
    expect(hitTestItem(items, 0.9, 0.9)).toBeUndefined();
  });
});
