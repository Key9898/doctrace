import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TrialBalance } from "@/features/trial-balance/components/TrialBalance/TrialBalance";
import { Workpapers } from "@/features/workpapers/components/Workpapers/Workpapers";
import { useDocTraceStore } from "@/stores/app-store";
import type { TodWorkpaperPack } from "@/types/domain";

const noop = () => false;

const pack: TodWorkpaperPack = {
  sentAt: "2026-09-06T00:00:00.000Z",
  identity: { preparer: "KZ", reviewer: "AY" },
  rows: [{ rowNumber: 7, status: "matched" }],
  snips: [],
};

describe("TB listing and WP ToD stacked lists", () => {
  afterEach(() => {
    cleanup();
    useDocTraceStore.getState().setTodWorkpaperPack(undefined);
  });

  it("keeps TrialBalance free of tables and overflow-x-auto", () => {
    useDocTraceStore.getState().setLocale("en-US");
    render(<TrialBalance onApplyTbSampleSelection={noop} />);

    expect(screen.queryAllByRole("table")).toHaveLength(0);

    const source = readFileSync(
      resolve(
        process.cwd(),
        "frontend/src/features/trial-balance/components/TrialBalance/TrialBalance.tsx",
      ),
      "utf8",
    );
    expect(source).not.toContain("overflow-x-auto");
    expect(source).not.toContain("<table");
  });

  it("shows Workpapers ToD rows without a table", () => {
    useDocTraceStore.getState().setLocale("en-US");
    useDocTraceStore.getState().setTodWorkpaperPack(pack);
    render(<Workpapers onSignTodWorkpaperFile={noop} />);

    expect(screen.queryAllByRole("table")).toHaveLength(0);
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
