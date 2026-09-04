import { describe, expect, it } from "vitest";

import {
  buildFormGrid,
  canTagSnip,
  formSnipsReady,
  sortFormSnips,
} from "@/features/snipping/services/form-fields";
import type { Snip, SnipFormField, SnipSourceType } from "@/types/domain";

function buildSnip(
  id: string,
  text: string,
  options?: {
    documentId?: string;
    sourceType?: SnipSourceType;
    formField?: SnipFormField;
    createdAt?: string;
  },
): Snip {
  return {
    id,
    documentId: options?.documentId ?? "doc-1",
    fileName: "invoice.pdf",
    pageNumber: 1,
    text,
    boundingBox: { x: 0.1, y: 0.2, width: 0.2, height: 0.05 },
    createdAt: options?.createdAt ?? "2026-08-31T12:00:00.000Z",
    sourceType: options?.sourceType ?? "pdf-word",
    formField: options?.formField,
  };
}

describe("form field helpers", () => {
  it("tags only word, line, and legacy pdf-text snips", () => {
    expect(canTagSnip({ sourceType: "pdf-word" })).toBe(true);
    expect(canTagSnip({ sourceType: "pdf-line" })).toBe(true);
    expect(canTagSnip({ sourceType: "pdf-text" })).toBe(true);
    expect(canTagSnip({ sourceType: "pdf-table" })).toBe(false);
    expect(canTagSnip({ sourceType: "extracted-snippet" })).toBe(false);
    expect(canTagSnip({ sourceType: "manual-region" })).toBe(false);
    expect(canTagSnip({})).toBe(false);
  });

  it("orders tagged rows by field then createdAt, including duplicate tags", () => {
    const laterAmount = buildSnip("a2", "200", {
      formField: "amount",
      createdAt: "2026-08-31T12:02:00.000Z",
    });
    const earlierAmount = buildSnip("a1", "100", {
      formField: "amount",
      createdAt: "2026-08-31T12:01:00.000Z",
    });
    const invoice = buildSnip("inv", "INV-9", {
      formField: "invoice-number",
      createdAt: "2026-08-31T12:03:00.000Z",
    });
    const table = buildSnip("tbl", "grid", {
      sourceType: "pdf-table",
      formField: "other",
    });

    const ordered = sortFormSnips([laterAmount, invoice, earlierAmount, table]);
    expect(ordered.map((snip) => snip.id)).toEqual(["inv", "a1", "a2"]);
  });

  it("builds a 2-column label/value grid in the active locale", () => {
    const snips = [
      buildSnip("amt", "1,200.00", { formField: "amount" }),
      buildSnip("inv", "INV-1", { formField: "invoice-number" }),
    ];

    expect(buildFormGrid(snips, "en-US")).toEqual([
      ["Invoice number", "INV-1"],
      ["Amount", "1,200.00"],
    ]);
    expect(buildFormGrid(snips, "my-MM")[0]?.[0]).toBe("ပြေစာနံပါတ်");
  });

  it("is ready only when tagged snips share one document", () => {
    expect(formSnipsReady([])).toEqual({ status: "empty" });
    expect(
      formSnipsReady([buildSnip("w", "x", { sourceType: "pdf-word" })]),
    ).toEqual({ status: "empty" });

    const mixed = formSnipsReady([
      buildSnip("a", "INV-1", {
        formField: "invoice-number",
        documentId: "doc-a",
      }),
      buildSnip("b", "100", { formField: "amount", documentId: "doc-b" }),
    ]);
    expect(mixed.status).toBe("mixed-document");

    const ready = formSnipsReady([
      buildSnip("b", "100", { formField: "amount" }),
      buildSnip("a", "INV-1", { formField: "invoice-number" }),
    ]);
    expect(ready.status).toBe("ready");
    if (ready.status === "ready") {
      expect(ready.snips.map((snip) => snip.id)).toEqual(["a", "b"]);
    }
  });
});
