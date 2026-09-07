import type {
  ListingRow,
  TrialBalanceAccount,
} from "@/features/trial-balance/services/tb-types";

export const TB_STANDARD_GROUPS = [
  "Unmapped",
  "Cash & Equivalents",
  "Accounts Receivable",
  "Prepayments & Other Assets",
  "Property, Plant & Equipment",
  "Accounts Payable",
  "Accrued Expenses",
  "Equity",
  "Revenue",
  "Expenses",
] as const;

export const TB_TIE_OUT_TOLERANCE = 0.01;

export interface LeadTieOut {
  tbAbs: number;
  listingAbs: number;
  tied: boolean;
}

export function mappedLeadOptions(accounts: TrialBalanceAccount[]): string[] {
  const seen = new Set<string>();

  accounts.forEach((account) => {
    if (account.mapping && account.mapping !== "Unmapped") {
      seen.add(account.mapping);
    }
  });

  return TB_STANDARD_GROUPS.filter((group) => seen.has(group));
}

export function filterListingByLead(
  listing: ListingRow[],
  accounts: TrialBalanceAccount[],
  lead: string,
  hasAccountColumn: boolean,
): ListingRow[] {
  if (!hasAccountColumn) {
    return listing;
  }

  const codes = new Set(
    accounts
      .filter((account) => account.mapping === lead)
      .map((account) => account.code),
  );

  return listing.filter(
    (row) => row.account !== undefined && codes.has(row.account),
  );
}

export function leadTieOut(
  accounts: TrialBalanceAccount[],
  listing: ListingRow[],
  lead: string,
): LeadTieOut {
  const tbNet = accounts
    .filter((account) => account.mapping === lead)
    .reduce((sum, account) => sum + account.debit - account.credit, 0);
  const listingSum = listing.reduce((sum, row) => sum + row.amount, 0);
  const tbAbs = Math.abs(tbNet);
  const listingAbs = Math.abs(listingSum);

  return {
    tbAbs,
    listingAbs,
    tied: Math.abs(listingAbs - tbAbs) < TB_TIE_OUT_TOLERANCE,
  };
}
