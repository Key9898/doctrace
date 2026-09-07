import type { DocumentKind } from "@/types/domain";

export type PbcIntakeKind = "tod-invoice" | "tod-bank" | "list-only";

export interface PbcIntakeInput {
  item: string;
  category: string;
}

export const PBC_INTAKE_CASES: readonly (PbcIntakeInput & { id: string })[] = [
  {
    id: "pbc_1",
    item: "Accounts Payable Ledger FY25-26",
    category: "Accounts Payable",
  },
  {
    id: "pbc_2",
    item: "Bank Confirmation Letters (All Accounts)",
    category: "Cash & Bank",
  },
  {
    id: "pbc_3",
    item: "Sample Invoices Evidence (TOD Selection)",
    category: "Expenses",
  },
  {
    id: "pbc_4",
    item: "Fixed Asset Additions Invoices & Vouchers",
    category: "Fixed Assets",
  },
  {
    id: "pbc_5",
    item: "Board Meeting Minutes (2025)",
    category: "Governance",
  },
];

const LIST_ONLY_PATTERN =
  /confirmation|\bminutes\b|\bledger\b|trial balance|\.xlsx\b/i;

const CASH_AND_BANK_PATTERN = /cash\s*&\s*bank/i;

const TOD_INVOICE_PATTERN = /invoice|voucher|\btod\b|expenses|fixed assets/i;

function haystack(input: PbcIntakeInput): string {
  return `${input.item} ${input.category}`;
}

export function pbcIntakeKind(input: PbcIntakeInput): PbcIntakeKind {
  const text = haystack(input);

  if (LIST_ONLY_PATTERN.test(text)) {
    return "list-only";
  }

  if (CASH_AND_BANK_PATTERN.test(text)) {
    return "tod-bank";
  }

  if (TOD_INVOICE_PATTERN.test(text)) {
    return "tod-invoice";
  }

  return "list-only";
}

export function isTodPbcIntake(kind: PbcIntakeKind): boolean {
  return kind !== "list-only";
}

export function pbcDocumentKind(kind: PbcIntakeKind): DocumentKind | null {
  if (kind === "tod-invoice") {
    return "invoice";
  }

  if (kind === "tod-bank") {
    return "bank-statement";
  }

  return null;
}
