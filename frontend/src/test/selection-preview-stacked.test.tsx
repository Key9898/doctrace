import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SelectionPanel } from "@/features/office/components/SelectionPanel/SelectionPanel";
import { useDocTraceStore } from "@/stores/app-store";
import type { SelectionSnapshot } from "@/types/domain";

const noop = () => undefined;

const snapshot: SelectionSnapshot = {
  sheetName: "Sheet1",
  address: "A1:B7",
  hasHeaders: true,
  headerRowNumber: 1,
  firstDataRowNumber: 2,
  startColumnIndex: 0,
  worksheetColumnCount: 10,
  rowCount: 6,
  columnCount: 2,
  columns: [
    { id: "col-inv", index: 0, header: "Invoice", letter: "A" },
    { id: "col-amt", index: 1, header: "Amount", letter: "B" },
  ],
  outputColumnOptions: [
    { id: "out-1", columnIndex: 2, letter: "C", label: "Status" },
  ],
  rows: [1, 2, 3, 4, 5, 6].map((index) => ({
    rowNumber: index + 1,
    values: {
      "col-inv": `INV-00${index}`,
      "col-amt": `AMT-00${index}`,
    },
  })),
};

describe("Selection preview stacked cards", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the first five captured rows without a table", () => {
    useDocTraceStore.getState().setLocale("en-US");
    render(
      <SelectionPanel
        hasHeaders
        onCapture={noop}
        onHeadersChange={noop}
        selection={snapshot}
      />,
    );

    expect(screen.queryAllByRole("table")).toHaveLength(0);
    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("INV-005")).toBeInTheDocument();
    expect(screen.queryByText("INV-006")).not.toBeInTheDocument();
    expect(screen.getByText("Showing first 5 of 6 rows")).toBeInTheDocument();

    const source = readFileSync(
      resolve(
        process.cwd(),
        "frontend/src/features/office/components/SelectionPanel/SelectionPanel.tsx",
      ),
      "utf8",
    );
    expect(source).not.toContain("overflow-x-auto");
    expect(source).not.toContain("<table");
    expect(source).not.toContain("min-w-[950px]");
  });

  it("keeps the empty state and capture control when nothing is captured", () => {
    useDocTraceStore.getState().setLocale("en-US");
    render(
      <SelectionPanel
        hasHeaders={false}
        onCapture={noop}
        onHeadersChange={noop}
      />,
    );

    expect(screen.queryAllByRole("table")).toHaveLength(0);
    expect(
      screen.getByText(
        "Select a sample range in Excel, then capture it here to unlock matching.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /capture selection/i }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-doctrace-action="capture-selection"]'),
    ).not.toBeNull();
  });
});
