import { describe, expect, it } from "vitest";

import { GUIDE_SECTION_IDS, pickGuideSectionId } from "../../site/guide-toc";

const MARKER = 88;

describe("Guide TOC picker", () => {
  it("keeps Excel when every heading is still below the marker", () => {
    const ids = [...GUIDE_SECTION_IDS];
    const tops = ids.map((_, i) => MARKER + 40 + i * 80);
    expect(pickGuideSectionId(tops, ids, MARKER, false)).toBe("guide-excel");
  });

  it("picks the last heading that has crossed the marker", () => {
    const ids = [...GUIDE_SECTION_IDS];
    const tops = ids.map((id) => {
      if (id === "guide-chrome") {
        return MARKER + 0.4;
      }
      if (
        id === "guide-cloud" ||
        id === "guide-assist" ||
        id === "guide-local"
      ) {
        return MARKER + 120;
      }
      return MARKER - 200;
    });
    expect(pickGuideSectionId(tops, ids, MARKER, false)).toBe("guide-chrome");
  });

  it("still selects nested Matching steps", () => {
    const ids = [...GUIDE_SECTION_IDS];
    const tops = ids.map((id) => (id === "guide-select" ? MARKER - 4 : 400));
    tops[ids.indexOf("guide-excel")] = MARKER - 300;
    tops[ids.indexOf("guide-engagements")] = MARKER - 200;
    tops[ids.indexOf("guide-matching")] = MARKER - 80;
    expect(pickGuideSectionId(tops, ids, MARKER, false)).toBe("guide-select");
  });

  it("pins Local sideload when the last heading cannot reach the marker", () => {
    const ids = [...GUIDE_SECTION_IDS];
    const tops = ids.map((id) =>
      id === "guide-local" ? MARKER + 160 : MARKER - 40,
    );
    expect(pickGuideSectionId(tops, ids, MARKER, true)).toBe("guide-local");
    expect(pickGuideSectionId(tops, ids, MARKER, false)).toBe("guide-assist");
  });

  it("ends the chapter list at chrome, cloud, assist, then local", () => {
    expect(GUIDE_SECTION_IDS.slice(-4)).toEqual([
      "guide-chrome",
      "guide-cloud",
      "guide-assist",
      "guide-local",
    ]);
  });
});
