import { afterEach, describe, expect, it, vi } from "vitest";

import { runDocumentMatchingInWorker } from "@/features/matching/services/matching-worker.service";
import type {
  MatchConfig,
  ParsedDocument,
  SelectionSnapshot,
} from "@/types/domain";

describe("matching worker service", () => {
  const originalWorker = globalThis.Worker;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, "Worker", {
      configurable: true,
      value: originalWorker,
      writable: true,
    });
  });

  it("falls back safely and processes 1000+ rows when Worker is unavailable", async () => {
    Object.defineProperty(globalThis, "Worker", {
      configurable: true,
      value: undefined,
      writable: true,
    });

    const progress = vi.fn();
    const selection = buildSelection(1000);
    const documents = buildDocuments();
    const config = buildConfig();

    const results = await runDocumentMatchingInWorker(
      selection,
      documents,
      config,
      progress,
    );

    expect(results).toHaveLength(1000);
    expect(results[0]?.status).toBe("matched");
    expect(results[0]?.confidence).toBe(100);
    expect(progress).toHaveBeenCalled();
    expect(progress).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "main-thread",
        processed: 1000,
        total: 1000,
      }),
    );
  });
});

function buildSelection(rowCount: number): SelectionSnapshot {
  return {
    sheetName: "Demo",
    address: `A1:C${rowCount + 1}`,
    hasHeaders: true,
    headerRowNumber: 1,
    firstDataRowNumber: 2,
    startColumnIndex: 0,
    worksheetColumnCount: 20,
    rowCount,
    columnCount: 3,
    columns: [
      {
        id: "amount",
        index: 0,
        header: "Amount",
        letter: "A",
        inferredRole: "amount",
      },
      {
        id: "date",
        index: 1,
        header: "Date",
        letter: "B",
        inferredRole: "date",
      },
      {
        id: "invoice",
        index: 2,
        header: "Invoice number",
        letter: "C",
        inferredRole: "invoiceNumber",
      },
    ],
    outputColumnOptions: [
      { id: "out-status", columnIndex: 3, letter: "D", label: "D - Status" },
      {
        id: "out-confidence",
        columnIndex: 4,
        letter: "E",
        label: "E - Confidence",
      },
    ],
    rows: Array.from({ length: rowCount }, (_, index) => ({
      rowNumber: index + 2,
      values: {
        amount: 1512.4,
        date: "2020-07-11",
        invoice: "20020098475",
      },
    })),
  };
}

function buildConfig(): MatchConfig {
  return {
    amountColumnId: "amount",
    dateColumnId: "date",
    invoiceNumberColumnId: "invoice",
    amountTolerance: 0.01,
    dateToleranceDays: 0,
    requireInvoiceNumber: true,
    fuzzyReferenceMatch: true,
    outputFields: ["status", "confidence"],
    outputColumnMap: {
      status: 3,
      confidence: 4,
    },
  };
}

function buildDocuments(): ParsedDocument[] {
  return [
    {
      id: "invoice-doc",
      fileName: "invoice.json",
      kind: "invoice",
      sourceKind: "json",
      mimeType: "application/json",
      objectUrl: "",
      importedAt: "2026-04-28T00:00:00.000Z",
      size: 1,
      pageCount: 1,
      status: "parsed",
      extractedText: "Invoice 20020098475 total 1512.40 date 2020-07-11",
      pages: [
        {
          pageNumber: 1,
          text: "Invoice 20020098475 total 1512.40 date 2020-07-11",
          snippets: ["Invoice 20020098475 total 1512.40 date 2020-07-11"],
        },
      ],
      invoiceNumber: {
        value: "20020098475",
        confidence: 1,
        sourceText: "Invoice 20020098475",
        pageNumber: 1,
      },
      amount: {
        value: 1512.4,
        confidence: 1,
        sourceText: "1512.40",
        pageNumber: 1,
      },
      date: {
        value: "2020-07-11",
        confidence: 1,
        sourceText: "2020-07-11",
        pageNumber: 1,
      },
      statementEntries: [],
    },
    {
      id: "bank-doc",
      fileName: "bank.json",
      kind: "bank-statement",
      sourceKind: "json",
      mimeType: "application/json",
      objectUrl: "",
      importedAt: "2026-04-28T00:00:00.000Z",
      size: 1,
      pageCount: 1,
      status: "parsed",
      extractedText: "2020-07-11 1512.40 20020098475",
      pages: [
        {
          pageNumber: 1,
          text: "2020-07-11 1512.40 20020098475",
          snippets: ["2020-07-11 1512.40 20020098475"],
        },
      ],
      statementEntries: [
        {
          id: "bank-entry",
          documentId: "bank-doc",
          fileName: "bank.json",
          pageNumber: 1,
          amount: 1512.4,
          date: "2020-07-11",
          reference: "20020098475",
          rawLine: "2020-07-11 1512.40 20020098475",
        },
      ],
    },
  ];
}
