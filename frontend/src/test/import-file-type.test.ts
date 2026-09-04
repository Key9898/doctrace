import { afterEach, describe, expect, it, vi } from "vitest";

import { parseImportFile } from "@/features/documents/services/document-parser.service";
import {
  isAllowedEvidenceFile,
  UNSUPPORTED_FILE_TYPE,
} from "@/lib/files/evidence-file";

function fileLike(name: string, type: string) {
  return { name, type };
}

describe("isAllowedEvidenceFile", () => {
  it("accepts pdf, json, and png by extension", () => {
    expect(isAllowedEvidenceFile(fileLike("invoice.pdf", ""))).toBe(true);
    expect(isAllowedEvidenceFile(fileLike("bundle.json", ""))).toBe(true);
    expect(isAllowedEvidenceFile(fileLike("scan.png", ""))).toBe(true);
  });

  it("accepts png with an empty MIME type", () => {
    expect(isAllowedEvidenceFile(fileLike("scan.png", ""))).toBe(true);
  });

  it("accepts an extensionless file when the MIME is image/png", () => {
    expect(isAllowedEvidenceFile(fileLike("scan", "image/png"))).toBe(true);
  });

  it("rejects txt, webp, docx, and heic by extension", () => {
    expect(isAllowedEvidenceFile(fileLike("notes.txt", "text/plain"))).toBe(
      false,
    );
    expect(isAllowedEvidenceFile(fileLike("photo.webp", "image/webp"))).toBe(
      false,
    );
    expect(
      isAllowedEvidenceFile(
        fileLike(
          "letter.docx",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
      ),
    ).toBe(false);
    expect(isAllowedEvidenceFile(fileLike("scan.heic", "image/heic"))).toBe(
      false,
    );
  });

  it("rejects webp even when the MIME is image/png", () => {
    expect(isAllowedEvidenceFile(fileLike("photo.webp", "image/png"))).toBe(
      false,
    );
  });

  it("rejects an extensionless file with empty MIME", () => {
    expect(isAllowedEvidenceFile(fileLike("untitled", ""))).toBe(false);
  });
});

describe("parseImportFile unsupported types", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an error document for txt without creating an object URL", async () => {
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:test");
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });

    const parsed = await parseImportFile(file, "invoice");
    const document = parsed[0];

    expect(parsed).toHaveLength(1);
    expect(document?.status).toBe("error");
    expect(document?.error).toBe(UNSUPPORTED_FILE_TYPE);
    expect(document?.objectUrl).toBe("");
    expect(document?.sourceKind).toBe("image");
    expect(createObjectURL).not.toHaveBeenCalled();
  });
});

describe("parseImportFile JSON seeds", () => {
  it("does not copy the whole bundle into each seed extractedText", async () => {
    const payload = [
      { invoiceNumber: "INV-A", amount: 10 },
      { invoiceNumber: "INV-B", amount: 20 },
    ];
    const file = new File([JSON.stringify(payload)], "bundle.json", {
      type: "application/json",
    });

    const parsed = await parseImportFile(file, "invoice");

    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.extractedText).toContain("INV-A");
    expect(parsed[0]?.extractedText).not.toContain("INV-B");
    expect(parsed[1]?.extractedText).toContain("INV-B");
    expect(parsed[1]?.extractedText).not.toContain("INV-A");
    expect(parsed[0]?.rawJson).toContain("INV-B");
  });
});
