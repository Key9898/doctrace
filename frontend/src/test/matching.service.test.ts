import { describe, expect, it } from "vitest";
import {
  hydrateOutputColumnMap,
  buildOutputMappingSummary,
  validateOutputMapping,
  matchSingleRow,
} from "@/features/matching/services/matching.service";
import type { MatchConfig, SelectionSnapshot } from "@/types/domain";

describe("matching service", () => {
  const mockSelection: SelectionSnapshot = {
    sheetName: "Sheet1",
    address: "A1:C10",
    hasHeaders: true,
    headerRowNumber: 1,
    firstDataRowNumber: 2,
    startColumnIndex: 0,
    worksheetColumnCount: 10,
    rowCount: 10,
    columnCount: 3,
    columns: [
      { id: "col-1", index: 0, header: "Invoice", letter: "A" },
      { id: "col-2", index: 1, header: "Amount", letter: "B" },
      { id: "col-3", index: 2, header: "Date", letter: "C" },
    ],
    outputColumnOptions: [
      { id: "out-1", columnIndex: 3, label: "Invoice Document", letter: "D" },
      { id: "out-2", columnIndex: 4, label: "Confidence", letter: "E" },
    ],
    rows: [],
  };

  const mockConfig: MatchConfig = {
    amountTolerance: 1,
    dateToleranceDays: 5,
    requireInvoiceNumber: true,
    fuzzyReferenceMatch: true,
    outputFields: ["invoiceDocument", "confidence"],
    outputColumnMap: {},
  };

  describe("hydrateOutputColumnMap", () => {
    it("should return empty object when no selection", () => {
      const result = hydrateOutputColumnMap(undefined, mockConfig);
      expect(result).toEqual({});
    });

    it("should map output fields to column indices", () => {
      const result = hydrateOutputColumnMap(mockSelection, mockConfig);
      expect(result.invoiceDocument).toBe(3);
      expect(result.confidence).toBe(4);
    });
  });

  describe("buildOutputMappingSummary", () => {
    it("should build summary for output fields", () => {
      const summary = buildOutputMappingSummary(mockSelection, mockConfig);
      expect(summary.length).toBe(2);
      expect(summary[0].field).toBe("invoiceDocument");
      expect(summary[0].columnIndex).toBe(3);
    });

    it("should use column letter for unmapped fields", () => {
      const summary = buildOutputMappingSummary(undefined, mockConfig);
      expect(summary[0].label).toBe("Unmapped");
    });
  });

  describe("validateOutputMapping", () => {
    it("should identify missing fields", () => {
      const result = validateOutputMapping(undefined, mockConfig);
      expect(result.missingFields.length).toBe(2);
    });

    it("should identify duplicate columns", () => {
      const configWithDuplicates: MatchConfig = {
        ...mockConfig,
        outputColumnMap: {
          invoiceDocument: 3,
          confidence: 3,
        },
      };
      const result = validateOutputMapping(mockSelection, configWithDuplicates);
      expect(result.duplicateColumns.length).toBe(1);
    });

    it("should return hydrated map", () => {
      const result = validateOutputMapping(mockSelection, mockConfig);
      expect(result.hydratedMap.invoiceDocument).toBe(3);
    });
  });

  describe("matchSingleRow", () => {
    it("should match single row with document evidence", () => {
      const row = {
        rowNumber: 2,
        values: {
          "col-1": "INV-100",
          "col-2": 1500,
          "col-3": "2026-05-10",
        },
      };

      const invoiceDocs = [
        {
          id: "doc-1",
          fileName: "invoice_1.pdf",
          kind: "invoice" as const,
          sourceKind: "pdf" as const,
          mimeType: "application/pdf",
          objectUrl: "",
          importedAt: "",
          size: 100,
          pageCount: 1,
          status: "parsed" as const,
          extractedText: "",
          pages: [],
          invoiceNumber: {
            value: "INV-100",
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          amount: {
            value: 1500,
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          date: {
            value: "2026-05-10",
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          statementEntries: [],
        },
      ];

      const config: MatchConfig = {
        amountColumnId: "col-2",
        dateColumnId: "col-3",
        invoiceNumberColumnId: "col-1",
        amountTolerance: 1,
        dateToleranceDays: 5,
        requireInvoiceNumber: true,
        fuzzyReferenceMatch: true,
        outputFields: ["invoiceDocument", "status", "confidence"],
        outputColumnMap: {},
      };

      const result = matchSingleRow(row, invoiceDocs, [], config);
      expect(result.status).toBe("matched");
      expect(result.confidence).toBe(100);
      expect(result.outputValues.invoiceDocument).toBe("invoice_1.pdf");
      expect(result.explanation.split("; ")).toHaveLength(2);
      expect(result.explanation).toContain(
        "Invoice matched by invoice number, amount, date (amount ±1, date ±5d)",
      );
      expect(result.matchedFields).toEqual([
        "invoice number",
        "amount",
        "date",
      ]);
      expect(result.explanation).toContain(
        "no bank statement hit (amount ±1, date ±5d)",
      );
    });

    it("should change confidence when scoreWeights change", () => {
      const row = {
        rowNumber: 2,
        values: {
          "col-1": "INV-100",
          "col-2": 1500,
          "col-3": "2026-05-10",
        },
      };
      const invoiceDocs = [
        {
          id: "doc-1",
          fileName: "invoice_1.pdf",
          kind: "invoice" as const,
          sourceKind: "pdf" as const,
          mimeType: "application/pdf",
          objectUrl: "",
          importedAt: "",
          size: 100,
          pageCount: 1,
          status: "parsed" as const,
          extractedText: "",
          pages: [],
          invoiceNumber: {
            value: "INV-100",
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          amount: {
            value: 1500,
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          date: {
            value: "2026-05-10",
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          statementEntries: [],
        },
      ];
      const baseConfig: MatchConfig = {
        amountColumnId: "col-2",
        dateColumnId: "col-3",
        invoiceNumberColumnId: "col-1",
        amountTolerance: 1,
        dateToleranceDays: 5,
        requireInvoiceNumber: true,
        fuzzyReferenceMatch: true,
        outputFields: ["invoiceDocument", "status", "confidence"],
        outputColumnMap: {},
      };

      const defaultResult = matchSingleRow(row, invoiceDocs, [], baseConfig);
      const weightedResult = matchSingleRow(row, invoiceDocs, [], {
        ...baseConfig,
        scoreWeights: { invoiceNumber: 10, amount: 10, date: 10 },
      });

      expect(defaultResult.confidence).toBe(100);
      expect(weightedResult.confidence).toBe(30);
      expect(weightedResult.confidence).not.toBe(defaultResult.confidence);
    });

    it("treats amount as matched when percent of GL exceeds the absolute gate", () => {
      const row = {
        rowNumber: 2,
        values: {
          "col-1": "INV-100",
          "col-2": 10000,
          "col-3": "2026-05-10",
        },
      };

      const invoiceDocs = [
        {
          id: "doc-1",
          fileName: "invoice_1.pdf",
          kind: "invoice" as const,
          sourceKind: "pdf" as const,
          mimeType: "application/pdf",
          objectUrl: "",
          importedAt: "",
          size: 100,
          pageCount: 1,
          status: "parsed" as const,
          extractedText: "",
          pages: [],
          invoiceNumber: {
            value: "INV-100",
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          amount: {
            value: 10050,
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          date: {
            value: "2026-05-10",
            confidence: 100,
            pageNumber: 1,
            sourceText: "",
          },
          statementEntries: [],
        },
      ];

      const baseConfig: MatchConfig = {
        amountColumnId: "col-2",
        dateColumnId: "col-3",
        invoiceNumberColumnId: "col-1",
        amountTolerance: 1,
        dateToleranceDays: 5,
        requireInvoiceNumber: true,
        fuzzyReferenceMatch: true,
        outputFields: ["invoiceDocument", "status", "confidence"],
        outputColumnMap: {},
      };

      const withoutPercent = matchSingleRow(row, invoiceDocs, [], baseConfig);
      expect(withoutPercent.status).toBe("partial");
      expect(withoutPercent.explanation.split("; ")).toHaveLength(2);
      expect(withoutPercent.explanation).toContain("(amount ±1, date ±5d)");
      expect(withoutPercent.explanation).not.toContain("%");

      const withPercent = matchSingleRow(row, invoiceDocs, [], {
        ...baseConfig,
        amountTolerancePercent: 1,
      });
      expect(withPercent.status).toBe("matched");
      expect(withPercent.explanation.split("; ")).toHaveLength(2);
      expect(withPercent.explanation).toContain("(amount ±1 or 1%, date ±5d)");
    });

    it("records bankMatchedFields when bank gates fire", () => {
      const row = {
        rowNumber: 2,
        values: {
          "col-1": "INV-100",
          "col-2": 1500,
          "col-3": "2026-05-10",
        },
      };

      const bankDocs = [
        {
          id: "bank-1",
          fileName: "stmt.pdf",
          kind: "bank-statement" as const,
          sourceKind: "pdf" as const,
          mimeType: "application/pdf",
          objectUrl: "",
          importedAt: "",
          size: 100,
          pageCount: 1,
          status: "parsed" as const,
          extractedText: "",
          pages: [],
          statementEntries: [
            {
              id: "entry-1",
              documentId: "bank-1",
              fileName: "stmt.pdf",
              pageNumber: 1,
              amount: 1500,
              date: "2026-05-10",
              reference: "INV-100",
              rawLine: "INV-100 1500 2026-05-10",
            },
          ],
        },
      ];

      const config: MatchConfig = {
        amountColumnId: "col-2",
        dateColumnId: "col-3",
        invoiceNumberColumnId: "col-1",
        amountTolerance: 1,
        dateToleranceDays: 5,
        requireInvoiceNumber: true,
        fuzzyReferenceMatch: true,
        outputFields: ["invoiceDocument", "status", "confidence"],
        outputColumnMap: {},
      };

      const result = matchSingleRow(row, [], bankDocs, config);
      expect(result.bankMatchedFields).toEqual([
        "invoice number",
        "amount",
        "date",
      ]);
      expect(result.explanation.split("; ")).toHaveLength(2);
    });
  });
});
