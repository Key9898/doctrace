import type {
  DocumentKind,
  FieldCandidate,
  ParsedDocument,
  ParsedPage,
  SourceKind,
  StatementEntry,
} from "@/types/domain";
import {
  extractAmounts,
  extractDates,
  extractInvoiceIdentifiers,
  normalizeAlphaNumeric,
  normalizeText,
  parseFlexibleNumber,
  parsePossibleDate,
  splitIntoLines,
} from "@/utils/parsing";
import { createId } from "@/utils/id";

function buildId() {
  return createId("doc");
}

function createFieldCandidate<TValue>(
  value: TValue | undefined,
  sourceText: string,
  pageNumber: number,
  confidence: number,
): FieldCandidate<TValue> | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return {
    value,
    sourceText,
    pageNumber,
    confidence,
  };
}

function extractPrimaryFields(pages: ParsedPage[]) {
  const text = pages.map((page) => page.text).join("\n");
  const amounts = extractAmounts(text);
  const dates = extractDates(text);
  const invoiceIdentifiers = extractInvoiceIdentifiers(text);

  const sortedAmounts = amounts.sort(
    (left, right) => (right.value ?? 0) - (left.value ?? 0),
  );
  const prioritizedAmount = sortedAmounts[0];
  const prioritizedDate = dates[0];
  const prioritizedInvoiceId = invoiceIdentifiers[0];

  return {
    invoiceNumber: createFieldCandidate(
      prioritizedInvoiceId,
      prioritizedInvoiceId ?? "",
      findPageForSnippet(pages, prioritizedInvoiceId),
      prioritizedInvoiceId ? 0.82 : 0,
    ),
    amount: createFieldCandidate(
      prioritizedAmount?.value,
      prioritizedAmount?.raw ?? "",
      findPageForSnippet(pages, prioritizedAmount?.raw),
      prioritizedAmount ? 0.78 : 0,
    ),
    date: createFieldCandidate(
      prioritizedDate?.value,
      prioritizedDate?.raw ?? "",
      findPageForSnippet(pages, prioritizedDate?.raw),
      prioritizedDate ? 0.7 : 0,
    ),
  };
}

function extractStatementEntries(
  documentId: string,
  fileName: string,
  pages: ParsedPage[],
) {
  const entries: StatementEntry[] = [];

  for (const page of pages) {
    const lines = splitIntoLines(page.text);

    for (const line of lines) {
      const amounts = extractAmounts(line);
      const dates = extractDates(line);

      if (!amounts.length || !dates.length) {
        continue;
      }

      const invoiceId = extractInvoiceIdentifiers(line)[0];
      const referenceCandidate = invoiceId ?? line.slice(0, 64);
      const lastAmount = amounts[amounts.length - 1];
      const firstDate = dates[0];

      entries.push({
        id: buildId(),
        documentId,
        fileName,
        pageNumber: page.pageNumber,
        amount: lastAmount?.value,
        date: firstDate?.value,
        reference: normalizeText(referenceCandidate),
        rawLine: line,
      });
    }
  }

  return dedupeStatementEntries(entries);
}

