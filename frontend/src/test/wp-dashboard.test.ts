import { describe, expect, it } from "vitest";

import { todWorkpaperDashboardCounts } from "@/features/workpapers/services/wp-dashboard";
import type { TodWorkpaperPack } from "@/types/domain";

const identity = { preparer: "KZ", reviewer: "AY" };

function pack(
  fileSignOff?: TodWorkpaperPack["fileSignOff"],
  rowCount = 3,
): TodWorkpaperPack {
  return {
    sentAt: "2026-09-06T00:00:00.000Z",
    identity,
    rows: Array.from({ length: rowCount }, (_, index) => ({
      rowNumber: index + 1,
      status: index === 0 ? "matched" : "exception",
    })),
    snips: [],
    fileSignOff,
  };
}

describe("todWorkpaperDashboardCounts", () => {
  it("returns 0/0 when there is no pack", () => {
    expect(todWorkpaperDashboardCounts(undefined)).toEqual({
      completed: 0,
      total: 0,
    });
  });

  it("returns 0/1 when the pack has no file sign-off", () => {
    expect(todWorkpaperDashboardCounts(pack())).toEqual({
      completed: 0,
      total: 1,
    });
  });

  it("returns 1/1 when the pack has a file sign-off", () => {
    expect(
      todWorkpaperDashboardCounts(
        pack({
          signedAt: "2026-09-06T12:00:00.000Z",
          preparer: "KZ",
          reviewer: "AY",
        }),
      ),
    ).toEqual({
      completed: 1,
      total: 1,
    });
  });

  it("ignores match row count", () => {
    const unsigned = pack(undefined, 8);
    const signed = pack(
      {
        signedAt: "2026-09-06T12:00:00.000Z",
        preparer: "KZ",
        reviewer: "AY",
      },
      8,
    );

    expect(unsigned.rows).toHaveLength(8);
    expect(todWorkpaperDashboardCounts(unsigned)).toEqual({
      completed: 0,
      total: 1,
    });
    expect(todWorkpaperDashboardCounts(signed)).toEqual({
      completed: 1,
      total: 1,
    });
  });
});
