import type { ParsedDocument } from "@/types/domain";

function documentHasParsePayload(document: ParsedDocument): boolean {
  if (document.extractedText.trim()) {
    return true;
  }

  if (document.rawJson) {
    return true;
  }

  if (document.statementEntries.length > 0) {
    return true;
  }

  return document.pages.some(
    (page) => page.text.trim() || page.snippets.length > 0,
  );
}

export function isFatDocument(document: ParsedDocument): boolean {
  return documentHasParsePayload(document);
}

export function areDocumentsStubOnly(documents: ParsedDocument[]): boolean {
  if (documents.length === 0) {
    return true;
  }

  return documents.every((document) => !documentHasParsePayload(document));
}

export function toDocumentStub(document: ParsedDocument): ParsedDocument {
  return {
    id: document.id,
    fileName: document.fileName,
    kind: document.kind,
    sourceKind: document.sourceKind,
    mimeType: document.mimeType,
    objectUrl: "",
    importedAt: document.importedAt,
    size: document.size,
    contentSha256: document.contentSha256,
    originalSize: document.originalSize,
    storedSize: document.storedSize,
    normalized: document.normalized,
    pageCount: document.pageCount,
    status: document.status,
    error: document.error,
    extractedText: "",
    pages: [],
    invoiceNumber: document.invoiceNumber,
    amount: document.amount,
    date: document.date,
    vendor: document.vendor,
    statementEntries: [],
  };
}

export function toDocumentPayload(document: ParsedDocument): ParsedDocument {
  return {
    ...document,
    objectUrl: "",
  };
}

export function mergeDocumentPayload(
  stub: ParsedDocument,
  payload: ParsedDocument | undefined,
  live?: ParsedDocument,
): ParsedDocument {
  const objectUrl =
    live?.objectUrl || stub.objectUrl || payload?.objectUrl || "";

  if (!payload) {
    return {
      ...stub,
      objectUrl,
    };
  }

  return {
    ...stub,
    ...payload,
    id: stub.id,
    fileName: stub.fileName || payload.fileName,
    objectUrl,
    invoiceNumber: stub.invoiceNumber ?? payload.invoiceNumber,
    amount: stub.amount ?? payload.amount,
    date: stub.date ?? payload.date,
    vendor: stub.vendor ?? payload.vendor,
    extractedText: payload.extractedText || stub.extractedText,
    pages: payload.pages.length ? payload.pages : stub.pages,
    statementEntries: payload.statementEntries.length
      ? payload.statementEntries
      : stub.statementEntries,
    rawJson: payload.rawJson ?? stub.rawJson,
  };
}

export function mergeDocumentLists(
  stubs: ParsedDocument[],
  payloads: ParsedDocument[],
  live: ParsedDocument[] = [],
): ParsedDocument[] {
  const payloadById = new Map(
    payloads.map((document) => [document.id, document]),
  );
  const liveById = new Map(live.map((document) => [document.id, document]));
  const seen = new Set<string>();
  const merged: ParsedDocument[] = [];

  for (const stub of stubs) {
    seen.add(stub.id);
    merged.push(
      mergeDocumentPayload(
        stub,
        payloadById.get(stub.id),
        liveById.get(stub.id),
      ),
    );
  }

  for (const payload of payloads) {
    if (seen.has(payload.id)) {
      continue;
    }

    seen.add(payload.id);
    merged.push(
      mergeDocumentPayload(payload, payload, liveById.get(payload.id)),
    );
  }

  for (const liveDocument of live) {
    if (seen.has(liveDocument.id)) {
      continue;
    }

    merged.push(liveDocument);
  }

  return merged;
}
