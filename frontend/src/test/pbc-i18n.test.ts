import { describe, expect, it } from "vitest";

import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";

const CHROME_KEYS = [
  "pbc.kicker",
  "pbc.title",
  "pbc.subtitle",
  "pbc.statPending",
  "pbc.statUploaded",
  "pbc.statApproved",
  "pbc.checklist",
  "pbc.idLabel",
  "pbc.deadlineLabel",
  "pbc.uploadedFile",
  "pbc.approve",
  "pbc.reject",
  "pbc.removeFile",
  "pbc.statusPending",
  "pbc.statusUploaded",
  "pbc.statusApproved",
  "pbc.statusRejected",
  "pbc.catAccountsPayable",
  "pbc.catCashBank",
  "pbc.catExpenses",
  "pbc.catFixedAssets",
  "pbc.catGovernance",
  "pbc.whatTitle",
  "pbc.whatBody",
] as const satisfies readonly TranslationKey[];

const MY_MM_LEFTOVERS: ReadonlyArray<{
  key: TranslationKey;
  leftover: string;
}> = [
  { key: "pbc.kicker", leftover: "Client Communication Portal" },
  { key: "pbc.title", leftover: "Client PBC Portal & Requests" },
  {
    key: "pbc.subtitle",
    leftover:
      "Track and verify document request templates prepared by the client (PBC) for audit testing.",
  },
  { key: "pbc.statPending", leftover: "Pending PBC" },
  { key: "pbc.whatTitle", leftover: "What is a PBC List?" },
];

const LOCKED_WHAT_BODY =
  "PBC stands for Prepared by Client. It is the request list of documents the audit team asks the client to provide. ToD invoice and bank PDF, image, or JSON can go to Matching Import. Ledgers, confirmations, minutes, trial balance, and spreadsheets stay on this list.";

describe("client PBC chrome i18n", () => {
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

  it("locks the PBC explainer and keeps acronym expansion", () => {
    expect(translate("en-US", "pbc.whatBody")).toBe(LOCKED_WHAT_BODY);

    for (const locale of ["en-US", "my-MM"] as const) {
      const body = translate(locale, "pbc.whatBody");
      expect(body).toContain("PBC");
      expect(body).toContain("Prepared by Client");
      expect(body).not.toContain("linked directly to execution workpapers");
    }
  });

  it("keeps the checklist count token in both locales", () => {
    for (const locale of ["en-US", "my-MM"] as const) {
      expect(translate(locale, "pbc.checklist")).toContain("{count}");
    }
  });

  it("keeps PBC product terms and categories in English on my-MM", () => {
    expect(translate("my-MM", "pbc.kicker")).toBe("Client PBC Portal");
    expect(translate("my-MM", "pbc.catAccountsPayable")).toBe(
      "Accounts Payable",
    );
    expect(translate("my-MM", "pbc.catCashBank")).toBe("Cash & Bank");
    expect(translate("my-MM", "pbc.catExpenses")).toBe("Expenses");
    expect(translate("my-MM", "pbc.catFixedAssets")).toBe("Fixed Assets");
    expect(translate("my-MM", "pbc.catGovernance")).toBe("Governance");
  });
});
