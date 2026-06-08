import type {
  BankMatch,
  MatchConfig,
  MatchFieldRole,
  MatchOutputField,
  MatchResult,
  ParsedDocument,
  SelectionSnapshot,
} from "@/types/domain";
import { DEFAULT_SCORE_WEIGHTS } from "@/types/domain";
import {
  compareDatesWithinTolerance,
  fuzzyIncludes,
  normalizeAlphaNumeric,
  normalizeText,
  parseFlexibleNumber,
  parsePossibleDate,
} from "@/utils/parsing";
import { toColumnLetter } from "@/utils/excel";
import { createId } from "@/utils/id";

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

function buildSequentialOutputColumnMap(
  selection: SelectionSnapshot | undefined,
  outputFields: MatchOutputField[],
) {
  if (!selection) {
    return {};
  }

  return outputFields.reduce<Partial<Record<MatchOutputField, number>>>(
    (map, field, index) => {
      map[field] =
        selection.outputColumnOptions[index]?.columnIndex ??
        selection.startColumnIndex + selection.columnCount + index;
      return map;
    },
    {},
  );
}

export function hydrateOutputColumnMap(
  selection: SelectionSnapshot | undefined,
  config: MatchConfig,
) {
  const sequentialMap = buildSequentialOutputColumnMap(
    selection,
    config.outputFields,
  );

  return {
    ...sequentialMap,
    ...config.outputColumnMap,
  };
}

export function buildOutputMappingSummary(
  selection: SelectionSnapshot | undefined,
  config: MatchConfig,
) {
  const hydratedMap = hydrateOutputColumnMap(selection, config);

  return config.outputFields.map((field) => {
    const columnIndex = hydratedMap[field];
    const option = selection?.outputColumnOptions.find(
      (entry) => entry.columnIndex === columnIndex,
    );

    return {
      field,
      columnIndex,
      label:
        option?.label ??
        (typeof columnIndex === "number"
          ? toColumnLetter(columnIndex)
          : "Unmapped"),
    };
  });
}

export function validateOutputMapping(
  selection: SelectionSnapshot | undefined,
  config: MatchConfig,
) {
  const hydratedMap = hydrateOutputColumnMap(selection, config);
  const targetColumns = config.outputFields
    .map((field) => hydratedMap[field])
    .filter((value): value is number => typeof value === "number");

  const duplicateColumns = targetColumns.filter(
    (value, index) => targetColumns.indexOf(value) !== index,
  );

  return {
    hydratedMap,
    missingFields: config.outputFields.filter(
      (field) => typeof hydratedMap[field] !== "number",
    ),
    duplicateColumns: [...new Set(duplicateColumns)],
  };
}

export interface MatchingRunProgress {
  processed: number;
  total: number;
}

export interface MatchingRunOptions {
  batchSize?: number;
  onProgress?: (progress: MatchingRunProgress) => void;
}

