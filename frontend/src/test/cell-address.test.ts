import { describe, expect, it } from "vitest";

import {
  a1FromIndexes,
  a1RangeFromOrigin,
  cellIsInsideRange,
  parseA1Cell,
  parseA1Range,
  snipLinkIntersectsBlock,
} from "@/features/office/services/cell-address";

describe("cell address", () => {
  it("parses A1 cells and ranges", () => {
    expect(parseA1Cell("B12")).toEqual({ rowIndex: 11, columnIndex: 1 });
    expect(parseA1Cell("Sheet1!$AA$2")).toEqual({
      rowIndex: 1,
      columnIndex: 26,
    });
    expect(a1FromIndexes(11, 1)).toBe("B12");
    expect(a1RangeFromOrigin("B12", 4, 6)).toBe("B12:G15");
    expect(parseA1Range("B12:G15")).toEqual({
      rowIndex: 11,
      columnIndex: 1,
      rowCount: 4,
      columnCount: 6,
    });
  });

  it("detects matrix containment and intersecting snip links", () => {
    expect(
      cellIsInsideRange(
        { rowIndex: 12, columnIndex: 2 },
        { rowIndex: 11, columnIndex: 1, rowCount: 4, columnCount: 6 },
      ),
    ).toBe(true);
    expect(
      cellIsInsideRange(
        { rowIndex: 0, columnIndex: 0 },
        { rowIndex: 11, columnIndex: 1, rowCount: 4, columnCount: 6 },
      ),
    ).toBe(false);
    expect(
      snipLinkIntersectsBlock(
        { sheetName: "Sheet1", cellAddress: "C13", rangeAddress: "C13:D14" },
        "Sheet1",
        "B12",
        4,
        6,
      ),
    ).toBe(true);
    expect(
      snipLinkIntersectsBlock(
        { sheetName: "Other", cellAddress: "B12" },
        "Sheet1",
        "B12",
        4,
        6,
      ),
    ).toBe(false);
  });

  it("places form value cells on origin column + 1", () => {
    const origin = parseA1Cell("D20");
    expect(origin).toEqual({ rowIndex: 19, columnIndex: 3 });
    expect(a1FromIndexes(origin!.rowIndex, origin!.columnIndex + 1)).toBe(
      "E20",
    );
    expect(a1FromIndexes(origin!.rowIndex + 1, origin!.columnIndex + 1)).toBe(
      "E21",
    );
  });
});
