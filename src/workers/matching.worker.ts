/**
 * Web Worker for document matching.
 * Runs matching logic off the main thread to prevent UI freezes
 * when processing 1000+ documents.
 */

import type {
  MatchConfig,
  MatchResult,
  ParsedDocument,
  SelectionSnapshot,
} from "@/types/domain";
import {
  compareDatesWithinTolerance,
  fuzzyIncludes,
  normalizeAlphaNumeric,
  parseFlexibleNumber,
  parsePossibleDate,
} from "@/utils/parsing";
import { createId } from "@/utils/id";

const DEFAULT_WEIGHTS = { invoiceNumber: 60, amount: 25, date: 15 };

function coerceExcelPrimitive(value: unknown) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }
  return value === undefined ? null : String(value);
}

function scoreInvoiceDocument(
  rowValues: Record<string, unknown>,
  config: MatchConfig,
  document: ParsedDocument,
) {
  const weights = config.scoreWeights ?? DEFAULT_WEIGHTS;
  let score = 0;
  const matchedFields: string[] = [];
  let referenceMatched = false;

  const invoiceCandidateValue = config.invoiceNumberColumnId
    ? rowValues[config.invoiceNumberColumnId]
    : "";
  const amountCandidateValue = config.amountColumnId
    ? rowValues[config.amountColumnId]
    : null;
  const dateCandidateValue = config.dateColumnId
    ? rowValues[config.dateColumnId]
    : null;

  const rowInvoiceNumber = normalizeAlphaNumeric(
    coerceExcelPrimitive(invoiceCandidateValue),
  );
  const rowAmount = parseFlexibleNumber(
    coerceExcelPrimitive(amountCandidateValue),
  );
  const rowDate = parsePossibleDate(coerceExcelPrimitive(dateCandidateValue));

  if (rowInvoiceNumber && document.invoiceNumber?.value) {
    const normalizedDocument = normalizeAlphaNumeric(
      document.invoiceNumber.value,
    );
    if (rowInvoiceNumber === normalizedDocument) {
      score += weights.invoiceNumber;
      matchedFields.push("invoice number");
      referenceMatched = true;
    } else if (
      config.fuzzyReferenceMatch &&
      fuzzyIncludes(rowInvoiceNumber, normalizedDocument)
    ) {
      score += Math.round(weights.invoiceNumber * 0.58);
      matchedFields.push("invoice number (fuzzy)");
      referenceMatched = true;
    }
  }

  if (config.requireInvoiceNumber && rowInvoiceNumber && !referenceMatched) {
    return { score: 0, matchedFields: [], match: undefined };
  }

  if (
    typeof rowAmount === "number" &&
    typeof document.amount?.value === "number"
  ) {
    const delta = Math.abs(rowAmount - document.amount.value);
    if (delta <= config.amountTolerance) {
      score += weights.amount;
      matchedFields.push("amount");
    }
  }

  if (rowDate && document.date?.value) {
    if (
      compareDatesWithinTolerance(
        rowDate,
        document.date.value,
        config.dateToleranceDays,
      )
    ) {
      score += weights.date;
      matchedFields.push("date");
    }
  }

  return {
    score,
    matchedFields,
    match:
      score > 0
        ? {
            documentId: document.id,
            fileName: document.fileName,
            pageNumber:
              document.invoiceNumber?.pageNumber ??
              document.amount?.pageNumber ??
              1,
            score,
            snippet:
              document.pages.find(
                (page) =>
                  page.pageNumber === (document.invoiceNumber?.pageNumber ?? 1),
              )?.snippets[0] ??
              document.pages[0]?.snippets[0] ??
              document.fileName,
            extractedInvoiceNumber: document.invoiceNumber?.value,
            extractedAmount: document.amount?.value,
            extractedDate: document.date?.value,
          }
        : undefined,
  };
}

