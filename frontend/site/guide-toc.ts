export const GUIDE_SECTION_IDS = [
  "guide-excel",
  "guide-engagements",
  "guide-matching",
  "guide-select",
  "guide-import",
  "guide-match",
  "guide-snip",
  "guide-review",
  "guide-tb",
  "guide-workpapers",
  "guide-portal",
  "guide-chrome",
  "guide-cloud",
  "guide-assist",
  "guide-local",
] as const;

export type GuideSectionId = (typeof GUIDE_SECTION_IDS)[number];

export function pickGuideSectionId(
  tops: readonly number[],
  ids: readonly string[],
  markerY: number,
  pinLast: boolean,
): string {
  const lastId = ids[ids.length - 1];
  if (!lastId) {
    return "";
  }
  if (pinLast) {
    return lastId;
  }
  let current = ids[0] ?? "";
  const count = Math.min(tops.length, ids.length);
  for (let i = 0; i < count; i += 1) {
    const top = tops[i];
    const id = ids[i];
    if (top === undefined || id === undefined) {
      break;
    }
    if (top <= markerY + 1) {
      current = id;
    }
  }
  return current;
}

export function isGuideSectionId(id: string): id is GuideSectionId {
  return (GUIDE_SECTION_IDS as readonly string[]).includes(id);
}
