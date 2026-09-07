import { describe, expect, it } from "vitest";

import { PBC_INTAKE_CASES } from "@/features/pbc-portal/services/pbc-intake";
import {
  minutesLinksFromRequests,
  pbcMinutesDemoLinks,
} from "@/features/pbc-portal/services/pbc-minutes";
import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";
import { useDocTraceStore } from "@/stores/app-store";

const CHROME_KEYS = [
  "wp.minutesTitle",
  "wp.minutesEmpty",
] as const satisfies readonly TranslationKey[];

describe("PBC minutes workpaper links", () => {
  it("links the demo minutes row when a file is present", () => {
    const links = minutesLinksFromRequests(
      PBC_INTAKE_CASES.map((row) =>
        row.id === "pbc_5"
          ? {
              ...row,
              status: "Approved" as const,
              fileName: "board_minutes_combined.pdf",
            }
          : { ...row, status: "Pending" as const },
      ),
    );

    expect(links).toEqual([
      {
        requestId: "pbc_5",
        item: "Board Meeting Minutes (2025)",
        fileName: "board_minutes_combined.pdf",
        status: "Approved",
      },
    ]);
    expect(pbcMinutesDemoLinks()).toEqual(links);
  });

  it("omits minutes rows that have no file name", () => {
    expect(
      minutesLinksFromRequests([
        {
          id: "pbc_5",
          item: "Board Meeting Minutes (2025)",
          category: "Governance",
          status: "Pending",
        },
      ]),
    ).toEqual([]);
  });

  it("does not link ledger or confirmation files", () => {
    expect(
      minutesLinksFromRequests([
        {
          id: "pbc_1",
          item: "Accounts Payable Ledger FY25-26",
          category: "Accounts Payable",
          status: "Approved",
          fileName: "ap_ledger_final.xlsx",
        },
        {
          id: "pbc_2",
          item: "Bank Confirmation Letters (All Accounts)",
          category: "Cash & Bank",
          status: "Uploaded",
          fileName: "kbz_confirmation_signed.pdf",
        },
      ]),
    ).toEqual([]);
  });

  it("keeps minutes links when a ToD pack is stored", () => {
    const store = useDocTraceStore.getState();
    const previousLinks = store.pbcMinutesLinks;
    const previousPack = store.todWorkpaperPack;
    const previousEngagements = store.engagements;
    const links = pbcMinutesDemoLinks();

    try {
      store.setPbcMinutesLinks(links);
      store.setTodWorkpaperPack({
        sentAt: "2026-09-06T00:00:00.000Z",
        identity: { preparer: "KZ", reviewer: "AY" },
        rows: [{ rowNumber: 2, status: "matched" }],
        snips: [],
      });

      expect(useDocTraceStore.getState().pbcMinutesLinks).toEqual(links);
    } finally {
      useDocTraceStore.setState({
        pbcMinutesLinks: previousLinks,
        todWorkpaperPack: previousPack,
        engagements: previousEngagements,
      });
    }
  });

  it("returns non-empty chrome copy in both locales", () => {
    for (const key of CHROME_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("replaces English-only my-MM leftovers", () => {
    expect(translate("my-MM", "wp.minutesTitle")).not.toBe("PBC minutes");
    expect(translate("my-MM", "wp.minutesEmpty")).not.toBe(
      "No minutes on this file yet.",
    );
  });
});
