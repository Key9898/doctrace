import { afterEach, describe, expect, it, vi } from "vitest";

import {
  SNIP_UNDO_TTL_MS,
  clearStash,
  patchStash,
  resetSnipUndoForTests,
  setStash,
  takeStash,
} from "@/features/snipping/services/snip-undo";

describe("snip undo stash", () => {
  afterEach(() => {
    vi.useRealTimers();
    resetSnipUndoForTests();
  });

  it("stores one slot and take clears it", () => {
    const token = setStash({
      sheetName: "Sheet1",
      cellAddress: "B12",
      previousText: "old",
      replacedWithText: "new",
    });

    const first = takeStash(token);
    expect(first?.previousText).toBe("old");
    expect(first?.replacedWithText).toBe("new");
    expect(takeStash(token)).toBeUndefined();
  });

  it("keeps only the latest slot", () => {
    const firstToken = setStash({
      sheetName: "Sheet1",
      cellAddress: "A1",
      previousText: "one",
      replacedWithText: "two",
    });
    const secondToken = setStash({
      sheetName: "Sheet1",
      cellAddress: "B2",
      previousText: "three",
      replacedWithText: "four",
    });

    expect(takeStash(firstToken)).toBeUndefined();
    expect(takeStash(secondToken)?.previousText).toBe("three");
  });

  it("returns undefined after TTL", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-31T12:00:00.000Z"));
    const token = setStash({
      sheetName: "Sheet1",
      cellAddress: "C3",
      previousText: "old",
      replacedWithText: "new",
    });

    vi.setSystemTime(
      new Date("2026-08-31T12:00:00.000Z").getTime() + SNIP_UNDO_TTL_MS + 1,
    );
    expect(takeStash(token)).toBeUndefined();
  });

  it("clearStash drops the slot", () => {
    const token = setStash({
      sheetName: "Sheet1",
      cellAddress: "D4",
      previousText: "old",
      replacedWithText: "new",
    });
    clearStash();
    expect(takeStash(token)).toBeUndefined();
  });

  it("stores a table grid stash without dropping 1x1 fields", () => {
    const token = setStash({
      sheetName: "Sheet1",
      cellAddress: "B12",
      previousText: "",
      replacedWithText: "A | B (2x2)",
      grid: {
        originAddress: "B12",
        rangeAddress: "B12:C13",
        rowCount: 2,
        columnCount: 2,
        previousFormulas: [
          ["=A1", "2"],
          ["", "3"],
        ],
        previousNumberFormats: [
          ["General", "0.00"],
          ["General", "General"],
        ],
        writtenValues: [
          ["A", "B"],
          ["C", "D"],
        ],
        displacedLinks: [],
        displacedAnchors: [],
      },
    });

    const stored = takeStash(token);
    expect(stored?.grid?.rangeAddress).toBe("B12:C13");
    expect(stored?.grid?.previousFormulas[0][0]).toBe("=A1");
  });

  it("patches createdBindingIds onto an existing grid stash", () => {
    const token = setStash({
      sheetName: "Sheet1",
      cellAddress: "B12",
      previousText: "",
      replacedWithText: "Label | Value (2x2)",
      grid: {
        originAddress: "B12",
        rangeAddress: "B12:C13",
        rowCount: 2,
        columnCount: 2,
        previousFormulas: [
          ["", ""],
          ["", ""],
        ],
        previousNumberFormats: [
          ["General", "General"],
          ["General", "General"],
        ],
        writtenValues: [
          ["Invoice number", "INV-1"],
          ["Amount", "100"],
        ],
        displacedLinks: [],
        displacedAnchors: [],
        createdBindingIds: [],
      },
    });

    patchStash(token, {
      grid: {
        originAddress: "B12",
        rangeAddress: "B12:C13",
        rowCount: 2,
        columnCount: 2,
        previousFormulas: [
          ["", ""],
          ["", ""],
        ],
        previousNumberFormats: [
          ["General", "General"],
          ["General", "General"],
        ],
        writtenValues: [
          ["Invoice number", "INV-1"],
          ["Amount", "100"],
        ],
        displacedLinks: [],
        displacedAnchors: [],
        createdBindingIds: ["dtsnip_a", "dtsnip_b"],
      },
    });

    expect(takeStash(token)?.grid?.createdBindingIds).toEqual([
      "dtsnip_a",
      "dtsnip_b",
    ]);
  });
});
