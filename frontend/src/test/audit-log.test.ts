import { describe, expect, it } from "vitest";

import {
  AUDIT_LOG_COLUMN_COUNT,
  AUDIT_LOG_HEADERS,
  auditLogEntryToCells,
  buildMatchConfigSnapshot,
  evaluateIdentity,
  keepLockedResults,
  latestMatchByRow,
  latestSignOffsByRow,
  lockedRowNumbers,
  mergeLockedMatchResults,
  parseAuditLogRow,
  parseAuditLogRows,
  writableResults,
} from "@/features/office/services/audit-log.service";
import {
  assessDiscrepancy,
  computeDiscrepancy,
} from "@/features/matching/services/materiality";
import { DEFAULT_SCORE_WEIGHTS, type MatchResult } from "@/types/domain";

function sampleResult(
  rowNumber: number,
  status: MatchResult["status"] = "exception",
): MatchResult {
  return {
    id: `match_${rowNumber}`,
    rowNumber,
    inputValues: { amount: 100 },
    status,
    confidence: status === "matched" ? 95 : 20,
    explanation: `row ${rowNumber}`,
    outputValues: {
      invoiceDocument: null,
      invoiceAmount: null,
      invoiceDate: null,
      invoiceNumber: null,
      bankDocument: null,
      bankAmount: null,
      bankDate: null,
      bankReference: null,
      status,
      confidence: status === "matched" ? 95 : 20,
    },
  };
}

describe("ISA audit log helpers", () => {
  it("builds a stable config snapshot with explicit key order", () => {
    const snapshot = buildMatchConfigSnapshot({
      amountTolerance: 1,
      dateToleranceDays: 5,
      requireInvoiceNumber: true,
      fuzzyReferenceMatch: false,
      outputFields: ["status", "confidence"],
      outputColumnMap: { status: 10, confidence: 11 },
    });

    expect(snapshot).toBe(
      JSON.stringify({
        amountTolerance: 1,
        amountTolerancePercent: 0,
        dateToleranceDays: 5,
        requireInvoiceNumber: true,
        fuzzyReferenceMatch: false,
        outputFields: ["status", "confidence"],
        outputColumnMap: { status: 10, confidence: 11 },
        scoreWeights: DEFAULT_SCORE_WEIGHTS,
      }),
    );
  });

  it("parses legacy 7-cell rows and wide match/signoff rows", () => {
    const legacy = parseAuditLogRow([
      "2026-08-31T00:00:00.000Z",
      5,
      "exception",
      20,
      "inv.pdf",
      "bank.pdf",
      "No strong invoice match",
    ]);
    expect(legacy).toMatchObject({
      event: "match",
      rowNumber: 5,
      invoiceFile: "inv.pdf",
      invoiceHash: "",
      explanation: "No strong invoice match",
    });

    const cells = auditLogEntryToCells({
      event: "signoff",
      timestamp: "2026-08-31T01:00:00.000Z",
      rowNumber: 5,
      status: "exception",
      confidence: 20,
      invoiceFile: "inv.pdf",
      invoiceHash: "abc",
      bankFile: "bank.pdf",
      bankHash: "def",
      explanation: "No strong invoice match",
      configSnapshot: "{}",
      preparer: "KZ",
      reviewer: "AY",
      signOffAction: "waive",
      signOffComment: "below trivial",
      materiality: "results.clearlyTrivial",
    });
    expect(cells).toHaveLength(AUDIT_LOG_COLUMN_COUNT);
    expect(AUDIT_LOG_HEADERS).toHaveLength(AUDIT_LOG_COLUMN_COUNT);

    const parsed = parseAuditLogRow(cells);
    expect(parsed).toMatchObject({
      event: "signoff",
      rowNumber: 5,
      signOffAction: "waive",
      preparer: "KZ",
    });
  });

  it("uses the latest sign-off per row and does not unlock on later match events", () => {
    const entries = parseAuditLogRows([
      ["Timestamp", "Row", "Status", "Confidence", "Invoice file", "Bank file"],
      [
        "2026-08-31T00:00:00.000Z",
        5,
        "exception",
        20,
        "inv.pdf",
        "bank.pdf",
        "legacy",
      ],
      [
        "signoff",
        "2026-08-31T01:00:00.000Z",
        5,
        "exception",
        20,
        "inv.pdf",
        "h1",
        "bank.pdf",
        "h2",
        "legacy",
        "{}",
        "KZ",
        "AY",
        "conclude",
        "first",
        "results.materialException",
      ],
      [
        "signoff",
        "2026-08-31T02:00:00.000Z",
        5,
        "exception",
        20,
        "inv.pdf",
        "h1",
        "bank.pdf",
        "h2",
        "legacy",
        "{}",
        "KZ",
        "AY",
        "waive",
        "second",
        "results.materialException",
      ],
      [
        "match",
        "2026-08-31T03:00:00.000Z",
        5,
        "matched",
        90,
        "inv.pdf",
        "h1",
        "bank.pdf",
        "h2",
        "later match",
        "{}",
        "KZ",
        "AY",
        "",
        "",
        "",
      ],
    ]);

    const signOffs = latestSignOffsByRow(entries);
    expect(signOffs[5]?.action).toBe("waive");
    expect(signOffs[5]?.comment).toBe("second");
    expect(latestMatchByRow(entries)[5]?.status).toBe("matched");
    expect(lockedRowNumbers(signOffs).has(5)).toBe(true);
  });

  it("filters writable results without shifting the full results list", () => {
    const results = [
      sampleResult(2, "matched"),
      sampleResult(3, "exception"),
      sampleResult(4, "partial"),
    ];
    const locked = new Set([3]);
    const writable = writableResults(results, locked);

    expect(writable.map((result) => result.rowNumber)).toEqual([2, 4]);
    expect(results.map((result) => result.rowNumber)).toEqual([2, 3, 4]);
    expect(
      keepLockedResults(results, locked).map((result) => result.rowNumber),
    ).toEqual([3]);

    const merged = mergeLockedMatchResults(
      [
        sampleResult(2, "matched"),
        sampleResult(3, "matched"),
        sampleResult(4, "matched"),
      ],
      results,
      locked,
      {},
    );
    expect(merged[1]?.status).toBe("exception");
    expect(merged[0]?.status).toBe("matched");
  });

  it("allows the same preparer and reviewer with a warning", () => {
    const incomplete = evaluateIdentity({ preparer: "KZ", reviewer: "  " });
    expect(incomplete.ok).toBe(false);

    const same = evaluateIdentity({ preparer: "kz", reviewer: "KZ" });
    expect(same.ok).toBe(true);
    if (same.ok) {
      expect(same.warning).toBe("same-name");
      expect(same.identity.preparer).toBe("kz");
    }

    const distinct = evaluateIdentity({ preparer: "KZ", reviewer: "AY" });
    expect(distinct.ok).toBe(true);
    if (distinct.ok) {
      expect(distinct.warning).toBeNull();
    }
  });

  it("reuses the same materiality thresholds as the results card", () => {
    const result = sampleResult(8);
    expect(computeDiscrepancy(result, "amount")).toBe(100);
    expect(assessDiscrepancy(100, 10000, 7500, 500)).toBe(
      "results.clearlyTrivial",
    );
    expect(assessDiscrepancy(600, 10000, 7500, 500)).toBe(
      "results.belowPerformance",
    );
  });
});
