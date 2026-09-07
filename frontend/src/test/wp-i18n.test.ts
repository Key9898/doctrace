import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const CHROME_KEYS = [
  "wp.kicker",
  "wp.title",
  "wp.subtitle",
  "wp.feedbackKicker",
  "wp.feedbackTitle",
  "wp.feedbackSubtitle",
  "wp.notesCount",
  "wp.assigned",
  "wp.workpaperLabel",
  "wp.reviewerLabel",
  "wp.responseLabel",
  "wp.respond",
  "wp.clearClose",
  "wp.cancel",
  "wp.submit",
  "wp.responsePlaceholder",
  "wp.statusNotStarted",
  "wp.statusInProgress",
  "wp.statusReadyForReview",
  "wp.statusApproved",
  "wp.noteOpen",
  "wp.noteResponded",
  "wp.noteClosed",
] as const satisfies readonly TranslationKey[];

const MY_MM_LEFTOVERS: ReadonlyArray<{
  key: TranslationKey;
  leftover: string;
}> = [
  { key: "wp.kicker", leftover: "Audit Documentation" },
  { key: "wp.title", leftover: "Audit Workpapers Checklist" },
  {
    key: "wp.subtitle",
    leftover:
      "Manage workpaper sign-offs, preparer assignments, and overall execution progress.",
  },
  { key: "wp.feedbackKicker", leftover: "Auditor Feedback" },
  { key: "wp.feedbackTitle", leftover: "Outstanding Review Notes" },
  {
    key: "wp.feedbackSubtitle",
    leftover: "Clear manager and partner notes to finalize document sign-offs.",
  },
  { key: "wp.respond", leftover: "Respond" },
  { key: "wp.clearClose", leftover: "Clear & Close" },
  {
    key: "wp.responsePlaceholder",
    leftover: "Type your audit response details...",
  },
];

describe("workpapers chrome i18n", () => {
  it("returns non-empty copy for every chrome key in both locales", () => {
    for (const key of CHROME_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("replaces English-only my-MM leftovers", () => {
    for (const { key, leftover } of MY_MM_LEFTOVERS) {
      expect(translate("my-MM", key)).not.toBe(leftover);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps interpolation tokens in notes count and assigned line", () => {
    for (const locale of ["en-US", "my-MM"] as const) {
      expect(translate(locale, "wp.notesCount")).toContain("{count}");
      const assigned = translate(locale, "wp.assigned");
      expect(assigned).toContain("{preparer}");
      expect(assigned).toContain("{reviewer}");
    }
  });
});