function dedupeStatementEntries(entries: StatementEntry[]) {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    const key = [
      entry.documentId,
      entry.pageNumber,
      entry.amount,
      entry.date,
      normalizeAlphaNumeric(entry.reference ?? ""),
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function findPageForSnippet(pages: ParsedPage[], snippet?: string) {
  if (!snippet) {
    return 1;
  }

  return pages.find((page) => page.text.includes(snippet))?.pageNumber ?? 1;
}

async function loadOcrService() {
  return import("./ocr.service");
}

async function loadPdfService() {
  return import("./pdf.service");
}

async function parseImageDocument(file: File, kind: DocumentKind) {
  const id = buildId();
  const objectUrl = URL.createObjectURL(file);
  const { runOcr } = await loadOcrService();
  const text = await runOcr(objectUrl);
  const pages = [
    {
      pageNumber: 1,
      text,
      snippets: splitIntoLines(text).slice(0, 6),
    },
  ];
  const primaryFields = extractPrimaryFields(pages);

  return {
    id,
    fileName: file.name,
    kind,
    sourceKind: "image" satisfies SourceKind,
    mimeType: file.type || "image/*",
    objectUrl,
    importedAt: new Date().toISOString(),
    size: file.size,
    pageCount: 1,
    status: "parsed" as const,
    extractedText: text,
    pages,
    ...primaryFields,
    statementEntries:
      kind === "bank-statement"
        ? extractStatementEntries(id, file.name, pages)
        : [],
  } satisfies ParsedDocument;
}

async function parsePdfDocument(file: File, kind: DocumentKind) {
  const buffer = await file.arrayBuffer();
  const objectUrl = URL.createObjectURL(file);
  const { runOcr } = await loadOcrService();
  const { readPdfPages } = await loadPdfService();
  const pdfPayload = await readPdfPages(buffer, runOcr);
  const pages = pdfPayload.pages;
  const primaryFields = extractPrimaryFields(pages);
  const id = buildId();

  return {
    id,
    fileName: file.name,
    kind,
    sourceKind: "pdf" satisfies SourceKind,
    mimeType: file.type || "application/pdf",
    objectUrl,
    importedAt: new Date().toISOString(),
    size: file.size,
    pageCount: pdfPayload.pageCount,
    status: "parsed" as const,
    extractedText: pages.map((page) => page.text).join("\n"),
    pages,
    ...primaryFields,
    statementEntries:
      kind === "bank-statement"
        ? extractStatementEntries(id, file.name, pages)
        : [],
  } satisfies ParsedDocument;
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonEvidenceSeed {
  id?: string;
  kind?: string;
  type?: string;
  sourceKind?: string;
  fileName?: string;
  name?: string;
  mimeType?: string;
  importedAt?: string;
  extractedText?: string;
  text?: string;
  pages?: Array<{
    pageNumber?: number;
    text?: string;
    snippets?: string[];
  }>;
  invoiceNumber?: string;
  amount?: string | number;
  date?: string;
  vendor?: string;
  statementEntries?: Array<{
    id?: string;
    pageNumber?: number;
    amount?: string | number;
    date?: string;
    reference?: string;
    rawLine?: string;
  }>;
}

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeDocumentKind(
  rawKind: string | undefined,
  fallbackKind: DocumentKind,
): DocumentKind {
  const normalized = rawKind?.toLowerCase().replace(/[_\s]/g, "-");

  if (
    normalized === "bank-statement" ||
    normalized === "bankstatement" ||
    normalized === "statement"
  ) {
    return "bank-statement";
  }

  if (
    normalized === "invoice" ||
    normalized === "receipt" ||
    normalized === "voucher"
  ) {
    return "invoice";
  }

  return fallbackKind;
}

function coerceJsonPages(seed: JsonEvidenceSeed, rawJson: string) {
  const pages =
    seed.pages?.map((page, index) => ({
      pageNumber: page.pageNumber ?? index + 1,
      text: normalizeText(page.text ?? seed.extractedText ?? seed.text ?? ""),
      snippets:
        page.snippets?.filter(Boolean) ??
        splitIntoLines(
          page.text ?? seed.extractedText ?? seed.text ?? "",
        ).slice(0, 6),
    })) ?? [];

  if (pages.length) {
    return pages;
  }

  const text = normalizeText(seed.extractedText ?? seed.text ?? rawJson);

  return [
    {
      pageNumber: 1,
      text,
      snippets: splitIntoLines(text).slice(0, 6),
    },
  ] satisfies ParsedPage[];
}

function coerceJsonStatementEntries(
  seed: JsonEvidenceSeed,
  documentId: string,
  fileName: string,
  pages: ParsedPage[],
) {
  if (!seed.statementEntries?.length) {
    return extractStatementEntries(documentId, fileName, pages);
  }

  return seed.statementEntries.map((entry, index) => ({
    id: entry.id ?? buildId(),
    documentId,
    fileName,
    pageNumber: entry.pageNumber ?? 1,
    amount: parseFlexibleNumber(entry.amount ?? null),
    date: parsePossibleDate(entry.date ?? null),
    reference: normalizeText(entry.reference ?? ""),
    rawLine:
      normalizeText(entry.rawLine ?? "") ||
      `Entry ${index + 1} ${normalizeText(entry.reference ?? "")}`.trim(),
  }));
}

function createJsonDocument(
  seed: JsonEvidenceSeed,
  fallbackKind: DocumentKind,
  rawJson: string,
  index: number,
) {
  const id = seed.id ?? buildId();
  const kind = normalizeDocumentKind(
    typeof seed.kind === "string"
      ? seed.kind
      : typeof seed.type === "string"
        ? seed.type
        : undefined,
    fallbackKind,
  );
  const fileName =
    normalizeText(seed.fileName ?? seed.name ?? null) ||
    `${kind}-${String(index + 1).padStart(2, "0")}.json`;
  const pages = coerceJsonPages(seed, rawJson);
  const extractedText = pages.map((page) => page.text).join("\n");
  const primaryFields = extractPrimaryFields(pages);

  if (!primaryFields.invoiceNumber && seed.invoiceNumber) {
    primaryFields.invoiceNumber = createFieldCandidate(
      normalizeText(seed.invoiceNumber),
      normalizeText(seed.invoiceNumber),
      1,
      0.95,
    );
  }

  if (!primaryFields.amount && seed.amount !== undefined) {
    const amountValue = parseFlexibleNumber(seed.amount ?? null);
    primaryFields.amount = createFieldCandidate(
      amountValue,
      normalizeText(seed.amount ?? ""),
      1,
      0.95,
    );
  }

  if (!primaryFields.date && seed.date) {
    const dateValue = parsePossibleDate(seed.date);
    primaryFields.date = createFieldCandidate(
      dateValue,
      normalizeText(seed.date),
      1,
      0.95,
    );
  }

  return {
    id,
    fileName,
    kind,
    sourceKind: "json" satisfies SourceKind,
    mimeType: seed.mimeType || "application/json",
    objectUrl: "",
    importedAt: seed.importedAt || new Date().toISOString(),
    size: rawJson.length,
    pageCount: pages.length,
    status: "parsed" as const,
    extractedText,
    pages,
    ...primaryFields,
    statementEntries:
      kind === "bank-statement"
        ? coerceJsonStatementEntries(seed, id, fileName, pages)
        : [],
    rawJson,
  } satisfies ParsedDocument;
}

async function parseJsonDocuments(file: File, fallbackKind: DocumentKind) {
  const raw = await file.text();
  const payload = JSON.parse(raw) as JsonValue;
  const seeds = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.documents)
      ? payload.documents
      : [payload];

  return seeds
    .filter(isRecord)
    .map((seed, index) =>
      createJsonDocument(
        seed as unknown as JsonEvidenceSeed,
        fallbackKind,
        raw,
        index,
      ),
    );
}

export async function parseImportFile(file: File, kind: DocumentKind) {
  try {
    if (
      file.type === "application/json" ||
      file.name.toLowerCase().endsWith(".json")
    ) {
      return await parseJsonDocuments(file, kind);
    }

    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      return [await parsePdfDocument(file, kind)];
    }

    return [await parseImageDocument(file, kind)];
  } catch (error) {
    return [
      {
        id: buildId(),
        fileName: file.name,
        kind,
        sourceKind:
          file.type === "application/pdf"
            ? "pdf"
            : file.type === "application/json"
              ? "json"
              : "image",
        mimeType: file.type || "application/octet-stream",
        objectUrl:
          file.type === "application/json" ? "" : URL.createObjectURL(file),
        importedAt: new Date().toISOString(),
        size: file.size,
        pageCount: 0,
        status: "error" as const,
        error:
          error instanceof Error
            ? error.message
            : "Unable to parse this document.",
        extractedText: "",
        pages: [],
        statementEntries: [],
        rawJson:
          file.type === "application/json" ||
          file.name.toLowerCase().endsWith(".json")
            ? await file.text().catch(() => "")
            : undefined,
      } satisfies ParsedDocument,
    ];
  }
}
