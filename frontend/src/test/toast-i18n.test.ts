import { describe, expect, it } from "vitest";

import { translate } from "@/lib/i18n/translations";

describe("pane toast i18n", () => {
  it("keeps English leftovers verbatim on en-US", () => {
    expect(translate("en-US", "match.completedTitle")).toBe(
      "Matching completed",
    );
    expect(translate("en-US", "match.noSampleTitle")).toBe(
      "No sample selected",
    );
    expect(translate("en-US", "persist.sessionCacheFailedTitle")).toBe(
      "Session cache failed",
    );
    expect(translate("en-US", "activity.matchBlockedTitle")).toBe(
      "Matching blocked",
    );
    expect(translate("en-US", "activity.matchingRunningDesc")).toBe(
      "{rows} sample row(s) and {docs} document(s).",
    );
    expect(translate("en-US", "app.officeReadyFailedFallback")).toBe(
      "Office readiness detection failed.",
    );
  });

  it("does not leave P0 English titles on my-MM", () => {
    expect(translate("my-MM", "match.completedTitle")).not.toBe(
      "Matching completed",
    );
    expect(translate("my-MM", "match.noSampleTitle")).not.toBe(
      "No sample selected",
    );
    expect(translate("my-MM", "persist.sessionCacheFailedTitle")).not.toBe(
      "Session cache failed",
    );
    expect(translate("my-MM", "activity.matchBlockedTitle")).not.toBe(
      "Matching blocked",
    );
    expect(translate("my-MM", "activity.matchingRunningDesc")).not.toBe(
      "{rows} sample row(s) and {docs} document(s).",
    );
  });

  it("keeps product and host terms in English on my-MM toast copy", () => {
    expect(translate("my-MM", "match.completedTitle")).toContain("Matching");
    expect(translate("my-MM", "persist.sessionCacheFailedDesc")).toContain(
      "IndexedDB",
    );
    expect(translate("my-MM", "wp.packReadyTitle")).toContain("ToD");
    expect(translate("my-MM", "match.excelContextCaptureDesc")).toContain(
      "Excel",
    );
    expect(translate("my-MM", "snip.alreadyCapturedTitle")).toContain("Snip");
    expect(translate("my-MM", "persist.auditLogLoadFailedFallback")).toContain(
      "ISA",
    );
    expect(translate("my-MM", "activity.matchBlockedTitle")).toContain(
      "Matching",
    );
    expect(translate("my-MM", "activity.ocrActiveDesc")).toContain("OCR");
    expect(translate("my-MM", "activity.sessionRestoredDesc")).toContain(
      "IndexedDB",
    );
    expect(translate("my-MM", "activity.snipModeOnTitle")).toContain("Snip");
    expect(translate("my-MM", "activity.tbSentTitle")).toContain("Matching");
    expect(translate("my-MM", "activity.todBlockedTitle")).toContain("ToD");
  });

  it("keeps interpolation tokens on both locales", () => {
    for (const locale of ["en-US", "my-MM"] as const) {
      expect(translate(locale, "match.completedDesc")).toContain("{count}");
      expect(translate(locale, "persist.fileTooLargeTitle")).toContain(
        "{name}",
      );
      expect(translate(locale, "match.rowMatchedTitle")).toContain("{row}");
      expect(translate(locale, "match.rowMatchedDesc")).toContain(
        "{confidence}",
      );
      expect(translate(locale, "match.outOfBoundsDesc")).toContain("{min}");
      expect(translate(locale, "match.outOfBoundsDesc")).toContain("{max}");
      expect(translate(locale, "snip.alreadyCapturedDesc")).toContain("{text}");
      expect(translate(locale, "snip.replacedDesc")).toContain("{cell}");
      expect(translate(locale, "wp.signedDesc")).toContain("{preparer}");
      expect(translate(locale, "wp.signedDesc")).toContain("{reviewer}");
      expect(translate(locale, "activity.matchingRunningDesc")).toContain(
        "{rows}",
      );
      expect(translate(locale, "activity.matchingRunningDesc")).toContain(
        "{docs}",
      );
      expect(translate(locale, "activity.rowMatchedDesc")).toContain(
        "{status}",
      );
      expect(translate(locale, "activity.selectionCapturedDesc")).toContain(
        "{address}",
      );
      expect(translate(locale, "activity.todSentDesc")).toContain("{snips}");
    }
  });
});
