import { describe, expect, it } from "vitest";

import { jsonDocumentPreviewText } from "@/features/documents/services/json-preview";
import type { ParsedDocument } from "@/types/domain";

function sampleJsonDoc(
  overrides: Partial<ParsedDocument> = {},
): ParsedDocument {
  return {
    id: "doc-1",
    fileName: "seed.json",
    kind: "invoice",
    sourceKind: "json",
    mimeType: "application/json",
    objectUrl: "",
    importedAt: "2026-09-01T00:00:00.000Z",
    size: 12,
    pageCount: 1,
    status: "parsed",
    extractedText: "Invoice INV-A",
    pages: [
      {
        pageNumber: 1,
        text: "page text",
        snippets: ["INV-A"],
      },
    ],
    statementEntries: [],
    rawJson: '[{"invoiceNumber":"INV-A"},{"invoiceNumber":"INV-B"}]',
    ...overrides,
  };
}

describe("jsonDocumentPreviewText", () => {
  it("prefers extractedText over pages and ignores rawJson", () => {
    expect(jsonDocumentPreviewText(sampleJsonDoc())).toBe("Invoice INV-A");
    expect(jsonDocumentPreviewText(sampleJsonDoc()).includes("INV-B")).toBe(
      false,
    );
  });

  it("joins page text when extractedText is empty", () => {
    expect(
      jsonDocumentPreviewText(
        sampleJsonDoc({
          extractedText: "  ",
          pages: [
            { pageNumber: 1, text: "first", snippets: [] },
            { pageNumber: 2, text: "second", snippets: [] },
          ],
        }),
      ),
    ).toBe("first\nsecond");
  });

  it("returns empty when extractedText and pages are empty", () => {
    expect(
      jsonDocumentPreviewText(
        sampleJsonDoc({
          extractedText: "",
          pages: [],
          rawJson: '{"bundle":true}',
        }),
      ),
    ).toBe("");
  });
});
