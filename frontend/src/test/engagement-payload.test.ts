import { describe, expect, it } from "vitest";

import {
  areDocumentsStubOnly,
  isFatDocument,
  mergeDocumentPayload,
  toDocumentPayload,
  toDocumentStub,
} from "@/lib/persistence/engagement-payload";
import type { ParsedDocument } from "@/types/domain";

function sampleDocument(
  overrides: Partial<ParsedDocument> = {},
): ParsedDocument {
  return {
    id: "doc-1",
    fileName: "invoice.pdf",
    kind: "invoice",
    sourceKind: "pdf",
    mimeType: "application/pdf",
    objectUrl: "blob:live",
    importedAt: "2026-09-01T00:00:00.000Z",
    size: 2048,
    contentSha256: "abc",
    pageCount: 1,
    status: "parsed",
    extractedText: "Invoice INV-1 total 1000",
    pages: [
      {
        pageNumber: 1,
        text: "Invoice INV-1 total 1000",
        snippets: ["INV-1"],
      },
    ],
    invoiceNumber: {
      value: "INV-1",
      confidence: 0.9,
      sourceText: "INV-1",
      pageNumber: 1,
    },
    amount: {
      value: 1000,
      confidence: 0.8,
      sourceText: "1000",
      pageNumber: 1,
    },
    statementEntries: [],
    ...overrides,
  };
}

describe("engagement-payload", () => {
  it("slims OCR, pages, rawJson, statement lines, and objectUrl", () => {
    const stub = toDocumentStub(
      sampleDocument({
        rawJson: '{"id":1}',
        statementEntries: [
          {
            id: "line-1",
            documentId: "doc-1",
            fileName: "bank.pdf",
            pageNumber: 1,
            rawLine: "01/01 1000 INV-1",
          },
        ],
      }),
    );

    expect(stub.objectUrl).toBe("");
    expect(stub.extractedText).toBe("");
    expect(stub.pages).toEqual([]);
    expect(stub.rawJson).toBeUndefined();
    expect(stub.statementEntries).toEqual([]);
    expect(stub.invoiceNumber?.value).toBe("INV-1");
    expect(stub.amount?.value).toBe(1000);
    expect(stub.contentSha256).toBe("abc");
    expect(isFatDocument(stub)).toBe(false);
  });

  it("payload strips objectUrl but keeps parse text", () => {
    const payload = toDocumentPayload(sampleDocument());
    expect(payload.objectUrl).toBe("");
    expect(payload.extractedText).toContain("INV-1");
    expect(isFatDocument(payload)).toBe(true);
  });

  it("merges payload onto a stub and keeps a live objectUrl", () => {
    const stub = toDocumentStub(sampleDocument());
    const payload = toDocumentPayload(sampleDocument());
    const live = sampleDocument({ objectUrl: "blob:restored" });
    const merged = mergeDocumentPayload(stub, payload, live);

    expect(merged.objectUrl).toBe("blob:restored");
    expect(merged.extractedText).toContain("INV-1");
    expect(merged.pages[0]?.snippets).toEqual(["INV-1"]);
    expect(merged.invoiceNumber?.value).toBe("INV-1");
  });

  it("treats empty parse fields as stub-only", () => {
    const stub = toDocumentStub(sampleDocument());
    expect(areDocumentsStubOnly([stub])).toBe(true);
    expect(areDocumentsStubOnly([sampleDocument()])).toBe(false);
  });
});
