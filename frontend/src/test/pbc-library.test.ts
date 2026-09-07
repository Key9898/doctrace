import { describe, expect, it } from "vitest";

import {
  clearPbcUploadedFile,
  pbcImportedDocumentIds,
} from "@/features/pbc-portal/services/pbc-library";
import { useDocTraceStore } from "@/stores/app-store";
import type { ParsedDocument } from "@/types/domain";

function invoice(id: string): ParsedDocument {
  return {
    id,
    fileName: "invoice-01.json",
    kind: "invoice",
    sourceKind: "json",
    mimeType: "application/json",
    objectUrl: `blob:${id}`,
    importedAt: "2026-09-06T00:00:00.000Z",
    size: 32,
    pageCount: 1,
    status: "parsed",
    extractedText: id,
    pages: [],
    statementEntries: [],
  };
}

describe("pbcImportedDocumentIds", () => {
  it("returns an empty list when ids are missing", () => {
    expect(pbcImportedDocumentIds(undefined)).toEqual([]);
    expect(pbcImportedDocumentIds([])).toEqual([]);
  });

  it("returns stored ids as-is after trim", () => {
    expect(pbcImportedDocumentIds([" doc-a ", "doc-b", " "])).toEqual([
      "doc-a",
      "doc-b",
    ]);
  });

  it("does not use fileName as the key", () => {
    const leftover = invoice("leftover-id");
    const imported = invoice("pbc-import-id");

    expect(leftover.fileName).toBe(imported.fileName);
    expect(pbcImportedDocumentIds([imported.id])).toEqual(["pbc-import-id"]);
  });
});

describe("clearPbcUploadedFile", () => {
  it("drops fileName and imported ids", () => {
    expect(
      clearPbcUploadedFile({
        id: "pbc_3",
        status: "Uploaded",
        fileName: "invoice-01.json",
        uploadedAt: "2026-09-06T12:00:00.000Z",
        importedDocumentIds: ["pbc-import-id"],
      }),
    ).toEqual({
      id: "pbc_3",
      status: "Pending",
      fileName: undefined,
      uploadedAt: undefined,
      importedDocumentIds: undefined,
    });
  });
});

describe("library delete by stored id", () => {
  it("removes only the stored import id when file names match", () => {
    const store = useDocTraceStore.getState();
    const previous = store.documents;
    const leftover = invoice("leftover-id");
    const imported = invoice("pbc-import-id");

    try {
      store.upsertDocument(leftover);
      store.upsertDocument(imported);

      const ids = pbcImportedDocumentIds([imported.id]);
      for (const id of ids) {
        store.removeDocument(id);
      }

      const remaining = useDocTraceStore.getState().documents;
      expect(remaining.map((doc) => doc.id)).toContain("leftover-id");
      expect(remaining.map((doc) => doc.id)).not.toContain("pbc-import-id");
    } finally {
      useDocTraceStore.setState({ documents: previous });
    }
  });
});
