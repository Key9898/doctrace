import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { pickGuideSectionId } from "../../site/guide-toc";
import { PRIVACY_SECTION_IDS, TERMS_SECTION_IDS } from "../../site/legal-toc";

const MARKER = 88;

function readFrontend(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), "frontend", relativePath), "utf8");
}

function hrefsFromToc(html: string): string[] {
  const toc = html.match(/<nav class="site-toc"[\s\S]*?<\/nav>/)?.[0] ?? "";
  return [...toc.matchAll(/href="#([^"]+)"/g)].map((match) => match[1] ?? "");
}

function sectionIds(html: string): string[] {
  return [...html.matchAll(/<section class="site-section" id="([^"]+)"/g)].map(
    (match) => match[1] ?? "",
  );
}

describe("legal page TOC", () => {
  it("keeps Privacy TOC hrefs, section ids, and id list in the same order", () => {
    const html = readFrontend("privacy.html");
    const ids = [...PRIVACY_SECTION_IDS];
    expect(hrefsFromToc(html)).toEqual(ids);
    expect(sectionIds(html)).toEqual(ids);
    expect(html).toContain("site-page site-guide");
    expect(html).not.toContain("max-w-3xl");
    expect(html).not.toContain("<details");
    expect(html).not.toContain("cookie.html");
  });

  it("keeps Terms TOC hrefs, section ids, and id list in the same order", () => {
    const html = readFrontend("terms.html");
    const ids = [...TERMS_SECTION_IDS];
    expect(hrefsFromToc(html)).toEqual(ids);
    expect(sectionIds(html)).toEqual(ids);
    expect(html).toContain("site-page site-guide");
    expect(html).not.toContain("max-w-3xl");
    expect(html).not.toContain("<details");
  });

  it("picks the last Privacy heading that has crossed the marker", () => {
    const ids = [...PRIVACY_SECTION_IDS];
    const tops = ids.map((id) =>
      id === "privacy-rights" ? MARKER - 4 : MARKER + 80,
    );
    expect(pickGuideSectionId(tops, ids, MARKER, false)).toBe("privacy-rights");
  });

  it("pins Privacy contact when the last heading cannot reach the marker", () => {
    const ids = [...PRIVACY_SECTION_IDS];
    const tops = ids.map((id) =>
      id === "privacy-contact" ? MARKER + 160 : MARKER - 40,
    );
    expect(pickGuideSectionId(tops, ids, MARKER, true)).toBe("privacy-contact");
    expect(pickGuideSectionId(tops, ids, MARKER, false)).toBe(
      "privacy-changes",
    );
  });

  it("pins Terms contact when the last heading cannot reach the marker", () => {
    const ids = [...TERMS_SECTION_IDS];
    const tops = ids.map((id) =>
      id === "terms-contact" ? MARKER + 160 : MARKER - 40,
    );
    expect(pickGuideSectionId(tops, ids, MARKER, true)).toBe("terms-contact");
    expect(pickGuideSectionId(tops, ids, MARKER, false)).toBe(
      "terms-publisher",
    );
  });
});
