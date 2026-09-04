import { describe, expect, it } from "vitest";
import {
  extractAmounts,
  extractDates,
  extractInvoiceIdentifiers,
  normalizeText,
  normalizeAlphaNumeric,
  parseFlexibleNumber,
  parsePossibleDate,
  compareDatesWithinTolerance,
  fuzzyIncludes,
} from "@/lib/parsing";

describe("parsing utilities", () => {
  describe("normalizeText", () => {
    it("should trim whitespace", () => {
      expect(normalizeText("  hello  ")).toBe("hello");
    });

    it("should handle null", () => {
      expect(normalizeText(null)).toBe("");
    });

    it("should convert numbers to strings", () => {
      expect(normalizeText(123)).toBe("123");
    });
  });

  describe("normalizeAlphaNumeric", () => {
    it("should remove non-alphanumeric characters", () => {
      expect(normalizeAlphaNumeric("INV-123")).toBe("INV123");
    });

    it("should convert to uppercase", () => {
      expect(normalizeAlphaNumeric("inv-123")).toBe("INV123");
    });
  });

  describe("parseFlexibleNumber", () => {
    it("should parse simple number", () => {
      expect(parseFlexibleNumber("123")).toBe(123);
    });

    it("should parse number with comma separators", () => {
      expect(parseFlexibleNumber("1,234.56")).toBe(1234.56);
    });

    it("should handle negative numbers", () => {
      expect(parseFlexibleNumber("-500")).toBe(-500);
    });

    it("should return undefined for invalid input", () => {
      expect(parseFlexibleNumber("abc")).toBeUndefined();
    });

    it("should handle number input directly", () => {
      expect(parseFlexibleNumber(999.99)).toBe(999.99);
    });
  });

  describe("parsePossibleDate", () => {
    it("should parse ISO date format", () => {
      expect(parsePossibleDate("2024-01-15")).toBe("2024-01-15");
    });

    it("should parse DD/MM/YYYY format", () => {
      const result = parsePossibleDate("15/01/2024");
      expect(result).toBeDefined();
    });

    it("should return undefined for invalid date", () => {
      expect(parsePossibleDate("not a date")).toBeUndefined();
    });
  });

  describe("extractAmounts", () => {
    it("should extract amounts from text", () => {
      const text = "Total: $1,234.56 and $999.00";
      const amounts = extractAmounts(text);
      expect(amounts.length).toBeGreaterThanOrEqual(2);
    });

    it("should return empty array for no amounts", () => {
      expect(extractAmounts("no amounts here")).toEqual([]);
    });
  });

  describe("extractDates", () => {
    it("should extract dates from text", () => {
      const text = "Date: 2024-01-15 and 15/01/2024";
      const dates = extractDates(text);
      expect(dates.length).toBeGreaterThanOrEqual(1);
    });

    it("should return empty array for no dates", () => {
      expect(extractDates("no dates here")).toEqual([]);
    });
  });

  describe("extractInvoiceIdentifiers", () => {
    it("should extract invoice identifiers", () => {
      const text = "Invoice INV-12345 for services";
      const ids = extractInvoiceIdentifiers(text);
      expect(ids.length).toBeGreaterThanOrEqual(1);
    });

    it("should return empty array for text without invoice keywords", () => {
      const ids = extractInvoiceIdentifiers("random text without keywords");
      expect(ids).toEqual([]);
    });
  });

  describe("compareDatesWithinTolerance", () => {
    it("should return true for same dates", () => {
      expect(compareDatesWithinTolerance("2024-01-15", "2024-01-15")).toBe(
        true,
      );
    });

    it("should return true for dates within tolerance", () => {
      expect(compareDatesWithinTolerance("2024-01-15", "2024-01-16", 1)).toBe(
        true,
      );
    });

    it("should return false for dates outside tolerance", () => {
      expect(compareDatesWithinTolerance("2024-01-15", "2024-01-20", 1)).toBe(
        false,
      );
    });

    it("should return false for undefined dates", () => {
      expect(compareDatesWithinTolerance(undefined, "2024-01-15")).toBe(false);
    });
  });

  describe("fuzzyIncludes", () => {
    it("should return true for exact match", () => {
      expect(fuzzyIncludes("INV-123", "INV-123")).toBe(true);
    });

    it("should return true for partial match", () => {
      expect(fuzzyIncludes("INV-123", "INV")).toBe(true);
    });

    it("should return false for no match", () => {
      expect(fuzzyIncludes("ABC", "XYZ")).toBe(false);
    });
  });
});
