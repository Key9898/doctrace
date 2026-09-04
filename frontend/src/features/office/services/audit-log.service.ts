import { createId } from "@/lib/id";
import {
  DEFAULT_SCORE_WEIGHTS,
  type AuditIdentity,
  type AuditLogEntry,
  type AuditLogEvent,
  type ExceptionSignOffAction,
  type MatchConfig,
  type MatchResult,
  type MatchStatus,
  type MaterialityAssessmentKey,
  type RowSignOff,
} from "@/types/domain";

export const AUDIT_LOG_HEADERS = [
  "Event",
  "Timestamp",
  "Row",
  "Status",
  "Confidence",
  "Invoice file",
  "Invoice hash",
  "Bank file",
  "Bank hash",
  "Explanation",
  "Config snapshot",
  "Preparer",
  "Reviewer",
  "Sign-off action",
  "Sign-off comment",
  "Materiality",
] as const;

export const AUDIT_LOG_COLUMN_COUNT = AUDIT_LOG_HEADERS.length;

const MATCH_STATUSES = new Set<MatchStatus>([
  "matched",
  "partial",
  "exception",
]);

const SIGN_OFF_ACTIONS = new Set<ExceptionSignOffAction>([
  "conclude",
  "waive",
  "follow-up",
]);

const MATERIALITY_KEYS = new Set<MaterialityAssessmentKey>([
  "results.clearlyTrivial",
  "results.belowPerformance",
  "results.materialException",
  "results.aboveOverall",
]);

export function normalizeIdentity(identity: AuditIdentity): AuditIdentity {
  return {
    preparer: identity.preparer.trim(),
    reviewer: identity.reviewer.trim(),
  };
}

export function evaluateIdentity(
  identity: AuditIdentity,
):
  | { ok: false; reason: "incomplete" }
  | { ok: true; warning: "same-name" | null; identity: AuditIdentity } {
  const next = normalizeIdentity(identity);

  if (!next.preparer || !next.reviewer) {
    return { ok: false, reason: "incomplete" };
  }

  const sameName = next.preparer.toLowerCase() === next.reviewer.toLowerCase();

  return {
    ok: true,
    warning: sameName ? "same-name" : null,
    identity: next,
  };
}

export function buildMatchConfigSnapshot(config: MatchConfig): string {
  return JSON.stringify({
    amountTolerance: config.amountTolerance,
    amountTolerancePercent: config.amountTolerancePercent ?? 0,
    dateToleranceDays: config.dateToleranceDays,
    requireInvoiceNumber: config.requireInvoiceNumber,
    fuzzyReferenceMatch: config.fuzzyReferenceMatch,
    outputFields: config.outputFields,
    outputColumnMap: config.outputColumnMap,
    scoreWeights: config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS,
  });
}

export function auditLogEntryToCells(
  entry: AuditLogEntry,
): Array<string | number> {
  return [
    entry.event,
    entry.timestamp,
    entry.rowNumber,
    entry.status,
    entry.confidence,
    entry.invoiceFile,
    entry.invoiceHash,
    entry.bankFile,
    entry.bankHash,
    entry.explanation,
    entry.configSnapshot,
    entry.preparer,
    entry.reviewer,
    entry.signOffAction,
    entry.signOffComment,
    entry.materiality,
  ];
}

function cellString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function parseMatchStatus(value: unknown): MatchStatus | "" {
  const text = cellString(value);
  return MATCH_STATUSES.has(text as MatchStatus) ? (text as MatchStatus) : "";
}

function parseConfidence(value: unknown): number | "" {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : "";
}

function emptyAuditLogEntry(): AuditLogEntry {
  return {
    event: "match",
    timestamp: "",
    rowNumber: 0,
    status: "",
    confidence: "",
    invoiceFile: "",
    invoiceHash: "",
    bankFile: "",
    bankHash: "",
    explanation: "",
    configSnapshot: "",
    preparer: "",
    reviewer: "",
    signOffAction: "",
    signOffComment: "",
    materiality: "",
  };
}

