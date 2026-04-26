import { describe, expect, it } from "vitest";
import {
  hydrateOutputColumnMap,
  buildOutputMappingSummary,
  validateOutputMapping,
} from "./matching.service";
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
});
