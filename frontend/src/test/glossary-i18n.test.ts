import { describe, expect, it } from "vitest";

import { translate } from "@/lib/i18n/translations";

describe("my-MM glossary copy", () => {
  it("drops P0 from the same-name identity description", () => {
    expect(translate("my-MM", "identity.sameNameDescription")).not.toContain(
      "P0",
    );
  });

  it("uses ညှပ် not ညုံ for manual snip", () => {
    expect(translate("my-MM", "viewer.manualSnip")).toContain("ညှပ်");
    expect(translate("my-MM", "viewer.manualSnip")).not.toContain("ညုံ");
  });

  it("keeps cloud.mail distinct from the email field", () => {
    expect(translate("my-MM", "cloud.mail")).not.toBe("အီးမေးလ်");
    expect(translate("my-MM", "cloud.email")).toBe("အီးမေးလ်");
  });

  it("keeps the browser preview badge in English", () => {
    expect(translate("my-MM", "app.browserPreview")).toBe("Browser preview");
  });

  it("keeps the preview Website link in English", () => {
    expect(translate("en-US", "app.website")).toBe("Website");
    expect(translate("my-MM", "app.website")).toBe("Website");
  });

  it("keeps interpolation tokens on new count and page keys", () => {
    for (const locale of ["en-US", "my-MM"] as const) {
      expect(translate(locale, "import.docCount")).toContain("{count}");
      expect(translate(locale, "import.fileCount")).toContain("{count}");
      expect(translate(locale, "snips.goToPage")).toContain("{page}");
      expect(translate(locale, "snips.goToPage")).toContain("{fileName}");
      expect(translate(locale, "viewer.imageRegion")).toContain("{page}");
    }
  });
});