function scoreBankEntries(
  rowValues: Record<string, unknown>,
  config: MatchConfig,
  documents: ParsedDocument[],
) {
  const weights = config.scoreWeights ?? DEFAULT_WEIGHTS;
  const invoiceCandidateValue = config.invoiceNumberColumnId
    ? rowValues[config.invoiceNumberColumnId]
    : "";
  const amountCandidateValue = config.amountColumnId
    ? rowValues[config.amountColumnId]
    : null;
  const dateCandidateValue = config.dateColumnId
    ? rowValues[config.dateColumnId]
    : null;

  const rowInvoiceNumber = normalizeAlphaNumeric(
    coerceExcelPrimitive(invoiceCandidateValue),
  );
  const rowAmount = parseFlexibleNumber(
    coerceExcelPrimitive(amountCandidateValue),
  );
  const rowDate = parsePossibleDate(coerceExcelPrimitive(dateCandidateValue));

  let bestMatch: MatchResult["bankMatch"] | undefined;

  for (const document of documents) {
    for (const entry of document.statementEntries) {
      let score = 0;
      let referenceMatched = false;

      if (rowInvoiceNumber && entry.reference) {
        const normalizedReference = normalizeAlphaNumeric(entry.reference);
        if (rowInvoiceNumber === normalizedReference) {
          score += Math.round(weights.invoiceNumber * 0.58);
          referenceMatched = true;
        } else if (
          config.fuzzyReferenceMatch &&
          fuzzyIncludes(rowInvoiceNumber, normalizedReference)
        ) {
          score += Math.round(weights.invoiceNumber * 0.33);
          referenceMatched = true;
        }
      }

      if (
        config.requireInvoiceNumber &&
        rowInvoiceNumber &&
        !referenceMatched
      ) {
        continue;
      }

      if (typeof rowAmount === "number" && typeof entry.amount === "number") {
        const delta = Math.abs(rowAmount - entry.amount);
        if (delta <= config.amountTolerance) {
          score += Math.round(weights.amount * 1.8);
        }
      }

      if (
        rowDate &&
        entry.date &&
        compareDatesWithinTolerance(
          rowDate,
          entry.date,
          config.dateToleranceDays,
        )
      ) {
        score += Math.round(weights.date * 1.33);
      }

      if (!bestMatch || score > bestMatch.score) {
        if (score > 0) {
          bestMatch = {
            documentId: document.id,
            fileName: document.fileName,
            pageNumber: entry.pageNumber,
            entryId: entry.id,
            score,
            snippet: entry.rawLine,
            extractedReference: entry.reference,
            extractedAmount: entry.amount,
            extractedDate: entry.date,
          };
        }
      }
    }
  }

  return bestMatch;
}

interface MatchingRequest {
  type: "run";
  selection: SelectionSnapshot;
  documents: ParsedDocument[];
  config: MatchConfig;
  batchSize: number;
}

interface MatchingProgress {
  type: "progress";
  processed: number;
  total: number;
}

interface MatchingComplete {
  type: "complete";
  results: MatchResult[];
}

type MatchOutputField =
  | "invoiceDocument"
  | "invoiceAmount"
  | "invoiceDate"
  | "invoiceNumber"
  | "bankDocument"
  | "bankAmount"
  | "bankDate"
  | "bankReference"
  | "status"
  | "confidence";

function buildOutputValues(
  result: MatchResult,
): Record<MatchOutputField, string | number | boolean | null> {
  return {
    invoiceDocument: result.invoiceMatch?.fileName ?? null,
    invoiceAmount: result.invoiceMatch?.extractedAmount ?? null,
    invoiceDate: result.invoiceMatch?.extractedDate ?? null,
    invoiceNumber: result.invoiceMatch?.extractedInvoiceNumber ?? null,
    bankDocument: result.bankMatch?.fileName ?? null,
    bankAmount: result.bankMatch?.extractedAmount ?? null,
    bankDate: result.bankMatch?.extractedDate ?? null,
    bankReference: result.bankMatch?.extractedReference ?? null,
    status: result.status,
    confidence: Math.round(result.confidence),
  };
}

self.onmessage = (event: MessageEvent<MatchingRequest>) => {
  const { selection, documents, config, batchSize } = event.data;
  const invoiceDocuments = documents.filter(
    (d) => d.kind === "invoice" && d.status === "parsed",
  );
  const bankDocuments = documents.filter(
    (d) => d.kind === "bank-statement" && d.status === "parsed",
  );

  const results: MatchResult[] = [];
  const total = selection.rows.length;

  for (let i = 0; i < total; i++) {
    const row = selection.rows[i];

    const invoiceCandidates = invoiceDocuments
      .map((doc) => scoreInvoiceDocument(row.values, config, doc))
      .sort((a, b) => b.score - a.score);
    const invoiceCandidate = invoiceCandidates[0];
    const bankCandidate = scoreBankEntries(row.values, config, bankDocuments);

    const totalScore =
      (invoiceCandidate?.score ?? 0) + (bankCandidate?.score ?? 0);
    const status =
      totalScore >= 90 ? "matched" : totalScore >= 45 ? "partial" : "exception";
    const confidence = Math.min(100, totalScore);

    const explanationParts = [
      invoiceCandidate?.matchedFields.length
        ? `Invoice matched by ${invoiceCandidate.matchedFields.join(", ")}`
        : "No strong invoice match",
      bankCandidate
        ? "bank statement evidence identified"
        : "no bank statement hit",
    ];

    const result: MatchResult = {
      id: createId("match"),
      rowNumber: row.rowNumber,
      inputValues: row.values,
      status,
      confidence,
      explanation: explanationParts.join("; "),
      invoiceMatch: invoiceCandidate?.match,
      bankMatch: bankCandidate,
      outputValues: {} as Record<
        MatchOutputField,
        string | number | boolean | null
      >,
    };
    result.outputValues = buildOutputValues(result);
    results.push(result);

    // Report progress every batch
    if ((i + 1) % batchSize === 0 || i === total - 1) {
      const progress: MatchingProgress = {
        type: "progress",
        processed: i + 1,
        total,
      };
      self.postMessage(progress);
    }
  }

  const complete: MatchingComplete = { type: "complete", results };
  self.postMessage(complete);
};
