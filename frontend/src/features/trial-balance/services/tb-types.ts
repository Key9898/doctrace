export const TB_DEFAULT_MAPPING = "Unmapped";

export interface TrialBalanceAccount {
  code: string;
  description: string;
  debit: number;
  credit: number;
  mapping: string;
}

export interface ListingRow {
  id: string;
  invoice: string;
  date: string;
  amount: number;
  account?: string;
  vendor?: string;
}

export type TbParseError = "empty" | "headers" | "duplicate";

export type TbParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: TbParseError };

export const SPREADSHEET_FILE_ACCEPT = [
  ".xlsx",
  ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
].join(",");