export function parseAuditLogRow(cells: unknown[]): AuditLogEntry | null {
  if (!cells.length) {
    return null;
  }

  const padded = [...cells];
  while (padded.length < AUDIT_LOG_COLUMN_COUNT) {
    padded.push("");
  }

  const first = cellString(padded[0]).toLowerCase();

  if (first === "event" || first === "timestamp") {
    return null;
  }

  if (first === "match" || first === "signoff") {
    const rowNumber = Number(padded[2]);
    if (!Number.isFinite(rowNumber) || rowNumber <= 0) {
      return null;
    }

    return {
      event: first as AuditLogEvent,
      timestamp: cellString(padded[1]),
      rowNumber,
      status: parseMatchStatus(padded[3]),
      confidence: parseConfidence(padded[4]),
      invoiceFile: cellString(padded[5]),
      invoiceHash: cellString(padded[6]),
      bankFile: cellString(padded[7]),
      bankHash: cellString(padded[8]),
      explanation: cellString(padded[9]),
      configSnapshot: cellString(padded[10]),
      preparer: cellString(padded[11]),
      reviewer: cellString(padded[12]),
      signOffAction: cellString(padded[13]),
      signOffComment: cellString(padded[14]),
      materiality: cellString(padded[15]),
    };
  }

  const rowNumber = Number(padded[1]);
  if (!Number.isFinite(rowNumber) || rowNumber <= 0) {
    return null;
  }

  return {
    ...emptyAuditLogEntry(),
    event: "match",
    timestamp: cellString(padded[0]),
    rowNumber,
    status: parseMatchStatus(padded[2]),
    confidence: parseConfidence(padded[3]),
    invoiceFile: cellString(padded[4]),
    bankFile: cellString(padded[5]),
    explanation: cellString(padded[6]),
  };
}

export function parseAuditLogRows(values: unknown[][]): AuditLogEntry[] {
  const entries: AuditLogEntry[] = [];

  for (const row of values) {
    const parsed = parseAuditLogRow(row);
    if (parsed) {
      entries.push(parsed);
    }
  }

  return entries;
}

export function latestSignOffsByRow(
  entries: AuditLogEntry[],
): Record<number, RowSignOff> {
  const map: Record<number, RowSignOff> = {};

  for (const entry of entries) {
    if (entry.event !== "signoff") {
      continue;
    }

    if (!SIGN_OFF_ACTIONS.has(entry.signOffAction as ExceptionSignOffAction)) {
      continue;
    }

    const materialityKey = MATERIALITY_KEYS.has(
      entry.materiality as MaterialityAssessmentKey,
    )
      ? (entry.materiality as MaterialityAssessmentKey)
      : "";

    map[entry.rowNumber] = {
      rowNumber: entry.rowNumber,
      action: entry.signOffAction as ExceptionSignOffAction,
      comment: entry.signOffComment,
      materialityKey,
      signedAt: entry.timestamp,
      preparer: entry.preparer,
      reviewer: entry.reviewer,
    };
  }

  return map;
}

export function latestMatchByRow(
  entries: AuditLogEntry[],
): Record<number, AuditLogEntry> {
  const map: Record<number, AuditLogEntry> = {};

  for (const entry of entries) {
    if (entry.event === "match") {
      map[entry.rowNumber] = entry;
    }
  }

  return map;
}

export function lockedRowNumbers(
  rowSignOffs: Record<number, RowSignOff>,
): Set<number> {
  return new Set(
    Object.keys(rowSignOffs)
      .map(Number)
      .filter((rowNumber) => Number.isFinite(rowNumber) && rowNumber > 0),
  );
}

export function writableResults(
  results: MatchResult[],
  locked: Set<number>,
): MatchResult[] {
  return results.filter((result) => !locked.has(result.rowNumber));
}

export function mergeLockedMatchResults(
  incoming: MatchResult[],
  previous: MatchResult[],
  locked: Set<number>,
  stubs: Record<number, MatchResult>,
): MatchResult[] {
  const previousByRow = new Map(
    previous.map((result) => [result.rowNumber, result]),
  );

  return incoming.map((result) => {
    if (!locked.has(result.rowNumber)) {
      return result;
    }

    return (
      previousByRow.get(result.rowNumber) ?? stubs[result.rowNumber] ?? result
    );
  });
}