function scoreInvoiceDocument(
  rowValues: Record<string, unknown>,
  config: MatchConfig,
  document: ParsedDocument,
) {
  const weights = config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS;
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
    return {
      score: 0,
      matchedFields: [],
      match: undefined,
    };
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
): BankMatch | undefined {
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

  const weights = config.scoreWeights ?? DEFAULT_SCORE_WEIGHTS;
  let bestMatch: BankMatch | undefined;

  for (const document of documents) {
    for (const entry of document.statementEntries) {
      let score = 0;
      let referenceMatched = false;

      if (rowInvoiceNumber) {
        if (entry.reference) {
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

        // Fallback: check if the row's invoice number is contained within the raw bank statement line text
        if (!referenceMatched && entry.rawLine) {
          const normalizedLine = normalizeAlphaNumeric(entry.rawLine);
          if (normalizedLine.includes(rowInvoiceNumber)) {
            score += Math.round(weights.invoiceNumber * 0.58);
            referenceMatched = true;
          }
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
        bestMatch = score
          ? {
              documentId: document.id,
              fileName: document.fileName,
              pageNumber: entry.pageNumber,
              entryId: entry.id,
              score,
              snippet: entry.rawLine,
              extractedReference: entry.reference,
              extractedAmount: entry.amount,
              extractedDate: entry.date,
            }
          : bestMatch;
      }
    }
  }

  return bestMatch;
}

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

export function runDocumentMatching(
  selection: SelectionSnapshot,
  documents: ParsedDocument[],
  config: MatchConfig,
  options: MatchingRunOptions = {},
) {
  const invoiceDocuments = documents.filter(
    (document) => document.kind === "invoice" && document.status === "parsed",
  );
  const bankDocuments = documents.filter(
    (document) =>
      document.kind === "bank-statement" && document.status === "parsed",
  );

  const results: MatchResult[] = [];
  const batchSize = Math.max(1, options.batchSize ?? 25);
  const total = selection.rows.length;

  for (let index = 0; index < selection.rows.length; index += 1) {
    const row = selection.rows[index];
    const invoiceCandidates = invoiceDocuments
      .map((document) => scoreInvoiceDocument(row.values, config, document))
      .sort((left, right) => right.score - left.score);
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

    const processed = index + 1;
    if (processed % batchSize === 0 || processed === total) {
      options.onProgress?.({ processed, total });
    }
  }

  return results;
}

export function suggestInitialConfig(
  selection?: SelectionSnapshot,
  outputFields?: MatchOutputField[],
): MatchConfig {
  const columns = selection?.columns ?? [];
  const resolvedOutputFields = outputFields ?? [
    "invoiceDocument",
    "invoiceAmount",
    "invoiceDate",
    "invoiceNumber",
    "bankDocument",
    "bankAmount",
    "bankDate",
    "bankReference",
    "status",
    "confidence",
  ];

  const amountColumn = columns.find(
    (column) => column.inferredRole === "amount",
  );
  const dateColumn = columns.find((column) => column.inferredRole === "date");
  const invoiceNumberColumn = columns.find(
    (column) => column.inferredRole === "invoiceNumber",
  );

  return {
    amountColumnId: amountColumn?.id,
    dateColumnId: dateColumn?.id,
    invoiceNumberColumnId: invoiceNumberColumn?.id,
    amountTolerance: 1,
    dateToleranceDays: 5,
    requireInvoiceNumber: true,
    fuzzyReferenceMatch: true,
    outputFields: resolvedOutputFields,
    outputColumnMap: buildSequentialOutputColumnMap(
      selection,
      resolvedOutputFields,
    ),
  };
}

export function getSuggestedInputColumnId(
  selection: SelectionSnapshot | undefined,
  role: MatchFieldRole,
) {
  return selection?.columns.find((column) => column.inferredRole === role)?.id;
}

export function buildResultsSummary(results: MatchResult[]) {
  return {
    matched: results.filter((result) => result.status === "matched").length,
    partial: results.filter((result) => result.status === "partial").length,
    exception: results.filter((result) => result.status === "exception").length,
    averageConfidence:
      results.length > 0
        ? Math.round(
            results.reduce((total, result) => total + result.confidence, 0) /
              results.length,
          )
        : 0,
  };
}

export function buildTemplateName() {
  return `Template ${new Date().toLocaleDateString("en-GB")}`;
}

export function getResultByLinkedReference(
  results: MatchResult[],
  rowNumber: number,
  preferredDocument: "invoice" | "bank-statement" = "invoice",
) {
  const result = results.find((entry) => entry.rowNumber === rowNumber);
  if (!result) {
    return undefined;
  }

  if (preferredDocument === "invoice" && result.invoiceMatch) {
    return {
      rowId: result.id,
      documentId: result.invoiceMatch.documentId,
      pageNumber: result.invoiceMatch.pageNumber,
      query: normalizeText(
        result.invoiceMatch.extractedInvoiceNumber ??
          result.invoiceMatch.extractedAmount ??
          "",
      ),
    };
  }

  if (result.bankMatch) {
    return {
      rowId: result.id,
      documentId: result.bankMatch.documentId,
      pageNumber: result.bankMatch.pageNumber,
      query: normalizeText(
        result.bankMatch.extractedReference ??
          result.bankMatch.extractedAmount ??
          "",
      ),
    };
  }

  return undefined;
}
