import { describe, expect, it } from "vitest";

import {
  isWorkbookEvidenceSupported,
  renameEvidenceFileName,
} from "@/features/office/services/workbook-evidence.service";

describe("workbook evidence", () => {
  it("skips Custom XML when ExcelApi 1.5 is not available", () => {
    expect(isWorkbookEvidenceSupported()).toBe(false);
  });

  it("skips evidence rename when Custom XML is not available", async () => {
    await expect(renameEvidenceFileName("abc", "renamed.pdf")).resolves.toBe(
      false,
    );
  });
});
