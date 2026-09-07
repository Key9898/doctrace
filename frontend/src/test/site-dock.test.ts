import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { copy } from "../../site/copy";
import { SITE_SOCIAL_HREFS } from "../../site/social-links";

const DOCK_KEYS = [
  "dockMail",
  "dockFacebook",
  "dockYouTube",
  "dockViber",
] as const;

describe("site dock chrome", () => {
  it("keeps the same copy keys in both locales", () => {
    expect(Object.keys(copy.my).sort()).toEqual(Object.keys(copy.en).sort());
  });

  it("keeps dock aria labels in both locales", () => {
    for (const key of DOCK_KEYS) {
      expect(copy.en[key].trim().length).toBeGreaterThan(0);
      expect(copy.my[key].trim().length).toBeGreaterThan(0);
    }
  });

  it("points mail at contact and social networks at home until live URLs exist", () => {
    expect(SITE_SOCIAL_HREFS.mail).toBe("/contact.html");
    expect(SITE_SOCIAL_HREFS.facebook).toBe("/");
    expect(SITE_SOCIAL_HREFS.youtube).toBe("/");
    expect(SITE_SOCIAL_HREFS.viber).toBe("/");
  });

  it("does not import the site dock from the task pane entry", () => {
    const source = readFileSync(
      resolve(process.cwd(), "frontend/src/main.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/site\/dock/);
  });
});
