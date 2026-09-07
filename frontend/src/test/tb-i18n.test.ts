import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const CHROME_KEYS = [
  "tb.kicker",
  "tb.title",
  "tb.subtitle",
  "tb.balanceOk",
  "tb.balanceWarn",
  "tb.balanceHint",
  "tb.debits",
  "tb.credits",
  "tb.mappings",
  "tb.searchPlaceholder",
  "tb.colCode",
  "tb.colDescription",
  "tb.colDebit",
  "tb.colCredit",
  "tb.colMapping",
  "tb.colInvoice",
  "tb.colDate",
  "tb.colAmount",
  "tb.guidelinesTitle",
] as const satisfies readonly TranslationKey[];

const MY_MM_LEFTOVERS: ReadonlyArray<{
  key: TranslationKey;
  leftover: string;
}> = [
  { key: "tb.kicker", leftover: "Trial Balance Module" },
  { key: "tb.title", leftover: "Trial Balance Verification" },
  {
    key: "tb.subtitle",
    leftover:
      "Import audit trial balances, map ledger accounts, and verify mathematical accuracy.",
  },
  { key: "tb.mappings", leftover: "Ledger Account Mappings" },
  { key: "tb.searchPlaceholder", leftover: "Search code or name..." },
  {
    key: "tb.guidelinesTitle",
    leftover: "Analytical TB Rollover Guidelines",
  },
  {
    key: "tb.balanceHint",
    leftover: "Total Debits must exactly match Total Credits to proceed.",
  },
];

describe("trial balance chrome i18n", () => {
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

  it("keeps debit-equals-credit visible only in balance hint", () => {
    expect(translate("en-US", "tb.balanceHint")).toBe(
      "Total Debits and Total Credits are shown. A mismatch does not block sending the sample.",
    );
    expect(translate("en-US", "tb.balanceHint").toLowerCase()).not.toContain(
      "proceed",
    );
    expect(translate("my-MM", "tb.balanceHint").toLowerCase()).not.toContain(
      "proceed",
    );
  });

  it("keeps the sample-to-Matching guidelines heading", () => {
    expect(translate("en-US", "tb.guidelinesTitle")).toBe(
      "Send a listing sample to Matching",
    );
  });

  it("keeps Trial Balance in English on my-MM chrome", () => {
    expect(translate("my-MM", "tb.kicker")).toContain("Trial Balance");
    expect(translate("my-MM", "tb.title")).toContain("Trial Balance");
    expect(translate("my-MM", "tb.kicker")).not.toContain("စမ်းသပ်လက်ကျန်");
    expect(translate("my-MM", "tb.title")).not.toContain("စမ်းသပ်လက်ကျန်");
  });
});