export function stubMatchResultFromLog(entry: AuditLogEntry): MatchResult {
  const status: MatchStatus = entry.status || "exception";
  const confidence =
    typeof entry.confidence === "number" ? entry.confidence : 0;

  return {
    id: createId("match"),
    rowNumber: entry.rowNumber,
    inputValues: {},
    status,
    confidence,
    explanation: entry.explanation || "Locked after sign-off",
    outputValues: {
      invoiceDocument: entry.invoiceFile || null,
      invoiceAmount: null,
      invoiceDate: null,
      invoiceNumber: null,
      bankDocument: entry.bankFile || null,
      bankAmount: null,
      bankDate: null,
      bankReference: null,
      status,
      confidence,
    },
  };
}

export function stubLockedMatchResult(rowNumber: number): MatchResult {
  return {
    id: createId("match"),
    rowNumber,
    inputValues: {},
    status: "exception",
    confidence: 0,
    explanation: "Locked after sign-off",
    outputValues: {
      invoiceDocument: null,
      invoiceAmount: null,
      invoiceDate: null,
      invoiceNumber: null,
      bankDocument: null,
      bankAmount: null,
      bankDate: null,
      bankReference: null,
      status: "exception",
      confidence: 0,
    },
  };
}

export function normalizeRowSignOffs(raw: unknown): Record<number, RowSignOff> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const next: Record<number, RowSignOff> = {};

  for (const [key, value] of Object.entries(raw)) {
    const rowNumber = Number(key);
    if (!Number.isFinite(rowNumber) || rowNumber <= 0) {
      continue;
    }

    if (!value || typeof value !== "object") {
      continue;
    }

    next[rowNumber] = value as RowSignOff;
  }

  return next;
}

export function keepLockedResults(
  results: MatchResult[],
  locked: Set<number>,
): MatchResult[] {
  return results.filter((result) => locked.has(result.rowNumber));
}

export function buildMatchAuditEntry(input: {
  result: MatchResult;
  identity: AuditIdentity;
  configSnapshot: string;
  invoiceHash: string;
  bankHash: string;
  timestamp?: string;
}): AuditLogEntry {
  return {
    event: "match",
    timestamp: input.timestamp ?? new Date().toISOString(),
    rowNumber: input.result.rowNumber,
    status: input.result.status,
    confidence: input.result.confidence,
    invoiceFile: input.result.invoiceMatch?.fileName ?? "",
    invoiceHash: input.invoiceHash,
    bankFile: input.result.bankMatch?.fileName ?? "",
    bankHash: input.bankHash,
    explanation: input.result.explanation,
    configSnapshot: input.configSnapshot,
    preparer: input.identity.preparer,
    reviewer: input.identity.reviewer,
    signOffAction: "",
    signOffComment: "",
    materiality: "",
  };
}

export function buildSignOffAuditEntry(input: {
  result: MatchResult;
  signOff: RowSignOff;
  identity: AuditIdentity;
  configSnapshot?: string;
  invoiceHash?: string;
  bankHash?: string;
}): AuditLogEntry {
  return {
    event: "signoff",
    timestamp: input.signOff.signedAt,
    rowNumber: input.result.rowNumber,
    status: input.result.status,
    confidence: input.result.confidence,
    invoiceFile: input.result.invoiceMatch?.fileName ?? "",
    invoiceHash: input.invoiceHash ?? "",
    bankFile: input.result.bankMatch?.fileName ?? "",
    bankHash: input.bankHash ?? "",
    explanation: input.result.explanation,
    configSnapshot: input.configSnapshot ?? "",
    preparer: input.identity.preparer,
    reviewer: input.identity.reviewer,
    signOffAction: input.signOff.action,
    signOffComment: input.signOff.comment,
    materiality: input.signOff.materialityKey,
  };
}
