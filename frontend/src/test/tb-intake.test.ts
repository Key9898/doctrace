import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";

import {
  filterListingByLead,
  leadTieOut,
} from "@/features/trial-balance/services/tb-lead";
import { listingToSelectionSnapshot } from "@/features/trial-balance/services/tb-selection";
import type {
  ListingRow,
  TrialBalanceAccount,
} from "@/features/trial-balance/services/tb-types";
import {
  parseListingWorkbook,
  parseTrialBalanceWorkbook,
} from "@/features/trial-balance/services/tb-workbook";
import { suggestInitialConfig } from "@/features/matching/services/matching.service";

function workbookBuffer(rows: unknown[][]): ArrayBuffer {
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
  const out = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  });

  if (out instanceof ArrayBuffer) {
    return out;
  }

  const bytes = out as Uint8Array;
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

const sampleAccounts: TrialBalanceAccount[] = [
  {
    code: "20100",
    description: "Accounts Payable",
    debit: 0,
    credit: 100,
    mapping: "Accounts Payable",
  },
  {
    code: "50100",
    description: "Rent",
    debit: 40,
    credit: 0,
    mapping: "Expenses",
  },
];

const sampleListing: ListingRow[] = [
  {
    id: "list_1",
    invoice: "INV-1",
    date: "2026-06-01",
    amount: 60,
    account: "20100",
  },
  {
    id: "list_2",
    invoice: "INV-2",
    date: "2026-06-02",
    amount: 40,
    account: "50100",
  },
];

describe("trial balance workbook parse", () => {
  it("parses TB accounts with alias headers", () => {
    const parsed = parseTrialBalanceWorkbook(
      workbookBuffer([
        ["Account Code", "Account Name", "Debit", "Credit"],
        ["20100", "AP", 0, 32400],
      ]),
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.value).toHaveLength(1);
    expect(parsed.value[0]?.code).toBe("20100");
    expect(parsed.value[0]?.credit).toBe(32400);
    expect(parsed.value[0]?.mapping).toBe("Unmapped");
  });

  it("fails closed on missing TB headers", () => {
    const parsed = parseTrialBalanceWorkbook(
      workbookBuffer([
        ["Foo", "Bar"],
        ["1", "2"],
      ]),
    );

    expect(parsed).toEqual({ ok: false, error: "headers" });
  });

  it("fails closed on duplicate required listing columns", () => {
    const parsed = parseListingWorkbook(
      workbookBuffer([
        ["Invoice", "Invoice Number", "Date", "Amount"],
        ["A", "B", "2026-01-01", 10],
      ]),
    );

    expect(parsed).toEqual({ ok: false, error: "duplicate" });
  });

  it("parses listing dates from Excel serials", () => {
    const parsed = parseListingWorkbook(
      workbookBuffer([
        ["Invoice", "Date", "Amount"],
        ["INV-9", 45809, 12.5],
      ]),
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.value.rows[0]?.invoice).toBe("INV-9");
    expect(parsed.value.rows[0]?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(parsed.value.rows[0]?.amount).toBe(12.5);
  });
});

describe("trial balance lead and sample", () => {
  it("filters listing by mapped lead when an account column exists", () => {
    const filtered = filterListingByLead(
      sampleListing,
      sampleAccounts,
      "Accounts Payable",
      true,
    );

    expect(filtered.map((row) => row.invoice)).toEqual(["INV-1"]);
  });

  it("keeps the whole listing when no account column exists", () => {
    const filtered = filterListingByLead(
      sampleListing.map((row) => ({
        id: row.id,
        invoice: row.invoice,
        date: row.date,
        amount: row.amount,
      })),
      sampleAccounts,
      "Accounts Payable",
      false,
    );

    expect(filtered).toHaveLength(2);
  });

  it("reports tie-out ok and warning", () => {
    const ok = leadTieOut(
      sampleAccounts,
      [{ ...sampleListing[0], amount: 100 }],
      "Accounts Payable",
    );
    const warn = leadTieOut(
      sampleAccounts,
      sampleListing.filter((row) => row.account === "20100"),
      "Accounts Payable",
    );

    expect(ok.tied).toBe(true);
    expect(warn.tied).toBe(false);
  });

  it("builds a Matching selection with inferred invoice date amount roles", () => {
    const snapshot = listingToSelectionSnapshot(sampleListing.slice(0, 1));
    const config = suggestInitialConfig(snapshot);

    expect(snapshot.sheetName).toBe("TB Listing");
    expect(snapshot.columns.map((column) => column.inferredRole)).toEqual([
      "invoiceNumber",
      "date",
      "amount",
    ]);
    expect(config.invoiceNumberColumnId).toBe(snapshot.columns[0]?.id);
    expect(config.dateColumnId).toBe(snapshot.columns[1]?.id);
    expect(config.amountColumnId).toBe(snapshot.columns[2]?.id);
  });
});
