import { describe, expect, it } from "vitest";

import {
  isSnipAnchorSupported,
  parseSnipAnchorIndex,
  removeSnipAnchorsByBindingIds,
  serializeSnipAnchorIndex,
  upsertSnipAnchor,
  type SnipAnchorRecord,
} from "@/features/office/services/workbook-snip-anchor.service";
import { hasRealSnipGeometry } from "@/features/snipping/services/snips";

function sampleAnchor(
  bindingId: string,
  extra?: Partial<SnipAnchorRecord>,
): SnipAnchorRecord {
  return {
    bindingId,
    snipId: "snip-1",
    contentSha256: "abc123",
    documentId: "doc-1",
    fileName: "invoice.pdf",
    kind: "invoice",
    sourceKind: "pdf",
    sourceType: "pdf-text",
    page: 2,
    x: 10,
    y: 20,
    width: 30,
    height: 40,
    text: 'INV-100 & "quoted"',
    ...extra,
  };
}

describe("snip anchors", () => {
  it("skips workbook anchors outside Excel", () => {
    expect(isSnipAnchorSupported()).toBe(false);
  });

  it("treats pdf-text and manual-region as real geometry", () => {
    expect(hasRealSnipGeometry({ sourceType: "pdf-text" })).toBe(true);
    expect(hasRealSnipGeometry({ sourceType: "manual-region" })).toBe(true);
    expect(hasRealSnipGeometry({ sourceType: "pdf-word" })).toBe(true);
    expect(hasRealSnipGeometry({ sourceType: "pdf-line" })).toBe(true);
    expect(hasRealSnipGeometry({ sourceType: "pdf-table" })).toBe(true);
    expect(hasRealSnipGeometry({ sourceType: "extracted-snippet" })).toBe(
      false,
    );
    expect(hasRealSnipGeometry({})).toBe(false);
  });

  it("round-trips XML including escaped text", () => {
    const original = [sampleAnchor("dtsnip_one")];
    const parsed = parseSnipAnchorIndex(serializeSnipAnchorIndex(original));

    expect(parsed).toEqual(original);
  });

  it("round-trips pdf-table sourceType", () => {
    const original = [
      sampleAnchor("dtsnip_table", { sourceType: "pdf-table" }),
    ];
    expect(parseSnipAnchorIndex(serializeSnipAnchorIndex(original))).toEqual(
      original,
    );
  });

  it("last-wins by bindingId", () => {
    const first = sampleAnchor("dtsnip_one", { text: "first" });
    const second = sampleAnchor("dtsnip_one", { text: "second", page: 3 });
    const next = upsertSnipAnchor([first], second);

    expect(next).toHaveLength(1);
    expect(next[0].text).toBe("second");
    expect(next[0].page).toBe(3);
  });

  it("removes anchors by binding id", () => {
    const keep = sampleAnchor("dtsnip_keep");
    const drop = sampleAnchor("dtsnip_drop", { snipId: "snip-2" });
    const next = removeSnipAnchorsByBindingIds([keep, drop], ["dtsnip_drop"]);

    expect(next).toEqual([keep]);
  });
});
