import { afterEach, describe, expect, it, vi } from "vitest";

import {
  canDownloadEvidence,
  canUseSaveFilePicker,
  extensionOf,
  isSavePickerAbort,
  isStoredCopyHint,
  sanitizeEvidenceFileName,
  triggerAnchorDownload,
} from "@/features/documents/services/evidence-file-name";
import type { ParsedDocument } from "@/types/domain";

function sampleDocument(
  overrides: Partial<ParsedDocument> = {},
): ParsedDocument {
  return {
    id: "doc-1",
    fileName: "invoice.pdf",
    kind: "invoice",
    sourceKind: "pdf",
    mimeType: "application/pdf",
    objectUrl: "blob:live",
    importedAt: "2026-09-01T00:00:00.000Z",
    size: 2048,
    contentSha256: "abc",
    pageCount: 1,
    status: "parsed",
    extractedText: "",
    pages: [],
    statementEntries: [],
    ...overrides,
  };
}

describe("extensionOf", () => {
  it("returns the last dotted suffix", () => {
    expect(extensionOf("invoice.pdf")).toBe(".pdf");
    expect(extensionOf("scan.PNG")).toBe(".PNG");
  });

  it("returns empty when there is no usable extension", () => {
    expect(extensionOf("invoice")).toBe("");
    expect(extensionOf(".pdf")).toBe("");
    expect(extensionOf("invoice.")).toBe("");
  });
});

describe("sanitizeEvidenceFileName", () => {
  it("keeps Myanmar Unicode and always reapplies the previous extension", () => {
    expect(sanitizeEvidenceFileName("ပြေစာ", "invoice.pdf")).toBe("ပြေစာ.pdf");
    expect(sanitizeEvidenceFileName("ပြေစာ.png", "invoice.pdf")).toBe(
      "ပြေစာ.pdf",
    );
  });

  it("strips path-illegal characters only", () => {
    expect(sanitizeEvidenceFileName("inv:a/b*c?.pdf", "old.pdf")).toBe(
      "invabc.pdf",
    );
  });

  it("returns undefined for empty or illegal-only names", () => {
    expect(sanitizeEvidenceFileName("   ", "invoice.pdf")).toBeUndefined();
    expect(
      sanitizeEvidenceFileName('\\\\/:*?"<>|', "invoice.pdf"),
    ).toBeUndefined();
    expect(sanitizeEvidenceFileName(".pdf", "invoice.pdf")).toBeUndefined();
  });

  it("keeps a name with no previous extension", () => {
    expect(sanitizeEvidenceFileName("receipt", "untitled")).toBe("receipt");
  });
});

describe("canDownloadEvidence", () => {
  it("allows parsed pdf and image with bytes or a hash", () => {
    expect(canDownloadEvidence(sampleDocument())).toBe(true);
    expect(
      canDownloadEvidence(
        sampleDocument({
          sourceKind: "image",
          mimeType: "image/png",
          objectUrl: "",
          contentSha256: "deadbeef",
        }),
      ),
    ).toBe(true);
  });

  it("rejects json, errors, and files with no stored bytes", () => {
    expect(canDownloadEvidence(sampleDocument({ sourceKind: "json" }))).toBe(
      false,
    );
    expect(canDownloadEvidence(sampleDocument({ status: "error" }))).toBe(
      false,
    );
    expect(
      canDownloadEvidence(
        sampleDocument({ objectUrl: "", contentSha256: undefined }),
      ),
    ).toBe(false);
  });
});

describe("isStoredCopyHint", () => {
  it("is true when normalized or stored size shrank", () => {
    expect(isStoredCopyHint({ normalized: true })).toBe(true);
    expect(isStoredCopyHint({ originalSize: 1000, storedSize: 400 })).toBe(
      true,
    );
    expect(isStoredCopyHint({ originalSize: 400, storedSize: 400 })).toBe(
      false,
    );
  });
});

describe("save picker and anchor download", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("detects showSaveFilePicker and AbortError", () => {
    expect(canUseSaveFilePicker()).toBe(false);
    vi.stubGlobal("showSaveFilePicker", vi.fn());
    expect(canUseSaveFilePicker()).toBe(true);

    const abort = new Error("cancel");
    abort.name = "AbortError";
    expect(isSavePickerAbort(abort)).toBe(true);
    expect(isSavePickerAbort(new Error("fail"))).toBe(false);
  });

  it("clicks a temporary download anchor and revokes the url", () => {
    const click = vi.fn();
    const remove = vi.fn();
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    vi.spyOn(document, "createElement").mockReturnValue({
      click,
      remove,
      rel: "",
      href: "",
      download: "",
    } as unknown as HTMLAnchorElement);
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);

    triggerAnchorDownload(new Blob(["pdf"]), "invoice.pdf");

    expect(click).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalled();
  });
});
