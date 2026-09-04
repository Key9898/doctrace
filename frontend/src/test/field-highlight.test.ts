import { describe, expect, it } from "vitest";

import {
  locateFieldBoxes,
  queriesForMatch,
} from "@/features/snipping/services/field-highlight";
import type { MatchResult, ParsedDocument } from "@/types/domain";

function invoiceDocument(extra?: Partial<ParsedDocument>): ParsedDocument {
  return {
    id: "doc-1",
    fileName: "invoice.pdf",
    kind: "invoice",
    sourceKind: "pdf",
    mimeType: "application/pdf",
    objectUrl: "",
    importedAt: "",
    size: 1,
    pageCount: 1,
    status: "parsed",
    extractedText: "",
    pages: [],
    statementEntries: [],
    invoiceNumber: {
      value: "INV-100",
      confidence: 100,
      pageNumber: 1,
      sourceText: "Invoice INV-100",
    },
    amount: {
      value: 1500,
      confidence: 100,
      pageNumber: 1,
      sourceText: "1,500.00",
    },
    date: {
      value: "2026-05-10",
      confidence: 100,
      pageNumber: 1,
      sourceText: "10 May 2026",
    },
    ...extra,
  };
}

function sampleResult(extra?: Partial<MatchResult>): MatchResult {
  return {
    id: "match-1",
    rowNumber: 2,
    inputValues: {},
    status: "matched",
    confidence: 100,
    explanation:
      "Invoice matched by invoice number, amount, date (amount ±1, date ±5d); no bank statement hit (amount ±1, date ±5d)",
    invoiceMatch: {
      documentId: "doc-1",
      fileName: "invoice.pdf",
      pageNumber: 1,
      score: 100,
      snippet: "INV-100",
      extractedInvoiceNumber: "INV-100",
      extractedAmount: 1500,
      extractedDate: "2026-05-10",
    },
    matchedFields: ["invoice number", "amount", "date"],
    outputValues: {
      invoiceDocument: "invoice.pdf",
      invoiceAmount: 1500,
      invoiceDate: "2026-05-10",
      invoiceNumber: "INV-100",
      bankDocument: null,
      bankAmount: null,
      bankDate: null,
      bankReference: null,
      status: "matched",
      confidence: 100,
    },
    ...extra,
  };
}

describe("field highlight", () => {
  it("maps fuzzy invoice tokens to sourceText and value, not the token string", () => {
    const queries = queriesForMatch(
      sampleResult({
        matchedFields: ["invoice number (fuzzy)"],
      }),
      invoiceDocument(),
    );

    expect(queries).toContain("Invoice INV-100");
    expect(queries).toContain("INV-100");
    expect(queries).not.toContain("invoice number (fuzzy)");
  });

  it("returns no queries when the viewer document is the other side", () => {
    const queries = queriesForMatch(
      sampleResult(),
      invoiceDocument({ id: "bank-other" }),
    );
    expect(queries).toEqual([]);
  });

  it("does not parse explanation when matchedFields are missing", () => {
    const queries = queriesForMatch(
      sampleResult({ matchedFields: undefined }),
      invoiceDocument(),
    );
    expect(queries).toEqual([]);
  });

  it("locates a query inside a single text item", () => {
    const boxes = locateFieldBoxes(
      [
        {
          str: "Invoice INV-100 paid",
          boundingBox: { x: 0.1, y: 0.2, width: 0.4, height: 0.03 },
        },
      ],
      ["INV-100"],
    );

    expect(boxes).toHaveLength(1);
    expect(boxes[0].x).toBe(0.1);
  });

  it("joins same-line fragments when no single item hits", () => {
    const boxes = locateFieldBoxes(
      [
        {
          str: "INV-",
          boundingBox: { x: 0.1, y: 0.25, width: 0.08, height: 0.03 },
        },
        {
          str: "100",
          boundingBox: { x: 0.19, y: 0.25, width: 0.08, height: 0.03 },
        },
        {
          str: "Other",
          boundingBox: { x: 0.1, y: 0.5, width: 0.2, height: 0.03 },
        },
      ],
      ["INV-100"],
    );

    expect(boxes).toHaveLength(2);
    expect(boxes.map((box) => box.x)).toEqual([0.1, 0.19]);
  });

  it("returns empty when nothing on the page matches", () => {
    expect(
      locateFieldBoxes(
        [
          {
            str: "Hello",
            boundingBox: { x: 0, y: 0, width: 0.2, height: 0.02 },
          },
        ],
        ["INV-100"],
      ),
    ).toEqual([]);
  });
});
